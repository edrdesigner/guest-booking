import { addHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { api } from '../lib/axios';
import { bookingValidation } from '../validation/bookingValidation';

export interface Booking {
  id?: number;
  property: string;
  checkIn: Date | string;
  checkOut: Date | string;
  createdAt?: string;
  adults: number;
}

interface BookingContextType {
  bookings: Booking[];
  saveBooking: (booking: Booking) => Promise<void>;
  deleteBooking: (id: number) => Promise<void>;
}

interface BookingProviderProps {
  children: ReactNode;
}

const BOOKING_HOUR = {
  CHECK_IN: 8,
  CHECK_OUT: 14,
};

export const BookingContext = createContext({} as BookingContextType);

export function BookingsProvider({ children }: BookingProviderProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const saveBooking = useCallback(
    async (entity: Booking) => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const entityToApi = {
        ...entity,
        checkIn: utcToZonedTime(
          addHours(new Date(entity.checkIn), BOOKING_HOUR.CHECK_IN),
          timeZone
        ),
        checkOut: utcToZonedTime(
          addHours(new Date(entity.checkOut), BOOKING_HOUR.CHECK_OUT),
          timeZone
        ),
      };

      bookingValidation({
        entity: entityToApi,
        entities: bookings,
      });

      if (entity?.id) {
        await api.put(`bookings/${entity.id}`, entityToApi);

        setBookings((prevState) => {
          const index = prevState.findIndex(
            (booking) => booking.id === entity.id
          );
          const newState = [...prevState];
          newState[index] = entityToApi;

          return newState;
        });
      } else {
        const response = await api.post('bookings', {
          ...entityToApi,
          createdAt: new Date(),
        });

        setBookings((prevState) => [response.data, ...prevState]);
      }
    },
    [bookings]
  );

  const deleteBooking = useCallback(async (id?: number) => {
    if (!id) {
      return;
    }

    await api.delete(`bookings/${id}`);

    setBookings((prevState) =>
      prevState.filter((booking) => booking.id !== id)
    );
  }, []);

  useEffect(() => {
    async function fetchBookings() {
      const response = await api.get('bookings', {
        params: {
          _sort: 'createdAt',
          _order: 'desc',
        },
      });

      setBookings(response.data ?? []);
    }

    fetchBookings();
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, saveBooking, deleteBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

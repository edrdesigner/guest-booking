import { addHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { isDateRangeOverlapping } from '../util/datesOverlapping';

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

  async function fetchBookings() {
    const response = await api.get('bookings', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
      },
    });

    setBookings(response.data ?? []);
  }

  async function saveBooking(data: Booking) {
    const { id, ...rest } = data;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const entityToApi = {
      ...rest,
      checkIn: utcToZonedTime(
        addHours(new Date(rest.checkIn), BOOKING_HOUR.CHECK_IN),
        timezone
      ),
      checkOut: utcToZonedTime(
        addHours(new Date(rest.checkOut), BOOKING_HOUR.CHECK_OUT),
        timezone
      ),
    };

    const isOverlapping = isDateRangeOverlapping({
      entity: { ...entityToApi, id },
      entities: bookings,
    });

    if (isOverlapping) {
      throw new Error('Date range is overlapping');
    }

    if (id) {
      await api.put(`bookings/${id}`, { ...entityToApi });

      setBookings((prevState) => {
        const index = prevState.findIndex((booking) => booking.id === id);
        const newState = [...prevState];
        newState[index] = { ...entityToApi, id };

        return newState;
      });
    } else {
      const response = await api.post('bookings', {
        ...entityToApi,
        createdAt: new Date(),
      });

      setBookings((prevState) => [response.data, ...prevState]);
    }
  }

  async function deleteBooking(id?: number | null) {
    if (!id) {
      return;
    }

    await api.delete(`bookings/${id}`);

    setBookings((prevState) =>
      prevState.filter((booking) => booking.id !== id)
    );
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, saveBooking, deleteBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

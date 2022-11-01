import { useContext, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { format, formatDistance } from 'date-fns';
import { Pencil, Trash } from 'phosphor-react';
import { Header } from '../../components/Header';
import { BookingModal } from '../../components/BookingModal';
import { Booking, BookingContext } from '../../contexts/BookingsContext';
import { BookingsContainer, BookingsTable } from './styles';

export function Bookings() {
  const { bookings, deleteBooking } = useContext(BookingContext);
  const [openModal, setOpenModal] = useState(false);
  const [booking, setBooking] = useState({} as Booking);

  function handleOnNewBooking() {
    setBooking({} as Booking);
    setOpenModal(true);
  }

  function handleEditBooking(item: Booking) {
    setBooking(item);
    setOpenModal(true);
  }

  return (
    <div>
      <Header onNew={handleOnNewBooking} />
      <BookingsContainer>
        <BookingsTable>
          <thead>
            <tr>
              <th>Property</th>
              <th>Check in</th>
              <th>Check out</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => {
              return (
                <tr key={booking.id}>
                  <td>{booking.property}</td>
                  <td>{format(new Date(booking.checkIn), 'MM/dd/y')}</td>
                  <td>{format(new Date(booking.checkOut), 'MM/dd/y')}</td>
                  <td>
                    {booking.createdAt &&
                      formatDistance(new Date(booking.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      onClick={() => handleEditBooking(booking)}
                    >
                      <Pencil size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={() => booking?.id && deleteBooking(booking.id)}
                    >
                      <Trash size={24} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </BookingsTable>
      </BookingsContainer>
      {openModal ? (
        <Dialog.Root open={openModal} onOpenChange={setOpenModal}>
          <Dialog.Trigger />
          <BookingModal entity={booking} onClose={() => setOpenModal(false)} />
        </Dialog.Root>
      ) : null}
    </div>
  );
}

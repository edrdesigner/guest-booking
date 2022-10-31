import { useContext, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { addDays, isValid } from 'date-fns';
import { format } from 'date-fns-tz';
import { Booking, BookingContext } from '../../contexts/BookingsContext';
import { CloseButton, Content, Overlay } from './styles';

const bookingFormSchema = z.object({
  property: z.string().min(3).max(50),
  adults: z.number().min(1).max(6),
  checkIn: z.date(),
  checkOut: z.date(),
});

interface BookingModalProps {
  entity?: Booking;
  onClose: () => void;
}

export function BookingModal({ entity, onClose }: BookingModalProps) {
  const { saveBooking } = useContext(BookingContext);
  const [formError, setFormError] = useState('');
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<Booking>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues:
      entity?.id != null
        ? {
            ...entity,
            checkIn: format(new Date(entity.checkIn), 'yyyy-MM-dd', {
              timeZone,
            }),
            checkOut: format(new Date(entity.checkOut), 'yyyy-MM-dd', {
              timeZone,
            }),
          }
        : {
            adults: 1,
            property: 'Property A',
          },
  });

  async function handleSaveBooking(data: Booking) {
    const { property, checkIn, checkOut, adults } = data;

    try {
      setFormError('');

      await saveBooking({
        ...entity,
        property,
        checkIn,
        checkOut,
        adults,
      });

      onClose();
    } catch (error: Error | any) {
      if (error?.message) {
        setFormError(error.message);
      }
    }
  }

  const minDate = new Date().toISOString().split('T')[0];

  const checkIn = watch('checkIn');
  const minDateCheckout =
    checkIn && isValid(checkIn)
      ? addDays(new Date(checkIn), 2).toISOString().split('T')[0]
      : undefined;

  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <Dialog.Title>
          {entity?.id ? 'Edit Booking' : 'New Booking'}
        </Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>
        <form onSubmit={handleSubmit(handleSaveBooking)}>
          {formError && <span>{formError}</span>}

          <label>Property</label>
          <input
            type="text"
            placeholder="Property"
            className={errors.property ? 'has-error' : ''}
            {...register('property')}
          />
          {errors?.property && <span>{errors.property.message}</span>}
          <label>Check In</label>
          <input
            type="date"
            placeholder="Check in"
            min={minDate}
            {...register('checkIn', { valueAsDate: true })}
          />
          {errors?.checkIn && <span>{errors.checkIn.message}</span>}
          <label>Check Out</label>
          <input
            type="date"
            lang="en-GB"
            min={minDateCheckout}
            placeholder="Check out"
            {...register('checkOut', { valueAsDate: true })}
          />
          {errors?.checkOut && <span>{errors.checkOut.message}</span>}
          <label>Adults</label>
          <input
            type="number"
            placeholder="Adults"
            className={errors.adults ? 'has-error' : ''}
            {...register('adults', { valueAsNumber: true })}
          />
          {errors?.adults && <span>{errors.adults.message}</span>}
          <button type="submit" disabled={isSubmitting}>
            {entity?.id ? 'Save' : 'Book now'}
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}

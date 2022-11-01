import { useContext, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { addDays, isBefore, isValid } from 'date-fns';
import { format } from 'date-fns-tz';
import { Booking, BookingContext } from '../../contexts/BookingsContext';
import { Input } from '../Input';
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

      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (error: Error | any) {
      if (error?.message) {
        setFormError(error.message);
      }
    }
  }

  const minDate = useMemo(() => {
    if (
      entity?.id &&
      entity.checkIn &&
      isBefore(new Date(entity.checkIn), new Date())
    ) {
      return new Date(entity.checkIn).toISOString().split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }, [entity?.id]);

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
          <Input
            label="Property"
            type="text"
            placeholder="Property"
            error={errors?.property?.message}
            {...register('property')}
          />
          <Input
            label="Check in"
            type="date"
            min={minDate}
            error={errors?.checkIn?.message}
            {...register('checkIn', { valueAsDate: true })}
          />
          <Input
            label="Check out"
            type="date"
            error={errors?.checkOut?.message}
            min={minDateCheckout}
            {...register('checkOut', { valueAsDate: true })}
          />
          <Input
            label="Adults"
            type="number"
            error={errors?.adults?.message}
            {...register('adults', { valueAsNumber: true })}
          />
          <button type="submit" disabled={isSubmitting}>
            {entity?.id ? 'Save' : 'Book now'}
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}

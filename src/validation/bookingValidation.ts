import { Booking } from '../contexts/BookingsContext';
import { isDateRangeOverlapping } from '../util/datesOverlapping';

interface ValidateBookingProps {
  entity: Booking;
  entities: Booking[];
}

export function bookingValidation({ entity, entities }: ValidateBookingProps) {
  const isOverlapping = isDateRangeOverlapping({
    entity,
    entities,
  });

  if (isOverlapping) {
    throw new Error('The selected dates are not available for this property');
  }
}

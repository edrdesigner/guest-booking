import { areIntervalsOverlapping } from 'date-fns';
import { Booking } from '../contexts/BookingsContext';

interface DatesOverlappingProps {
  entity: Booking;
  entities: Booking[];
}

export function isDateRangeOverlapping({
  entity,
  entities,
}: DatesOverlappingProps) {
  return entities
    .filter((booking) => {
      if (entity?.id && booking.id === entity.id) {
        return false;
      }

      return booking.property === entity.property;
    })
    .find((booking) => {
      const rageState = {
        start: new Date(booking.checkIn),
        end: new Date(booking.checkOut),
      };
      const rangeEntity = {
        start: new Date(entity.checkIn),
        end: new Date(entity.checkOut),
      };

      return areIntervalsOverlapping(rageState, rangeEntity);
    });
}

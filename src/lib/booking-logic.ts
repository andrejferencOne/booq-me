import { addMinutes } from 'date-fns';
  import {
    buildBratislavaDateTime,
    formatBratislavaTime,
    getDayOfWeekBratislava,
  } from './timezone';

  const WORKING_HOURS: Record<number, { start: string; end: string } | null> = {
    1: { start: '09:00', end: '19:00' },
    2: { start: '09:00', end: '19:00' },
    3: { start: '09:00', end: '19:00' },
    4: { start: '09:00', end: '19:00' },
    5: { start: '09:00', end: '19:00' },
    6: { start: '09:00', end: '14:00' },
    0: null,
  };

  const SLOT_STEP_MINUTES = 15;
  
  type BusySlot = {
    startTime: Date;
    endTime: Date;
  };
  
  export const computeAvailableSlots = (
    dateStr: string,
    serviceDurationMinutes: number,
    busySlots: BusySlot[],
  ): string[] => {
    const dayStartUtc = buildBratislavaDateTime(dateStr, '00:00');
    const dayOfWeek = getDayOfWeekBratislava(dayStartUtc);
    const hours = WORKING_HOURS[dayOfWeek];

    if (!hours) return [];

    const openTimeUtc = buildBratislavaDateTime(dateStr, hours.start);
    const closeTimeUtc = buildBratislavaDateTime(dateStr, hours.end);
    const now = new Date();

    const available: string[] = [];
    let slot = openTimeUtc;

    while (slot < closeTimeUtc) {
      const slotEnd = addMinutes(slot, serviceDurationMinutes);

      if (slotEnd > closeTimeUtc) break;

      const overlaps = busySlots.some(
        (busy) => slot < busy.endTime && busy.startTime < slotEnd,
      );
  
      if (!overlaps && slot > now) {
        available.push(formatBratislavaTime(slot));
      }
  
      slot = addMinutes(slot, SLOT_STEP_MINUTES);
    }

    return available;
  };

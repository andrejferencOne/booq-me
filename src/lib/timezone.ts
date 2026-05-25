  import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

  export const TZ = 'Europe/Bratislava';

  export const buildBratislavaDateTime = (dateStr: string, timeStr: string): Date => {
    return fromZonedTime(`${dateStr}T${timeStr}:00`, TZ);
  };
  
  export const formatBratislavaTime = (date: Date): string => {
    return formatInTimeZone(date, TZ, 'HH:mm');
  };
  
  export const formatBratislavaDateTime = (date: Date): string => {
    return formatInTimeZone(date, TZ, 'dd.MM.yyyy HH:mm');
  };
  
  export const startOfDayBratislava = (dateStr: string): Date => {
    return fromZonedTime(`${dateStr}T00:00:00`, TZ);
  };
  
  export const endOfDayBratislava = (dateStr: string): Date => {
    return fromZonedTime(`${dateStr}T23:59:59.999`, TZ);
  };
  
  export const getDayOfWeekBratislava = (date: Date): number => {
    return toZonedTime(date, TZ).getDay();
  };

export type CivilDate = {
  year: number;
  month: number;
  day: number;
};

export type BogotaClock = CivilDate & {
  hour: number;
  minute: number;
};

const BOGOTA_OFFSET_HOURS = 5;

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  const value = parts.find((item) => item.type === type)?.value;
  return Number(value);
}

export function bogotaWallClock(instant: Date): BogotaClock {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);

  return {
    year: part(parts, 'year'),
    month: part(parts, 'month'),
    day: part(parts, 'day'),
    hour: part(parts, 'hour'),
    minute: part(parts, 'minute'),
  };
}

export function addCalendarDays(date: CivilDate, offset: number): CivilDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + offset));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

export function classStart(diaOffset: number, hora: string, now: Date): Date {
  const today = bogotaWallClock(now);
  const day = addCalendarDays(today, diaOffset);
  const [hourText, minuteText] = hora.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return new Date(Date.UTC(day.year, day.month - 1, day.day, hour + BOGOTA_OFFSET_HOURS, minute));
}

export function bogotaDayOffset(start: Date, now: Date): number {
  const startDay = bogotaWallClock(start);
  const today = bogotaWallClock(now);
  const startUtc = Date.UTC(startDay.year, startDay.month - 1, startDay.day);
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  return Math.round((startUtc - todayUtc) / 86_400_000);
}

export function isSameBogotaDay(left: Date, right: Date): boolean {
  return bogotaDayOffset(left, right) === 0;
}

export function dayLabel(offset: number): string {
  if (offset === 0) {
    return 'Hoy';
  }
  if (offset === 1) {
    return 'Mañana';
  }
  return 'Pasado mañana';
}

import { hours, SLOT_MINUTES, clinic } from './clinic';

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Current date (YYYY-MM-DD) and minutes since midnight in the clinic's time zone. */
export function nowInClinic() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: clinic.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function weekday(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** All slot start times for a date, minus past ones and the ones already taken. */
export function slotsFor(date: string, taken: string[] = []) {
  if (!isValidDate(date)) return [];
  const range = hours[weekday(date)];
  if (!range) return [];
  const now = nowInClinic();
  if (date < now.date) return [];
  const out: string[] = [];
  for (let m = toMin(range[0]); m + SLOT_MINUTES <= toMin(range[1]); m += SLOT_MINUTES) {
    // Keep one hour of notice for same-day bookings.
    if (date === now.date && m < now.minutes + 60) continue;
    const t = toTime(m);
    if (!taken.includes(t)) out.push(t);
  }
  return out;
}

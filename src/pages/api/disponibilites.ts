import type { APIRoute } from 'astro';
import { hours } from '../../lib/clinic';
import { slotsFor, nowInClinic, weekday } from '../../lib/slots';
import { listBookings } from '../../lib/store';

export const prerender = false;

// GET /api/disponibilites?days=12
// -> { days: [{ date, free }], next: { date, time } | null }
// The next open days with their count of free slots, plus the first free slot.
export const GET: APIRoute = async ({ url }) => {
  const want = Math.min(Math.max(Number(url.searchParams.get('days')) || 12, 1), 30);
  const all = await listBookings();
  const taken = (date: string) => all.filter((b) => b.date === date && b.status === 'confirmé').map((b) => b.time);

  const start = new Date(nowInClinic().date + 'T00:00:00Z');
  const days: { date: string; free: number }[] = [];
  let next: { date: string; time: string } | null = null;

  for (let i = 0; days.length < want && i < 60; i++) {
    const date = new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10);
    if (!hours[weekday(date)]) continue; // closed day
    const free = slotsFor(date, taken(date));
    days.push({ date, free: free.length });
    if (!next && free.length) next = { date, time: free[0] };
  }
  return Response.json({ days, next }, { headers: { 'cache-control': 'no-store' } });
};

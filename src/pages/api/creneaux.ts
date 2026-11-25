import type { APIRoute } from 'astro';
import { slotsFor, isValidDate } from '../../lib/slots';
import { takenTimes, storageReady } from '../../lib/store';

export const prerender = false;

// GET /api/creneaux?date=YYYY-MM-DD  ->  { date, slots: ["08:30", ...] }
export const GET: APIRoute = async ({ url }) => {
  const date = url.searchParams.get('date') ?? '';
  if (!isValidDate(date)) return Response.json({ error: 'Date invalide' }, { status: 400 });
  // Without storage (Vercel before Redis is added) show the opening hours; booking itself is refused.
  const slots = slotsFor(date, storageReady() ? await takenTimes(date) : []);
  return Response.json({ date, slots }, { headers: { 'cache-control': 'no-store' } });
};

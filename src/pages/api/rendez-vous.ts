import type { APIRoute } from 'astro';
import { services } from '../../lib/clinic';
import { slotsFor, isValidDate } from '../../lib/slots';
import { addBooking, takenTimes } from '../../lib/store';

export const prerender = false;

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// POST /api/rendez-vous  { service, date, time, name, phone, email?, note? }
export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const service = clean(body.service, 40);
  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  const note = clean(body.note, 500);
  // honeypot: real people never fill this field
  if (clean(body.website, 100)) return Response.json({ error: 'Requête refusée.' }, { status: 400 });

  const errors: Record<string, string> = {};
  if (!services.some((s) => s.id === service)) errors.service = 'Choisissez un soin.';
  if (!isValidDate(date)) errors.date = 'Choisissez une date.';
  if (!/^\d{2}:\d{2}$/.test(time)) errors.time = 'Choisissez un horaire.';
  if (name.length < 2) errors.name = 'Indiquez votre nom.';
  if (phone.replace(/\D/g, '').length < 9) errors.phone = 'Indiquez un numéro de téléphone valide.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Adresse e-mail invalide.';
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  if (!slotsFor(date, await takenTimes(date)).includes(time)) {
    return Response.json({ error: 'Ce créneau vient d’être pris. Choisissez un autre horaire.', code: 'slot_taken' }, { status: 409 });
  }

  const booking = await addBooking({ service, date, time, name, phone, email: email || undefined, note: note || undefined });
  if (!booking) {
    return Response.json({ error: 'Ce créneau vient d’être pris. Choisissez un autre horaire.', code: 'slot_taken' }, { status: 409 });
  }

  // Production: send the SMS / WhatsApp / e-mail confirmation here.
  return Response.json({ ref: booking.ref, date: booking.date, time: booking.time, service: booking.service }, { status: 201 });
};

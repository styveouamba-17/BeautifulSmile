import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// A JSON file is enough for the demo. For production, swap these three
// functions for a database (Supabase, Postgres, Firebase...): the API stays the same.

export interface Booking {
  id: string;
  ref: string;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  note?: string;
  status: 'confirmé' | 'annulé';
  createdAt: string;
}

const FILE = path.resolve(process.cwd(), 'data', 'bookings.json');
let queue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Booking[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return [];
  }
}

async function writeAll(list: Booking[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(list, null, 2));
  await fs.rename(tmp, FILE);
}

export async function listBookings() {
  return readAll();
}

export async function takenTimes(date: string) {
  return (await readAll()).filter((b) => b.date === date && b.status === 'confirmé').map((b) => b.time);
}

/** Serialised so two patients can never take the same slot. Returns null when the slot is gone. */
export function addBooking(input: Omit<Booking, 'id' | 'ref' | 'status' | 'createdAt'>): Promise<Booking | null> {
  const run = queue.then(async () => {
    const list = await readAll();
    if (list.some((b) => b.date === input.date && b.time === input.time && b.status === 'confirmé')) return null;
    const booking: Booking = {
      ...input,
      id: crypto.randomUUID(),
      ref: 'BS-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
      status: 'confirmé',
      createdAt: new Date().toISOString(),
    };
    list.push(booking);
    await writeAll(list);
    return booking;
  });
  queue = run.catch(() => {});
  return run;
}

export function setStatus(id: string, status: Booking['status']) {
  const run = queue.then(async () => {
    const list = await readAll();
    const b = list.find((x) => x.id === id);
    if (b) {
      b.status = status;
      await writeAll(list);
    }
    return b ?? null;
  });
  queue = run.catch(() => {});
  return run;
}

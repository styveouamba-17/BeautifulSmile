import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Two backends with the same API:
// - Redis (Upstash REST) when KV_REST_API_URL / KV_REST_API_TOKEN (Vercel's Upstash
//   integration) or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set. Used on Vercel.
// - A JSON file in data/ otherwise. Used for local development only: Vercel's disk is temporary.

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

type NewBooking = Omit<Booking, 'id' | 'ref' | 'status' | 'createdAt'>;

const env = (k: string) => process.env[k] ?? (import.meta.env as Record<string, string | undefined>)[k];
const REDIS_URL = env('KV_REST_API_URL') || env('UPSTASH_REDIS_REST_URL');
const REDIS_TOKEN = env('KV_REST_API_TOKEN') || env('UPSTASH_REDIS_REST_TOKEN');
const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);

export class StorageNotConfigured extends Error {}

function makeBooking(input: NewBooking): Booking {
  return {
    ...input,
    id: crypto.randomUUID(),
    ref: 'BS-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
    status: 'confirmé',
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------- Redis backend
// bs:bookings      hash  id -> booking JSON
// bs:slot:<d>:<t>  string id, set with NX so one slot can only be claimed once

const HASH = 'bs:bookings';
const slotKey = (b: { date: string; time: string }) => `bs:slot:${b.date}:${b.time}`;

async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL!, {
    method: 'POST',
    headers: { authorization: `Bearer ${REDIS_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`Redis: ${data.error ?? res.status}`);
  return data.result as T;
}

const redisStore = {
  async list(): Promise<Booking[]> {
    const flat = (await redis<string[]>(['HGETALL', HASH])) ?? [];
    const out: Booking[] = [];
    for (let i = 1; i < flat.length; i += 2) out.push(JSON.parse(flat[i]));
    return out;
  },
  async add(input: NewBooking): Promise<Booking | null> {
    const booking = makeBooking(input);
    const claimed = await redis<string | null>(['SET', slotKey(booking), booking.id, 'NX']);
    if (claimed !== 'OK') return null;
    await redis(['HSET', HASH, booking.id, JSON.stringify(booking)]);
    return booking;
  },
  async setStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const raw = await redis<string | null>(['HGET', HASH, id]);
    if (!raw) return null;
    const b: Booking = JSON.parse(raw);
    if (b.status === status) return b;
    if (status === 'annulé') {
      await redis(['DEL', slotKey(b)]);
    } else {
      // Restoring only works if nobody took the slot in the meantime.
      const claimed = await redis<string | null>(['SET', slotKey(b), b.id, 'NX']);
      if (claimed !== 'OK') return null;
    }
    b.status = status;
    await redis(['HSET', HASH, id, JSON.stringify(b)]);
    return b;
  },
};

// ----------------------------------------------------------------- File backend

const FILE = path.resolve(process.cwd(), 'data', 'bookings.json');
let queue: Promise<unknown> = Promise.resolve();
const serial = <T>(fn: () => Promise<T>) => {
  const run = queue.then(fn);
  queue = run.catch(() => {});
  return run;
};

async function readFile(): Promise<Booking[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return [];
  }
}
async function writeFile(list: Booking[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE + '.tmp', JSON.stringify(list, null, 2));
  await fs.rename(FILE + '.tmp', FILE);
}
const isTaken = (list: Booking[], b: { date: string; time: string; id?: string }) =>
  list.some((x) => x.id !== b.id && x.date === b.date && x.time === b.time && x.status === 'confirmé');

const fileStore = {
  list: readFile,
  add: (input: NewBooking) =>
    serial(async () => {
      const list = await readFile();
      if (isTaken(list, input)) return null;
      const booking = makeBooking(input);
      list.push(booking);
      await writeFile(list);
      return booking;
    }),
  setStatus: (id: string, status: Booking['status']) =>
    serial(async () => {
      const list = await readFile();
      const b = list.find((x) => x.id === id);
      if (!b) return null;
      if (status === 'confirmé' && isTaken(list, b)) return null;
      b.status = status;
      await writeFile(list);
      return b;
    }),
};

// ----------------------------------------------------------------------- API

function backend() {
  if (useRedis) return redisStore;
  // On Vercel without Redis the file would vanish between requests: refuse instead of losing bookings.
  if (process.env.VERCEL) throw new StorageNotConfigured('Stockage non configuré : ajoutez Upstash Redis au projet Vercel.');
  return fileStore;
}

export const storageReady = () => useRedis || !process.env.VERCEL;

export async function listBookings() {
  return backend().list();
}

export async function takenTimes(date: string) {
  return (await listBookings()).filter((b) => b.date === date && b.status === 'confirmé').map((b) => b.time);
}

/** Returns null when the slot was already taken. */
export function addBooking(input: NewBooking) {
  return backend().add(input);
}

/** Returns null when the booking is missing, or when restoring and the slot was taken since. */
export function setStatus(id: string, status: Booking['status']) {
  return backend().setStatus(id, status);
}

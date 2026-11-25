# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Patients of BeautifulSmile, a dental clinic at the Rond-point JVC roundabout, Sacré-Cœur 3, Dakar. They come to the site to see which treatments the clinic offers, roughly what they cost, where it is, and to book a slot without calling.

The clinic team is a second audience: they use the `/admin` agenda to see bookings made online, call or WhatsApp the patient to confirm, and cancel or restore a booking.

**Open, to confirm with the clinic:** the main patient profile (local families, young professionals, expatriates or diaspora). Do not tune copy or priorities to one profile until the clinic says which.

## Product Purpose

A website plus online booking for one dental clinic. It shows the treatments with starting prices, books a slot in three steps (treatment, day and time, contact details), and gives the clinic a simple agenda of those bookings.

Success means a patient goes from arriving to a booked slot in about two minutes on a phone, and the clinic receives bookings it can confirm the same day.

## Positioning

Most dental practices in the area can only be booked by phone. This site books a real free slot online, at any hour: slots follow the clinic's hours, a slot that is taken disappears, and two patients can never take the same one.

## Operating Context

- The project is a **prospecting mock-up**. The clinic has not seen or approved anything yet; the site is shown during a sales pitch to win the clinic as a client. It is the first project of a wider search for local businesses that could use websites and related services.
- Patients are in Dakar, mostly on phones and on mobile data, so the site must stay light and fast.
- The clinic confirms each booking by calling the patient back (WhatsApp link per booking in `/admin`). Payment and insurance details are discussed on site.
- Time zone: Africa/Dakar (UTC+0 all year, no daylight saving).

## Capabilities and Constraints

- Built with Astro 5 and the Node adapter. Pages are prerendered; `/api/creneaux`, `/api/disponibilites`, `/api/rendez-vous` and `/admin` run on the server.
- Bookings are stored in `data/bookings.json` (demo). For production, swap `src/lib/store.ts` for a database and add the SMS or WhatsApp confirmation.
- Every clinic fact lives once in `src/lib/clinic.ts`.
- `/admin` is protected by `ADMIN_PASSWORD` (default `demo` for the pitch). The production domain must be added to `security.allowedDomains` in `astro.config.mjs`.
- Language: **French only.** No English or Wolof version is planned.
- **Assumed for the demo, to confirm with the clinic before going live:** prices, opening hours (Mon–Fri 8:30–18:30, Sat 9:00–14:00, closed Sunday), treatment durations, payment methods (cash, card, Wave, Orange Money), insurance and IPM wording, the equipment claims in the "Cabinet" section, the email address.
- **Missing:** phone or WhatsApp number (no number is shown or invented), logo, the clinic's own photographs, the dentists' names.

## Brand Commitments

- Name: **BeautifulSmile**, as written by the clinic. The tooth mark in `src/components/Logo.astro` is a stand-in until the clinic supplies its logo.
- Voice: plain, reassuring French that says what happens and what it costs. No medical jargon without an explanation, no slogans or exclamation marks.

## Evidence on Hand

- Real: the clinic's name, its location (Rond-point JVC, Sacré-Cœur 3, Dakar), and the fact that it does dental care.
- Photographs in `public/img/` are free Unsplash stand-ins, not the clinic.
- There are **no** testimonials, ratings, patient counts, staff names or awards. Do not invent any.
- A public search found no listing for "BeautifulSmile" at Sacré-Cœur 3; confirm the exact name and address with the clinic.

## Product Principles

1. **Booking is the product.** Every page decision serves getting a patient to a confirmed slot quickly, on a phone.
2. **Say the price and the next step.** Starting prices are shown, a written quote comes before long treatments, and the patient always knows what happens after booking.
3. **Only real facts.** A demo value stays clearly marked as such in the code and never becomes a claim. No invented proof.
4. **Built to be reused.** The clinic's facts are kept in one file so the same base can be adapted quickly for the next prospect.

## Accessibility & Inclusion

No specific requirement given. Working baseline: readable contrast, keyboard-usable booking (radio groups with arrow keys), clear error messages tied to their fields, and reduced motion respected.

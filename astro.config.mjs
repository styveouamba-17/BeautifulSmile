import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Pages are prerendered (static HTML). Only /api/* and /admin run on the server,
// so bookings are stored and double-bookings are refused.
export default defineConfig({
  site: 'https://beautifulsmile.example',
  adapter: node({ mode: 'standalone' }),
  devToolbar: { enabled: false },
  // Hostnames the server answers on (needed for the admin's form POSTs).
  // Add the clinic's real domain here before going live.
  security: {
    allowedDomains: [
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' },
      { hostname: 'beautifulsmile.example' },
      { hostname: '*.beautifulsmile.example' },
    ],
  },
});

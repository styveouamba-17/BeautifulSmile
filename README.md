# BeautifulSmile, site de démonstration

Site vitrine + prise de rendez-vous en ligne pour la clinique dentaire BeautifulSmile
(rond-point JVC, Sacré-Cœur 3, Dakar). Astro 5, déployé sur Vercel.

## Lancer en local

```bash
npm install
npm run dev          # http://localhost:4321
```

En local, les rendez-vous sont enregistrés dans `data/bookings.json`.

- Site : `/` (soins et tarifs, cabinet, spécialités, FAQ, rendez-vous)
- Espace clinique : `/admin` (mot de passe `demo` par défaut, variable `ADMIN_PASSWORD`)
- API : `GET /api/creneaux?date=AAAA-MM-JJ`, `GET /api/disponibilites?days=12`, `POST /api/rendez-vous`

## Déployer sur Vercel

1. Importer le projet dans Vercel. Le preset **Astro** est détecté tout seul.
   Ne pas remplir « Output Directory » : l'adaptateur `@astrojs/vercel` génère `.vercel/output`.
2. **Stockage des rendez-vous** (obligatoire, le disque de Vercel est temporaire) :
   Vercel → projet → *Storage* → *Create Database* → **Upstash for Redis** (offre gratuite) →
   *Connect* au projet. Cela ajoute `KV_REST_API_URL` et `KV_REST_API_TOKEN`.
   Des variables `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` marchent aussi.
3. *Settings → Environment Variables* : ajouter `ADMIN_PASSWORD` (sinon le mot de passe est `demo`).
4. Redéployer.

Sans Redis, le site et les horaires s'affichent mais une réservation renvoie
« momentanément indisponible », et `/admin` explique quoi configurer.

Domaine personnalisé : l'ajouter dans `security.allowedDomains` de `astro.config.mjs`
(les adresses `*.vercel.app` sont déjà autorisées).

## Où modifier quoi

- Horaires, soins, tarifs, adresse, e-mail : `src/lib/clinic.ts` (une seule source)
- Couleurs et typographie : `src/styles/global.css` (variables `:root`)
- Photos : `public/img/` (remplacer par les photos de la clinique, mêmes noms, 800 et 1600 px)
- Stockage : `src/lib/store.ts` (Redis sur Vercel, fichier JSON en local)
- Confirmation SMS/WhatsApp à brancher dans `src/pages/api/rendez-vous.ts`

## À confirmer avec la clinique

Tarifs, horaires, moyens de paiement, prise en charge IPM, équipements cités, e-mail, logo,
numéro de téléphone/WhatsApp (aucun numéro n'est affiché pour l'instant), et les vraies photos
(les photos actuelles viennent d'Unsplash).

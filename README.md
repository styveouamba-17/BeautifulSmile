# BeautifulSmile, site de démonstration

Site vitrine + prise de rendez-vous en ligne pour la clinique dentaire BeautifulSmile
(rond-point JVC, Sacré-Cœur 3, Dakar). Astro 5, adaptateur Node.

## Lancer

```bash
npm install
npm run dev          # http://localhost:4321  (développement)
npm run build && npm start   # version de production
```

- Site : `/`  (soins et tarifs, cabinet, spécialités, FAQ, rendez-vous)
- Espace clinique : `/admin` (mot de passe `demo`, à changer avec la variable `ADMIN_PASSWORD`)
- API : `GET /api/creneaux?date=AAAA-MM-JJ`, `POST /api/rendez-vous`

## Où modifier quoi

- Horaires, soins, tarifs, adresse, e-mail : `src/lib/clinic.ts` (une seule source)
- Couleurs et typographie : `src/styles/global.css` (variables `:root`)
- Photos : `public/img/` (remplacer par les photos de la clinique, mêmes noms, 800 et 1600 px)
- Rendez-vous stockés dans `data/bookings.json`. Pour la production : remplacer `src/lib/store.ts`
  par une base de données (Supabase, Postgres…) et brancher l'envoi SMS/WhatsApp dans
  `src/pages/api/rendez-vous.ts`.
- Domaine de production : l'ajouter dans `security.allowedDomains` de `astro.config.mjs`.

## À confirmer avec la clinique

Tarifs, horaires, moyens de paiement, prise en charge IPM, équipements cités, e-mail, logo,
numéro de téléphone/WhatsApp (aucun numéro n'est affiché pour l'instant), et les vraies photos
(les photos actuelles viennent d'Unsplash).

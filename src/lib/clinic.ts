// Every fact about the clinic lives here, once. Values marked "À CONFIRMER"
// were assumed for the pitch and must be checked with the clinic.

export const clinic = {
  name: 'BeautifulSmile',
  kind: 'Clinique dentaire',
  street: 'Rond-point JVC',
  district: 'Sacré-Cœur 3',
  city: 'Dakar',
  // Directions open a map search, never coordinates.
  mapUrl: 'https://www.openstreetmap.org/search?query=Rond-point%20JVC%20Sacr%C3%A9-C%C5%93ur%203%20Dakar',
  email: 'contact@beautifulsmile.example', // À CONFIRMER
  timezone: 'Africa/Dakar',
};

// Opening hours, À CONFIRMER. Day index: 0 = dimanche ... 6 = samedi.
// Each range is [open, close] in "HH:MM"; the last slot starts 30 min before close.
export const hours: Record<number, [string, string] | null> = {
  0: null,
  1: ['08:30', '18:30'],
  2: ['08:30', '18:30'],
  3: ['08:30', '18:30'],
  4: ['08:30', '18:30'],
  5: ['08:30', '18:30'],
  6: ['09:00', '14:00'],
};

export const hoursRows = [
  { days: 'Lundi – vendredi', time: '8 h 30 – 18 h 30', idx: [1, 2, 3, 4, 5] },
  { days: 'Samedi', time: '9 h – 14 h', idx: [6] },
  { days: 'Dimanche', time: 'Fermé', idx: [0] },
];

export const SLOT_MINUTES = 30;

// Treatments, prices "à partir de" in FCFA, À CONFIRMER with the clinic.
export const services = [
  { id: 'consultation', name: 'Consultation et bilan', line: 'Examen complet, radio si besoin et plan de soins expliqué en clair.', price: '15 000 FCFA', duration: 30 },
  { id: 'detartrage', name: 'Détartrage et polissage', line: 'Nettoyage en profondeur des dents et des gencives, à faire chaque année.', price: '25 000 FCFA', duration: 30 },
  { id: 'soins', name: 'Soins des caries', line: 'Composite de la couleur de la dent, traitement de racine si nécessaire.', price: '20 000 FCFA', duration: 60 },
  { id: 'blanchiment', name: 'Blanchiment dentaire', line: 'Éclaircissement au fauteuil en une séance, avec gouttières pour la maison.', price: '150 000 FCFA', duration: 60 },
  { id: 'orthodontie', name: 'Orthodontie et aligneurs', line: 'Bagues ou aligneurs transparents, pour les enfants comme pour les adultes.', price: 'Sur devis', duration: 30 },
  { id: 'implants', name: 'Implants et couronnes', line: 'Remplacement d’une dent manquante par un implant et une couronne en céramique.', price: 'Sur devis', duration: 30 },
  { id: 'enfants', name: 'Soins des enfants', line: 'Premier contrôle dès 3 ans, scellement des sillons et conseils aux parents.', price: '15 000 FCFA', duration: 30 },
];

export type Service = (typeof services)[number];

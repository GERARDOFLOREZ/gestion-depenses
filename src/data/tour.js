// Étapes de la visite guidée.
//  - tab    : la vraie page de l'appli ouverte derrière la carte
//  - target : la zone mise en évidence (sélecteur CSS)
//  - title / text : clés de traduction (le français sert de clé, comme ailleurs dans l'appli)
const FIRST_BLOCK = '.app-main .tab-panel > *:first-child';

export const TOUR_STEPS = [
  {
    id: 'dashboard',
    tab: 'dashboard',
    icon: '📊',
    target: '.balance-summary',
    title: 'Votre mois, d\'un seul regard',
    text: 'Revenus, dépenses et solde : votre situation, toujours à jour.',
  },
  {
    id: 'charts',
    tab: 'dashboard',
    icon: '📈',
    target: '.expense-chart',
    title: 'Voyez où file votre argent',
    text: 'Des graphiques clairs, mois par mois et par catégorie.',
  },
  {
    id: 'expenses',
    tab: 'expenses',
    icon: '💸',
    target: '.expense-form',
    title: 'Une dépense en 5 secondes',
    text: 'Un libellé, un montant, c\'est noté. Les revenus sont juste à côté.',
  },
  {
    id: 'recurring',
    tab: 'recurring',
    icon: '🔁',
    target: '.expense-form',
    title: 'Le loyer s\'ajoute tout seul',
    text: 'Programmez ce qui revient régulièrement : plus rien à oublier.',
  },
  {
    id: 'accounts',
    tab: 'accounts',
    icon: '🏦',
    target: FIRST_BLOCK,
    title: 'Plusieurs comptes, plusieurs devises',
    text: 'Banque, espèces, mobile money : chaque compte garde sa devise.',
  },
  {
    id: 'budgets',
    tab: 'budgets',
    icon: '🎯',
    target: '.budget-manager',
    title: 'Des budgets qui vous préviennent',
    text: 'Fixez une limite par catégorie : l\'appli vous alerte quand vous vous en approchez.',
  },
  {
    id: 'goals',
    tab: 'goals',
    icon: '🐖',
    target: FIRST_BLOCK,
    title: 'Épargnez pour vos projets',
    text: 'Un objectif, une date, et votre cagnotte qui grandit.',
  },
  {
    id: 'debts',
    tab: 'debts',
    icon: '🤝',
    target: FIRST_BLOCK,
    title: 'Qui vous doit quoi ?',
    text: 'Suivez vos dettes et prêts, et notez chaque remboursement.',
  },
  {
    id: 'categories',
    tab: 'categories',
    icon: '🏷️',
    target: '.expense-form',
    title: 'Vos catégories, vos couleurs',
    text: 'Créez vos propres catégories pour une appli qui vous ressemble.',
  },
  {
    id: 'spaces',
    tab: 'dashboard',
    icon: '🗂️',
    target: '.header-actions',
    title: 'Un login, plusieurs espaces',
    text: 'Perso, association, projet : chaque espace reste séparé. Et l\'appli parle français, anglais, espagnol et arabe.',
  },
  {
    id: 'start',
    tab: 'expenses',
    icon: '🚀',
    target: '.expense-form',
    title: 'À vous de jouer !',
    text: 'Ajoutez votre première dépense : tout commence ici.',
  },
];

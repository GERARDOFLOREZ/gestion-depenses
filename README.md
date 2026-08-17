# 💰 Gestion des Dépenses

Application web de gestion de dépenses personnelles, construite avec React et Vite.

## Fonctionnalités

- Ajout, modification et suppression de dépenses
- Catégorisation (Alimentation, Transport, Logement, Santé, Loisirs, Éducation, Factures, Autre)
- Filtrage par catégorie et par plage de dates
- Résumé visuel des dépenses par catégorie
- Persistance locale des données (localStorage)
- Export des dépenses au format CSV

## Stack technique

- **React** (Vite)
- **Context API + useReducer** pour la gestion d'état globale
- **Hooks personnalisés** pour la logique métier
- **localStorage** pour la persistance des données
- **CSS natif** (pas de framework)

## Installation

```bash
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

## Architecture du projet
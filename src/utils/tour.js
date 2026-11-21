// Mémorise, par utilisateur et par appareil, que la visite guidée a déjà été proposée.
// Le numéro de version permet de la remontrer à tous si le contenu change beaucoup.
const key = (userId) => `gestion-depenses:tour:v1:${userId}`;

export function hasSeenTour(userId) {
  try {
    return localStorage.getItem(key(userId)) === 'seen';
  } catch {
    // Stockage indisponible : on ne harcèle pas l'utilisateur à chaque chargement.
    return true;
  }
}

export function markTourSeen(userId) {
  try {
    localStorage.setItem(key(userId), 'seen');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la visite guidée :', error);
  }
}

// « Fait » = la personne a lancé la visite. Tant que ce n'est pas le cas, une pastille dorée
// lui rappelle que la visite existe (sur le bouton Menu et dans le menu).
const doneKey = (userId) => `gestion-depenses:tour:v1:done:${userId}`;

export function hasDoneTour(userId) {
  try {
    return localStorage.getItem(doneKey(userId)) === 'done';
  } catch {
    return true;
  }
}

export function markTourDone(userId) {
  try {
    localStorage.setItem(doneKey(userId), 'done');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la visite guidée :', error);
  }
}

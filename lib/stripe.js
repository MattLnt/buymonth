import Stripe from 'stripe'

// Les valeurs collees dans le dashboard Vercel arrivent parfois avec une espace ou
// un retour a la ligne en trop. Stripe repond alors « No such price: ' price_... ' »,
// erreur deroutante puisque l'identifiant est le bon. On nettoie a la lecture.
const env = (nom) => {
  const v = process.env[nom]
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

export const stripe = env('STRIPE_SECRET_KEY')
  ? new Stripe(env('STRIPE_SECRET_KEY'))
  : null

// URL de base pour les redirections Stripe (success/cancel)
export const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

/* ------------------------------------------------------------------ *
 * MODÈLE V2 — facturation au bien actif
 * ------------------------------------------------------------------ *
 * Deux prix récurrents « par unité / mois » (quantity = nb biens actifs) :
 *   - PRICE_PRO      : 39 € HTVA / bien actif / mois
 *   - PRICE_PRO_PLUS : 45 € HTVA / bien actif / mois
 *
 * La mise en service (1 490 €) se règle HORS plateforme (facture manuelle) :
 * aucun prix Stripe, aucun paiement à gérer ici.
 *
 * À créer côté dashboard Stripe, puis renseigner dans le .env :
 *   STRIPE_PRICE_PRO=price_...
 *   STRIPE_PRICE_PRO_PLUS=price_...
 * ------------------------------------------------------------------ */
export const PRICE_PRO = env('STRIPE_PRICE_PRO')
export const PRICE_PRO_PLUS = env('STRIPE_PRICE_PRO_PLUS')

// Prix récurrent correspondant à une formule
export function priceForFormule(formule) {
  return formule === 'PRO_PLUS' ? PRICE_PRO_PLUS : PRICE_PRO
}

/* ------------------------------------------------------------------ *
 * DÉPRÉCIÉ (ancien modèle : abo fixe + widget payant).
 * Conservés le temps de la transition, à retirer au nettoyage final.
 * ------------------------------------------------------------------ */
export const PRICE_ABO = env('STRIPE_PRICE_ABO')
export const PRICE_WIDGET = env('STRIPE_PRICE_WIDGET')
import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

// URL de base pour les redirections Stripe (success/cancel)
export const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

/* ------------------------------------------------------------------ *
 * MODÈLE V2 — facturation au bien actif
 * ------------------------------------------------------------------ *
 * Deux prix récurrents « par unité / mois » (quantity = nb biens actifs) :
 *   - PRICE_PRO      : 39 € HTVA / bien actif / mois
 *   - PRICE_PRO_PLUS : 45 € HTVA / bien actif / mois
 * Un prix one-time pour la mise en service :
 *   - PRICE_MISE_EN_SERVICE : 1 490 € HTVA (une seule fois)
 *
 * À créer côté dashboard Stripe, puis renseigner dans le .env :
 *   STRIPE_PRICE_PRO=price_...
 *   STRIPE_PRICE_PRO_PLUS=price_...
 *   STRIPE_PRICE_MISE_EN_SERVICE=price_...
 * ------------------------------------------------------------------ */
export const PRICE_PRO = process.env.STRIPE_PRICE_PRO
export const PRICE_PRO_PLUS = process.env.STRIPE_PRICE_PRO_PLUS
export const PRICE_MISE_EN_SERVICE = process.env.STRIPE_PRICE_MISE_EN_SERVICE

// Prix récurrent correspondant à une formule
export function priceForFormule(formule) {
  return formule === 'PRO_PLUS' ? PRICE_PRO_PLUS : PRICE_PRO
}

/* ------------------------------------------------------------------ *
 * DÉPRÉCIÉ (ancien modèle : abo fixe + widget payant).
 * Conservés le temps de la transition, à retirer au nettoyage final.
 * ------------------------------------------------------------------ */
export const PRICE_ABO = process.env.STRIPE_PRICE_ABO
export const PRICE_WIDGET = process.env.STRIPE_PRICE_WIDGET
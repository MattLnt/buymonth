/*
 * Calcul de la mensualité indicative (Dossier développeur, Partie 7 §3).
 *
 *   prixDecaisse  : prix TVAC pour le neuf, prix de vente pour l'existant (cf. lib/regime.js)
 *   apportPct     : quotité d'apport (0.10 = 10 %)
 *   tauxAnnuel    : taux débiteur annuel fixe
 *   dureeMois     : durée du crédit en mois
 *
 * Taux mensuel équivalent actuariel, arrondi à la dizaine d'euros supérieure (« à partir de »).
 * Test de non-régression : 250 000 € HTVA, TVA 21 % → 302 500 € décaissé, apport 10 %,
 * 360 mois à 3,95 % → M = 1 281,04 € → affichage 1 290 €.
 */
const DEFAUTS = { apportPct: 0.10, tauxAnnuel: 0.0395, dureeMois: 360 }

export function calculMensualite(prixDecaisse, params = DEFAUTS) {
  const { apportPct, tauxAnnuel, dureeMois } = { ...DEFAUTS, ...params }
  const capital = (Number(prixDecaisse) || 0) * (1 - apportPct)
  if (capital <= 0 || !dureeMois) return 0
  const i = Math.pow(1 + tauxAnnuel, 1 / 12) - 1
  const m = i === 0 ? capital / dureeMois : capital * i / (1 - Math.pow(1 + i, -dureeMois))
  return Math.ceil(m / 10) * 10
}

/*
 * Régime fiscal du bien (Dossier développeur, Partie 7 — version allégée du 19/08).
 * Le promoteur encode toujours son prix habituel : HTVA pour le neuf, prix de vente pour l'existant.
 * La plateforme convertit en « prix décaissé » (base du calcul de la mensualité et prix affiché au particulier).
 * Les droits d'enregistrement et frais de notaire ne sont jamais financés : ils restent hors calcul.
 *
 * Fichier sans dépendance serveur : utilisable côté client comme côté serveur.
 */

export const REGIMES = {
  TVA_21: {
    coef: 1.21,
    label: 'Neuf — TVA 21 %',
    court: 'TVA 21 %',
    phrase: 'TVA 21 % comprise', // affiché à côté du prix public
    prixLabel: 'Prix total hors TVA',
    nl: { label: 'Nieuwbouw — btw 21 %', court: 'btw 21 %', phrase: 'incl. 21 % btw', prixLabel: 'Totale prijs excl. btw' },
    neuf: true,
  },
  TVA_6: {
    coef: 1.06,
    label: 'Neuf — TVA 6 % (démolition-reconstruction, sous conditions)',
    court: 'TVA 6 %',
    phrase: 'TVA 6 % comprise — sous conditions',
    prixLabel: 'Prix total hors TVA',
    nl: { label: 'Nieuwbouw — btw 6 % (afbraak en heropbouw, onder voorwaarden)', court: 'btw 6 %', phrase: 'incl. 6 % btw — onder voorwaarden', prixLabel: 'Totale prijs excl. btw' },
    neuf: true,
  },
  ENREGISTREMENT: {
    coef: 1,
    label: 'Bien existant — droits d\'enregistrement',
    court: 'Existant',
    phrase: null,
    prixLabel: 'Prix de vente',
    nl: { label: 'Bestaand pand — registratierechten', court: 'Bestaand', phrase: null, prixLabel: 'Verkoopprijs' },
    neuf: false,
  },
}

export const REGIME_CODES = Object.keys(REGIMES)

// Champ texte d'un régime dans la langue voulue (label, court, phrase, prixLabel)
export function texteRegime(regime, champ, lang = 'fr') {
  const r = REGIMES[regime]
  if (!r) return null
  return (lang === 'nl' ? r.nl?.[champ] : r[champ]) ?? null
}

export function estRegimeValide(r) {
  return typeof r === 'string' && REGIME_CODES.includes(r)
}

// Prix décaissé = base de calcul de la mensualité et prix affiché au particulier.
// Sans régime (bien historique), le prix encodé est pris tel quel.
export function prixDecaisse(prixTotal, regime) {
  const p = Number(prixTotal) || 0
  const coef = REGIMES[regime]?.coef ?? 1
  return Math.round(p * coef)
}

// Phrase accolée au prix public : « TVA 21 % comprise » — null pour l'existant / non renseigné
export function phraseRegime(regime, lang = 'fr') {
  return texteRegime(regime, 'phrase', lang)
}

// Libellé complet du prix public : « 302.500 € TVA 21 % comprise »
export function libellePrixPublic(prixTotal, regime, lang = 'fr') {
  const montant = prixDecaisse(prixTotal, regime).toLocaleString(lang === 'nl' ? 'nl-BE' : 'fr-BE') + ' €'
  const phrase = phraseRegime(regime, lang)
  return phrase ? `${montant} ${phrase}` : montant
}

// Libellé du champ prix dans le formulaire promoteur
export function libelleChampPrix(regime, lang = 'fr') {
  return texteRegime(regime, 'prixLabel', lang) ?? (lang === 'nl' ? 'Prijs van het pand' : 'Prix du bien')
}

export function estNeuf(regime) {
  return REGIMES[regime]?.neuf ?? null // null = inconnu
}

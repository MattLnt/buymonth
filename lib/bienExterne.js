/*
 * Bien « externe » : simulateur pré-rempli depuis le configurateur d'un partenaire.
 *
 * Accord Vizion du 07/07/2026 : à la fin de son parcours, le visiteur clique pour
 * accéder à BuyMonth et arrive sur /simulateur avec les paramètres de sa configuration
 * dans l'URL (montant, apport, durée). Le formulaire se pré-remplit automatiquement.
 *
 * Le bien n'existe pas en base : il est reconstruit à la volée depuis l'URL, et
 * rien n'est enregistré tant que le visiteur ne soumet pas le formulaire.
 * Les valeurs venant de l'extérieur, tout est validé et borné ici.
 *
 * Fichier sans dépendance serveur : utilisable côté client comme côté serveur.
 */

import { estRegimeValide, prixDecaisse } from './regime'

// Mêmes bornes que l'API Vizion (lib/vizionApi.js) : anti-valeurs absurdes
const PRIX_MIN = 1000
const PRIX_MAX = 100_000_000

// Durée de crédit plausible, en mois (5 à 40 ans)
const DUREE_MIN = 60
const DUREE_MAX = 480

// Au-delà, un nombre de « durée » est forcément des mois et non des années
const SEUIL_ANNEES = 50

const TITRE_MAX = 120

// Premier paramètre présent parmi plusieurs alias (fr + en : le brief Vizion est en anglais)
const alias = (sp, ...noms) => {
  for (const n of noms) {
    const v = sp?.[n]
    const val = Array.isArray(v) ? v[0] : v
    if (val !== undefined && val !== null && String(val).trim() !== '') return String(val).trim()
  }
  return null
}

const entier = (v) => {
  if (v === null) return null
  // tolère « 315000 », « 315 000 », « 315.000 » et « 315000.00 »
  const n = Number(String(v).replace(/[\s.](?=\d{3}\b)/g, '').replace(',', '.'))
  return Number.isFinite(n) ? Math.round(n) : null
}

// Texte libre venant de l'URL : on coupe et on retire ce qui n'a rien à faire dans un libellé
function texte(v, max = TITRE_MAX) {
  if (!v) return null
  const t = v.replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, max)
  return t || null
}

// Lien retour vers la fiche du partenaire : https uniquement, jamais de javascript: ni de data:
function urlRetour(v) {
  if (!v) return null
  try {
    const u = new URL(v)
    return u.protocol === 'https:' ? u.toString() : null
  } catch {
    return null
  }
}

// Durée reçue en années (25) ou en mois (300) → toujours des mois, bornés.
// Partagé avec l'API Vizion pour que les deux bouts de l'intégration lisent la durée pareil.
export function dureeEnMois(v) {
  const n = entier(v)
  if (!n || n <= 0) return null
  const mois = n <= SEUIL_ANNEES ? n * 12 : n
  if (mois < DUREE_MIN || mois > DUREE_MAX) return null
  return mois
}

/**
 * Reconstruit un bien à partir des paramètres d'URL d'un partenaire.
 * @param {object} sp  searchParams déjà résolus
 * @returns {null|object}  null si aucun prix exploitable n'est fourni
 */
export function lireBienExterne(sp) {
  const prixTotal = entier(alias(sp, 'prix', 'montant', 'price', 'amount'))
  if (prixTotal === null || prixTotal < PRIX_MIN || prixTotal > PRIX_MAX) return null

  const regimeBrut = alias(sp, 'regime', 'regimeFiscal')
  const regime = estRegimeValide(regimeBrut) ? regimeBrut : null

  const apportBrut = entier(alias(sp, 'apport', 'downPayment'))
  const apport = apportBrut !== null && apportBrut > 0 && apportBrut <= PRIX_MAX ? apportBrut : null

  const dureeMois = dureeEnMois(alias(sp, 'duree', 'duration'))

  const titre = texte(alias(sp, 'titre', 'title', 'nom'))
  const reference = texte(alias(sp, 'ref', 'reference'), 40)
  const ville = texte(alias(sp, 'ville', 'city'), 60)
  const retour = urlRetour(alias(sp, 'retour', 'returnUrl', 'url'))

  // Partenaire à l'origine du renvoi : sert de source du lead (VIZION par défaut)
  const srcBrut = (alias(sp, 'src', 'source') || 'VIZION').toUpperCase()
  const source = /^[A-Z0-9_-]{2,24}$/.test(srcBrut) ? srcBrut : 'PARTENAIRE'

  return {
    externe: true,
    titre: titre || 'Votre configuration',
    reference,
    ville,
    prixTotal,
    regime,
    prixDecaisse: prixDecaisse(prixTotal, regime),
    apport,
    dureeMois,
    retour,
    source,
  }
}

// Libellé du bien enregistré avec le lead, à défaut d'une fiche en base
export function libelleBienExterne(bien) {
  if (!bien?.externe) return null
  const bouts = [bien.titre]
  if (bien.reference) bouts.push(`réf. ${bien.reference}`)
  if (bien.ville) bouts.push(bien.ville)
  bouts.push(`${bien.prixDecaisse.toLocaleString('fr-BE')} €`)
  return `${bien.source} — ${bouts.join(' — ')}`
}

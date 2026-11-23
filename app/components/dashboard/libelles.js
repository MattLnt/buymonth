// Libellés affichés du dashboard promoteur (FR / NL).
// Les valeurs stockées en base restent en français : on ne traduit que le libellé.

const TYPES_NL = {
  Appartement: 'Appartement',
  Maison: 'Huis',
  Studio: 'Studio',
  Villa: 'Villa',
  Terrain: 'Bouwgrond',
  Bureau: 'Kantoor',
  Commerce: 'Handelspand',
}

const PROVINCES_NL = {
  Anvers: 'Antwerpen',
  'Brabant flamand': 'Vlaams-Brabant',
  'Brabant wallon': 'Waals-Brabant',
  Bruxelles: 'Brussel',
  'Flandre-Occidentale': 'West-Vlaanderen',
  'Flandre-Orientale': 'Oost-Vlaanderen',
  Hainaut: 'Henegouwen',
  Liège: 'Luik',
  Limbourg: 'Limburg',
  Luxembourg: 'Luxemburg',
  Namur: 'Namen',
}

// Type de bien stocké ('Maison') → libellé dans la langue
export function libelleType(type, lang = 'fr') {
  if (!type) return type
  return lang === 'nl' ? TYPES_NL[type] || type : type
}

export function libelleProvince(province, lang = 'fr') {
  if (!province) return province
  return lang === 'nl' ? PROVINCES_NL[province] || province : province
}

// Statut de suivi d'un lead par le promoteur (valeur stockée en français)
const STATUTS_LEAD_NL = {
  'À contacter': 'Te contacteren',
  'Contact en cours': 'Contact lopend',
  'Projet futur': 'Toekomstig project',
  Offre: 'Bod',
  'Compromis avec conditions': 'Compromis met voorwaarden',
  'Compromis sans conditions': 'Compromis zonder voorwaarden',
  Vente: 'Verkoop',
  Abandon: 'Afgehaakt',
  'Mauvaises coordonnées': 'Foutieve gegevens',
}

export function libelleStatutLead(statut, lang = 'fr') {
  if (!statut) return statut
  return lang === 'nl' ? STATUTS_LEAD_NL[statut] || statut : statut
}

// Statut d'un bien (ACTIF, OPTION, HORS_LIGNE, VENDU) → libellé court
export function libelleStatutBien(statut, lang = 'fr') {
  const nl = lang === 'nl'
  switch (statut) {
    case 'ACTIF': return nl ? 'Actief' : 'Actif'
    case 'OPTION': return nl ? 'In optie' : 'Sous option'
    case 'HORS_LIGNE': return nl ? 'Offline' : 'Hors-ligne'
    case 'VENDU': return nl ? 'Verkocht' : 'Vendu'
    default: return statut
  }
}

// Estimation de capacité d'emprunt (règle standard belge)
// Mensualité max = ~33% des revenus nets, moins les crédits en cours.

const TAUX_ENDETTEMENT = 0.33
const TAUX_ANNUEL = 0.0345
const DUREE_MOIS = 300 // 25 ans
const APPORT_PCT = 0.10

// Montant empruntable à partir d'une mensualité disponible (formule d'amortissement inversée)
function capitalDepuisMensualite(mensualite, tauxAnnuel = TAUX_ANNUEL, dureeMois = DUREE_MOIS) {
  const i = tauxAnnuel / 12
  return mensualite * (1 - Math.pow(1 + i, -dureeMois)) / i
}

export function calculCapacite({ revenus, apport = 0, creditsEnCours = 0 }) {
  const rev = Number(revenus) || 0
  const ap = Number(apport) || 0
  const credits = Number(creditsEnCours) || 0

  // mensualité maximale supportable
  const mensualiteMax = Math.max(0, rev * TAUX_ENDETTEMENT - credits)

  // capital empruntable
  const capitalEmpruntable = capitalDepuisMensualite(mensualiteMax)

  // budget total = capital + apport
  const budgetMax = Math.round(capitalEmpruntable + ap)

  return {
    mensualiteMax: Math.round(mensualiteMax),
    capitalEmpruntable: Math.round(capitalEmpruntable),
    budgetMax,
    tauxEndettement: TAUX_ENDETTEMENT,
  }
}

// Compare le budget du visiteur au prix d'un bien
export function evalueBien({ revenus, apport = 0, creditsEnCours = 0, prixBien }) {
  const cap = calculCapacite({ revenus, apport, creditsEnCours })
  const prix = Number(prixBien) || 0
  const ecart = cap.budgetMax - prix
  const ratio = prix > 0 ? cap.budgetMax / prix : 0

  let statut // 'ok' | 'limite' | 'insuffisant'
  if (ratio >= 1) statut = 'ok'
  else if (ratio >= 0.85) statut = 'limite'
  else statut = 'insuffisant'

  return { ...cap, prix, ecart, ratio, statut }
}
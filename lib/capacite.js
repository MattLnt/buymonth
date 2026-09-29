// Estimation de capacité d'emprunt (règle BuyMonth)
// Mensualité max = 40% des revenus nets, moins les crédits en cours.
// Les hypothèses (taux, durée) viennent des paramètres admin, transmises via `cfg`.

import { MENSUALITE_CONFIG } from './mensualiteConfig'

const TAUX_ENDETTEMENT = 0.40

// Montant empruntable à partir d'une mensualité disponible (formule d'amortissement inversée)
function capitalDepuisMensualite(mensualite, tauxAnnuel, dureeMois) {
  const i = Math.pow(1 + tauxAnnuel, 1 / 12) - 1
  if (i === 0) return mensualite * dureeMois
  return mensualite * (1 - Math.pow(1 + i, -dureeMois)) / i
}

export function calculCapacite({ revenus, apport = 0, creditsEnCours = 0 }, cfg = MENSUALITE_CONFIG) {
  const c = { ...MENSUALITE_CONFIG, ...cfg }
  const rev = Number(revenus) || 0
  const ap = Number(apport) || 0
  const credits = Number(creditsEnCours) || 0

  // mensualité maximale supportable
  const mensualiteMax = Math.max(0, rev * TAUX_ENDETTEMENT - credits)

  // capital empruntable
  const capitalEmpruntable = capitalDepuisMensualite(mensualiteMax, c.tauxAnnuel, c.dureeMois)

  // budget total = capital + apport
  const budgetMax = Math.round(capitalEmpruntable + ap)

  return {
    mensualiteMax: Math.round(mensualiteMax),
    capitalEmpruntable: Math.round(capitalEmpruntable),
    budgetMax,
    tauxEndettement: TAUX_ENDETTEMENT,
  }
}

// Compare le budget du visiteur au prix décaissé d'un bien (TVAC pour le neuf)
export function evalueBien({ revenus, apport = 0, creditsEnCours = 0, prixBien }, cfg = MENSUALITE_CONFIG) {
  const cap = calculCapacite({ revenus, apport, creditsEnCours }, cfg)
  const prix = Number(prixBien) || 0
  const ecart = cap.budgetMax - prix
  const ratio = prix > 0 ? cap.budgetMax / prix : 0

  let statut // 'ok' | 'limite' | 'insuffisant'
  if (ratio >= 1) statut = 'ok'
  else if (ratio >= 0.85) statut = 'limite'
  else statut = 'insuffisant'

  return { ...cap, prix, ecart, ratio, statut }
}

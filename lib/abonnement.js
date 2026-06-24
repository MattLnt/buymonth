// Statuts Stripe considérés comme donnant accès
const STATUTS_ACTIFS = ['active', 'trialing']

// Essai gratuit accordé par l'admin encore valide ?
export function essaiActif(client) {
  if (!client?.trialEndsAt) return false
  return new Date(client.trialEndsAt).getTime() > Date.now()
}

export function abonnementActif(client) {
  if (!client) return false
  // Abonnement Stripe actif
  if (client.subStatus && STATUTS_ACTIFS.includes(client.subStatus)) return true
  // OU essai gratuit admin en cours
  if (essaiActif(client)) return true
  return false
}
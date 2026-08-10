// Facturation « au bien actif » (modèle V2)
// Montant mensuel = nb de biens FACTURABLES × tarif de la formule.
// Bien facturable = statut ACTIF (Disponible) OU OPTION (Sous option) — cf. dossier §8.1.
// + frais de mise en service uniques (une seule fois).
// Le widget est gratuit (plus de paiement à l'unité).

export const TARIFS = {
  PRO: 39, // € HTVA / bien facturable / mois
  PRO_PLUS: 45, // € HTVA / bien facturable / mois
}

export const MISE_EN_SERVICE = 1490 // € HTVA, une seule fois

export const SEUIL_SUR_MESURE = 125 // au-delà : offre sur mesure

// Statuts facturés (= « bien actif » au sens contractuel : Disponible ou Sous option)
export const STATUTS_FACTURABLES = ['ACTIF', 'OPTION']

// Libellés d'affichage
export const FORMULE_LABEL = {
  PRO: 'BuyMonth Pro',
  PRO_PLUS: 'BuyMonth Pro+',
}

// Un bien est facturé s'il est ACTIF ou en OPTION. hors-ligne / vendu => hors décompte.
export function estBienFacturable(bien) {
  return STATUTS_FACTURABLES.includes(bien?.statut)
}

// Tarif unitaire d'une formule (défaut PRO si inconnu)
export function tarifUnitaire(formule) {
  return TARIFS[formule] ?? TARIFS.PRO
}

/*
 * Décompte de facturation d'un client.
 * @param biens   liste des biens du client (avec .statut)
 * @param formule 'PRO' | 'PRO_PLUS'
 */
export function decompteFacturation(biens = [], formule = 'PRO') {
  const total = biens.length
  const actifs = biens.filter(estBienFacturable).length
  const unitaire = tarifUnitaire(formule)
  const montantMensuel = actifs * unitaire

  return {
    formule,
    formuleLabel: FORMULE_LABEL[formule] ?? formule,
    total, // nb total de biens
    actifs, // nb de biens facturés (ACTIF + OPTION)
    unitaire, // tarif / bien / mois
    montantMensuel, // € HTVA / mois
    surMesure: actifs > SEUIL_SUR_MESURE,
  }
}

// Statuts d'abonnement Stripe qui donnent droit à la diffusion publique.
// active = payé et en cours ; trialing = période d'essai.
// Tout le reste (past_due, canceled, unpaid, incomplete, null) => non diffusé.
export const STATUTS_ABONNEMENT_ACTIFS = ['active', 'trialing']

/*
 * Un promoteur est "actif" (ses biens sont diffusés publiquement) s'il a
 * un abonnement Stripe en cours. Sans abonnement actif, aucun de ses biens
 * n'apparaît sur la vitrine, les fiches, les pages agence ou les widgets.
 * @param client  le Client (avec .subStatus)
 */
export function estPromoteurActif(client) {
  return STATUTS_ABONNEMENT_ACTIFS.includes(client?.subStatus)
}
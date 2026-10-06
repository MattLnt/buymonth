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

  // Decompte par statut : la page Abonnement doit pouvoir expliquer le montant
  // ligne par ligne, sinon le promoteur ne sait pas d'ou sortent ses euros.
  const parStatut = biens.reduce((acc, b) => {
    const cle = b?.statut || 'ACTIF'
    acc[cle] = (acc[cle] || 0) + 1
    return acc
  }, {})

  return {
    formule,
    formuleLabel: FORMULE_LABEL[formule] ?? formule,
    total, // nb total de biens
    actifs, // nb de biens facturés (ACTIF + OPTION)
    unitaire, // tarif / bien / mois
    montantMensuel, // € HTVA / mois
    surMesure: actifs > SEUIL_SUR_MESURE,
    parStatut, // { ACTIF: n, OPTION: n, HORS_LIGNE: n, VENDU: n }
  }
}

// Statuts d'abonnement Stripe qui donnent droit à la diffusion publique.
// active = payé et en cours ; trialing = période d'essai ou attente du 1er.
// Tout le reste (canceled, unpaid, incomplete, null) => non diffusé.
export const STATUTS_ABONNEMENT_ACTIFS = ['active', 'trialing']

/*
 * Délai de grâce en cas d'impayé.
 *
 * Un prélèvement peut échouer pour une broutille — plafond atteint, carte
 * renouvelée, provision insuffisante — et se régulariser en deux jours. Couper
 * la diffusion dès le premier échec ferait disparaître le catalogue du
 * promoteur, et les widgets installés sur son propre site, du jour au
 * lendemain. On lui laisse donc le temps de régulariser.
 */
export const JOURS_GRACE_IMPAYE = 10

// Un impayé est-il encore dans le délai de grâce ?
export function dansDelaiDeGrace(client) {
  if (!client?.impayeDepuis) return false
  const limite = new Date(client.impayeDepuis).getTime() + JOURS_GRACE_IMPAYE * 24 * 60 * 60 * 1000
  return Date.now() < limite
}

// Date à laquelle la diffusion s'arrête si rien n'est régularisé
export function finDelaiDeGrace(client) {
  if (!client?.impayeDepuis) return null
  return new Date(new Date(client.impayeDepuis).getTime() + JOURS_GRACE_IMPAYE * 24 * 60 * 60 * 1000)
}

/*
 * Un promoteur est "actif" (ses biens sont diffusés publiquement) s'il a
 * un abonnement Stripe en cours. Sans abonnement actif, aucun de ses biens
 * n'apparaît sur la vitrine, les fiches, les pages agence ou les widgets.
 * @param client  le Client (avec .subStatus)
 */
export function estPromoteurActif(client) {
  if (STATUTS_ABONNEMENT_ACTIFS.includes(client?.subStatus)) return true
  // Impayé récent : on continue de diffuser pendant le délai de grâce.
  if (client?.subStatus === 'past_due' && dansDelaiDeGrace(client)) return true
  return false
}
/*
 * Ancrage du cycle de facturation au 1er du mois.
 * Dossier développeur V9, partie 8.1 (page 29) : « le montant facturé varie selon
 * le nombre de biens actifs au 1er du mois ; l'abonnement se paie le 1er du mois
 * pour tout le monde ». Le mois partiel entre l'inscription et le 1er est facturé
 * au prorata (décision BuyMonth du 06/10/2026).
 *
 * Renvoie l'horodatage Unix (secondes) du prochain 1er du mois à 00:00 UTC.
 */
export function prochainPremierDuMois(depuis = new Date()) {
  const d = new Date(Date.UTC(depuis.getUTCFullYear(), depuis.getUTCMonth() + 1, 1, 0, 0, 0))
  return Math.floor(d.getTime() / 1000)
}

/*
 * Condition Prisma equivalente a estPromoteurActif(), pour les requetes qui
 * filtrent directement en base plutot que de charger le client.
 * A utiliser dans un `where` : { published: true, OR: filtreClientDiffusable() }
 */
export function filtreClientDiffusable() {
  const limite = new Date(Date.now() - JOURS_GRACE_IMPAYE * 24 * 60 * 60 * 1000)
  return [
    { client: { subStatus: { in: STATUTS_ABONNEMENT_ACTIFS } } },
    { client: { subStatus: 'past_due', impayeDepuis: { gt: limite } } },
  ]
}

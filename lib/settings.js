import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'
import { prixDecaisse } from '@/lib/regime'

// Récupère (ou crée) la ligne de paramètres unique "default"
export async function getSettings() {
  let s = await prisma.settings.findUnique({ where: { id: 'default' } })
  if (!s) {
    s = await prisma.settings.create({
      data: { id: 'default', apportPct: 0.10, tauxAnnuel: 0.0395, taegAnnuel: 0.0425, dureeMois: 360 },
    })
  }
  return s
}

// Hypothèses de calcul, sous forme d'objet simple transmissible aux composants client.
// C'est la source de vérité de tout montant affiché (fiche, cartes, badge, widget, simulateur).
export async function getConfigMensualite() {
  const s = await getSettings()
  return {
    apportPct: s.apportPct,
    tauxAnnuel: s.tauxAnnuel,
    taegAnnuel: s.taegAnnuel,
    dureeMois: s.dureeMois,
  }
}

// Calcule la mensualité d'un bien (prix encodé + régime fiscal) avec les paramètres enregistrés en base
export async function calculMensualiteServeur(prixTotal, regime = null) {
  const cfg = await getConfigMensualite()
  return calculMensualite(prixDecaisse(prixTotal, regime), cfg)
}

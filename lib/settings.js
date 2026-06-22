import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'

// Récupère (ou crée) la ligne de paramètres unique "default"
export async function getSettings() {
  let s = await prisma.settings.findUnique({ where: { id: 'default' } })
  if (!s) {
    s = await prisma.settings.create({
      data: { id: 'default', apportPct: 0.10, tauxAnnuel: 0.0345, dureeMois: 300 },
    })
  }
  return s
}

// Calcule la mensualité en utilisant les paramètres enregistrés en base (serveur uniquement)
export async function calculMensualiteServeur(prixTotal) {
  const s = await getSettings()
  return calculMensualite(prixTotal, {
    apportPct: s.apportPct,
    tauxAnnuel: s.tauxAnnuel,
    dureeMois: s.dureeMois,
  })
}
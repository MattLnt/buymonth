import { prisma } from '@/lib/prisma'

// Routage des leads vers les commerciaux d'un promoteur partenaire.
// Demande Valentino du 03/11/2026 (partenariat Matexi, test de 3 mois) : chaque
// lead part en clair chez un commercial, avec la reference du bien et la mention
// « Source : BuyMonth », pour reprise manuelle dans leur CRM.
//
// Deux adresses par regle = tournante stricte : un lead chez l'un, le suivant
// chez l'autre. L'alternance se deduit du nombre de leads deja routes sur le
// bien, il n'y a donc aucun compteur a maintenir (et rien a reparer si un lead
// est supprime en base : la suite reprend sur la parite courante).

// Regle applicable a un bien : celle de son projet si elle existe, sinon celle
// qui couvre tout le portefeuille du promoteur. Une regle inactive est ignoree,
// c'est ce qui permet d'arreter le test sans rien effacer.
export async function regleRoutage(bien) {
  if (!bien?.clientId) return null

  const regles = await prisma.routageLead.findMany({
    where: { clientId: bien.clientId, actif: true },
  })
  if (regles.length === 0) return null

  const projet = bien.projet && bien.projet !== 'Hors projet' ? bien.projet : null
  return (
    (projet && regles.find((r) => r.projet === projet)) ||
    regles.find((r) => !r.projet) ||
    null
  )
}

// Adresse du commercial dont c'est le tour, pour un lead qui vient d'etre cree.
// Renvoie null si le promoteur n'a pas de regle de routage.
export async function destinataireRoutage({ lead, bien }) {
  const regle = await regleRoutage(bien)
  if (!regle) return null

  const adresses = [regle.email1, regle.email2].filter(Boolean)
  if (adresses.length === 0) return null
  if (adresses.length === 1) return adresses[0]

  // Leads deja routes sur ce bien, celui qu'on vient de creer exclu. Seuls les
  // leads transmissibles au promoteur comptent : ce sont les seuls qui sont
  // partis chez un commercial, donc les seuls qui ont fait avancer le tour.
  const dejaRoutes = await prisma.lead.count({
    where: {
      bienId: bien.id,
      consentPromoteur: true,
      id: { not: lead.id },
    },
  })

  return adresses[dejaRoutes % adresses.length]
}

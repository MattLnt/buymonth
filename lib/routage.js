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

  // Le routage doit d'abord etre ouvert par l'admin BuyMonth sur la fiche du
  // promoteur ; les adresses saisies ne servent a rien tant qu'il est ferme.
  const client = await prisma.client.findUnique({
    where: { id: bien.clientId },
    select: { routageActif: true },
  })
  if (!client?.routageActif) return null

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

// Nettoie les lignes saisies a l'ecran (admin ou promoteur) avant enregistrement.
// Renvoie { erreur } si la saisie est incoherente, sinon { regles } pret a creer.
export function normaliserRegles(clientId, lignes) {
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const propre = (v) => {
    const e = String(v || '').trim().toLowerCase()
    return EMAIL.test(e) ? e : null
  }

  const regles = []
  for (const r of Array.isArray(lignes) ? lignes : []) {
    const email1 = propre(r.email1)
    const email2 = propre(r.email2)
    // Ligne vide : c'est la facon de supprimer une regle depuis l'ecran
    if (!email1 && !email2) continue
    if (email1 && email2 && email1 === email2) {
      return { erreur: 'Les deux commerciaux ont la meme adresse.' }
    }
    const projet = typeof r.projet === 'string' && r.projet.trim() ? r.projet.trim().slice(0, 200) : null
    // Une seule regle par projet, sinon le choix du destinataire serait au hasard
    if (regles.some((p) => p.projet === projet)) {
      return {
        erreur: projet
          ? `Deux regles pour le projet « ${projet} ».`
          : 'Deux regles pour tout le portefeuille.',
      }
    }
    regles.push({
      clientId,
      projet,
      // une regle a toujours une adresse principale, meme si seul le 2e champ etait rempli
      email1: email1 || email2,
      email2: email1 ? email2 : null,
      actif: r.actif !== false,
    })
  }
  return { regles }
}

// Remplace l'ensemble des regles d'un promoteur par celles envoyees a l'ecran.
export async function remplacerRegles(clientId, regles) {
  await prisma.$transaction([
    prisma.routageLead.deleteMany({ where: { clientId } }),
    ...(regles.length ? [prisma.routageLead.createMany({ data: regles })] : []),
  ])
  return prisma.routageLead.findMany({
    where: { clientId },
    orderBy: [{ projet: 'asc' }, { createdAt: 'asc' }],
  })
}

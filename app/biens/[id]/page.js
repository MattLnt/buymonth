import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BienFiche } from '@/app/components/public/BienFiche'
import { estPromoteurActif } from '@/lib/facturation'

export const dynamic = 'force-dynamic'

export default async function BienDetailPage({ params }) {
  const { id } = await params

  const bien = await prisma.bien.findUnique({
    where: { id },
    include: { client: { select: { id: true, userId: true, societe: true, slug: true, logoUrl: true, telephone: true, subStatus: true } } },
  })

  // Le bien n'existe pas du tout → retour au catalogue
  if (!bien) redirect('/biens')

  // Est-ce le propriétaire connecté qui regarde son propre bien ?
  const session = await getServerSession(authOptions)
  let estProprietaire = false
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
    estProprietaire = !!user && user.id === bien.client?.userId
  }

  // Le bien est-il diffusé publiquement ? (publié ET promoteur abonné)
  const diffusable = bien.published && estPromoteurActif(bien.client)

  // Cas 1 : bien diffusable → fiche publique normale (on incrémente les vues)
  if (diffusable) {
    prisma.bien.update({ where: { id }, data: { vues: { increment: 1 } } }).catch(() => {})
    return <BienFiche bien={bien} />
  }

  // Cas 2 : bien non diffusable, mais c'est le propriétaire → fiche en mode aperçu (bandeau premium)
  if (estProprietaire) {
    return <BienFiche bien={bien} apercu />
  }

  // Cas 3 : bien non diffusable, visiteur lambda → retour au catalogue
  redirect('/biens')
}
import { NextResponse } from 'next/server'
import { getT } from '@/lib/i18n/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { t } = await getT()
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: t('Profil introuvable.', 'Profiel niet gevonden.') }, { status: 404 })

    const paiements = await prisma.widgetPayment.findMany({
      where: { clientId: client.id, statut: 'paid', bienId: { not: null } },
      select: { bienId: true },
    })

    const bienIds = [...new Set(paiements.map((p) => p.bienId))]
    return NextResponse.json({ bienIds })
  } catch (e) {
    return NextResponse.json({ error: t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}
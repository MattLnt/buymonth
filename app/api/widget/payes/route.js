import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 })

    const paiements = await prisma.widgetPayment.findMany({
      where: { clientId: client.id, statut: 'paid', bienId: { not: null } },
      select: { bienId: true },
    })

    const bienIds = [...new Set(paiements.map((p) => p.bienId))]
    return NextResponse.json({ bienIds })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
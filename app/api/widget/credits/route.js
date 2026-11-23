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

    const gratuitsUtilises = await prisma.widgetPayment.count({
      where: { clientId: client.id, montant: 0 },
    })
    const creditsRestants = Math.max(0, (client.widgetsGratuits || 0) - gratuitsUtilises)

    return NextResponse.json({ creditsRestants })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const bienId = searchParams.get('bienId')
    if (!bienId) return NextResponse.json({ error: 'bienId manquant.' }, { status: 400 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 })

    // Vérifie l'ownership du bien
    const bien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (!bien || bien.clientId !== client.id) {
      return NextResponse.json({ error: 'Bien introuvable.' }, { status: 404 })
    }

    // Ce bien a-t-il déjà un paiement widget ?
    const paiement = await prisma.widgetPayment.findFirst({
      where: { clientId: client.id, bienId, statut: 'paid' },
    })

    return NextResponse.json({ paye: !!paiement })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getT } from '@/lib/i18n/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  const { t } = await getT()
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const bienId = searchParams.get('bienId')
    if (!bienId) return NextResponse.json({ error: t('bienId manquant.', 'bienId ontbreekt.') }, { status: 400 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: t('Profil introuvable.', 'Profiel niet gevonden.') }, { status: 404 })

    // Vérifie l'ownership du bien
    const bien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (!bien || bien.clientId !== client.id) {
      return NextResponse.json({ error: t('Bien introuvable.', 'Pand niet gevonden.') }, { status: 404 })
    }

    // Ce bien a-t-il déjà un paiement widget ?
    const paiement = await prisma.widgetPayment.findFirst({
      where: { clientId: client.id, bienId, statut: 'paid' },
    })

    return NextResponse.json({ paye: !!paiement })
  } catch (e) {
    return NextResponse.json({ error: t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}
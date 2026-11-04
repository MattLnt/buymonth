import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normaliserRegles, remplacerRegles } from '@/lib/routage'

// Le promoteur gere les adresses de ses commerciaux depuis son propre compte,
// mais seulement si l'admin BuyMonth a ouvert la fonction pour lui.

async function clientCourant() {
  const session = await getServerSession(authOptions)
  if (!session) return { refus: NextResponse.json({ error: 'Non autorisé.' }, { status: 401 }) }
  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    select: { id: true, routageActif: true },
  })
  if (!client) return { refus: NextResponse.json({ error: 'Compte introuvable.' }, { status: 404 }) }
  if (!client.routageActif) {
    return { refus: NextResponse.json({ error: 'Fonction non activée sur votre compte.' }, { status: 403 }) }
  }
  return { client }
}

export async function GET() {
  const { client, refus } = await clientCourant()
  if (refus) return refus

  const regles = await prisma.routageLead.findMany({
    where: { clientId: client.id },
    orderBy: [{ projet: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ regles })
}

export async function PUT(req) {
  const { client, refus } = await clientCourant()
  if (refus) return refus

  try {
    const b = await req.json()
    const { regles, erreur } = normaliserRegles(client.id, b.regles)
    if (erreur) return NextResponse.json({ error: erreur }, { status: 400 })

    return NextResponse.json({ ok: true, regles: await remplacerRegles(client.id, regles) })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

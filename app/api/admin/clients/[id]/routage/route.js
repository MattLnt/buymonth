import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normaliserRegles, remplacerRegles } from '@/lib/routage'

// Routage des leads d'un promoteur, cote admin BuyMonth (lot Matexi du
// 03/11/2026). L'admin ouvre la fonction pour le promoteur, qui saisit ensuite
// lui-meme les adresses de ses commerciaux depuis son compte. L'admin peut
// aussi les saisir a sa place, pour la mise en route ou un depannage.

async function garde() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }
  return null
}

export async function GET(req, { params }) {
  const refus = await garde()
  if (refus) return refus

  const { id } = await params
  const client = await prisma.client.findUnique({ where: { id }, select: { routageActif: true } })
  if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

  const regles = await prisma.routageLead.findMany({
    where: { clientId: id },
    orderBy: [{ projet: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ routageActif: client.routageActif, regles })
}

export async function PUT(req, { params }) {
  const refus = await garde()
  if (refus) return refus

  try {
    const { id } = await params
    const b = await req.json()

    const client = await prisma.client.findUnique({ where: { id }, select: { id: true, routageActif: true } })
    if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

    const { regles, erreur } = normaliserRegles(id, b.regles)
    if (erreur) return NextResponse.json({ error: erreur }, { status: 400 })

    const routageActif = typeof b.routageActif === 'boolean' ? b.routageActif : client.routageActif
    if (routageActif !== client.routageActif) {
      await prisma.client.update({ where: { id }, data: { routageActif } })
    }

    return NextResponse.json({ ok: true, routageActif, regles: await remplacerRegles(id, regles) })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

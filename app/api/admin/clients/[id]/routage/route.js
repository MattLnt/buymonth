import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Regles de routage des leads d'un promoteur (lot Matexi du 03/11/2026).
// Reserve a l'admin BuyMonth : le promoteur ne voit pas cet ecran.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function nettoyerEmail(v) {
  const e = String(v || '').trim().toLowerCase()
  return EMAIL.test(e) ? e : null
}

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
  const regles = await prisma.routageLead.findMany({
    where: { clientId: id },
    orderBy: [{ projet: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ regles })
}

// Remplace l'ensemble des regles du promoteur par celles envoyees par l'ecran.
// Une ligne sans adresse valide est simplement ignoree, c'est la facon de
// supprimer une regle depuis l'ecran (et d'arreter le test Matexi).
export async function PUT(req, { params }) {
  const refus = await garde()
  if (refus) return refus

  try {
    const { id } = await params
    const b = await req.json()

    const client = await prisma.client.findUnique({ where: { id }, select: { id: true } })
    if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

    const lignes = Array.isArray(b.regles) ? b.regles : []
    const propres = []
    for (const r of lignes) {
      const email1 = nettoyerEmail(r.email1)
      const email2 = nettoyerEmail(r.email2)
      if (!email1 && !email2) continue
      if (email1 && email2 && email1 === email2) {
        return NextResponse.json({ error: 'Les deux commerciaux ont la même adresse.' }, { status: 400 })
      }
      const projet = typeof r.projet === 'string' && r.projet.trim() ? r.projet.trim().slice(0, 200) : null
      // Une seule regle par projet, sinon le choix du destinataire serait au hasard
      if (propres.some((p) => p.projet === projet)) {
        return NextResponse.json(
          { error: projet ? `Deux règles pour le projet « ${projet} ».` : 'Deux règles pour tout le portefeuille.' },
          { status: 400 },
        )
      }
      propres.push({
        clientId: id,
        projet,
        // une regle a toujours une adresse principale, meme si seul le 2e champ etait rempli
        email1: email1 || email2,
        email2: email1 ? email2 : null,
        actif: r.actif !== false,
      })
    }

    await prisma.$transaction([
      prisma.routageLead.deleteMany({ where: { clientId: id } }),
      ...(propres.length ? [prisma.routageLead.createMany({ data: propres })] : []),
    ])

    const regles = await prisma.routageLead.findMany({
      where: { clientId: id },
      orderBy: [{ projet: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json({ ok: true, regles })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Valeurs autorisées côté promoteur (jeu distinct de l'admin)
const STATUTS_PROMOTEUR = [
  'À contacter',
  'Contact en cours',
  'Projet futur',
  'Offre',
  'Compromis avec conditions',
  'Compromis sans conditions',
  'Vente',
  'Abandon',
  'Refus crédit',
  'Mauvaises coordonnées',
]

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { leadId, statut } = await req.json()
    if (!leadId || !statut) return NextResponse.json({ error: 'Paramètres manquants.' }, { status: 400 })
    if (!STATUTS_PROMOTEUR.includes(statut)) {
      return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })
    }

    // Sécurité : le lead doit porter sur un bien du promoteur connecté
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { bien: { select: { clientId: true } } },
    })
    if (!lead || lead.bien?.clientId !== client.id) {
      return NextResponse.json({ error: 'Lead introuvable.' }, { status: 404 })
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: { statutPromoteur: statut },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
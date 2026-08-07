import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Statuts internes admin (jeu distinct du promoteur)
const STATUTS_ADMIN = [
  'À contacter',
  'Contact en cours',
  'Projet futur',
  'Dossier introduit',
  'Dossier accepté',
  'Acte passé',
  'Abandon',
  'Refus crédit',
  'Mauvaises coordonnées',
]

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
    }

    const { leadId, statut } = await req.json()
    if (!leadId || !statut) return NextResponse.json({ error: 'Paramètres manquants.' }, { status: 400 })
    if (!STATUTS_ADMIN.includes(statut)) {
      return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) return NextResponse.json({ error: 'Lead introuvable.' }, { status: 404 })

    await prisma.lead.update({
      where: { id: leadId },
      data: { statutAdmin: statut },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
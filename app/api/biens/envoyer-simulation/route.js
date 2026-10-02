import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { envoyerEmailSimulation } from '@/lib/email'
import { estPromoteurActif } from '@/lib/facturation'
import { rateLimit } from '@/lib/rateLimit'

/*
 * POST /api/biens/envoyer-simulation  { id, email }
 * Le promoteur connecté envoie à son client un e-mail contenant le lien de simulation du bien.
 * Pas de traçage ni de conservation de l'adresse (choix client, échange du 01/10/2026).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const BASE_URL = process.env.NEXTAUTH_URL || 'https://buymonth.be'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    // Garde-fou anti-abus : 30 envois par heure et par promoteur
    const rl = rateLimit(`sim:${client.id}`, 30, 60 * 60 * 1000)
    if (!rl.ok) {
      return NextResponse.json({ error: "Trop d'envois en peu de temps. Réessayez dans quelques minutes." }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}))
    const id = body?.id
    const email = String(body?.email || '').trim().toLowerCase()

    if (!id) return NextResponse.json({ error: 'Bien manquant.' }, { status: 400 })
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 })

    const bien = await prisma.bien.findUnique({ where: { id } })
    if (!bien || bien.clientId !== client.id) {
      return NextResponse.json({ error: 'Bien introuvable.' }, { status: 404 })
    }

    // Le lien ne fonctionne que si la fiche est accessible publiquement
    if (!bien.published) {
      return NextResponse.json({ error: "Ce bien n'est pas en ligne : passez-le en « Actif » ou « Sous option » avant d'envoyer la simulation." }, { status: 400 })
    }
    if (!estPromoteurActif(client)) {
      return NextResponse.json({ error: "Votre abonnement n'est pas actif : la fiche du bien n'est pas visible par vos clients." }, { status: 400 })
    }

    const url = `${BASE_URL}/biens/${bien.id}#simuler`
    const res = await envoyerEmailSimulation({ email, bien, promoteur: client, url })

    if (res?.skipped === 'no_api_key') {
      return NextResponse.json({ error: "Envoi d'e-mails non configuré." }, { status: 500 })
    }
    if (!res?.ok) {
      return NextResponse.json({ error: "L'e-mail n'a pas pu être envoyé. Réessayez." }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[SIMULATION] Erreur :', e?.message)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

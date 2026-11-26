import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { envoyerEmailSimulation } from '@/lib/email'
import { estPromoteurActif } from '@/lib/facturation'
import { rateLimit } from '@/lib/rateLimit'
import { getT } from '@/lib/i18n/server'
import { normLang, withLang } from '@/lib/i18n/config'

/*
 * POST /api/biens/envoyer-simulation  { id, email }
 * Le promoteur connecté envoie à son client un e-mail contenant le lien de simulation du bien.
 * Pas de traçage ni de conservation de l'adresse (choix client, échange du 01/10/2026).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const BASE_URL = process.env.NEXTAUTH_URL || 'https://buymonth.be'

export async function POST(req) {
  const { t } = await getT()
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 })

    // Garde-fou anti-abus : 30 envois par heure et par promoteur
    const rl = rateLimit(`sim:${client.id}`, 30, 60 * 60 * 1000)
    if (!rl.ok) {
      return NextResponse.json({ error: t("Trop d'envois en peu de temps. Réessayez dans quelques minutes.", 'Te veel verzendingen in korte tijd. Probeer het over enkele minuten opnieuw.') }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}))
    const id = body?.id
    const email = String(body?.email || '').trim().toLowerCase()

    if (!id) return NextResponse.json({ error: t('Bien manquant.', 'Pand ontbreekt.') }, { status: 400 })
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: t('Adresse e-mail invalide.', 'Ongeldig e-mailadres.') }, { status: 400 })

    const bien = await prisma.bien.findUnique({ where: { id } })
    if (!bien || bien.clientId !== client.id) {
      return NextResponse.json({ error: t('Bien introuvable.', 'Pand niet gevonden.') }, { status: 404 })
    }

    // Le lien ne fonctionne que si la fiche est accessible publiquement
    if (!bien.published) {
      return NextResponse.json({ error: t("Ce bien n'est pas en ligne : passez-le en « Actif » ou « Sous option » avant d'envoyer la simulation.", 'Dit pand staat niet online: zet het op “Actief” of “In optie” voordat u de simulatie verstuurt.') }, { status: 400 })
    }
    if (!estPromoteurActif(client)) {
      return NextResponse.json({ error: t("Votre abonnement n'est pas actif : la fiche du bien n'est pas visible par vos clients.", 'Uw abonnement is niet actief: de fiche van het pand is niet zichtbaar voor uw klanten.') }, { status: 400 })
    }

    // Langue choisie par le promoteur pour cet e-mail ; le lien ouvre la fiche dans la même langue
    const langEmail = normLang(body?.lang)
    const url = withLang(`${BASE_URL}/biens/${bien.id}#simuler`, langEmail)
    const res = await envoyerEmailSimulation({ email, bien, promoteur: client, url, lang: langEmail })

    if (res?.skipped === 'no_api_key') {
      return NextResponse.json({ error: t("Envoi d'e-mails non configuré.", 'Verzending van e-mails niet geconfigureerd.') }, { status: 500 })
    }
    if (!res?.ok) {
      return NextResponse.json({ error: t("L'e-mail n'a pas pu être envoyé. Réessayez.", 'De e-mail kon niet worden verstuurd. Probeer het opnieuw.') }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[SIMULATION] Erreur :', e?.message)
    return NextResponse.json({ error: t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}

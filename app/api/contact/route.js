import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'
import { envoyerEmailContact } from '@/lib/email'
import { getT } from '@/lib/i18n/server'

export async function POST(req) {
  const { t } = await getT()
  try {
    const body = await req.json()
    const nom = (body.nom || '').trim()
    const email = (body.email || '').trim()
    const sujet = (body.sujet || '').trim()
    const message = (body.message || '').trim()

    // Validation
    if (!nom || !email || !message) {
      return NextResponse.json({ error: t('Merci de remplir tous les champs requis.', 'Gelieve alle verplichte velden in te vullen.') }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: t('Adresse email invalide.', 'Ongeldig e-mailadres.') }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: t('Message trop long.', 'Bericht te lang.') }, { status: 400 })
    }

    // Destinataires = ceux configurés en admin (mêmes que les leads)
    const settings = await getSettings()
    const destinataires = settings.leadEmails || []

    if (destinataires.length === 0) {
      // Pas de destinataire configuré : on ne bloque pas l'utilisateur, mais on logue
      console.warn('[CONTACT] Aucun destinataire configuré dans les paramètres.')
      return NextResponse.json({ ok: true, warning: 'no_recipients' })
    }

    await envoyerEmailContact({ nom, email, sujet, message, destinataires })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[CONTACT]', e?.message)
    return NextResponse.json({ error: t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}
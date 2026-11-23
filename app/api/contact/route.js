import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'
import { envoyerEmailContact } from '@/lib/email'

export async function POST(req) {
  try {
    const body = await req.json()
    const nom = (body.nom || '').trim()
    const email = (body.email || '').trim()
    const sujet = (body.sujet || '').trim()
    const message = (body.message || '').trim()

    // Validation
    if (!nom || !email || !message) {
      return NextResponse.json({ error: 'Merci de remplir tous les champs requis.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message trop long.' }, { status: 400 })
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
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
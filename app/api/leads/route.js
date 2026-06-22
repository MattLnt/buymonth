import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { envoyerEmailLead } from '@/lib/email'

export async function POST(req) {
  try {
    const b = await req.json()

    let bien = null
    if (b.bienId) {
      bien = await prisma.bien.findUnique({
        where: { id: b.bienId },
        select: { id: true, titre: true, ville: true },
      })
    }

    if (!b.email && !b.telephone) {
      return NextResponse.json({ error: 'Email ou téléphone requis.' }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        bienId: bien?.id || null,
        nom: b.nom || null,
        email: b.email || null,
        telephone: b.telephone || null,
        revenu: b.revenu ? parseInt(b.revenu, 10) : null,
        apport: b.apport ? parseInt(b.apport, 10) : null,
        source: b.source || 'SIMULATEUR',
      },
    })

    // notification email (non bloquant)
    try {
      const settings = await getSettings()
      await envoyerEmailLead({ lead, bien, destinataires: settings.leadEmails || [] })
    } catch (e) {
      // on n'échoue jamais la requête si l'email plante
    }

    return NextResponse.json({ ok: true, leadId: lead.id })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
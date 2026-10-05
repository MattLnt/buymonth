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
        select: {
          id: true,
          titre: true,
          ville: true,
          projet: true,
          unite: true,
          client: { select: { user: { select: { email: true } }, societe: true } },
        },
      })
    }

    if (!b.email && !b.telephone) {
      return NextResponse.json({ error: 'Email ou téléphone requis.' }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        bienId: bien?.id || null,
        nom: b.nom || null,
        societe: b.societe || null,
        email: b.email || null,
        telephone: b.telephone || null,
        revenu: b.revenu ? parseInt(b.revenu, 10) : null,
        apport: b.apport ? parseInt(b.apport, 10) : null,
        consentPromoteur: b.consentPromoteur === true,
        consentFinance: b.consentFinance === true,
        consentAt: b.consentPromoteur === true || b.consentFinance === true ? new Date() : null,
        source: b.source || 'SIMULATEUR',
      },
    })

    // notification email (non bloquant)
    try {
      const settings = await getSettings()

      // Destinataires = adresses plateforme (BuyMonth, responsable du traitement)
      // + e-mail du promoteur, uniquement si le visiteur a coché la case qui
      // autorise la transmission au promoteur (annexe 1 du dossier du 05/10/2026).
      const emailPromoteur = lead.consentPromoteur ? bien?.client?.user?.email : null
      const destinataires = [
        ...(settings.leadEmails || []),
        ...(emailPromoteur ? [emailPromoteur] : []),
      ]
      // dédoublonnage
      const uniques = [...new Set(destinataires.filter(Boolean))]

      await envoyerEmailLead({ lead, bien, destinataires: uniques })
    } catch (e) {
      // on n'échoue jamais la requête si l'email plante
    }

    return NextResponse.json({ ok: true, leadId: lead.id })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
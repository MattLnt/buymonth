import { NextResponse } from 'next/server'
import { getT } from '@/lib/i18n/server'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { envoyerEmailLead, envoyerEmailLeadCommercial } from '@/lib/email'
import { destinataireRoutage } from '@/lib/routage'

export async function POST(req) {
  const { t } = await getT()
  try {
    const b = await req.json()

    let bien = null
    if (b.bienId) {
      bien = await prisma.bien.findUnique({
        where: { id: b.bienId },
        select: {
          id: true,
          clientId: true,
          titre: true,
          ville: true,
          projet: true,
          unite: true,
          client: { select: { user: { select: { email: true, langue: true } }, societe: true } },
        },
      })
    }

    if (!b.email && !b.telephone) {
      return NextResponse.json({ error: t('Email ou téléphone requis.', 'E-mail of telefoon verplicht.') }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        bienId: bien?.id || null,
        bienExterne: bien ? null : (typeof b.bienExterne === 'string' ? b.bienExterne.slice(0, 200) : null),
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

      // Bien d'un partenaire : pas de fiche en base, on alimente l'email avec le libelle recu
      const bienEmail = bien || (lead.bienExterne ? { titre: lead.bienExterne } : null)
      // Le promoteur reçoit l'e-mail dans la langue de son compte ; BuyMonth en français.
      const langPromoteur = bien?.client?.user?.langue === 'nl' ? 'nl' : 'fr'
      if (emailPromoteur && langPromoteur === 'nl') {
        const autres = uniques.filter((e) => e !== emailPromoteur)
        if (autres.length) await envoyerEmailLead({ lead, bien: bienEmail, destinataires: autres })
        await envoyerEmailLead({ lead, bien: bienEmail, destinataires: [emailPromoteur], lang: 'nl' })
      } else {
        await envoyerEmailLead({ lead, bien: bienEmail, destinataires: uniques })
      }
    } catch (e) {
      // on n'échoue jamais la requête si l'email plante
    }

    // Routage vers le commercial d'un promoteur partenaire, s'il en a un
    // (lot Matexi). Meme condition que l'e-mail au promoteur : rien ne part
    // sans la case de transmission au promoteur.
    try {
      if (bien && lead.consentPromoteur) {
        const destinataire = await destinataireRoutage({ lead, bien })
        if (destinataire) {
          await envoyerEmailLeadCommercial({ lead, bien, destinataire, lang: bien?.client?.user?.langue })
        }
      }
    } catch (e) {
      // idem : un routage qui plante ne fait pas perdre le lead
    }

    return NextResponse.json({ ok: true, leadId: lead.id })
  } catch (e) {
    return NextResponse.json({ error: t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}
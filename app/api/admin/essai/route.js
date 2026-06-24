import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const STATUTS_ABONNE = ['active', 'trialing']

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }

  try {
    const { clientId, trialEndsAt, widgetsGratuits, actif, widgetsOnly } = await req.json()
    if (!clientId) return NextResponse.json({ error: 'clientId manquant.' }, { status: 400 })

    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

    const estAbonne = client.subStatus && STATUTS_ABONNE.includes(client.subStatus)

    let data

    if (widgetsOnly) {
      // Mise à jour des widgets gratuits uniquement (cas client abonné)
      data = { widgetsGratuits: Math.max(0, parseInt(widgetsGratuits ?? 0, 10)) }
    } else if (actif === false) {
      // Désactiver l'essai : on retire la date (les widgets gratuits restent acquis)
      data = { trialEndsAt: null }
    } else {
      // Activer / modifier l'essai complet
      if (estAbonne) {
        return NextResponse.json({ error: 'Ce client est déjà abonné. Vous pouvez seulement lui offrir des widgets gratuits.' }, { status: 400 })
      }
      if (!trialEndsAt) return NextResponse.json({ error: 'Date d\'expiration requise.' }, { status: 400 })
      const date = new Date(trialEndsAt)
      if (isNaN(date.getTime())) return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
      data = {
        trialEndsAt: date,
        widgetsGratuits: Math.max(0, parseInt(widgetsGratuits ?? 0, 10)),
      }
    }

    const updated = await prisma.client.update({
      where: { id: clientId },
      data,
      select: { id: true, trialEndsAt: true, widgetsGratuits: true },
    })

    return NextResponse.json({ ok: true, client: updated })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
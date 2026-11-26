import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normaliserRegles, remplacerRegles } from '@/lib/routage'
import { getT } from '@/lib/i18n/server'

// Les messages de validation de lib/routage sont en français : on les traduit ici.
function traduireErreur(erreur, t) {
  if (erreur === 'Adresse e-mail invalide.') return t(erreur, 'Ongeldig e-mailadres.')
  if (erreur === 'Deux regles pour tout le portefeuille.') return t(erreur, 'Twee regels voor de hele portefeuille.')
  const m = /^Deux regles pour le projet « (.*) »\.$/.exec(erreur)
  if (m) return t(erreur, `Twee regels voor het project “${m[1]}”.`)
  return erreur
}

// Le promoteur gere les adresses de ses commerciaux depuis son propre compte,
// mais seulement si l'admin BuyMonth a ouvert la fonction pour lui.

async function clientCourant(t) {
  const session = await getServerSession(authOptions)
  if (!session) return { refus: NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 }) }
  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    select: { id: true, routageActif: true },
  })
  if (!client) return { refus: NextResponse.json({ error: t('Compte introuvable.', 'Account niet gevonden.') }, { status: 404 }) }
  if (!client.routageActif) {
    return { refus: NextResponse.json({ error: t('Fonction non activée sur votre compte.', 'Functie niet geactiveerd op uw account.') }, { status: 403 }) }
  }
  return { client }
}

export async function GET() {
  const { t } = await getT()
  const { client, refus } = await clientCourant(t)
  if (refus) return refus

  const regles = await prisma.routageLead.findMany({
    where: { clientId: client.id },
    orderBy: [{ projet: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ regles })
}

export async function PUT(req) {
  const { t } = await getT()
  const { client, refus } = await clientCourant(t)
  if (refus) return refus

  try {
    const b = await req.json()
    const { regles, erreur } = normaliserRegles(client.id, b.regles)
    if (erreur) return NextResponse.json({ error: traduireErreur(erreur, t) }, { status: 400 })

    return NextResponse.json({ ok: true, regles: await remplacerRegles(client.id, regles) })
  } catch (e) {
    return NextResponse.json({ error: t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}

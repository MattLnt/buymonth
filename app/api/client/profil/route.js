import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { genererSlugUnique } from '@/lib/slug'
import { getT } from '@/lib/i18n/server'

export async function PUT(req) {
  const { t } = await getT()
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: t('Profil introuvable.', 'Profiel niet gevonden.') }, { status: 404 })

    const b = await req.json()
    if (!b.societe || !b.societe.trim()) {
      return NextResponse.json({ error: t('Le nom de société est requis.', 'De bedrijfsnaam is verplicht.') }, { status: 400 })
    }

    const societe = b.societe.trim()

    // Régénère le slug si la société change OU si le client n'a pas encore de slug
    const data = {
      societe,
      contactNom: b.contactNom || null,
      telephone: b.telephone || null,
      adresse: b.adresse || null,
      numeroTva: b.numeroTva || null,
      logoUrl: b.logoUrl || null,
    }

    if (societe !== client.societe || !client.slug) {
      data.slug = await genererSlugUnique(societe, client.id)
    }

    const updated = await prisma.client.update({
      where: { id: client.id },
      data,
    })

    return NextResponse.json({ ok: true, client: updated })
  } catch (e) {
    return NextResponse.json({ error: t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}
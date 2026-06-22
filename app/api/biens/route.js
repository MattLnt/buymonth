import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculMensualiteServeur } from '@/lib/settings'

async function getClient() {
  const session = await getServerSession(authOptions)
  if (!session) return null
  return prisma.client.findUnique({ where: { userId: session.user.id } })
}

export async function POST(req) {
  try {
    const client = await getClient()
    if (!client) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const b = await req.json()
    const prixTotal = parseInt(b.prixTotal, 10)
    if (!b.titre || !prixTotal || prixTotal <= 0) {
      return NextResponse.json({ error: 'Titre et prix valides requis.' }, { status: 400 })
    }

    const mensualite = await calculMensualiteServeur(prixTotal)

    const bien = await prisma.bien.create({
      data: {
        clientId: client.id,
        titre: b.titre,
        description: b.description || null,
        prixTotal,
        mensualite,
        type: b.type || null,
        chambres: b.chambres ? parseInt(b.chambres, 10) : null,
        surface: b.surface ? parseInt(b.surface, 10) : null,
        ville: b.ville || null,
        province: b.province || null,
        adresse: b.adresse || null,
        urlClient: b.urlClient || null,
        images: Array.isArray(b.images) ? b.images : [],
        published: b.published !== false,
      },
    })

    return NextResponse.json({ ok: true, bien })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const client = await getClient()
    if (!client) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const b = await req.json()
    if (!b.id) return NextResponse.json({ error: 'ID manquant.' }, { status: 400 })

    const existing = await prisma.bien.findUnique({ where: { id: b.id } })
    if (!existing || existing.clientId !== client.id) {
      return NextResponse.json({ error: 'Bien introuvable.' }, { status: 404 })
    }

    const prixTotal = parseInt(b.prixTotal, 10)
    if (!b.titre || !prixTotal || prixTotal <= 0) {
      return NextResponse.json({ error: 'Titre et prix valides requis.' }, { status: 400 })
    }

    const mensualite = await calculMensualiteServeur(prixTotal)

    const bien = await prisma.bien.update({
      where: { id: b.id },
      data: {
        titre: b.titre,
        description: b.description || null,
        prixTotal,
        mensualite,
        type: b.type || null,
        chambres: b.chambres ? parseInt(b.chambres, 10) : null,
        surface: b.surface ? parseInt(b.surface, 10) : null,
        ville: b.ville || null,
        province: b.province || null,
        adresse: b.adresse || null,
        urlClient: b.urlClient || null,
        images: Array.isArray(b.images) ? b.images : existing.images,
        published: b.published !== false,
      },
    })

    return NextResponse.json({ ok: true, bien })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const client = await getClient()
    if (!client) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID manquant.' }, { status: 400 })

    const existing = await prisma.bien.findUnique({ where: { id } })
    if (!existing || existing.clientId !== client.id) {
      return NextResponse.json({ error: 'Bien introuvable.' }, { status: 404 })
    }

    await prisma.bien.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
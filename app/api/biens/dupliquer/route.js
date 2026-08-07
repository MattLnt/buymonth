import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID manquant.' }, { status: 400 })

    const src = await prisma.bien.findUnique({ where: { id } })
    if (!src || src.clientId !== client.id) {
      return NextResponse.json({ error: 'Bien introuvable.' }, { status: 404 })
    }

    // Copie : même contenu, mais HORS_LIGNE (hors décompte) + non publié + titre « (copie) »
    const copie = await prisma.bien.create({
      data: {
        clientId: client.id,
        titre: `${src.titre} (copie)`,
        description: src.description,
        prixTotal: src.prixTotal,
        mensualite: src.mensualite,
        type: src.type,
        chambres: src.chambres,
        sallesDeBain: src.sallesDeBain,
        surface: src.surface,
        terrasse: src.terrasse,
        jardin: src.jardin,
        ville: src.ville,
        province: src.province,
        adresse: src.adresse,
        projet: src.projet,
        unite: src.unite,
        pebNumero: src.pebNumero,
        pebClasse: src.pebClasse,
        pebKwh: src.pebKwh,
        images: src.images,
        urlClient: src.urlClient,
        statut: 'HORS_LIGNE',
        published: false,
      },
    })

    // Copie hors-ligne → non facturable, pas de synchro Stripe nécessaire
    return NextResponse.json({ ok: true, bien: copie })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
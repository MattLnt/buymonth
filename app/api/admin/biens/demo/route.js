import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Admin uniquement : bascule le flag « bien de démonstration » (bien fictif, à titre d'illustration).
// Un bien démo reste accessible par son URL mais sort de la vitrine publique dès qu'un vrai bien est en ligne.
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
    }

    const { bienId, demo } = await req.json()
    if (!bienId || typeof demo !== 'boolean') {
      return NextResponse.json({ error: 'Paramètres manquants.' }, { status: 400 })
    }

    const bien = await prisma.bien.findUnique({ where: { id: bienId }, select: { id: true } })
    if (!bien) return NextResponse.json({ error: 'Bien introuvable.' }, { status: 404 })

    await prisma.bien.update({ where: { id: bienId }, data: { demo } })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { calculMensualite } from '@/lib/calcul'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }

  try {
    const s = await getSettings()
    const params = { apportPct: s.apportPct, tauxAnnuel: s.tauxAnnuel, dureeMois: s.dureeMois }

    const biens = await prisma.bien.findMany({ select: { id: true, prixTotal: true } })

    let count = 0
    for (const b of biens) {
      const mensualite = calculMensualite(b.prixTotal, params)
      await prisma.bien.update({ where: { id: b.id }, data: { mensualite } })
      count++
    }

    return NextResponse.json({ ok: true, count })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getConfigMensualite } from '@/lib/settings'
import { calculMensualite } from '@/lib/calcul'
import { prixDecaisse } from '@/lib/regime'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }

  try {
    const params = await getConfigMensualite()

    const biens = await prisma.bien.findMany({ select: { id: true, prixTotal: true, regime: true } })

    let count = 0
    for (const b of biens) {
      const mensualite = calculMensualite(prixDecaisse(b.prixTotal, b.regime), params)
      await prisma.bien.update({ where: { id: b.id }, data: { mensualite } })
      count++
    }

    return NextResponse.json({ ok: true, count })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
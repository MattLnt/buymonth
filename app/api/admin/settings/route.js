import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }
  const s = await getSettings()
  return NextResponse.json(s)
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
  }

  try {
    const b = await req.json()

    // calcul
    const apportPct = b.apportPct != null ? Math.max(0, Math.min(1, Number(b.apportPct))) : undefined
    const tauxAnnuel = b.tauxAnnuel != null ? Math.max(0, Number(b.tauxAnnuel)) : undefined
    const dureeMois = b.dureeMois != null ? Math.max(1, parseInt(b.dureeMois, 10)) : undefined

    // emails : tableau nettoyé
    let leadEmails
    if (Array.isArray(b.leadEmails)) {
      leadEmails = b.leadEmails
        .map((e) => String(e).trim().toLowerCase())
        .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    }

    await getSettings() // garantit l'existence de la ligne

    const updated = await prisma.settings.update({
      where: { id: 'default' },
      data: {
        ...(apportPct !== undefined && { apportPct }),
        ...(tauxAnnuel !== undefined && { tauxAnnuel }),
        ...(dureeMois !== undefined && { dureeMois }),
        ...(leadEmails !== undefined && { leadEmails }),
      },
    })

    return NextResponse.json({ ok: true, settings: updated })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
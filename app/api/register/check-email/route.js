import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getT } from '@/lib/i18n/server'

export async function POST(req) {
  const { t } = await getT()
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: t('Email requis', 'E-mail verplicht') }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: t('Cet email est déjà utilisé', 'Dit e-mailadres is al in gebruik') }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: t('Erreur serveur', 'Serverfout') }, { status: 500 })
  }
}
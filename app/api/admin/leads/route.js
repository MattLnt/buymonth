import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID manquant.' }, { status: 400 })

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) return NextResponse.json({ error: 'Lead introuvable.' }, { status: 404 })

    // Suppression LOGIQUE (soft delete) : on pose deletedAt, on NE supprime PAS la ligne.
    // La trace du consentement (données du lead) est conservée pour la preuve RGPD.
    // Idempotent : si déjà supprimé, on renvoie ok sans réécrire.
    if (!lead.deletedAt) {
      await prisma.lead.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
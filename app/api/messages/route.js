import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')

    if (conversationId) {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: { sender: { select: { id: true, role: true } } },
        orderBy: { createdAt: 'asc' }
      })
      await prisma.message.updateMany({
        where: { conversationId, senderId: { not: session.user.id }, isRead: false },
        data: { isRead: true }
      })
      return NextResponse.json(messages)
    }

    let conversations = []

    if (session.user.role === 'ACHETEUR') {
      const acheteur = await prisma.acheteur.findUnique({ where: { userId: session.user.id } })
      conversations = await prisma.conversation.findMany({
        where: { deblocage: { acheteurId: acheteur.id } },
        include: {
          deblocage: {
            include: {
              opportunite: { select: { province: true, chiffreAffaires: true, typeDeal: true } },
              acheteur: { include: { user: { select: { email: true } } } },
            }
          },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          _count: { select: { messages: { where: { senderId: { not: session.user.id }, isRead: false } } } }
        },
        orderBy: { updatedAt: 'desc' }
      })
    } else if (session.user.role === 'VENDEUR') {
      const vendeur = await prisma.vendeur.findUnique({ where: { userId: session.user.id } })
      conversations = await prisma.conversation.findMany({
        where: { deblocage: { opportunite: { vendeurId: vendeur.id } } },
        include: {
          deblocage: {
            include: {
              opportunite: { select: { province: true, chiffreAffaires: true, typeDeal: true } },
              acheteur: { include: { user: { select: { email: true } } } },
            }
          },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          _count: { select: { messages: { where: { senderId: { not: session.user.id }, isRead: false } } } }
        },
        orderBy: { updatedAt: 'desc' }
      })
    }

    return NextResponse.json(conversations)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { conversationId, deblocageId, content, attachmentUrl, attachmentName } = await req.json()
    let convId = conversationId

    if (!convId && deblocageId) {
      const existing = await prisma.conversation.findUnique({ where: { deblocageId } })
      if (existing) {
        convId = existing.id
      } else {
        const conv = await prisma.conversation.create({ data: { deblocageId } })
        convId = conv.id
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: convId,
        senderId: session.user.id,
        content: content || "",
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
      },
      include: { sender: { select: { id: true, role: true } } }
    })

    await prisma.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
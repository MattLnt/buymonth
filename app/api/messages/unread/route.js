import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ count: 0 })

    const count = await prisma.message.count({
      where: {
        senderId: { not: session.user.id },
        isRead: false,
        conversation: {
          deblocage: session.user.role === 'ACHETEUR' ? {
            acheteur: { userId: session.user.id }
          } : {
            opportunite: {
              vendeur: { userId: session.user.id }
            }
          }
        }
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}
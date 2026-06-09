import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role === 'EMPLOYER') {
    redirect('/dashboard/employeur')
  }

  if (session.user.role === 'CANDIDAT') {
    redirect('/dashboard/candidat')
  }

  if (session.user.role === 'ADMIN') {
    redirect('/dashboard/admin')
  }
}
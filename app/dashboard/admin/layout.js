import { requireUser } from '@/lib/session'
import { Sidebar } from '@/app/components/dashboard/Sidebar'
import { ADMIN_NAV } from '@/app/components/dashboard/navConfig'

export default async function AdminLayout({ children }) {
  const user = await requireUser('ADMIN')
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6FB' }}>
      <Sidebar items={ADMIN_NAV} societe="Administration" email={user?.email} />
      <main style={{ flex: 1, padding: '32px 36px 96px', minWidth: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  )
}
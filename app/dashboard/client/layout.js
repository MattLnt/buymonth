import { getCurrentClient } from '@/lib/session'
import { Sidebar } from '@/app/components/dashboard/Sidebar'
import { CLIENT_NAV } from '@/app/components/dashboard/navConfig'

export default async function ClientLayout({ children }) {
  const { user, client } = await getCurrentClient()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6FB' }}>
      <Sidebar items={CLIENT_NAV} societe={client?.societe} email={user?.email} />
      <main style={{ flex: 1, padding: '32px 36px 96px', minWidth: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  )
}
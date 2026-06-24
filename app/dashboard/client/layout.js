import { getCurrentClient } from '@/lib/session'
import { DashboardShell } from '@/app/components/dashboard/DashboardShell'
import { CLIENT_NAV } from '@/app/components/dashboard/navConfig'

export default async function ClientLayout({ children }) {
  const client = await getCurrentClient()

  let statut = 'none'
  if (client?.subStatus === 'active' || client?.subStatus === 'trialing') {
    statut = client.subStatus
  } else if (client?.trialEndsAt && new Date(client.trialEndsAt) > new Date()) {
    statut = 'trialing'
  }

  return (
    <DashboardShell navItems={CLIENT_NAV} societe={client?.societe} email={client?.user?.email} statut={statut}>
      {children}
    </DashboardShell>
  )
}
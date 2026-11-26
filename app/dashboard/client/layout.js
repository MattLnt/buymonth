import { getCurrentClient } from '@/lib/session'
import { DashboardShell } from '@/app/components/dashboard/DashboardShell'
import { navPromoteur } from '@/app/components/dashboard/navConfig'
import { getT } from '@/lib/i18n/server'

export default async function ClientLayout({ children }) {
  const client = await getCurrentClient()
  const { lang } = await getT()

  let statut = 'none'
  if (client?.subStatus === 'active' || client?.subStatus === 'trialing') {
    statut = client.subStatus
  } else if (client?.trialEndsAt && new Date(client.trialEndsAt) > new Date()) {
    statut = 'trialing'
  }

  return (
    <DashboardShell navItems={navPromoteur(client || {}, lang)} societe={client?.societe} email={client?.user?.email} statut={statut}>
      {children}
    </DashboardShell>
  )
}
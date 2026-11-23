import { requireUser } from '@/lib/session'
import { DashboardShell } from '@/app/components/dashboard/DashboardShell'
import { ADMIN_NAV } from '@/app/components/dashboard/navConfig'
import { LangProvider } from '@/app/components/i18n/LangProvider'

export default async function AdminLayout({ children }) {
  const user = await requireUser('ADMIN')

  // L'administration reste en français, quelle que soit la langue choisie.
  return (
    <LangProvider lang="fr">
    <DashboardShell navItems={ADMIN_NAV} societe="Administration" email={user?.email} statut="admin" role="admin">
      {children}
    </DashboardShell>
    </LangProvider>
  )
}
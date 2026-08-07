import Link from 'next/link'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { ClientCreateForm } from './ClientCreateForm'

export const dynamic = 'force-dynamic'

export default function NouveauClientPage() {
  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <Link href="/dashboard/admin/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#7CB8A8', textDecoration: 'none', fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Retour aux clients
        </Link>
      </div>

      <PageHeader title="Nouveau promoteur" subtitle="Créez un compte promoteur et ses informations." />

      <ClientCreateForm />
    </>
  )
}
import Link from 'next/link'
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

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#193B5E', margin: 0, letterSpacing: '-0.02em' }}>Nouveau promoteur</h1>
        <p style={{ fontSize: 14, color: '#8A92A6', margin: '5px 0 0' }}>Créez un compte promoteur, ses contacts et sa formule.</p>
      </div>

      <ClientCreateForm />
    </>
  )
}
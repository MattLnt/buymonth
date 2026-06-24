import { getCurrentClient } from '@/lib/session'
import { abonnementActif } from '@/lib/abonnement'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { CheckoutForm } from './CheckoutForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const client = await getCurrentClient()

  // Déjà abonné → pas besoin de repayer
  if (abonnementActif(client)) {
    redirect('/dashboard/client/abonnement')
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Link href="/dashboard/client/abonnement" style={{ fontSize: 13.5, color: '#7CB8A8', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Retour
        </Link>
      </div>
      <PageHeader title="Finaliser votre abonnement" subtitle="Activez votre accès complet à la plateforme BuyMonth." />
      <CheckoutForm />
    </>
  )
}
import { getCurrentClient } from '@/lib/session'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { AbonnementClient } from './AbonnementClient'

export const dynamic = 'force-dynamic'

export default async function AbonnementPage({ searchParams }) {
  const client = await getCurrentClient()
  const sp = await searchParams

  // On lit tout depuis la base (rempli à la création + par le webhook) → instantané
  const details = client.stripeSubId ? {
    currentPeriodEnd: client.subEndsAt ? new Date(client.subEndsAt).getTime() : null,
    cancelAtPeriodEnd: false, // info détaillée disponible dans le portail Stripe
    cancelAt: null,
    trialEnd: client.trialEndsAt ? new Date(client.trialEndsAt).getTime() : null,
    montant: 500,
    devise: 'eur',
  } : null

  return (
    <>
      <PageHeader title="Abonnement" subtitle="Gérez votre accès à la plateforme BuyMonth." />

      {sp.success && (
        <div style={{ background: 'rgba(36,158,124,0.1)', border: '1px solid rgba(36,158,124,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1B7A5E' }}>Votre abonnement a bien été pris en compte.</span>
        </div>
      )}
      {sp.canceled && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', marginBottom: 22 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#C2620C' }}>Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.</span>
        </div>
      )}

      <AbonnementClient subStatus={client.subStatus} details={details} createdAt={client.createdAt} />
    </>
  )
}
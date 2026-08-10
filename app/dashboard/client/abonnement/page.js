import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { AbonnementClient } from './AbonnementClient'
import { decompteFacturation } from '@/lib/facturation'
import { stripe, PRICE_PRO, PRICE_PRO_PLUS } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

// Déduit la formule à partir d'un price ID Stripe
function formuleDepuisPrice(priceId) {
  if (priceId === PRICE_PRO_PLUS) return 'PRO_PLUS'
  if (priceId === PRICE_PRO) return 'PRO'
  return null
}

const FORMULE_LABEL = { PRO: 'BuyMonth Pro', PRO_PLUS: 'BuyMonth Pro+' }

export default async function AbonnementPage({ searchParams }) {
  const client = await getCurrentClient()
  const sp = await searchParams

  // Décompte « au bien actif » : nb de biens ACTIF + OPTION × tarif de la formule
  const biens = await prisma.bien.findMany({
    where: { clientId: client.id },
    select: { statut: true },
  })
  const facturation = decompteFacturation(biens, client.formule)

  // On lit tout depuis la base (rempli à la création + par le webhook) → instantané
  const details = client.stripeSubId ? {
    currentPeriodEnd: client.subEndsAt ? new Date(client.subEndsAt).getTime() : null,
    cancelAtPeriodEnd: false, // info détaillée disponible dans le portail Stripe
    cancelAt: null,
    trialEnd: client.trialEndsAt ? new Date(client.trialEndsAt).getTime() : null,
    montant: facturation.montantMensuel, // nb biens actifs × tarif formule
    devise: 'eur',
  } : null

  // Changement de formule programmé (downgrade) : on interroge Stripe pour savoir
  // si un subscription schedule prévoit une bascule vers une autre formule en fin de période.
  let changementProgramme = null
  if (stripe && client.stripeSubId) {
    try {
      const sub = await stripe.subscriptions.retrieve(client.stripeSubId, { expand: ['schedule'] })
      const schedule = sub.schedule && typeof sub.schedule === 'object' ? sub.schedule : null
      if (schedule && Array.isArray(schedule.phases) && schedule.phases.length > 1) {
        // La phase courante = phases[0], la suivante = phases[1]
        const prochainePhase = schedule.phases[1]
        const priceId = prochainePhase?.items?.[0]?.price
        const formuleCible = formuleDepuisPrice(typeof priceId === 'string' ? priceId : priceId?.id)
        if (formuleCible && formuleCible !== client.formule) {
          changementProgramme = {
            formuleCible,
            formuleCibleLabel: FORMULE_LABEL[formuleCible],
            dateEffet: prochainePhase.start_date ? prochainePhase.start_date * 1000 : (client.subEndsAt ? new Date(client.subEndsAt).getTime() : null),
          }
        }
      }
    } catch {
      // silencieux : si Stripe est indisponible, on n'affiche juste pas le bandeau
    }
  }

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

      <AbonnementClient
        subStatus={client.subStatus}
        formule={client.formule}
        details={details}
        createdAt={client.createdAt}
        facturation={facturation}
        changementProgramme={changementProgramme}
      />
    </>
  )
}
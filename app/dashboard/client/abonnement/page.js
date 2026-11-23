import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { AbonnementClient } from './AbonnementClient'
import { decompteFacturation, prochainPremierDuMois, finDelaiDeGrace, dansDelaiDeGrace } from '@/lib/facturation'
import { stripe, PRICE_PRO, PRICE_PRO_PLUS } from '@/lib/stripe'
import { getSettings } from '@/lib/settings'

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

  // Facturation ancree au 1er du mois (dossier V9, partie 8.1). Le mois partiel
  // entre l'activation et ce 1er est facture au prorata : on l'estime ici pour
  // que le promoteur sache ce qu'il va payer avant de cliquer.
  const ancrageMs = prochainPremierDuMois() * 1000
  const joursDuMois = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const joursRestants = Math.max(1, Math.ceil((ancrageMs - Date.now()) / 86400000))
  const prorata = Math.round((facturation.montantMensuel * joursRestants) / joursDuMois)
  // Rien n'est preleve a l'inscription : la premiere facture, le 1er, cumule le
  // mois partiel au prorata et le mois complet qui commence.
  const premiereFacture = prorata + facturation.montantMensuel

  // Un abonnement en attente du 1er est en statut « trialing » chez Stripe sans
  // etre un essai gratuit : il ne faut l'annoncer comme un essai que si l'admin
  // en a reellement accorde un.
  const reglages = await getSettings()
  const essaiAdmin = Boolean(reglages?.essaiActif && reglages?.essaiJours > 0)

  // On lit tout depuis la base (rempli à la création + par le webhook) → instantané
  const details = client.stripeSubId ? {
    currentPeriodEnd: client.subEndsAt ? new Date(client.subEndsAt).getTime() : null,
    cancelAtPeriodEnd: false, // complété plus bas depuis Stripe
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

      // Resiliation programmee : le portail Stripe annule par defaut « a la fin de la
      // periode ». Sans cette lecture, l'espace promoteur affichait « abonnement actif »
      // jusqu'au dernier jour, sans jamais annoncer l'arret. (Constate le 06/10/2026.)
      if (details) {
        // Stripe a deux facons d'annoncer un arret programme : cancel_at_period_end
        // (fin de periode) ou cancel_at (date precise). Le portail client utilise la
        // seconde, avec cancel_at_period_end a false — ne tester que le drapeau
        // laissait donc le bandeau muet. (Constate le 06/10/2026.)
        details.cancelAtPeriodEnd = Boolean(sub.cancel_at_period_end || sub.cancel_at)
        details.cancelAt = sub.cancel_at ? sub.cancel_at * 1000 : null
        const finPeriode = sub.current_period_end || sub.items?.data?.[0]?.current_period_end || null
        if (finPeriode) details.currentPeriodEnd = finPeriode * 1000
      }

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
        premierPrelevement={ancrageMs}
        joursRestants={joursRestants}
        prorata={prorata}
        premiereFacture={premiereFacture}
        essaiAdmin={essaiAdmin}
        finGrace={finDelaiDeGrace(client)?.getTime() || null}
        dansGrace={dansDelaiDeGrace(client)}
      />
    </>
  )
}
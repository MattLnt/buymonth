'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useLang } from '@/app/components/i18n/LangProvider'
import { locale } from '@/lib/i18n/config'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const euroL = (n, lang) => (n || 0).toLocaleString(locale(lang)) + ' €'

// ── Formulaire interne ──
function InnerForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { t } = useLang()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError('')

    // 1. Confirmer le SetupIntent (enregistre le moyen de paiement, sans debiter)
    const { error: setupError, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
      confirmParams: {
        // Exigee des qu'un moyen de paiement peut rediriger : certaines banques
        // demandent une confirmation de leur cote pour un mandat SEPA.
        return_url: `${window.location.origin}/dashboard/client/abonnement?success=1`,
      },
    })

    if (setupError) {
      setError(setupError.message || t('Votre moyen de paiement n’a pas pu être validé.', 'Uw betaalmethode kon niet worden gevalideerd.'))
      setLoading(false)
      return
    }

    const paymentMethodId = setupIntent?.payment_method
    if (!paymentMethodId) {
      setError(t('Moyen de paiement non enregistré. Réessayez.', 'Betaalmethode niet opgeslagen. Probeer het opnieuw.'))
      setLoading(false)
      return
    }

    // 2. Creer l'abonnement avec ce moyen de paiement
    try {
      const res = await fetch('/api/stripe/creer-abonnement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('Erreur lors de la création de l’abonnement.', 'Fout bij het aanmaken van het abonnement.'))
        setLoading(false)
        return
      }
      router.push('/dashboard/client/abonnement?success=1')
    } catch {
      setError(t('Erreur réseau.', 'Netwerkfout.'))
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* billingDetails en 'auto' : le PaymentElement reclame de lui-meme le nom,
          l'e-mail et l'adresse, obligatoires pour un mandat SEPA. */}
      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: { applePay: 'never', googlePay: 'never', link: 'never' },
          fields: { billingDetails: 'auto' },
        }}
      />

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13, borderRadius: 10, padding: '12px 14px', marginTop: 18 }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={!stripe || loading} style={{ width: '100%', marginTop: 22, padding: '15px', borderRadius: 11, background: '#193B5E', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
        {loading ? t('Traitement...', 'Bezig...') : t('Confirmer et activer mon accès', 'Bevestigen en mijn toegang activeren')}
      </button>

      <p style={{ fontSize: 12, color: '#A9B0BE', margin: '16px 0 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A9B0BE" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
        {t('Paiement sécurisé et chiffré via Stripe', 'Beveiligde en versleutelde betaling via Stripe')}
      </p>
    </form>
  )
}

// ── Wrapper ──
export function CheckoutForm({ facturation = null }) {
  const { lang, t } = useLang()
  const euro = (n) => euroL(n, lang)
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState('')

  const f = facturation || { formuleLabel: 'BuyMonth Pro', actifs: 0, unitaire: 39, montantMensuel: 0 }

  useEffect(() => {
    fetch('/api/stripe/setup-intent', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        if (!data.clientSecret) { setError(t('Initialisation impossible.', 'Initialisatie mislukt.')); return }
        setClientSecret(data.clientSecret)
      })
      .catch(() => setError(t('Impossible d’initialiser le paiement.', 'De betaling kon niet worden gestart.')))
  }, [])

  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#7CB8A8',
      colorBackground: '#FAFDFD',
      colorText: '#193B5E',
      colorDanger: '#E5484D',
      fontFamily: 'system-ui, sans-serif',
      borderRadius: '10px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': { border: '1.5px solid #E8EDF2', padding: '12px 14px' },
      '.Input:focus': { border: '1.5px solid #7CB8A8', boxShadow: 'none' },
      '.Label': { fontWeight: '600', color: '#5A6B7D', fontSize: '13px' },
    },
  }

  const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 18, padding: 32 }

  return (
    <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'start' }}>
      <style>{`@media (max-width: 880px){ .checkout-grid { grid-template-columns: 1fr !important; } }`}</style>

      {/* Paiement */}
      <div style={card}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>{t('Informations de paiement', 'Betaalgegevens')}</h2>
        <p style={{ fontSize: 13.5, color: '#8A92A6', margin: '0 0 24px' }}>{t('Carte bancaire ou domiciliation SEPA. Rien n’est prélevé aujourd’hui : votre première facture tombe le 1er du mois.', 'Bankkaart of SEPA-domiciliëring. Vandaag wordt er niets afgeschreven: uw eerste factuur volgt op de 1e van de maand.')}</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13.5, borderRadius: 10, padding: '14px 16px' }}>{error}</div>
        )}

        {!error && !clientSecret && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>{t('Initialisation du paiement...', 'Betaling wordt voorbereid...')}</div>
        )}

        {!error && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance, locale: lang }}>
            <InnerForm />
          </Elements>
        )}
      </div>

      {/* Récap */}
      <div style={{ ...card, background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(124,184,168,0.18)', color: '#7CB8A8', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, marginBottom: 20, letterSpacing: '0.05em' }}>{t('RÉCAPITULATIF', 'OVERZICHT')}</div>

          {/* Abonnement mensuel = nb biens actifs × tarif formule */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
              {f.formuleLabel}
              <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{f.actifs} {f.actifs > 1 ? t('biens', 'panden') : t('bien', 'pand')} × {euro(f.unitaire)}/{t('mois', 'maand')}</span>
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{euro(f.montantMensuel)} / {t('mois', 'maand')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{t('Total mensuel', 'Maandtotaal')}</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#7CB8A8', whiteSpace: 'nowrap' }}>{euro(f.montantMensuel)}</span>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px', lineHeight: 1.5 }}>
            {t(
              'Montants HTVA. Le décompte des biens actifs est revu chaque mois — la facturation suit votre portefeuille. Les frais de mise en service (1 490 € HTVA, une seule fois) sont facturés séparément.',
              'Bedragen excl. btw. Het aantal actieve panden wordt elke maand herzien — de facturatie volgt uw portefeuille. De opstartkosten (1.490 € excl. btw, eenmalig) worden apart gefactureerd.'
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[t('Vous ne payez que vos biens actifs', 'U betaalt enkel voor uw actieve panden'), t('Widgets & QR codes inclus', 'Widgets & QR-codes inbegrepen'), t('Résiliable à tout moment', 'Op elk moment opzegbaar')].map((f2) => (
              <div key={f2} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {f2}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
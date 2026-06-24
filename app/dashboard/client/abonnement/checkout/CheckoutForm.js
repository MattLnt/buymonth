'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

// ── Formulaire interne ──
function InnerForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError('')

    // 1. Confirmer le SetupIntent (enregistre + valide la carte, sans débiter)
    const { error: setupError, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    })

    if (setupError) {
      setError(setupError.message || 'La carte n\'a pas pu être validée.')
      setLoading(false)
      return
    }

    const paymentMethodId = setupIntent?.payment_method
    if (!paymentMethodId) {
      setError('Carte non enregistrée. Réessayez.')
      setLoading(false)
      return
    }

    // 2. Créer l'abonnement avec cette carte
    try {
      const res = await fetch('/api/stripe/creer-abonnement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la création de l\'abonnement.')
        setLoading(false)
        return
      }
      router.push('/dashboard/client/abonnement?success=1')
    } catch {
      setError('Erreur réseau.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13, borderRadius: 10, padding: '12px 14px', marginTop: 18 }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={!stripe || loading} style={{ width: '100%', marginTop: 22, padding: '15px', borderRadius: 11, background: '#193B5E', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
        {loading ? 'Traitement...' : 'Confirmer et activer mon accès'}
      </button>

      <p style={{ fontSize: 12, color: '#A9B0BE', margin: '16px 0 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A9B0BE" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
        Paiement sécurisé et chiffré via Stripe
      </p>
    </form>
  )
}

// ── Wrapper ──
export function CheckoutForm() {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/stripe/setup-intent', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        if (!data.clientSecret) { setError('Initialisation impossible.'); return }
        setClientSecret(data.clientSecret)
      })
      .catch(() => setError('Impossible d\'initialiser le paiement.'))
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
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Informations de paiement</h2>
        <p style={{ fontSize: 13.5, color: '#8A92A6', margin: '0 0 24px' }}>Renseignez votre carte pour activer votre abonnement.</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13.5, borderRadius: 10, padding: '14px 16px' }}>{error}</div>
        )}

        {!error && !clientSecret && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Initialisation du paiement...</div>
        )}

        {!error && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <InnerForm />
          </Elements>
        )}
      </div>

      {/* Récap */}
      <div style={{ ...card, background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(124,184,168,0.18)', color: '#7CB8A8', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, marginBottom: 20, letterSpacing: '0.05em' }}>RÉCAPITULATIF</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Abonnement plateforme</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>500 € / mois</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Total aujourd'hui</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#7CB8A8' }}>500 €</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Renouvellement automatique mensuel', 'Résiliable à tout moment', 'Accès immédiat après paiement'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
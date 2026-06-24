'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

function InnerForm({ onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError('')

    const { error: payError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (payError) {
      setError(payError.message || 'Le paiement a échoué.')
      setLoading(false)
      return
    }
    if (paymentIntent?.status === 'succeeded') {
      onSuccess()
      return
    }
    setError('Paiement non confirmé. Réessayez.')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13, borderRadius: 10, padding: '12px 14px', marginTop: 16 }}>{error}</div>
      )}
      <button type="submit" disabled={!stripe || loading} style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 11, background: '#193B5E', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
        {loading ? 'Traitement...' : 'Payer 90 € et générer'}
      </button>
    </form>
  )
}

export function WidgetPaymentModal({ bien, onClose, onSuccess }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    fetch('/api/widget/payer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bienId: bien.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.dejaPaye) { onSuccess(); return }
        if (data.error) { setError(data.error); return }
        if (!data.clientSecret) { setError('Initialisation impossible.'); return }
        setClientSecret(data.clientSecret)
      })
      .catch(() => setError('Erreur réseau.'))
    return () => { document.body.style.overflow = '' }
  }, [])

  const appearance = {
    theme: 'flat',
    variables: { colorPrimary: '#7CB8A8', colorBackground: '#FAFDFD', colorText: '#193B5E', colorDanger: '#E5484D', fontFamily: 'system-ui, sans-serif', borderRadius: '10px', spacingUnit: '4px' },
    rules: { '.Input': { border: '1.5px solid #E8EDF2', padding: '12px 14px' }, '.Input:focus': { border: '1.5px solid #7CB8A8', boxShadow: 'none' }, '.Label': { fontWeight: '600', color: '#5A6B7D', fontSize: '13px' } },
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,36,56,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 760, position: 'relative', boxShadow: '0 24px 70px rgba(0,0,0,0.3)', margin: 'auto', overflow: 'hidden' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, width: 36, height: 36, borderRadius: '50%', background: '#F2F5FA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A6275', zIndex: 2 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <div className="wpm-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr' }}>
          <style>{`@media (max-width: 720px){ .wpm-grid { grid-template-columns: 1fr !important; } .wpm-left { display: none !important; } }`}</style>

          {/* Colonne gauche : récap */}
          <div className="wpm-left" style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'inline-block', background: 'rgba(124,184,168,0.18)', color: '#7CB8A8', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, marginBottom: 22, letterSpacing: '0.05em' }}>WIDGET</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px', lineHeight: 1.25 }}>Générer votre widget</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 26px' }}>Pour « {bien.titre} »</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: '#7CB8A8' }}>90 €</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>paiement unique</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {['Code d\'intégration iframe & HTML', 'Téléchargement SVG et PNG', 'Valable pour ce bien'].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite : paiement */}
          <div style={{ padding: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 18px' }}>Paiement</h3>

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13.5, borderRadius: 10, padding: '14px 16px' }}>{error}</div>}

            {!error && !clientSecret && <div style={{ padding: '30px 0', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Initialisation...</div>}

            {!error && clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <InnerForm onSuccess={onSuccess} />
              </Elements>
            )}

            <p style={{ fontSize: 11.5, color: '#A9B0BE', margin: '16px 0 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A9B0BE" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              Sécurisé via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
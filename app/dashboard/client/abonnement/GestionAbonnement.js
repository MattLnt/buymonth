'use client'

/*
 * Gestion de l'abonnement, sans quitter le site.
 *
 * Avant le 06/10/2026, « Gerer mon abonnement » renvoyait vers le portail
 * Stripe : le promoteur sortait de BuyMonth et atterrissait sur une page aux
 * couleurs d'un prestataire, au moment precis ou il gere son argent. Tout est
 * desormais rendu ici — moyen de paiement, factures, resiliation — et Stripe
 * n'intervient plus que pour le formulaire de carte, qui doit rester chez lui
 * pour des raisons de securite.
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const NAVY = '#193B5E'
const carte = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 26 }

function formatDate(ms) {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function montant(centimes, devise = 'eur') {
  return `${((centimes || 0) / 100).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} ${String(devise).toUpperCase() === 'EUR' ? '€' : devise}`
}

const MARQUES = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', bancontact: 'Bancontact' }

function IconeMoyen({ type }) {
  const d = type === 'sepa_debit'
    ? <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>
    : <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></>
  return (
    <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B7A5E" strokeWidth="1.8">{d}</svg>
    </span>
  )
}

const PASTILLE = {
  paid: { fg: '#1B7A5E', bg: 'rgba(36,158,124,0.12)' },
  open: { fg: '#C2620C', bg: '#FFF7ED' },
  uncollectible: { fg: '#E5484D', bg: 'rgba(229,72,77,0.1)' },
  void: { fg: '#8A92A6', bg: '#F2F5FA' },
}

/* ------------------------------------------------------------------ *
 * Formulaire de remplacement du moyen de paiement
 * ------------------------------------------------------------------ */
function FormulaireMoyen({ onFini, onAnnuler }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')

  async function soumettre(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setErreur('')

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
      confirmParams: { return_url: `${window.location.origin}/dashboard/client/abonnement` },
    })
    if (error) { setErreur(error.message || 'Moyen de paiement refusé.'); setLoading(false); return }

    const pm = setupIntent?.payment_method
    if (!pm) { setErreur('Moyen de paiement non enregistré.'); setLoading(false); return }

    try {
      const res = await fetch('/api/abonnement/moyen-paiement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: pm }),
      })
      const data = await res.json()
      if (!res.ok) { setErreur(data.error || 'Erreur.'); setLoading(false); return }
      onFini()
    } catch {
      setErreur('Erreur réseau.'); setLoading(false)
    }
  }

  return (
    <form onSubmit={soumettre}>
      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: { applePay: 'never', googlePay: 'never', link: 'never' },
          fields: { billingDetails: 'auto' },
        }}
      />
      {erreur && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13, borderRadius: 10, padding: '11px 14px', marginTop: 14 }}>{erreur}</div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button type="submit" disabled={!stripe || loading}
          style={{ flex: 1, padding: '13px', borderRadius: 10, background: NAVY, color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? 'Enregistrement…' : 'Enregistrer ce moyen de paiement'}
        </button>
        <button type="button" onClick={onAnnuler} disabled={loading}
          style={{ padding: '13px 18px', borderRadius: 10, background: '#F5F8FB', color: '#5A6275', border: '1px solid #E6EDF4', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Annuler
        </button>
      </div>
      <p style={{ fontSize: 11.5, color: '#A9B0BE', margin: '12px 0 0', textAlign: 'center' }}>
        Vos coordonnées bancaires sont transmises directement à notre prestataire de paiement. BuyMonth ne les voit ni ne les conserve.
      </p>
    </form>
  )
}

/* ------------------------------------------------------------------ */

export function GestionAbonnement({ actif }) {
  const router = useRouter()
  const [donnees, setDonnees] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [message, setMessage] = useState('')

  const [modeEdition, setModeEdition] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [confirmation, setConfirmation] = useState(false)
  const [action, setAction] = useState('')

  const charger = useCallback(async () => {
    try {
      const res = await fetch('/api/abonnement/facturation')
      const data = await res.json()
      if (!res.ok) { setErreur(data.error || 'Erreur.'); return }
      setDonnees(data)
    } catch {
      setErreur('Impossible de charger vos informations de facturation.')
    } finally {
      setChargement(false)
    }
  }, [])

  useEffect(() => { charger() }, [charger])

  async function ouvrirEdition() {
    setErreur(''); setMessage('')
    try {
      const res = await fetch('/api/stripe/setup-intent', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) { setErreur(data.error || 'Erreur.'); return }
      setClientSecret(data.clientSecret)
      setModeEdition(true)
    } catch { setErreur('Erreur réseau.') }
  }

  async function basculerResiliation(annuler) {
    setAction('resil'); setErreur(''); setMessage('')
    try {
      const res = await fetch('/api/abonnement/resilier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annuler }),
      })
      const data = await res.json()
      if (!res.ok) { setErreur(data.error || 'Erreur.'); setAction(''); return }
      setMessage(data.message)
      setConfirmation(false)
      await charger()
      router.refresh()
    } catch { setErreur('Erreur réseau.') } finally { setAction('') }
  }

  const apparence = {
    theme: 'stripe',
    variables: { colorPrimary: '#7CB8A8', colorText: NAVY, fontSizeBase: '14px', borderRadius: '10px' },
  }

  const moyen = donnees?.moyen
  const factures = donnees?.factures || []
  const resiliation = donnees?.resiliation

  return (
    <div style={{ marginTop: 26 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY, margin: '0 0 4px' }}>Gérer mon abonnement</h3>
      <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px' }}>
        Moyen de paiement, factures et résiliation.
      </p>

      {message && (
        <div style={{ background: 'rgba(36,158,124,0.1)', border: '1px solid rgba(36,158,124,0.25)', borderRadius: 12, padding: '13px 17px', marginBottom: 16 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1B7A5E' }}>{message}</span>
        </div>
      )}
      {erreur && (
        <div style={{ background: 'rgba(229,72,77,0.08)', border: '1px solid rgba(229,72,77,0.2)', borderRadius: 12, padding: '13px 17px', marginBottom: 16 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#E5484D' }}>{erreur}</span>
        </div>
      )}

      <div className="gest-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <style>{`@media (max-width: 900px){ .gest-grid { grid-template-columns: 1fr !important; } }`}</style>

        {/* Moyen de paiement */}
        <div style={carte}>
          <h4 style={{ fontSize: 14.5, fontWeight: 700, color: NAVY, margin: '0 0 16px' }}>Moyen de paiement</h4>

          {modeEdition && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: apparence }}>
              <FormulaireMoyen
                onAnnuler={() => { setModeEdition(false); setClientSecret('') }}
                onFini={async () => {
                  setModeEdition(false); setClientSecret('')
                  setMessage('Votre moyen de paiement a été mis à jour.')
                  await charger()
                }}
              />
            </Elements>
          ) : chargement ? (
            <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>Chargement…</p>
          ) : moyen ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', background: '#FAFBFE', border: '1px solid #F2F5FA', borderRadius: 12 }}>
                <IconeMoyen type={moyen.type} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>
                    {moyen.libelle}
                    {moyen.marque && moyen.type === 'card' ? ` ${MARQUES[moyen.marque] || moyen.marque}` : ''}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#8A92A6', marginTop: 2 }}>
                    {moyen.fin ? `•••• ${moyen.fin}` : '—'}
                    {moyen.expireLe ? ` · expire le ${moyen.expireLe}` : ''}
                  </div>
                </div>
              </div>
              <button onClick={ouvrirEdition}
                style={{ width: '100%', marginTop: 14, padding: '12px', borderRadius: 10, background: '#F5F8FB', color: NAVY, border: '1px solid #E6EDF4', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                Changer de moyen de paiement
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13.5, color: '#8A92A6', margin: '0 0 14px' }}>Aucun moyen de paiement enregistré.</p>
              <button onClick={ouvrirEdition}
                style={{ width: '100%', padding: '12px', borderRadius: 10, background: NAVY, color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
                Enregistrer un moyen de paiement
              </button>
            </>
          )}
        </div>

        {/* Factures */}
        <div style={carte}>
          <h4 style={{ fontSize: 14.5, fontWeight: 700, color: NAVY, margin: '0 0 16px' }}>Factures</h4>

          {chargement ? (
            <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>Chargement…</p>
          ) : factures.length === 0 ? (
            <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>
              Aucune facture pour le moment. La première sera émise le 1er du mois.
            </p>
          ) : (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {factures.map((f, i) => {
                const p = PASTILLE[f.statut] || PASTILLE.void
                return (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderBottom: i < factures.length - 1 ? '1px solid #F2F5FA' : 'none' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: NAVY }}>{montant(f.montant, f.devise)}</div>
                      <div style={{ fontSize: 12, color: '#8A92A6', marginTop: 2 }}>
                        {formatDate(f.date)}{f.numero ? ` · ${f.numero}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, color: p.fg, background: p.bg, whiteSpace: 'nowrap' }}>
                        {f.statutLabel}
                      </span>
                      {f.aRegler && (
                        <a href={f.aRegler} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12.5, fontWeight: 700, color: '#C2620C', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                          Régler
                        </a>
                      )}
                      {f.pdf && (
                        <a href={f.pdf} target="_blank" rel="noopener noreferrer" title="Télécharger le PDF"
                          style={{ display: 'inline-flex', color: '#249E7C' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Résiliation */}
      {actif && (
        <div style={{ ...carte, marginTop: 20 }}>
          {resiliation ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#C2620C', margin: '0 0 4px' }}>Résiliation programmée</h4>
                <p style={{ fontSize: 13, color: '#8A92A6', margin: 0, lineHeight: 1.6 }}>
                  Votre abonnement prend fin le {formatDate(resiliation.le)}. Vos biens restent en ligne jusqu&rsquo;à cette date.
                </p>
              </div>
              <button onClick={() => basculerResiliation(false)} disabled={action === 'resil'}
                style={{ padding: '12px 20px', borderRadius: 10, background: '#7CB8A8', color: '#0F2A22', border: 'none', fontSize: 13.5, fontWeight: 700, cursor: action === 'resil' ? 'wait' : 'pointer', flexShrink: 0 }}>
                {action === 'resil' ? 'Patientez…' : 'Reprendre mon abonnement'}
              </button>
            </div>
          ) : confirmation ? (
            <div>
              <h4 style={{ fontSize: 14.5, fontWeight: 700, color: NAVY, margin: '0 0 6px' }}>Confirmer la résiliation</h4>
              <p style={{ fontSize: 13, color: '#5A6275', margin: '0 0 16px', lineHeight: 1.65 }}>
                Vos biens resteront en ligne jusqu&rsquo;à la fin de la période déjà payée. Passé cette date, ils sortiront
                de la vitrine, des pages agence et de vos widgets. Vous pourrez revenir en arrière à tout moment d&rsquo;ici là.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => basculerResiliation(true)} disabled={action === 'resil'}
                  style={{ padding: '12px 20px', borderRadius: 10, background: '#E5484D', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 700, cursor: action === 'resil' ? 'wait' : 'pointer' }}>
                  {action === 'resil' ? 'Patientez…' : 'Oui, résilier'}
                </button>
                <button onClick={() => setConfirmation(false)} disabled={action === 'resil'}
                  style={{ padding: '12px 20px', borderRadius: 10, background: '#F5F8FB', color: '#5A6275', border: '1px solid #E6EDF4', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                  Garder mon abonnement
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: NAVY, margin: '0 0 4px' }}>Résilier mon abonnement</h4>
                <p style={{ fontSize: 13, color: '#8A92A6', margin: 0 }}>
                  Sans engagement. L&rsquo;arrêt prend effet à la fin de la période en cours.
                </p>
              </div>
              <button onClick={() => setConfirmation(true)}
                style={{ padding: '12px 20px', borderRadius: 10, background: '#fff', color: '#E5484D', border: '1px solid #FBD5D5', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                Résilier
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

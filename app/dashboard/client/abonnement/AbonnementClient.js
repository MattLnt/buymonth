'use client'

import { useState } from 'react'

const STATUT_LABEL = {
  active: { label: 'Actif', color: '#249E7C', bg: 'rgba(36,158,124,0.12)', dot: '#249E7C' },
  trialing: { label: 'Période d\'essai', color: '#5B8DEF', bg: 'rgba(91,141,239,0.12)', dot: '#5B8DEF' },
  past_due: { label: 'Paiement en retard', color: '#E89923', bg: 'rgba(232,153,35,0.12)', dot: '#E89923' },
  canceled: { label: 'Annulé', color: '#E5484D', bg: 'rgba(229,72,77,0.12)', dot: '#E5484D' },
  none: { label: 'Aucun abonnement', color: '#8A92A6', bg: '#F2F5FA', dot: '#8A92A6' },
}

function formatDate(ms) {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function AbonnementClient({ subStatus, details, createdAt }) {
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  const statut = STATUT_LABEL[subStatus] || STATUT_LABEL.none
  const estActif = subStatus === 'active' || subStatus === 'trialing'
  const resiliationProgrammee = details?.cancelAtPeriodEnd

  function souscrire() {
    window.location.href = '/dashboard/client/abonnement/checkout'
  }

  async function gerer() {
    setLoading('portal'); setError('')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      setError(data.error || 'Erreur.'); setLoading('')
    } catch { setError('Erreur réseau.'); setLoading('') }
  }

  const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 26 }

  return (
    <div>
      {/* Bandeau résiliation programmée */}
      {resiliationProgrammee && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2620C" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#C2620C' }}>
            Votre abonnement est résilié et prendra fin le {formatDate(details.cancelAt || details.currentPeriodEnd)}. Vous gardez l'accès jusqu'à cette date.
          </span>
        </div>
      )}

      <div className="abo-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, alignItems: 'start' }}>
        <style>{`@media (max-width: 880px){ .abo-grid { grid-template-columns: 1fr !important; } }`}</style>

        {/* Colonne gauche : carte offre premium */}
        <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 18, padding: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'inline-block', background: 'rgba(124,184,168,0.18)', color: '#7CB8A8', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, letterSpacing: '0.05em' }}>ABONNEMENT PLATEFORME</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: statut.color, background: '#fff' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: statut.dot }} />
                {statut.label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 22 }}>
              <span style={{ fontSize: 46, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{details?.montant ? details.montant.toLocaleString('fr-BE') : '500'} €</span>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>/ mois</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
              {['Accès complet à la plateforme', 'Biens illimités affichés en mensualités', 'Génération de widgets pour votre site', 'Réception de leads qualifiés'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,184,168,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)' }}>{f}</span>
                </div>
              ))}
            </div>

            {estActif ? (
              <button onClick={gerer} disabled={loading === 'portal'} style={{ width: '100%', padding: '15px', borderRadius: 11, background: '#fff', color: '#16324F', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
                {loading === 'portal' ? 'Ouverture...' : 'Gérer mon abonnement'}
              </button>
            ) : (
              <button onClick={souscrire} disabled={loading === 'sub'} style={{ width: '100%', padding: '15px', borderRadius: 11, background: '#7CB8A8', color: '#0F2A22', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
                {loading === 'sub' ? 'Redirection...' : 'S\'abonner maintenant'}
              </button>
            )}
            {error && <p style={{ color: '#FFB4B4', fontSize: 13, margin: '14px 0 0', textAlign: 'center' }}>{error}</p>}
          </div>
        </div>

        {/* Colonne droite : détails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Détails facturation */}
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: '0 0 18px' }}>Détails de facturation</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Statut', node: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: statut.color }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: statut.dot }} />{statut.label}</span> },
                subStatus === 'trialing' && details?.trialEnd && { label: 'Fin de l\'essai', value: formatDate(details.trialEnd) },
                estActif && !resiliationProgrammee && { label: 'Prochain prélèvement', value: formatDate(details?.currentPeriodEnd) },
                resiliationProgrammee && { label: 'Fin d\'accès', value: formatDate(details?.cancelAt || details?.currentPeriodEnd), color: '#E5484D' },
                { label: 'Membre depuis', value: formatDate(new Date(createdAt).getTime()) },
              ].filter(Boolean).map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #F2F5FA' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#8A92A6' }}>{row.label}</span>
                  {row.node || <span style={{ fontSize: 13.5, fontWeight: 600, color: row.color || '#193B5E' }}>{row.value}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Gestion (infos sur le portail) */}
          {estActif && (
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: '0 0 8px' }}>Gérer votre abonnement</h3>
              <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 16px', lineHeight: 1.6 }}>
                Depuis l'espace de gestion sécurisé Stripe, vous pouvez modifier votre moyen de paiement, consulter vos factures et résilier votre abonnement.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Modifier la carte bancaire', 'Télécharger les factures', 'Résilier l\'abonnement'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#5A6275' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    {item}
                  </div>
                ))}
              </div>
              <button onClick={gerer} disabled={loading === 'portal'} style={{ width: '100%', marginTop: 18, padding: '12px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}>
                {loading === 'portal' ? 'Ouverture...' : 'Ouvrir l\'espace de gestion'}
              </button>
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#A9B0BE', margin: '22px 0 0', lineHeight: 1.5, textAlign: 'center' }}>
        Paiement sécurisé via Stripe. La modification du moyen de paiement et la résiliation se font dans l'espace de gestion Stripe.
      </p>
    </div>
  )
}
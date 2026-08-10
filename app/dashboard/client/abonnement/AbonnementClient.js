'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUT_LABEL = {
  active: { label: 'Actif', color: '#249E7C', bg: 'rgba(36,158,124,0.12)', dot: '#249E7C' },
  trialing: { label: 'Période d\'essai', color: '#5B8DEF', bg: 'rgba(91,141,239,0.12)', dot: '#5B8DEF' },
  past_due: { label: 'Paiement en retard', color: '#E89923', bg: 'rgba(232,153,35,0.12)', dot: '#E89923' },
  canceled: { label: 'Annulé', color: '#E5484D', bg: 'rgba(229,72,77,0.12)', dot: '#E5484D' },
  none: { label: 'Aucun abonnement', color: '#8A92A6', bg: '#F2F5FA', dot: '#8A92A6' },
}

// Tarifs (doivent rester alignés sur lib/facturation.js)
const TARIF = { PRO: 39, PRO_PLUS: 45 }
const RANG = { PRO: 0, PRO_PLUS: 1 }

// Features par formule (source : dossier BLOC 8)
const FEATURES = {
  PRO: [
    'Plateforme de gestion du portefeuille',
    'Badges, widgets & QR codes illimités',
    'Pages de simulation dédiées',
    'Tableau de bord & statistiques',
    'Diffusion sur la vitrine publique',
    'Hébergement, maintenance & support',
  ],
  PRO_PLUS: [
    'Tous les services BuyMonth Pro',
    'Marque blanche (badges & widgets à vos couleurs)',
    'Encodage et mises à jour pris en charge par BuyMonth',
    'Mise en avant prioritaire sur la vitrine',
  ],
}

const FORMULE_LABEL = { PRO: 'BuyMonth Pro', PRO_PLUS: 'BuyMonth Pro+' }

function formatDate(ms) {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' })
}

function euro(n) {
  return (n || 0).toLocaleString('fr-BE') + ' €'
}

export function AbonnementClient({ subStatus, formule = 'PRO', details, createdAt, facturation, changementProgramme = null }) {
  const router = useRouter()
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const statut = STATUT_LABEL[subStatus] || STATUT_LABEL.none
  const estActif = subStatus === 'active' || subStatus === 'trialing'
  const resiliationProgrammee = details?.cancelAtPeriodEnd

  const f = facturation || { formuleLabel: 'BuyMonth Pro', actifs: 0, total: 0, unitaire: 39, montantMensuel: 0, surMesure: false }
  const nbActifs = f.actifs || 0

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

  async function changerFormule(cible) {
    setLoading(cible); setError(''); setMessage('')
    try {
      const res = await fetch('/api/abonnement/formule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formule: cible }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur.'); setLoading(''); return }
      setMessage(data.message || 'Formule mise à jour.')
      setLoading('')
      router.refresh()
    } catch {
      setError('Erreur réseau.'); setLoading('')
    }
  }

  const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 26 }

  // Rendu d'une carte de formule (comparaison)
  function CarteFormule({ cle }) {
    const estActuelle = formule === cle
    const estUpgrade = RANG[cle] > RANG[formule]
    const proPlus = cle === 'PRO_PLUS'
    const coutMensuel = nbActifs * TARIF[cle]

    // Libellé du bouton selon la situation
    let boutonLabel = null
    if (!estActuelle) {
      if (!estActif) boutonLabel = `Choisir ${FORMULE_LABEL[cle]}`
      else if (estUpgrade) boutonLabel = `Passer à ${FORMULE_LABEL[cle]}`
      else boutonLabel = `Revenir à ${FORMULE_LABEL[cle]}`
    }

    return (
      <div style={{
        position: 'relative',
        background: estActuelle ? 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)' : '#fff',
        border: estActuelle ? 'none' : `1.5px solid ${proPlus ? 'rgba(78,125,212,0.35)' : '#EEF2F7'}`,
        borderRadius: 18, padding: 26, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {proPlus && !estActuelle && (
          <span style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(78,125,212,0.12)', color: '#4E7DD4', fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>PREMIUM</span>
        )}
        {estActuelle && (
          <span style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(124,184,168,0.2)', color: '#7CB8A8', fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>VOTRE FORMULE</span>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: estActuelle ? '#7CB8A8' : (proPlus ? '#4E7DD4' : '#8A92A6'), marginBottom: 10 }}>
          {FORMULE_LABEL[cle].toUpperCase()}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: estActuelle ? '#fff' : '#193B5E', letterSpacing: '-0.02em' }}>{TARIF[cle]} €</span>
          <span style={{ fontSize: 13, color: estActuelle ? 'rgba(255,255,255,0.6)' : '#8A92A6' }}>/ bien actif / mois HTVA</span>
        </div>

        {/* coût pour CE promoteur avec ses biens actifs */}
        <div style={{ fontSize: 13, color: estActuelle ? 'rgba(255,255,255,0.75)' : '#5A6275', marginBottom: 18, fontWeight: 600 }}>
          {nbActifs > 0 ? <>Avec vos {nbActifs} bien{nbActifs > 1 ? 's' : ''} actif{nbActifs > 1 ? 's' : ''} : {euro(coutMensuel)} / mois</> : 'Aucun bien actif pour le moment'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22, flex: 1 }}>
          {FEATURES[cle].map((ft) => (
            <div key={ft} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: estActuelle ? 'rgba(124,184,168,0.22)' : (proPlus ? 'rgba(78,125,212,0.12)' : 'rgba(36,158,124,0.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={estActuelle ? '#7CB8A8' : (proPlus ? '#4E7DD4' : '#249E7C')} strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <span style={{ fontSize: 13, color: estActuelle ? 'rgba(255,255,255,0.82)' : '#3D4759', lineHeight: 1.4 }}>{ft}</span>
            </div>
          ))}
        </div>

        {boutonLabel ? (
          <button
            onClick={() => changerFormule(cle)}
            disabled={loading === cle}
            style={{
              width: '100%', padding: '13px', borderRadius: 11, border: 'none',
              background: proPlus ? '#4E7DD4' : '#193B5E', color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: loading === cle ? 'wait' : 'pointer',
            }}
          >
            {loading === cle ? 'Traitement...' : boutonLabel}
          </button>
        ) : (
          <div style={{ width: '100%', padding: '13px', borderRadius: 11, background: 'rgba(124,184,168,0.15)', color: '#7CB8A8', fontSize: 13.5, fontWeight: 700, textAlign: 'center' }}>
            Formule actuelle
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Bandeau changement de formule programmé (downgrade) */}
      {changementProgramme && (
        <div style={{ background: 'rgba(78,125,212,0.08)', border: '1px solid rgba(78,125,212,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E7DD4" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#2E5AA8' }}>
            Changement programmé : vous passerez en {changementProgramme.formuleCibleLabel}
            {changementProgramme.dateEffet ? ` le ${formatDate(changementProgramme.dateEffet)}` : ' à la fin de votre période en cours'}.
            D'ici là, vous conservez votre formule actuelle.
          </span>
        </div>
      )}

      {/* Bandeau résiliation programmée */}
      {resiliationProgrammee && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2620C" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#C2620C' }}>
            Votre abonnement est résilié et prendra fin le {formatDate(details.cancelAt || details.currentPeriodEnd)}. Vous gardez l'accès jusqu'à cette date.
          </span>
        </div>
      )}

      {/* Messages de retour changement de formule */}
      {message && (
        <div style={{ background: 'rgba(36,158,124,0.1)', border: '1px solid rgba(36,158,124,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1B7A5E' }}>{message}</span>
        </div>
      )}
      {error && (
        <div style={{ background: 'rgba(229,72,77,0.08)', border: '1px solid rgba(229,72,77,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 22 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#E5484D' }}>{error}</span>
        </div>
      )}

      {/* ZONE 1 — Récap coût actuel */}
      <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden', marginBottom: 22 }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ display: 'inline-block', background: 'rgba(124,184,168,0.18)', color: '#7CB8A8', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, letterSpacing: '0.05em' }}>{f.formuleLabel.toUpperCase()}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: statut.color, background: '#fff' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: statut.dot }} />
                {statut.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 46, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{euro(f.montantMensuel)}</span>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>/ mois HTVA</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              {f.actifs} bien{f.actifs > 1 ? 's' : ''} actif{f.actifs > 1 ? 's' : ''} × {euro(f.unitaire)} / mois
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
            {estActif ? (
              <button onClick={gerer} disabled={loading === 'portal'} style={{ padding: '13px 22px', borderRadius: 11, background: '#fff', color: '#16324F', border: 'none', fontSize: 14, fontWeight: 700, cursor: loading === 'portal' ? 'wait' : 'pointer' }}>
                {loading === 'portal' ? 'Ouverture...' : 'Gérer mon abonnement'}
              </button>
            ) : (
              <button onClick={souscrire} style={{ padding: '13px 22px', borderRadius: 11, background: '#7CB8A8', color: '#0F2A22', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                S'abonner maintenant
              </button>
            )}
          </div>
        </div>

        {f.surMesure && (
          <div style={{ position: 'relative', marginTop: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, color: 'rgba(255,255,255,0.8)' }}>
            Au-delà de 125 biens actifs, une offre sur mesure s'applique — contactez-nous.
          </div>
        )}
      </div>

      {/* ZONE 2 + 3 — Comparaison des deux formules (coût par formule intégré à chaque carte) */}
      <div style={{ marginBottom: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 4px' }}>Choisissez votre formule</h3>
        <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px' }}>
          {estActif
            ? 'Le passage à une formule supérieure est immédiat (au prorata). Un passage à une formule inférieure prend effet à la fin de votre période en cours.'
            : 'Sélectionnez la formule qui vous convient, puis abonnez-vous.'}
        </p>
        <div className="formules-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <style>{`@media (max-width: 880px){ .formules-grid { grid-template-columns: 1fr !important; } .abo-grid { grid-template-columns: 1fr !important; } }`}</style>
          <CarteFormule cle="PRO" />
          <CarteFormule cle="PRO_PLUS" />
        </div>
      </div>

      {/* ZONE 4 — Détails de facturation + gestion */}
      <div className="abo-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, alignItems: 'start', marginTop: 22 }}>
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: '0 0 18px' }}>Détails de facturation</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { label: 'Statut', node: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: statut.color }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: statut.dot }} />{statut.label}</span> },
              { label: 'Formule', value: f.formuleLabel },
              { label: 'Biens facturés', value: `${f.actifs} / ${f.total}` },
              { label: 'Tarif par bien', value: `${euro(f.unitaire)} / mois` },
              { label: 'Total mensuel', value: `${euro(f.montantMensuel)} HTVA`, strong: true },
              subStatus === 'trialing' && details?.trialEnd && { label: 'Fin de l\'essai', value: formatDate(details.trialEnd) },
              estActif && !resiliationProgrammee && { label: 'Prochain prélèvement', value: formatDate(details?.currentPeriodEnd) },
              resiliationProgrammee && { label: 'Fin d\'accès', value: formatDate(details?.cancelAt || details?.currentPeriodEnd), color: '#E5484D' },
              { label: 'Membre depuis', value: formatDate(new Date(createdAt).getTime()) },
            ].filter(Boolean).map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #F2F5FA' : 'none' }}>
                <span style={{ fontSize: 13, color: '#8A92A6' }}>{row.label}</span>
                {row.node || <span style={{ fontSize: row.strong ? 15 : 13.5, fontWeight: row.strong ? 700 : 600, color: row.color || '#193B5E' }}>{row.value}</span>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: '#A9B0BE', margin: '14px 0 0', lineHeight: 1.5 }}>
            Frais de mise en service (1 490 € HTVA, une seule fois) facturés séparément, hors plateforme.
          </p>
        </div>

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
            <button onClick={gerer} disabled={loading === 'portal'} style={{ width: '100%', marginTop: 18, padding: '12px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: loading === 'portal' ? 'wait' : 'pointer' }}>
              {loading === 'portal' ? 'Ouverture...' : 'Ouvrir l\'espace de gestion'}
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#A9B0BE', margin: '22px 0 0', lineHeight: 1.5, textAlign: 'center' }}>
        Vous ne payez que vos biens actifs — un bien vendu ou hors-ligne sort automatiquement du décompte. Paiement sécurisé via Stripe.
      </p>
    </div>
  )
}
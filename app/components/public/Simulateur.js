'use client'

import { useState, useEffect } from 'react'
import { evalueBien } from '@/lib/capacite'
import { MENSUALITE_CONFIG, AVERTISSEMENT_LEGAL } from '@/lib/mensualiteConfig'

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '13px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 15, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

function Euro({ children }) {
  return <div style={{ position: 'relative' }}>{children}<span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9AA2B4', pointerEvents: 'none' }}>€</span></div>
}

const pct = (t) => new Intl.NumberFormat('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(t * 100) + ' %'
const euro = (n) => (n || 0).toLocaleString('fr-BE') + ' €'

export function Simulateur({ bien, onStepChange }) {
  const [step, setStep] = useState(1)
  const [sim, setSim] = useState({ revenus: '', apport: '', creditsEnCours: '' })
  const [contact, setContact] = useState({ nom: '', societe: '', email: '', telephone: '' })
  const [consent, setConsent] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cfgM = MENSUALITE_CONFIG
  const dureeAns = Math.round(cfgM.dureeMois / 12)

  useEffect(() => { onStepChange?.(step) }, [step, onStepChange])

  const setS = (k) => (e) => setSim({ ...sim, [k]: e.target.value })
  const setC = (k) => (e) => setContact({ ...contact, [k]: e.target.value })

  // ÉTAPE 1 : coordonnées + données → on capte le lead, PUIS on calcule et affiche le résultat
  async function soumettre(e) {
    e.preventDefault()
    if (!sim.revenus) { setError('Indiquez vos revenus.'); return }
    if (!contact.email && !contact.telephone) { setError('Un email ou un téléphone est requis.'); return }
    if (!consent) { setError('Vous devez accepter la transmission de vos données pour continuer.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bienId: bien?.id || null,
          nom: contact.nom,
          societe: contact.societe,
          email: contact.email,
          telephone: contact.telephone,
          revenu: sim.revenus,
          apport: sim.apport,
          source: 'SIMULATEUR',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur.'); setLoading(false); return }

      // Lead créé → on calcule le résultat et on passe à l'étape 2
      const r = evalueBien({ revenus: sim.revenus, apport: sim.apport, creditsEnCours: sim.creditsEnCours, prixBien: bien?.prixTotal || 0 })
      setResult(r)
      setLoading(false)
      setStep(2)
    } catch {
      setError('Erreur réseau.'); setLoading(false)
    }
  }

  const apportPrisEnCompte = parseInt(sim.apport, 10) || 0
  const budgetTotalMax = result ? (result.capitalEmpruntable || 0) + apportPrisEnCompte : 0

  return (
    <div>
      <style>{`
        .sim-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 560px){ .sim-row { grid-template-columns: 1fr; } }
      `}</style>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 26 }}>
        {[{ n: 1, t: 'Vos informations' }, { n: 2, t: 'Votre capacité' }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', flex: i === 0 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: step >= s.n ? '#193B5E' : '#E8EDF2', color: step >= s.n ? '#fff' : '#9AA2B4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s.n}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: step >= s.n ? '#193B5E' : '#9AA2B4', whiteSpace: 'nowrap' }}>{s.t}</span>
            </div>
            {i === 0 && <div style={{ flex: 1, height: 2, background: step >= 2 ? '#193B5E' : '#E8EDF2', marginTop: 14, marginLeft: 8, marginRight: 8 }} />}
          </div>
        ))}
      </div>

      {/* ÉTAPE 1 : informations + coordonnées + consentement */}
      {step === 1 && (
        <form onSubmit={soumettre}>
          {/* Capacité — Revenus + Apport côte à côte, Crédits pleine largeur */}
          <div className="sim-row" style={{ marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Revenus nets mensuels</label>
              <Euro><input type="number" value={sim.revenus} onChange={setS('revenus')} placeholder="3500" style={{ ...inputStyle, paddingRight: 36 }} /></Euro>
            </div>
            <div>
              <label style={labelStyle}>Apport disponible</label>
              <Euro><input type="number" value={sim.apport} onChange={setS('apport')} placeholder="30000" style={{ ...inputStyle, paddingRight: 36 }} /></Euro>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Crédits en cours (mensualités)</label>
            <Euro><input type="number" value={sim.creditsEnCours} onChange={setS('creditsEnCours')} placeholder="0" style={{ ...inputStyle, paddingRight: 36 }} /></Euro>
          </div>

          {/* Coordonnées (avant le résultat) */}
          <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 20, marginBottom: 4 }}>
            <p style={{ fontSize: 13.5, color: '#5A6275', margin: '0 0 16px', lineHeight: 1.55 }}>
              Vos coordonnées permettent à <strong style={{ color: '#193B5E' }}>BuyMonth Finance</strong> (intermédiaire agréé FSMA) de vous préparer une offre personnalisée.
            </p>
            <div className="sim-row" style={{ marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Nom complet</label>
                <input value={contact.nom} onChange={setC('nom')} placeholder="Votre nom" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Entreprise <span style={{ textTransform: 'none', fontWeight: 500, color: '#A9B0BE' }}>(optionnel)</span></label>
                <input value={contact.societe} onChange={setC('societe')} placeholder="Via une société" style={inputStyle} />
              </div>
            </div>
            <div className="sim-row" style={{ marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={contact.email} onChange={setC('email')} placeholder="vous@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input value={contact.telephone} onChange={setC('telephone')} placeholder="+32 ..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Opt-in RGPD (obligatoire) */}
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 20 }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, cursor: 'pointer', accentColor: '#7CB8A8' }} />
            <span style={{ fontSize: 12.5, color: '#5A6275', lineHeight: 1.5 }}>
              J'accepte que mes données soient transmises à BuyMonth Finance (intermédiaire en crédit agréé FSMA) afin d'être recontacté(e) au sujet de mon projet. Consultez notre <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: '#7CB8A8', fontWeight: 600 }}>politique de confidentialité</a>.
            </span>
          </label>

          {error && <p style={{ color: '#E5484D', fontSize: 13, margin: '0 0 16px' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Envoi...' : 'Voir ma capacité'}
          </button>
        </form>
      )}

      {/* ÉTAPE 2 : résultat (carte 4 lignes, sans comparaison au bien) */}
      {step === 2 && result && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ display: 'inline-flex', width: 56, height: 56, borderRadius: '50%', background: 'rgba(36,158,124,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Votre demande est enregistrée</h2>
            <p style={{ fontSize: 14, color: '#5A6275', margin: 0, lineHeight: 1.55, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
              Voici votre capacité d'emprunt estimée. Un conseiller BuyMonth Finance vous recontactera pour l'affiner.
            </p>
          </div>

          {/* Carte résultat — 4 lignes */}
          <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 16, padding: 26 }}>
            {[
              { label: 'Mensualité maximale', value: euro(result.mensualiteMax) },
              { label: 'Capital empruntable maximum', value: euro(result.capitalEmpruntable) },
              { label: 'Apport pris en compte', value: euro(apportPrisEnCompte) },
              { label: 'Budget total maximum', value: euro(budgetTotalMax), strong: true },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}>{row.label}</span>
                <span style={{ fontSize: row.strong ? 24 : 16, fontWeight: 700, color: row.strong ? '#7CB8A8' : '#fff', whiteSpace: 'nowrap' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#8A92A6', margin: '16px 0 0', lineHeight: 1.5 }}>
            Estimation hors frais, sur base d'un crédit à {dureeAns} ans, taux débiteur {pct(cfgM.tauxAnnuel)}, TAEG {pct(cfgM.taegAnnuel)}. Le budget total maximum additionne le capital empruntable et votre apport. Indicatif uniquement.
          </p>

          <button type="button" onClick={() => setStep(1)} style={{ width: '100%', padding: '12px', marginTop: 16, borderRadius: 10, background: 'transparent', color: '#5A6275', border: '1.5px solid #E8EDF2', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
            ← Modifier mes informations
          </button>
        </div>
      )}

      {/* Mention légale */}
      <p style={{ fontSize: 11, color: '#A9B0BE', margin: '20px 0 0', lineHeight: 1.5, textAlign: 'center' }}>
        {AVERTISSEMENT_LEGAL} Simulation purement indicative, sans valeur contractuelle. Sous réserve d'analyse et d'acceptation du dossier. Crédit : BuyMonth Finance — intermédiaire agréé FSMA n° 1021.366.349.
      </p>
    </div>
  )
}
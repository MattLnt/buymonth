'use client'

import { useState, useEffect } from 'react'
import { evalueBien } from '@/lib/capacite'
import { MENSUALITE_CONFIG, AVERTISSEMENT_LEGAL } from '@/lib/mensualiteConfig'

const labelStyle = { display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }
const inputStyle = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14.5, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

function Euro({ children }) {
  return <div style={{ position: 'relative' }}>{children}<span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 13.5, color: '#9AA2B4', pointerEvents: 'none' }}>€</span></div>
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

  if (step === 2 && result) {
    return (
      <div className="sim-step2-padding">
        <style>{`
          .sim-step2-padding { padding: 28px 24px; }
          @media (max-width: 600px){
            .sim-step2-padding { padding: 24px 16px; }
          }
        `}</style>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: '50%', background: 'rgba(36,158,124,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Votre demande est enregistrée</h2>
          <p style={{ fontSize: 13.5, color: '#5A6275', margin: 0, lineHeight: 1.5, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Voici votre capacité d'emprunt estimée. Un conseiller BuyMonth Finance vous recontactera pour l'affiner.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 14, padding: '16px 14px' }}>
          {[
            { label: 'Mensualité maximale', value: euro(result.mensualiteMax) },
            { label: 'Capital empruntable max', value: euro(result.capitalEmpruntable) },
            { label: 'Apport pris en compte', value: euro(apportPrisEnCompte) },
            { label: 'Budget total maximum', value: euro(budgetTotalMax), strong: true },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>{row.label}</span>
              <span style={{ fontSize: row.strong ? 18 : 14.5, fontWeight: 700, color: row.strong ? '#7CB8A8' : '#fff', whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10.5, color: '#8A92A6', margin: '12px 0 0', lineHeight: 1.45 }}>
          Estimation hors frais, sur base d'un crédit à {dureeAns} ans, taux débiteur {pct(cfgM.tauxAnnuel)}, TAEG {pct(cfgM.taegAnnuel)}. Le budget total maximum additionne le capital empruntable et votre apport. Indicatif uniquement.
        </p>

        <button type="button" onClick={() => setStep(1)} style={{ width: '100%', padding: '11px', marginTop: 12, borderRadius: 10, background: 'transparent', color: '#5A6275', border: '1.5px solid #E8EDF2', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          ← Modifier mes informations
        </button>

        <p style={{ fontSize: 10, color: '#A9B0BE', margin: '12px 0 0', lineHeight: 1.4, textAlign: 'center' }}>
          {AVERTISSEMENT_LEGAL} Crédit : BuyMonth Finance — intermédiaire agréé FSMA n° 1021.366.349.
        </p>
      </div>
    )
  }

  return (
    <div className="sim-wrap" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden' }}>
      <style>{`
        .sim-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .sim-right-panel { padding: 28px 24px; }
        @media (max-width: 720px){
          .sim-wrap { grid-template-columns: 1fr !important; }
          .sim-left { display: none !important; }
          .sim-row { grid-template-columns: 1fr !important; gap: 10px; }
          .sim-right-panel { padding: 24px 16px; }
        }
      `}</style>

      {/* PANNEAU GAUCHE */}
      <div className="sim-left" style={{ background: 'linear-gradient(160deg, #16324F 0%, #1D4267 100%)', padding: 28, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,184,168,0.16)', border: '1px solid rgba(124,184,168,0.3)', borderRadius: 20, padding: '5px 12px', marginBottom: 18, alignSelf: 'flex-start' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7CB8A8' }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7CB8A8', letterSpacing: '0.05em' }}>SIMULATION GRATUITE</span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Votre capacité d'emprunt</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.55 }}>
            {bien?.titre ? `Pour « ${bien.titre} ». ` : ''}Estimez en une minute ce que vous pouvez emprunter, sans engagement.
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 24 }}>
            {['Réponse immédiate', 'Sans engagement', 'Étude par un conseiller agréé FSMA'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(124,184,168,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.82)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PANNEAU DROIT */}
      <div className="sim-right-panel">
        <form onSubmit={soumettre}>
          <div className="sim-row" style={{ marginBottom: 10 }}>
            <div>
              <label style={labelStyle}>Revenus nets mensuels</label>
              <Euro><input type="number" value={sim.revenus} onChange={setS('revenus')} placeholder="3500" style={{ ...inputStyle, paddingRight: 34 }} /></Euro>
            </div>
            <div>
              <label style={labelStyle}>Apport disponible</label>
              <Euro><input type="number" value={sim.apport} onChange={setS('apport')} placeholder="30000" style={{ ...inputStyle, paddingRight: 34 }} /></Euro>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Crédits en cours (mensualités)</label>
            <Euro><input type="number" value={sim.creditsEnCours} onChange={setS('creditsEnCours')} placeholder="0" style={{ ...inputStyle, paddingRight: 34 }} /></Euro>
          </div>

          <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 14, marginBottom: 4 }}>
            <p style={{ fontSize: 12, color: '#5A6275', margin: '0 0 12px', lineHeight: 1.45 }}>
              Vos coordonnées permettent à <strong style={{ color: '#193B5E' }}>BuyMonth Finance</strong> de préparer votre offre.
            </p>
            <div className="sim-row" style={{ marginBottom: 10 }}>
              <div>
                <label style={labelStyle}>Nom complet</label>
                <input value={contact.nom} onChange={setC('nom')} placeholder="Votre nom" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Entreprise <span style={{ textTransform: 'none', fontWeight: 500, color: '#A9B0BE' }}>(opt.)</span></label>
                <input value={contact.societe} onChange={setC('societe')} placeholder="Via une société" style={inputStyle} />
              </div>
            </div>
            <div className="sim-row" style={{ marginBottom: 14 }}>
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

          <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 14 }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2, width: 15, height: 15, flexShrink: 0, cursor: 'pointer', accentColor: '#7CB8A8' }} />
            <span style={{ fontSize: 11, color: '#5A6275', lineHeight: 1.4 }}>
              J'accepte que mes données soient transmises à BuyMonth Finance (agréé FSMA) afin d'être recontacté(e). <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: '#7CB8A8', fontWeight: 600 }}>Confidentialité</a>.
            </span>
          </label>

          {error && <p style={{ color: '#E5484D', fontSize: 12.5, margin: '0 0 12px' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Envoi...' : 'Voir ma capacité'}
          </button>

          <p style={{ fontSize: 9.5, color: '#A9B0BE', margin: '10px 0 0', lineHeight: 1.35, textAlign: 'center' }}>
            Simulation indicative, sans valeur contractuelle. FSMA n° 1021.366.349.
          </p>
        </form>
      </div>
    </div>
  )
}
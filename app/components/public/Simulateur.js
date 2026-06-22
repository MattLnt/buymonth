'use client'

import { useState, useEffect } from 'react'
import { evalueBien } from '@/lib/capacite'

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '13px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 15, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

function Euro({ children }) {
  return <div style={{ position: 'relative' }}>{children}<span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9AA2B4', pointerEvents: 'none' }}>€</span></div>
}

export function Simulateur({ bien, onStepChange }) {
  const [step, setStep] = useState(1)
  const [sim, setSim] = useState({ revenus: '', apport: '', creditsEnCours: '' })
  const [contact, setContact] = useState({ nom: '', email: '', telephone: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { onStepChange?.(done ? 1 : step) }, [step, done, onStepChange])

  const setS = (k) => (e) => setSim({ ...sim, [k]: e.target.value })
  const setC = (k) => (e) => setContact({ ...contact, [k]: e.target.value })

  function simuler(e) {
    e.preventDefault()
    if (!sim.revenus) { setError('Indiquez vos revenus.'); return }
    setError('')
    const r = evalueBien({ revenus: sim.revenus, apport: sim.apport, creditsEnCours: sim.creditsEnCours, prixBien: bien?.prixTotal || 0 })
    setResult(r)
    setStep(2)
  }

  async function envoyer(e) {
    e.preventDefault()
    if (!contact.email && !contact.telephone) { setError('Email ou téléphone requis.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bienId: bien?.id || null, nom: contact.nom, email: contact.email, telephone: contact.telephone, revenu: sim.revenus, apport: sim.apport, source: 'SIMULATEUR' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur.'); setLoading(false); return }
      setDone(true)
    } catch {
      setError('Erreur réseau.'); setLoading(false)
    }
  }

  const statutConfig = {
    ok: { color: '#249E7C', bg: 'rgba(36,158,124,0.08)', border: 'rgba(36,158,124,0.25)', label: 'Ce bien est dans votre budget', icon: 'M20 6L9 17l-5-5' },
    limite: { color: '#E89923', bg: 'rgba(232,153,35,0.08)', border: 'rgba(232,153,35,0.25)', label: 'À la limite de votre budget', icon: 'M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' },
    insuffisant: { color: '#E5484D', bg: 'rgba(229,72,77,0.08)', border: 'rgba(229,72,77,0.25)', label: 'Ce bien dépasse votre budget', icon: 'M18 6L6 18M6 6l12 12' },
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <span style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: '50%', background: 'rgba(36,158,124,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#193B5E', margin: '0 0 10px' }}>Demande envoyée !</h2>
        <p style={{ fontSize: 15, color: '#5A6275', margin: 0, lineHeight: 1.6, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
          Un conseiller en crédit agréé va étudier votre dossier et vous recontacter rapidement pour une offre personnalisée.
        </p>
      </div>
    )
  }

  const cfg = result ? statutConfig[result.statut] : null
  const ratioPct = result ? Math.min(100, Math.round(result.ratio * 100)) : 0

  return (
    <div>
      <style>{`@media (min-width: 640px){ .sim-step2 { display: grid !important; grid-template-columns: 1fr 1fr; gap: 24px; align-items: stretch; } }`}</style>

      {/* Stepper : numéro au-dessus du titre */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 26 }}>
        {[{ n: 1, t: 'Simulation' }, { n: 2, t: 'Vos coordonnées' }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', flex: i === 0 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: step >= s.n ? '#193B5E' : '#E8EDF2', color: step >= s.n ? '#fff' : '#9AA2B4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s.n}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: step >= s.n ? '#193B5E' : '#9AA2B4', whiteSpace: 'nowrap' }}>{s.t}</span>
            </div>
            {i === 0 && <div style={{ flex: 1, height: 2, background: step >= 2 ? '#193B5E' : '#E8EDF2', marginTop: 14, marginLeft: 8, marginRight: 8 }} />}
          </div>
        ))}
      </div>

      {/* ÉTAPE 1 */}
      {step === 1 && (
        <form onSubmit={simuler}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Revenus nets mensuels du ménage</label>
            <Euro><input type="number" value={sim.revenus} onChange={setS('revenus')} placeholder="3500" style={{ ...inputStyle, paddingRight: 36 }} /></Euro>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Apport disponible</label>
            <Euro><input type="number" value={sim.apport} onChange={setS('apport')} placeholder="30000" style={{ ...inputStyle, paddingRight: 36 }} /></Euro>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Crédits en cours (mensualités)</label>
            <Euro><input type="number" value={sim.creditsEnCours} onChange={setS('creditsEnCours')} placeholder="0" style={{ ...inputStyle, paddingRight: 36 }} /></Euro>
          </div>

          {error && <p style={{ color: '#E5484D', fontSize: 13, margin: '0 0 16px' }}>{error}</p>}

          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Calculer ma capacité
          </button>
        </form>
      )}

      {/* ÉTAPE 2 */}
      {step === 2 && result && (
        <div className="sim-step2">
          {/* Colonne récap — pleine hauteur, complète */}
          <div style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column' }}>
            {/* badge statut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d={cfg.icon} /></svg>
              </span>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: cfg.color, lineHeight: 1.25 }}>{cfg.label}</div>
            </div>

            {/* barre budget vs prix */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#5A6275', marginBottom: 6 }}>
                <span>Votre budget</span>
                <span>Prix du bien</span>
              </div>
              <div style={{ position: 'relative', height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${ratioPct}%`, background: cfg.color, borderRadius: 20, transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* lignes détaillées */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
              {[
                { label: 'Budget estimé', value: `${result.budgetMax.toLocaleString('fr-BE')} €`, strong: true },
                { label: 'Prix du bien', value: `${result.prix.toLocaleString('fr-BE')} €` },
                { label: result.ecart >= 0 ? 'Marge' : 'Manque', value: `${result.ecart >= 0 ? '+' : ''}${result.ecart.toLocaleString('fr-BE')} €`, color: result.ecart >= 0 ? '#249E7C' : '#E5484D' },
                { label: 'Mensualité max', value: `${result.mensualiteMax.toLocaleString('fr-BE')} €` },
                { label: 'Capital empruntable', value: `${result.capitalEmpruntable.toLocaleString('fr-BE')} €` },
                { label: 'Apport pris en compte', value: `${(parseInt(sim.apport, 10) || 0).toLocaleString('fr-BE')} €` },
                { label: 'Taux d\'endettement', value: '33 %' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 13, color: '#5A6275' }}>{row.label}</span>
                  <span style={{ fontSize: row.strong ? 15 : 13.5, fontWeight: row.strong ? 700 : 600, color: row.color || '#193B5E' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, color: '#8A92A6', margin: '14px 0 0', lineHeight: 1.5 }}>
              Estimation sur base d'un crédit à 25 ans, taux 3,45 %. Indicatif uniquement.
            </p>
          </div>

          {/* Colonne formulaire */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 13.5, color: '#5A6275', margin: '0 0 16px', lineHeight: 1.55 }}>
              Laissez vos coordonnées pour qu'un conseiller agréé vous prépare une <strong style={{ color: '#193B5E' }}>offre personnalisée</strong>.
            </p>
            <form onSubmit={envoyer} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Nom complet</label>
                <input value={contact.nom} onChange={setC('nom')} placeholder="Votre nom" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={contact.email} onChange={setC('email')} placeholder="vous@email.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Téléphone</label>
                <input value={contact.telephone} onChange={setC('telephone')} placeholder="+32 ..." style={inputStyle} />
              </div>

              {error && <p style={{ color: '#E5484D', fontSize: 13, margin: '0 0 14px' }}>{error}</p>}

              <div style={{ marginTop: 'auto' }}>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', marginBottom: 8 }}>
                  {loading ? 'Envoi...' : 'Recevoir mon offre'}
                </button>
                <button type="button" onClick={() => setStep(1)} style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'transparent', color: '#5A6275', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                  ← Retour à la simulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mention légale */}
      <p style={{ fontSize: 11, color: '#A9B0BE', margin: '20px 0 0', lineHeight: 1.5, textAlign: 'center' }}>
        Simulation purement indicative, sans valeur contractuelle. Sous réserve d'analyse et d'acceptation du dossier par l'organisme prêteur. JG Management — FSMA 1021.366.349
      </p>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Icon } from '@/app/components/dashboard/Icon'

const labelStyle = { display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 15, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }
const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 28, marginBottom: 20 }

function SectionHeader({ icon, title, desc, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={20} color="#7CB8A8" />
        </span>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 4px' }}>{title}</h2>
          <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0, lineHeight: 1.55, maxWidth: 520 }}>{desc}</p>
        </div>
      </div>
      {action}
    </div>
  )
}

function Suffix({ children, suffix }) {
  return <div style={{ position: 'relative' }}>{children}<span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9AA2B4', pointerEvents: 'none' }}>{suffix}</span></div>
}

export function ParametresForm({ initial }) {
  const [apportPct, setApportPct] = useState(Math.round((initial.apportPct ?? 0.10) * 100))
  const [tauxAnnuel, setTauxAnnuel] = useState(((initial.tauxAnnuel ?? 0.0345) * 100).toFixed(2))
  const [dureeAns, setDureeAns] = useState(Math.round((initial.dureeMois ?? 300) / 12))
  const [emails, setEmails] = useState(initial.leadEmails || [])
  const [newEmail, setNewEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [recalcOpen, setRecalcOpen] = useState(false)
  const [recalcLoading, setRecalcLoading] = useState(false)
  const [recalcMsg, setRecalcMsg] = useState('')

  function addEmail() {
    const e = newEmail.trim().toLowerCase()
    if (!e) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setMsg('Adresse email invalide.'); return }
    if (emails.includes(e)) { setMsg('Cette adresse est déjà ajoutée.'); return }
    setEmails([...emails, e]); setNewEmail(''); setMsg('')
  }

  function removeEmail(e) {
    setEmails(emails.filter((x) => x !== e))
  }

  async function save() {
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apportPct: Number(apportPct) / 100,
          tauxAnnuel: Number(tauxAnnuel) / 100,
          dureeMois: Number(dureeAns) * 12,
          leadEmails: emails,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Erreur.'); setSaving(false); return }
      setMsg('Paramètres enregistrés ✓')
    } catch {
      setMsg('Erreur réseau.')
    }
    setSaving(false)
  }

  async function recalculer() {
    setRecalcLoading(true); setRecalcMsg('')
    try {
      const res = await fetch('/api/admin/recalcul', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setRecalcMsg(data.error || 'Erreur.'); setRecalcLoading(false); return }
      setRecalcMsg(`${data.count} bien${data.count > 1 ? 's' : ''} recalculé${data.count > 1 ? 's' : ''} ✓`)
      setRecalcOpen(false)
    } catch {
      setRecalcMsg('Erreur réseau.')
    }
    setRecalcLoading(false)
  }

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Calcul de mensualité */}
      <div style={card}>
        <SectionHeader icon="euro" title="Calcul de la mensualité" desc="Ces paramètres définissent la mensualité affichée sur les biens, le widget et le simulateur." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
          <div>
            <label style={labelStyle}>Apport requis</label>
            <Suffix suffix="%"><input type="number" value={apportPct} onChange={(e) => setApportPct(e.target.value)} style={{ ...inputStyle, paddingRight: 34 }} /></Suffix>
          </div>
          <div>
            <label style={labelStyle}>Taux annuel (TAEG)</label>
            <Suffix suffix="%"><input type="number" step="0.01" value={tauxAnnuel} onChange={(e) => setTauxAnnuel(e.target.value)} style={{ ...inputStyle, paddingRight: 34 }} /></Suffix>
          </div>
          <div>
            <label style={labelStyle}>Durée du crédit</label>
            <Suffix suffix="ans"><input type="number" value={dureeAns} onChange={(e) => setDureeAns(e.target.value)} style={{ ...inputStyle, paddingRight: 42 }} /></Suffix>
          </div>
        </div>
      </div>

      {/* Destinataires des leads */}
      <div style={card}>
        <SectionHeader icon="inbox" title="Destinataires des leads" desc="Chaque nouvelle demande reçue via le simulateur et le formulaire de contact sera envoyée à ces adresses." />

        <div style={{ display: 'flex', gap: 10, marginBottom: emails.length ? 16 : 0 }}>
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
            placeholder="email@exemple.be"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={addEmail} style={{ padding: '12px 22px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Ajouter
          </button>
        </div>

        {emails.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', background: '#FAFBFE', border: '1px dashed #E0E6EF', borderRadius: 10, fontSize: 13, color: '#9AA2B4' }}>
            Aucun destinataire configuré. Les leads ne seront envoyés à personne.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {emails.map((e) => (
              <div key={e} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', background: '#FAFBFE', border: '1px solid #EEF2F7', borderRadius: 10 }}>
                <span style={{ fontSize: 14, color: '#193B5E', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="inbox" size={15} color="#7CB8A8" />
                  {e}
                </span>
                <button onClick={() => removeEmail(e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E5484D', fontSize: 13, fontWeight: 600 }}>Retirer</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barre d'enregistrement */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={save} disabled={saving} style={{ padding: '13px 28px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
          {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </button>
        {msg && <span style={{ fontSize: 13.5, fontWeight: 600, color: msg.includes('✓') ? '#249E7C' : '#E5484D' }}>{msg}</span>}
      </div>

      {/* Recalcul des biens */}
      <div style={{ ...card, marginBottom: 0, borderColor: '#F0E4D0', background: '#FFFCF7' }}>
        <SectionHeader icon="settings" title="Recalculer les biens existants" desc="Les biens déjà publiés conservent la mensualité calculée à leur création. Recalculez tous les biens avec les paramètres actuels (pensez à enregistrer d'abord)." />

        {!recalcOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setRecalcOpen(true)} style={{ padding: '12px 24px', borderRadius: 10, background: '#fff', color: '#C77D2E', border: '1.5px solid #F0D9B5', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Recalculer tous les biens
            </button>
            {recalcMsg && <span style={{ fontSize: 13.5, fontWeight: 600, color: recalcMsg.includes('✓') ? '#249E7C' : '#E5484D' }}>{recalcMsg}</span>}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: '#193B5E', fontWeight: 600 }}>Confirmer le recalcul de tous les biens ?</span>
            <button onClick={recalculer} disabled={recalcLoading} style={{ padding: '10px 20px', borderRadius: 9, background: '#C77D2E', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: recalcLoading ? 'wait' : 'pointer' }}>
              {recalcLoading ? 'Recalcul...' : 'Oui, recalculer'}
            </button>
            <button onClick={() => setRecalcOpen(false)} style={{ padding: '10px 18px', borderRadius: 9, background: 'transparent', color: '#5A6275', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
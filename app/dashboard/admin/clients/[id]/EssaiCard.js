'use client'

import { useState } from 'react'
import { DatePicker } from '@/app/components/dashboard/DatePicker'

const STATUTS_ABONNE = ['active', 'trialing']

export function EssaiCard({ client }) {
  const estAbonne = client.subStatus && STATUTS_ABONNE.includes(client.subStatus)
  const dejaActif = client.trialEndsAt && new Date(client.trialEndsAt).getTime() > Date.now()

  const [date, setDate] = useState(
    client.trialEndsAt ? new Date(client.trialEndsAt).toISOString().slice(0, 10) : ''
  )
  const [widgets, setWidgets] = useState(client.widgetsGratuits ?? 0)
  const [actif, setActif] = useState(dejaActif)
  const [trialEndsAt, setTrialEndsAt] = useState(client.trialEndsAt)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Enregistre l'essai complet (date + widgets) — clients non abonnés
  async function enregistrer() {
    if (!date) { setMsg('Choisissez une date d\'expiration.'); return }
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/essai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id, trialEndsAt: date, widgetsGratuits: Number(widgets), actif: true }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Erreur.'); setSaving(false); return }
      setTrialEndsAt(data.client.trialEndsAt)
      setActif(true)
      setMsg('Essai enregistré ✓')
    } catch {
      setMsg('Erreur réseau.')
    }
    setSaving(false)
  }

  // Enregistre uniquement les widgets gratuits — clients abonnés
  async function enregistrerWidgets() {
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/essai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id, widgetsGratuits: Number(widgets), widgetsOnly: true }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Erreur.'); setSaving(false); return }
      setMsg('Widgets gratuits enregistrés ✓')
    } catch {
      setMsg('Erreur réseau.')
    }
    setSaving(false)
  }

  async function desactiver() {
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/essai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id, actif: false }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Erreur.'); setSaving(false); return }
      setTrialEndsAt(null)
      setActif(false)
      setDate('')
      setMsg('Essai désactivé.')
    } catch {
      setMsg('Erreur réseau.')
    }
    setSaving(false)
  }

  const labelStyle = { display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }
  const inputStyle = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14.5, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

  const todayISO = new Date().toISOString().slice(0, 10)

  // ── CLIENT ABONNÉ : on ne propose que les widgets gratuits ──
  if (estAbonne) {
    return (
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Widgets gratuits</h3>
        <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.5 }}>
          Ce client est déjà abonné, il a accès à la plateforme. Vous pouvez lui offrir des widgets gratuits.
        </p>

        <div style={{ background: 'rgba(124,184,168,0.1)', border: '1px solid rgba(124,184,168,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 12.5, color: '#1B7A5E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#249E7C' }} />
          Abonnement actif
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Widgets gratuits</label>
          <input type="number" min="0" value={widgets} onChange={(e) => setWidgets(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: 11.5, color: '#A9B0BE', margin: '7px 0 0', lineHeight: 1.45 }}>
            Crédits de widgets offerts (en plus de son abonnement).
          </p>
        </div>

        {msg && <div style={{ fontSize: 13, fontWeight: 600, color: msg.includes('✓') ? '#249E7C' : '#E5484D', marginBottom: 14 }}>{msg}</div>}

        <button onClick={enregistrerWidgets} disabled={saving} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#7CB8A8', color: '#0F2A22', border: 'none', fontSize: 14, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
          {saving ? 'Enregistrement...' : 'Enregistrer les widgets gratuits'}
        </button>
      </div>
    )
  }

  // ── CLIENT NON ABONNÉ : essai complet (date + widgets) ──
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: 0 }}>Essai gratuit</h3>
        {actif && trialEndsAt && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#249E7C', background: 'rgba(36,158,124,0.12)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#249E7C' }} />
            Actif
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 20px', lineHeight: 1.5 }}>
        Donne accès à l'encodage des biens, aux leads et à l'onglet widgets sans abonnement payant.
      </p>

      {actif && trialEndsAt && (
        <div style={{ background: 'rgba(36,158,124,0.08)', border: '1px solid rgba(36,158,124,0.2)', borderRadius: 10, padding: '11px 14px', marginBottom: 18, fontSize: 13, color: '#1B7A5E', fontWeight: 600 }}>
          Essai actif jusqu'au {new Date(trialEndsAt).toLocaleDateString('fr-BE')}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <DatePicker label="Date d'expiration" value={date} onChange={setDate} minDate={todayISO} placeholder="Choisir une date" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Widgets gratuits</label>
        <input type="number" min="0" value={widgets} onChange={(e) => setWidgets(e.target.value)} style={inputStyle} />
        <p style={{ fontSize: 11.5, color: '#A9B0BE', margin: '7px 0 0', lineHeight: 1.45 }}>
          Crédits de widgets offerts (conservés même après l'essai).
        </p>
      </div>

      {msg && <div style={{ fontSize: 13, fontWeight: 600, color: msg.includes('✓') ? '#249E7C' : (msg.includes('désactivé') ? '#8A92A6' : '#E5484D'), marginBottom: 14 }}>{msg}</div>}

      <button onClick={enregistrer} disabled={saving} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#7CB8A8', color: '#0F2A22', border: 'none', fontSize: 14, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', marginBottom: actif ? 9 : 0 }}>
        {saving ? 'Enregistrement...' : actif ? 'Mettre à jour' : 'Activer l\'essai'}
      </button>

      {actif && (
        <button onClick={desactiver} disabled={saving} style={{ width: '100%', padding: '11px', borderRadius: 10, background: 'transparent', color: '#E5484D', border: '1.5px solid #F5D0D0', fontSize: 13.5, fontWeight: 600, cursor: saving ? 'wait' : 'pointer' }}>
          Désactiver l'essai
        </button>
      )}
    </div>
  )
}
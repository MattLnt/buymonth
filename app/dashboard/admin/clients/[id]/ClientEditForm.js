'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormSelect } from '@/app/components/dashboard/FormSelect'

const FORMULES = [
  { value: 'PRO', label: 'BuyMonth Pro (39 €/bien)' },
  { value: 'PRO_PLUS', label: 'BuyMonth Pro+ (45 €/bien)' },
]

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

// Champ défini AU NIVEAU MODULE (pas dans le composant) — sinon il est recréé à chaque frappe et l'input perd le focus
function Champ({ label, k, type = 'text', placeholder, full, value, onChange }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(k, e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  )
}

export function ClientEditForm({ client }) {
  const router = useRouter()
  const [form, setForm] = useState({
    societe: client.societe || '',
    email: client.email || '',
    contactNom: client.contactNom || '',
    contactOpe: client.contactOpe || '',
    contactFacturation: client.contactFacturation || '',
    telephone: client.telephone || '',
    numeroTva: client.numeroTva || '',
    adresse: client.adresse || '',
    adresseAdmin: client.adresseAdmin || '',
    formule: client.formule || 'PRO',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.error || 'Erreur.' }); setSaving(false); return }
      setMsg({ type: 'ok', text: 'Modifications enregistrées.' })
      setSaving(false)
      router.refresh()
    } catch {
      setMsg({ type: 'err', text: 'Erreur réseau.' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, marginBottom: 22 }}>
      <style>{`
        @media (max-width: 600px){
          .champ-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: '0 0 18px' }}>Informations du promoteur</h3>

      {/* Identité */}
      <div className="champ-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <Champ label="Société" k="societe" placeholder="Nom de l'agence / promoteur" value={form.societe} onChange={setField} />
        <Champ label="Email de connexion" k="email" type="email" placeholder="contact@promoteur.be" value={form.email} onChange={setField} />
        <Champ label="N° TVA" k="numeroTva" placeholder="BE0123456789" value={form.numeroTva} onChange={setField} />
        <Champ label="Téléphone" k="telephone" placeholder="+32 ..." value={form.telephone} onChange={setField} />
      </div>

      {/* Contacts */}
      <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 18, marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Contacts</p>
        <div className="champ-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Champ label="Contact opérationnel / marketing" k="contactOpe" placeholder="Nom du contact" value={form.contactOpe} onChange={setField} />
          <Champ label="Contact facturation" k="contactFacturation" placeholder="Nom du contact" value={form.contactFacturation} onChange={setField} />
          <Champ label="Contact principal (affiché)" k="contactNom" placeholder="Nom du contact" full value={form.contactNom} onChange={setField} />
        </div>
      </div>

      {/* Adresses */}
      <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 18, marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Adresses</p>
        <div className="champ-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Champ label="Adresse" k="adresse" placeholder="Rue, n°, ville" value={form.adresse} onChange={setField} />
          <Champ label="Adresse administrative" k="adresseAdmin" placeholder="Siège / facturation" value={form.adresseAdmin} onChange={setField} />
        </div>
      </div>

      {/* Formule */}
      <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 18, marginBottom: 22 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Formule</p>
        <div style={{ maxWidth: 320 }}>
          <FormSelect value={form.formule} onChange={(v) => setField('formule', v)} options={FORMULES} />
        </div>
      </div>

      {msg && (
        <div style={{ marginBottom: 16, padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
          background: msg.type === 'ok' ? 'rgba(36,158,124,0.1)' : '#FEF2F2',
          border: `1px solid ${msg.type === 'ok' ? 'rgba(36,158,124,0.25)' : '#FECACA'}`,
          color: msg.type === 'ok' ? '#1B7A5E' : '#DC2626' }}>
          {msg.text}
        </div>
      )}

      <button type="submit" disabled={saving} style={{ padding: '12px 24px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: saving ? 'wait' : 'pointer' }}>
        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </form>
  )
}
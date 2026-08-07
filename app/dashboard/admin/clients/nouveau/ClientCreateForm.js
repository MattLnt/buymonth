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

export function ClientCreateForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    societe: '',
    email: '',
    password: '',
    contactNom: '',
    contactOpe: '',
    contactFacturation: '',
    telephone: '',
    numeroTva: '',
    adresse: '',
    adresseAdmin: '',
    formule: 'PRO',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const handle = (k) => (e) => setField(k, e.target.value)

  function genererMotDePasse() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let p = ''
    for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)]
    setField('password', p)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.societe.trim()) { setError('La société est obligatoire.'); return }
    if (!form.email.trim()) { setError("L'email de connexion est obligatoire."); return }
    if (form.password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur.'); setSaving(false); return }
      router.push(`/dashboard/admin/clients/${data.id}`)
      router.refresh()
    } catch {
      setError('Erreur réseau.'); setSaving(false)
    }
  }

  const Champ = ({ label, k, type = 'text', placeholder, full }) => (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={form[k]} onChange={handle(k)} placeholder={placeholder} style={inputStyle} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, maxWidth: 760 }}>
      {error && (
        <div style={{ marginBottom: 18, padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Identité + accès */}
      <p style={{ fontSize: 12, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Identité & accès</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <Champ label="Société *" k="societe" placeholder="Nom de l'agence / promoteur" />
        <Champ label="Email de connexion *" k="email" type="email" placeholder="contact@promoteur.be" />
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Mot de passe initial *</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="text" value={form.password} onChange={handle('password')} placeholder="Au moins 8 caractères" style={inputStyle} />
            <button type="button" onClick={genererMotDePasse} style={{ whiteSpace: 'nowrap', padding: '0 16px', borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#F2F5FA', color: '#193B5E', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Générer
            </button>
          </div>
          <p style={{ fontSize: 11.5, color: '#A9B0BE', margin: '7px 0 0' }}>Communiquez-le au promoteur ; il pourra le changer via « mot de passe oublié ».</p>
        </div>
      </div>

      {/* Contacts */}
      <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 18, marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Contacts</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Champ label="Contact opérationnel / marketing" k="contactOpe" placeholder="Nom du contact" />
          <Champ label="Contact facturation" k="contactFacturation" placeholder="Nom du contact" />
          <Champ label="Contact principal (affiché)" k="contactNom" placeholder="Nom du contact" full />
          <Champ label="Téléphone" k="telephone" placeholder="+32 ..." />
          <Champ label="N° TVA" k="numeroTva" placeholder="BE0123456789" />
        </div>
      </div>

      {/* Adresses */}
      <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 18, marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Adresses</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Champ label="Adresse" k="adresse" placeholder="Rue, n°, ville" />
          <Champ label="Adresse administrative" k="adresseAdmin" placeholder="Siège / facturation" />
        </div>
      </div>

      {/* Formule */}
      <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 18, marginBottom: 22 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Formule</p>
        <div style={{ maxWidth: 320 }}>
          <FormSelect value={form.formule} onChange={(v) => setField('formule', v)} options={FORMULES} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" disabled={saving} style={{ padding: '12px 24px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: saving ? 'wait' : 'pointer' }}>
          {saving ? 'Création...' : 'Créer le promoteur'}
        </button>
      </div>
    </form>
  )
}
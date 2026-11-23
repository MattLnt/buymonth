'use client'

import { useState } from 'react'
import { useLang } from '@/app/components/i18n/LangProvider'

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 15, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }
const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 28, marginBottom: 22 }

export function ProfilForm({ initial, email }) {
  const { t } = useLang()
  const [societe, setSociete] = useState(initial.societe || '')
  const [contactNom, setContactNom] = useState(initial.contactNom || '')
  const [telephone, setTelephone] = useState(initial.telephone || '')
  const [adresse, setAdresse] = useState(initial.adresse || '')
  const [numeroTva, setNumeroTva] = useState(initial.numeroTva || '')
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(false)

  async function uploadLogo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setMsg('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setLogoUrl(data.url)
      else { setMsgOk(false); setMsg(data.error || t('Échec de l’upload du logo.', 'Uploaden van het logo mislukt.')) }
    } catch {
      setMsgOk(false); setMsg(t('Erreur lors de l’upload.', 'Fout bij het uploaden.'))
    }
    setUploading(false)
  }

  async function save() {
    if (!societe.trim()) { setMsgOk(false); setMsg(t('Le nom de société est requis.', 'De bedrijfsnaam is verplicht.')); return }
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/client/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ societe, contactNom, telephone, adresse, numeroTva, logoUrl }),
      })
      const data = await res.json()
      if (!res.ok) { setMsgOk(false); setMsg(data.error || t('Erreur.', 'Fout.')); setSaving(false); return }
      setMsgOk(true); setMsg(t('Profil enregistré ✓', 'Profiel opgeslagen ✓'))
    } catch {
      setMsgOk(false); setMsg(t('Erreur réseau.', 'Netwerkfout.'))
    }
    setSaving(false)
  }

  return (
    <div>
      {/* Logo */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 20px' }}>{t('Logo de la société', 'Bedrijfslogo')}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 14, background: logoUrl ? `url(${logoUrl}) center/cover` : '#16324F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7CB8A8', fontWeight: 700, fontSize: 26, flexShrink: 0 }}>
            {!logoUrl && (societe?.[0]?.toUpperCase() || '?')}
          </div>
          <div>
            <label style={{ display: 'inline-block', padding: '10px 18px', borderRadius: 9, background: '#F2F5FA', color: '#193B5E', fontSize: 13.5, fontWeight: 600, cursor: uploading ? 'wait' : 'pointer' }}>
              {uploading ? t('Upload...', 'Uploaden...') : (logoUrl ? t('Changer le logo', 'Logo wijzigen') : t('Ajouter un logo', 'Logo toevoegen'))}
              <input type="file" accept="image/*" onChange={uploadLogo} disabled={uploading} style={{ display: 'none' }} />
            </label>
            {logoUrl && (
              <button onClick={() => setLogoUrl('')} style={{ marginLeft: 10, background: 'none', border: 'none', color: '#E5484D', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t('Retirer', 'Verwijderen')}</button>
            )}
          </div>
        </div>
      </div>

      {/* Infos société */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 22px' }}>{t('Informations', 'Gegevens')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          <div>
            <label style={labelStyle}>{t('Société *', 'Bedrijf *')}</label>
            <input value={societe} onChange={(e) => setSociete(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('Personne de contact', 'Contactpersoon')}</label>
            <input value={contactNom} onChange={(e) => setContactNom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('Téléphone', 'Telefoon')}</label>
            <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+32 ..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('Numéro de TVA', 'Btw-nummer')}</label>
            <input value={numeroTva} onChange={(e) => setNumeroTva(e.target.value)} placeholder="BE 0123.456.789" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>{t('Adresse', 'Adres')}</label>
            <input value={adresse} onChange={(e) => setAdresse(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>{t('Email de connexion', 'Login-e-mail')}</label>
            <input value={email} disabled style={{ ...inputStyle, background: '#F2F5FA', color: '#8A92A6', cursor: 'not-allowed' }} />
          </div>
        </div>
      </div>

      {/* Enregistrer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={save} disabled={saving} style={{ padding: '13px 28px', borderRadius: 10, background: '#7CB8A8', color: '#0F2A22', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
          {saving ? t('Enregistrement...', 'Opslaan...') : t('Enregistrer le profil', 'Profiel opslaan')}
        </button>
        {msg && <span style={{ fontSize: 13.5, fontWeight: 600, color: msgOk ? '#249E7C' : '#E5484D' }}>{msg}</span>}
      </div>
    </div>
  )
}
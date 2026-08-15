'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormSelect } from '@/app/components/dashboard/FormSelect'

const FORMULES = [
  { value: 'PRO', label: 'BuyMonth Pro (39 €/bien)' },
  { value: 'PRO_PLUS', label: 'BuyMonth Pro+ (45 €/bien)' },
]

const FORMULE_LABEL = { PRO: 'BuyMonth Pro', PRO_PLUS: 'BuyMonth Pro+' }
const FORMULE_PRIX = { PRO: '39 €/bien', PRO_PLUS: '45 €/bien' }

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

function SectionCard({ num, titre, sousTitre, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #193B5E, #1D4267)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{num}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#193B5E' }}>{titre}</div>
          {sousTitre && <div style={{ fontSize: 12.5, color: '#8A92A6', marginTop: 1 }}>{sousTitre}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

function RecapLigne({ label, value, vide }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: vide ? 'rgba(255,255,255,0.35)' : '#fff', textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

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

  const initiale = (form.societe.trim()[0] || '?').toUpperCase()

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        @media (max-width: 980px){
          .nouveau-promo-grid { grid-template-columns: 1fr !important; }
          .nouveau-promo-recap { position: static !important; }
        }
        @media (max-width: 600px){
          .champ-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {error && (
        <div style={{ marginBottom: 18, padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
          {error}
        </div>
      )}

      <div className="nouveau-promo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Colonne formulaire */}
        <div>
          <SectionCard num="1" titre="Identité & accès" sousTitre="Société et identifiants de connexion.">
            <div className="champ-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Champ label="Société *" k="societe" placeholder="Nom de l'agence / promoteur" full value={form.societe} onChange={setField} />
              <Champ label="Email de connexion *" k="email" type="email" placeholder="contact@promoteur.be" full value={form.email} onChange={setField} />
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Mot de passe initial *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="text" value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="Au moins 8 caractères" style={inputStyle} />
                  <button type="button" onClick={genererMotDePasse} style={{ whiteSpace: 'nowrap', padding: '0 16px', borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#F2F5FA', color: '#193B5E', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Générer
                  </button>
                </div>
                <p style={{ fontSize: 11.5, color: '#A9B0BE', margin: '7px 0 0' }}>Communiquez-le au promoteur ; il pourra le changer via « mot de passe oublié ».</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard num="2" titre="Contacts" sousTitre="Interlocuteurs opérationnels et facturation.">
            <div className="champ-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Champ label="Contact opérationnel / marketing" k="contactOpe" placeholder="Nom du contact" value={form.contactOpe} onChange={setField} />
              <Champ label="Contact facturation" k="contactFacturation" placeholder="Nom du contact" value={form.contactFacturation} onChange={setField} />
              <Champ label="Contact principal (affiché)" k="contactNom" placeholder="Nom du contact" full value={form.contactNom} onChange={setField} />
              <Champ label="Téléphone" k="telephone" placeholder="+32 ..." value={form.telephone} onChange={setField} />
              <Champ label="N° TVA" k="numeroTva" placeholder="BE0123456789" value={form.numeroTva} onChange={setField} />
            </div>
          </SectionCard>

          <SectionCard num="3" titre="Adresses" sousTitre="Adresse affichée et adresse administrative.">
            <div className="champ-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Champ label="Adresse" k="adresse" placeholder="Rue, n°, ville" value={form.adresse} onChange={setField} />
              <Champ label="Adresse administrative" k="adresseAdmin" placeholder="Siège / facturation" value={form.adresseAdmin} onChange={setField} />
            </div>
          </SectionCard>

          <SectionCard num="4" titre="Formule" sousTitre="Tarif appliqué par bien actif.">
            <div style={{ maxWidth: 360 }}>
              <FormSelect value={form.formule} onChange={(v) => setField('formule', v)} options={FORMULES} />
            </div>
          </SectionCard>
        </div>

        {/* Colonne récap sticky */}
        <div className="nouveau-promo-recap" style={{ position: 'sticky', top: 88 }}>
          <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 18px 44px rgba(25,59,94,0.18)' }}>
            {/* En-tête récap */}
            <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', padding: '24px 22px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Récapitulatif</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(124,184,168,0.22)', border: '1px solid rgba(124,184,168,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#A8D5C7', flexShrink: 0 }}>
                  {initiale}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', wordBreak: 'break-word' }}>
                    {form.societe.trim() || 'Nouveau promoteur'}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: 11.5, fontWeight: 700, color: '#A8D5C7', background: 'rgba(124,184,168,0.16)', padding: '3px 10px', borderRadius: 20 }}>
                    {FORMULE_LABEL[form.formule]} · {FORMULE_PRIX[form.formule]}
                  </div>
                </div>
              </div>
            </div>

            {/* Corps récap */}
            <div style={{ background: '#1B3B5A', padding: '6px 22px 20px' }}>
              <RecapLigne label="Email" value={form.email.trim() || 'À renseigner'} vide={!form.email.trim()} />
              <RecapLigne label="Mot de passe" value={form.password ? '••••••••' : 'À définir'} vide={!form.password} />
              <RecapLigne label="Contact principal" value={form.contactNom.trim() || '—'} vide={!form.contactNom.trim()} />
              <RecapLigne label="Contact facturation" value={form.contactFacturation.trim() || '—'} vide={!form.contactFacturation.trim()} />
              <RecapLigne label="Téléphone" value={form.telephone.trim() || '—'} vide={!form.telephone.trim()} />
              <RecapLigne label="N° TVA" value={form.numeroTva.trim() || '—'} vide={!form.numeroTva.trim()} />
              <RecapLigne label="Adresse" value={form.adresse.trim() || '—'} vide={!form.adresse.trim()} />

              <button type="submit" disabled={saving} style={{ width: '100%', marginTop: 18, padding: '13px 24px', borderRadius: 11, background: saving ? 'rgba(124,184,168,0.5)' : '#7CB8A8', color: '#0F2A40', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', transition: 'background 0.15s' }}>
                {saving ? 'Création...' : 'Créer le promoteur'}
              </button>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '10px 0 0' }}>
                Un compte et sa page agence seront créés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
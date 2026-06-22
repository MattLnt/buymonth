'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormSection } from './FormSection'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { AddressInput } from './AddressInput'
import { PhotoUploader } from './PhotoUploader'
import { FormRecap } from './FormRecap'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']

const ic = {
  pin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  euro: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>,
  photo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
  doc: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
}

export function BienForm({ initial = null, mode = 'create' }) {
  const router = useRouter()
  const [form, setForm] = useState({
    titre: initial?.titre || '',
    description: initial?.description || '',
    prixTotal: initial?.prixTotal || '',
    type: initial?.type || '',
    chambres: initial?.chambres || '',
    surface: initial?.surface || '',
    ville: initial?.ville || '',
    province: initial?.province || '',
    adresse: initial?.adresse || '',
    urlClient: initial?.urlClient || '',
    published: initial?.published !== false,
  })
  const [photos, setPhotos] = useState(initial?.images || [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const handle = (k) => (e) => setField(k, e.target.value)

  const isFormValid = form.titre && parseInt(form.prixTotal, 10) > 0

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isFormValid) { setError('Titre et prix valides requis.'); return }
    setLoading(true); setError('')

    try {
      const res = await fetch('/api/biens', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images: photos, ...(mode === 'edit' ? { id: initial.id } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur.'); setLoading(false); return }
      router.push('/dashboard/client/biens')
      router.refresh()
    } catch {
      setError('Erreur réseau.'); setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce bien définitivement ?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/biens?id=${initial.id}`, { method: 'DELETE' })
      if (res.ok) { router.push('/dashboard/client/biens'); router.refresh() }
      else setDeleting(false)
    } catch { setDeleting(false) }
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      <style>{`
        @media (max-width: 1024px) {
          .bien-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bien-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>

          {/* COLONNE PRINCIPALE */}
          <div>
            <FormSection icon={ic.doc} title="Informations générales" subtitle="Titre et description du bien">
              <div style={{ marginBottom: 16 }}>
                <FormInput label="Titre de l'annonce" name="titre" value={form.titre} onChange={handle('titre')} placeholder="Bel appartement neuf 2 chambres" required />
              </div>
              <FormInput label="Description" name="description" type="textarea" value={form.description} onChange={handle('description')} placeholder="Points forts, emplacement, particularités..." />
            </FormSection>

            <FormSection icon={ic.euro} title="Prix" subtitle="La mensualité est calculée automatiquement">
              <FormInput label="Prix total de vente" name="prixTotal" type="number" value={form.prixTotal} onChange={handle('prixTotal')} placeholder="215000" suffix="€" required min="0" />
            </FormSection>

            <FormSection icon={ic.home} title="Type & localisation" subtitle="Catégorie et adresse du bien">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <FormSelect label="Type" value={form.type} onChange={(v) => setField('type', v)} options={TYPES} />
                <FormSelect label="Province" value={form.province} onChange={(v) => setField('province', v)} options={PROVINCES} />
              </div>
              <AddressInput
                label="Adresse / Localisation"
                value={form.adresse}
                onChange={(v) => setField('adresse', v)}
                onSelect={({ adresse, ville, province }) => setForm((f) => ({ ...f, adresse, ville: ville || f.ville, province: province || f.province }))}
              />
              {form.ville && (
                <p style={{ fontSize: 12, color: '#7CB8A8', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  {form.ville}{form.province ? ` · ${form.province}` : ''}
                </p>
              )}
            </FormSection>

            <FormSection icon={ic.grid} title="Caractéristiques" subtitle="Surface et aménagements">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormInput label="Chambres" name="chambres" type="number" value={form.chambres} onChange={handle('chambres')} placeholder="2" min="0" />
                <FormInput label="Surface (m²)" name="surface" type="number" value={form.surface} onChange={handle('surface')} placeholder="85" min="0" />
              </div>
            </FormSection>

            <FormSection icon={ic.photo} title="Photos" subtitle="Images du bien (maximum 10)">
              <PhotoUploader photos={photos} setPhotos={setPhotos} uploading={uploading} setUploading={setUploading} setError={setError} />
            </FormSection>

            <FormSection icon={ic.doc} title="Lien externe" subtitle="Vers la fiche du bien sur votre site">
              <FormInput label="URL de l'annonce" name="urlClient" type="url" value={form.urlClient} onChange={handle('urlClient')} placeholder="https://votre-site.be/bien/123" />
            </FormSection>
          </div>

          {/* RÉCAP STICKY */}
          <FormRecap form={form} photos={photos} loading={loading} isFormValid={isFormValid} mode={mode} onDelete={handleDelete} deleting={deleting} />
        </div>
      </form>
    </div>
  )
}
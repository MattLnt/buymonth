'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormSection } from './FormSection'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { AddressInput } from './AddressInput'
import { PhotoUploader } from './PhotoUploader'
import { FormRecap } from './FormRecap'
import { ConfirmModal } from './ConfirmModal'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']
const PEB_CLASSES = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']

const STATUTS = [
  { value: 'ACTIF', label: 'Actif — en vente (facturé)' },
  { value: 'OPTION', label: 'Sous option (en ligne, facturé)' },
  { value: 'HORS_LIGNE', label: 'Hors-ligne (hors décompte)' },
  { value: 'VENDU', label: 'Vendu (hors décompte)' },
]

// Valeur spéciale du select pour déclencher la saisie d'un nouveau projet
const NOUVEAU = '__nouveau__'

const ic = {
  pin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  euro: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>,
  photo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
  doc: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  tag: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
  layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
}

export function BienForm({ initial = null, mode = 'create', projets = [] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    projet: initial?.projet || 'Hors projet',
    unite: initial?.unite || '',
    titre: initial?.titre || '',
    description: initial?.description || '',
    type: initial?.type || '',
    prixTotal: initial?.prixTotal || '',
    chambres: initial?.chambres || '',
    sallesDeBain: initial?.sallesDeBain || '',
    surface: initial?.surface || '',
    terrasse: initial?.terrasse || '',
    jardin: initial?.jardin || '',
    ville: initial?.ville || '',
    province: initial?.province || '',
    adresse: initial?.adresse || '',
    urlClient: initial?.urlClient || '',
    pebNumero: initial?.pebNumero || '',
    pebClasse: initial?.pebClasse || '',
    pebKwh: initial?.pebKwh || '',
    statut: initial?.statut || 'ACTIF',
    published: initial?.published !== false,
  })
  const [photos, setPhotos] = useState(initial?.images || [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Liste des projets existants (hors "Hors projet"), sans doublon
  const projetsExistants = [...new Set(projets.filter((p) => p && p !== 'Hors projet'))]

  // Mode "nouveau projet" : actif si le projet courant n'est ni "Hors projet" ni dans la liste existante
  const [nouveauProjet, setNouveauProjet] = useState(
    !!form.projet && form.projet !== 'Hors projet' && !projetsExistants.includes(form.projet)
  )

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const handle = (k) => (e) => setField(k, e.target.value)

  // Valeur affichée dans le select : soit le projet courant, soit l'option "nouveau"
  const selectValue = nouveauProjet ? NOUVEAU : form.projet

  function onSelectProjet(v) {
    if (v === NOUVEAU) {
      setNouveauProjet(true)
      setField('projet', '') // on vide pour laisser saisir
    } else {
      setNouveauProjet(false)
      setField('projet', v)
    }
  }

  const isFormValid = form.titre && parseInt(form.prixTotal, 10) > 0
  const estVisible = form.statut === 'ACTIF' || form.statut === 'OPTION'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isFormValid) { setError('Titre et prix valides requis.'); return }
    // Au moins une photo obligatoire pour un bien visible en ligne
    if (estVisible && photos.length === 0) {
      setError('Ajoutez au moins une photo pour mettre ce bien en ligne.')
      return
    }
    // Si "nouveau projet" activé mais champ vide, on retombe sur "Hors projet"
    const projetFinal = nouveauProjet && !form.projet.trim() ? 'Hors projet' : (form.projet.trim() || 'Hors projet')

    setLoading(true); setError('')

    try {
      const res = await fetch('/api/biens', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projet: projetFinal, images: photos, ...(mode === 'edit' ? { id: initial.id } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur.'); setLoading(false); return }
      router.push('/dashboard/client/biens')
      router.refresh()
    } catch {
      setError('Erreur réseau.'); setLoading(false)
    }
  }

  async function confirmerSuppression() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/biens?id=${initial.id}`, { method: 'DELETE' })
      if (res.ok) { router.push('/dashboard/client/biens'); router.refresh() }
      else setDeleting(false)
    } catch { setDeleting(false) }
  }

  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }
  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

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
            <FormSection icon={ic.layers} title="Projet & unité" subtitle="Rattachez ce bien à un programme (facultatif)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <FormSelect
                    label="Projet"
                    value={selectValue}
                    onChange={onSelectProjet}
                    options={[
                      { value: 'Hors projet', label: 'Hors projet' },
                      ...projetsExistants.map((p) => ({ value: p, label: p })),
                      { value: NOUVEAU, label: '+ Nouveau projet…' },
                    ]}
                  />
                  {nouveauProjet && (
                    <input
                      value={form.projet}
                      onChange={handle('projet')}
                      placeholder="Nom du nouveau programme"
                      autoFocus
                      style={{ ...inputStyle, marginTop: 8 }}
                    />
                  )}
                </div>
                <FormInput label="Unité" name="unite" value={form.unite} onChange={handle('unite')} placeholder="B2.03" />
              </div>
            </FormSection>

            <FormSection icon={ic.doc} title="Informations générales" subtitle="Titre, type et description du bien">
              <div style={{ marginBottom: 16 }}>
                <FormInput label="Titre de l'annonce" name="titre" value={form.titre} onChange={handle('titre')} placeholder="Bel appartement neuf 2 chambres" required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <FormSelect label="Type de bien" value={form.type} onChange={(v) => setField('type', v)} options={TYPES} placeholder="Sélectionner un type" />
              </div>
              <FormInput label="Description" name="description" type="textarea" value={form.description} onChange={handle('description')} placeholder="Points forts, emplacement, particularités..." />
            </FormSection>

            <FormSection icon={ic.euro} title="Prix" subtitle="La mensualité est calculée automatiquement">
              <FormInput label="Prix du bien" name="prixTotal" type="number" value={form.prixTotal} onChange={handle('prixTotal')} placeholder="215000" suffix="€" required min="0" />
            </FormSection>

            <FormSection icon={ic.pin} title="Localisation" subtitle="Adresse et province du bien">
              <div style={{ marginBottom: 16 }}>
                <FormSelect label="Province" value={form.province} onChange={(v) => setField('province', v)} options={PROVINCES} placeholder="Sélectionner une province" />
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <FormInput label="Chambres" name="chambres" type="number" value={form.chambres} onChange={handle('chambres')} placeholder="2" min="0" />
                <FormInput label="Salles de bain" name="sallesDeBain" type="number" value={form.sallesDeBain} onChange={handle('sallesDeBain')} placeholder="1" min="0" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FormInput label="Surface (m²)" name="surface" type="number" value={form.surface} onChange={handle('surface')} placeholder="85" min="0" />
                <FormInput label="Terrasse (m²)" name="terrasse" type="number" value={form.terrasse} onChange={handle('terrasse')} placeholder="12" min="0" />
                <FormInput label="Jardin (m²)" name="jardin" type="number" value={form.jardin} onChange={handle('jardin')} placeholder="0" min="0" />
              </div>
            </FormSection>

            <FormSection icon={ic.zap} title="Performance énergétique (PEB)" subtitle="Facultatif">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FormInput label="N° de PEB" name="pebNumero" value={form.pebNumero} onChange={handle('pebNumero')} placeholder="20230000123456" />
                <FormSelect label="Classe PEB" value={form.pebClasse} onChange={(v) => setField('pebClasse', v)}
                  options={[{ value: '', label: 'Non renseigné' }, ...PEB_CLASSES.map((c) => ({ value: c, label: c }))]} />
                <FormInput label="Consommation (kWh/an)" name="pebKwh" value={form.pebKwh} onChange={handle('pebKwh')} placeholder="145" />
              </div>
            </FormSection>

            <FormSection icon={ic.tag} title="Statut & visibilité" subtitle="Le statut détermine si le bien est facturé">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <FormSelect
                  label="Statut du bien"
                  value={form.statut}
                  onChange={(v) => setField('statut', v)}
                  options={STATUTS}
                />
                {estVisible ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(124,184,168,0.12)', border: '1.5px solid rgba(124,184,168,0.4)', borderRadius: 10, padding: '12px 14px' }}>
                    <span style={{ flexShrink: 0, display: 'flex', color: '#249E7C', marginTop: 1 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                    </span>
                    <p style={{ fontSize: 13, color: '#1C6B52', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                      Ce bien sera <strong>compté dans votre abonnement</strong> — facturé au tarif de votre formule, par bien actif et au prorata. Un bien mis hors-ligne ou vendu en sort automatiquement.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#F5F7FA', border: '1.5px solid #E8EDF2', borderRadius: 10, padding: '12px 14px' }}>
                    <span style={{ flexShrink: 0, display: 'flex', color: '#8A92A6', marginTop: 1 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    </span>
                    <p style={{ fontSize: 13, color: '#5A6B7D', margin: 0, lineHeight: 1.5 }}>
                      Ce bien <strong style={{ color: '#193B5E' }}>n'est pas compté</strong> dans votre abonnement. Il n'apparaît pas au public tant qu'il reste dans ce statut.
                    </p>
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection icon={ic.photo} title="Photos" subtitle="Au moins une photo pour publier (10 max)">
              <PhotoUploader photos={photos} setPhotos={setPhotos} uploading={uploading} setUploading={setUploading} setError={setError} />
            </FormSection>

            <FormSection icon={ic.doc} title="Lien externe" subtitle="Vers la fiche du bien sur votre site">
              <FormInput label="URL de l'annonce" name="urlClient" type="url" value={form.urlClient} onChange={handle('urlClient')} placeholder="https://votre-site.be/bien/123" />
            </FormSection>
          </div>

          {/* RÉCAP STICKY */}
          <FormRecap form={form} photos={photos} loading={loading} isFormValid={isFormValid} mode={mode} onDelete={() => setConfirmOpen(true)} deleting={deleting} />
        </div>
      </form>

      {/* Modale de confirmation premium (remplace le confirm() natif) */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmerSuppression}
        loading={deleting}
        title="Supprimer ce bien ?"
        confirmLabel="Supprimer le bien"
        message={
          <>
            {initial?.titre ? <>Le bien <strong style={{ color: '#193B5E' }}>{initial.titre}</strong> sera définitivement supprimé. </> : 'Ce bien sera définitivement supprimé. '}
            Cette action est irréversible.
          </>
        }
      />
    </div>
  )
}
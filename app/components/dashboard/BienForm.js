'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormSection } from './FormSection'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { AddressInput } from './AddressInput'
import { PhotoUploader } from './PhotoUploader'
import { FormRecap } from './FormRecap'
import { ConfirmModal } from './ConfirmModal'
import { libelleChampPrix, libellePrixPublic } from '@/lib/regime'
import { libelleType, libelleProvince, libelleStatutBien } from './libelles'
import { useLang } from '@/app/components/i18n/LangProvider'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']
const PEB_CLASSES = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']

const statuts = (t) => [
  { value: 'ACTIF', label: t('Actif — en vente (facturé)', 'Actief — te koop (gefactureerd)') },
  { value: 'OPTION', label: t('Sous option (en ligne, facturé)', 'In optie (online, gefactureerd)') },
  { value: 'HORS_LIGNE', label: t('Hors-ligne (hors décompte)', 'Offline (niet meegeteld)') },
  { value: 'VENDU', label: t('Vendu (hors décompte)', 'Verkocht (niet meegeteld)') },
]

// Couleur + libellé court par statut de bien
const STATUT_STYLE = {
  ACTIF: { c: '#1C6B52', bg: 'rgba(36,158,124,0.14)', dot: '#249E7C', court: 'Actif' },
  OPTION: { c: '#8A6D1B', bg: 'rgba(232,153,35,0.16)', dot: '#E89923', court: 'Sous option' },
  HORS_LIGNE: { c: '#5A6B7D', bg: '#EEF1F5', dot: '#8A92A6', court: 'Hors-ligne' },
  VENDU: { c: '#193B5E', bg: 'rgba(25,59,94,0.10)', dot: '#193B5E', court: 'Vendu' },
}

// Régime fiscal : deux temps (TVA / droits d'enregistrement, puis 21 % / 6 %) en boutons côte à côte.
// Le libellé du champ prix s'adapte ; le promoteur n'encode jamais de montant TVAC.
function RegimeSelect({ value, onChange }) {
  const { t } = useLang()
  const soumisTva = value === 'TVA_21' || value === 'TVA_6'
  const famille = soumisTva ? 'TVA' : value === 'ENREGISTREMENT' ? 'ENREGISTREMENT' : ''

  const btn = (actif) => ({
    flex: 1, padding: '11px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
    border: `1.5px solid ${actif ? '#193B5E' : '#E8EDF2'}`,
    background: actif ? '#193B5E' : '#FAFDFD', color: actif ? '#fff' : '#5A6B7D',
    transition: 'all 0.15s ease',
  })
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }

  return (
    <div>
      <label style={labelStyle}>{t('Régime fiscal du bien', 'Fiscaal regime van het pand')} <span style={{ color: '#7CB8A8' }}>*</span></label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" style={btn(famille === 'TVA')} onClick={() => onChange('TVA_21')}>{t('Bien soumis à la TVA', 'Pand onderworpen aan btw')}</button>
        <button type="button" style={btn(famille === 'ENREGISTREMENT')} onClick={() => onChange('ENREGISTREMENT')}>{t("Bien soumis aux droits d'enregistrement", 'Pand onderworpen aan registratierechten')}</button>
      </div>
      {famille === 'TVA' && (
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="button" style={btn(value === 'TVA_21')} onClick={() => onChange('TVA_21')}>{t('TVA 21 %', 'btw 21 %')}</button>
          <button type="button" style={btn(value === 'TVA_6')} onClick={() => onChange('TVA_6')}>{t('TVA 6 % — démolition-reconstruction', 'btw 6 % — afbraak en heropbouw')}</button>
        </div>
      )}
      <p style={{ fontSize: 12, color: '#8A92A6', margin: '10px 0 0', lineHeight: 1.5 }}>
        {famille === 'TVA'
          ? t('Vous encodez le prix hors TVA. La plateforme calcule le prix TVA comprise et la mensualité dessus.', 'U voert de prijs excl. btw in. Het platform berekent de prijs incl. btw en het maandbedrag daarop.')
          : famille === 'ENREGISTREMENT'
            ? t('Vous encodez le prix de vente. Les droits d\'enregistrement et frais de notaire restent hors calcul.', 'U voert de verkoopprijs in. Registratierechten en notariskosten blijven buiten de berekening.')
            : t('Ce choix détermine le calcul de la mensualité indicative affichée. Vous déclarez l\'exactitude de cette information.', 'Deze keuze bepaalt de berekening van het getoonde indicatieve maandbedrag. U verklaart dat deze informatie juist is.')}
      </p>
    </div>
  )
}

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

// Dropdown custom du statut avec pastilles colorées — menu absolu sous le bouton
function StatutSelect({ value, onChange }) {
  const { lang, t } = useLang()
  const STATUTS = statuts(t)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const cur = STATUT_STYLE[value] || STATUT_STYLE.ACTIF

  useEffect(() => {
    if (!open) return
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{t('Statut du bien', 'Status van het pand')}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2',
          background: '#FAFDFD', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: cur.c, outline: 'none',
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: cur.dot, flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{STATUTS.find((s) => s.value === value)?.label || libelleStatutBien(value, lang)}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A92A6" strokeWidth="2.5" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1px solid #EEF2F7', borderRadius: 12, boxShadow: '0 12px 32px rgba(25,59,94,0.16)', padding: 5, overflow: 'hidden' }}>
          {STATUTS.map((s) => {
            const st = STATUT_STYLE[s.value]
            const actif = s.value === value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => { onChange(s.value); setOpen(false) }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none',
                  background: actif ? '#F5F8FB' : 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: actif ? 700 : 500, color: '#3D4759',
                }}
                onMouseEnter={(e) => { if (!actif) e.currentTarget.style.background = '#FAFBFE' }}
                onMouseLeave={(e) => { if (!actif) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.c, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot }} />
                  {libelleStatutBien(s.value, lang)}
                </span>
                {actif && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="3" style={{ marginLeft: 'auto', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function BienForm({ initial = null, mode = 'create', projets = [], cfg = null }) {
  const router = useRouter()
  const { lang, t } = useLang()
  const [form, setForm] = useState({
    projet: initial?.projet || 'Hors projet',
    unite: initial?.unite || '',
    titre: initial?.titre || '',
    description: initial?.description || '',
    type: initial?.type || '',
    prixTotal: initial?.prixTotal || '',
    regime: initial?.regime || '',
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

  const isFormValid = form.titre && parseInt(form.prixTotal, 10) > 0 && !!form.regime
  const estVisible = form.statut === 'ACTIF' || form.statut === 'OPTION'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isFormValid) { setError(form.regime ? t('Titre et prix valides requis.', 'Geldige titel en prijs vereist.') : t('Choisissez le régime fiscal du bien.', 'Kies het fiscaal regime van het pand.')); return }
    // Au moins une photo obligatoire pour un bien visible en ligne
    if (estVisible && photos.length === 0) {
      setError(t('Ajoutez au moins une photo pour mettre ce bien en ligne.', 'Voeg minstens één foto toe om dit pand online te zetten.'))
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
      if (!res.ok) { setError(data.error || t('Erreur.', 'Fout.')); setLoading(false); return }
      router.push('/dashboard/client/biens')
      router.refresh()
    } catch {
      setError(t('Erreur réseau.', 'Netwerkfout.')); setLoading(false)
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
        @media (max-width: 600px) {
          .bf-grid { grid-template-columns: 1fr !important; }
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
            <FormSection icon={ic.layers} title={t('Projet & unité', 'Project & unit')} subtitle={t('Rattachez ce bien à un programme (facultatif)', 'Koppel dit pand aan een project (optioneel)')}>
              <div className="bf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <FormSelect
                    label={t('Projet', 'Project')}
                    value={selectValue}
                    onChange={onSelectProjet}
                    options={[
                      { value: 'Hors projet', label: t('Hors projet', 'Geen project') },
                      ...projetsExistants.map((p) => ({ value: p, label: p })),
                      { value: NOUVEAU, label: t('+ Nouveau projet…', '+ Nieuw project…') },
                    ]}
                  />
                  {nouveauProjet && (
                    <input
                      value={form.projet}
                      onChange={handle('projet')}
                      placeholder={t('Nom du nouveau programme', 'Naam van het nieuwe project')}
                      autoFocus
                      style={{ ...inputStyle, marginTop: 8 }}
                    />
                  )}
                </div>
                <FormInput label={t('Unité', 'Unit')} name="unite" value={form.unite} onChange={handle('unite')} placeholder="B2.03" />
              </div>
            </FormSection>

            <FormSection icon={ic.doc} title={t('Informations générales', 'Algemene informatie')} subtitle={t('Titre, type et description du bien', 'Titel, type en beschrijving van het pand')}>
              <div style={{ marginBottom: 16 }}>
                <FormInput label={t("Titre de l'annonce", 'Titel van de advertentie')} name="titre" value={form.titre} onChange={handle('titre')} placeholder={t('Bel appartement neuf 2 chambres', 'Mooi nieuwbouwappartement met 2 slaapkamers')} required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <FormSelect label={t('Type de bien', 'Type pand')} value={form.type} onChange={(v) => setField('type', v)} options={TYPES.map((x) => ({ value: x, label: libelleType(x, lang) }))} placeholder={t('Sélectionner un type', 'Selecteer een type')} />
              </div>
              <FormInput label="Description" name="description" type="textarea" value={form.description} onChange={handle('description')} placeholder={t('Points forts, emplacement, particularités...', 'Troeven, ligging, bijzonderheden...')} />
            </FormSection>

            <FormSection icon={ic.euro} title={t('Prix & régime fiscal', 'Prijs & fiscaal regime')} subtitle={t('La mensualité est calculée automatiquement sur le prix TVA comprise', 'Het maandbedrag wordt automatisch berekend op de prijs incl. btw')}>
              <div style={{ marginBottom: 16 }}>
                <RegimeSelect value={form.regime} onChange={(v) => setField('regime', v)} />
              </div>
              <FormInput label={libelleChampPrix(form.regime, lang)} name="prixTotal" type="number" value={form.prixTotal} onChange={handle('prixTotal')} placeholder="250000" suffix="€" required min="0" />
              {form.regime && parseInt(form.prixTotal, 10) > 0 && (
                <p style={{ fontSize: 12.5, color: '#5A6B7D', margin: '10px 0 0' }}>
                  {t('Prix affiché au public :', 'Prijs zichtbaar voor het publiek:')} <strong style={{ color: '#193B5E' }}>{libellePrixPublic(parseInt(form.prixTotal, 10), form.regime, lang)}</strong>
                </p>
              )}
            </FormSection>

            <FormSection icon={ic.pin} title={t('Localisation', 'Ligging')} subtitle={t('Adresse et province du bien', 'Adres en provincie van het pand')}>
              <div style={{ marginBottom: 16 }}>
                <FormSelect label={t('Province', 'Provincie')} value={form.province} onChange={(v) => setField('province', v)} options={PROVINCES.map((x) => ({ value: x, label: libelleProvince(x, lang) }))} placeholder={t('Sélectionner une province', 'Selecteer een provincie')} />
              </div>
              <AddressInput
                label={t('Adresse / Localisation', 'Adres / ligging')}
                value={form.adresse}
                onChange={(v) => setField('adresse', v)}
                onSelect={({ adresse, ville, province }) => setForm((f) => ({ ...f, adresse, ville: ville || f.ville, province: province || f.province }))}
              />
              {form.ville && (
                <p style={{ fontSize: 12, color: '#7CB8A8', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  {form.ville}{form.province ? ` · ${libelleProvince(form.province, lang)}` : ''}
                </p>
              )}
            </FormSection>

            <FormSection icon={ic.grid} title={t('Caractéristiques', 'Kenmerken')} subtitle={t('Surface et aménagements', 'Oppervlakte en voorzieningen')}>
              <div className="bf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <FormInput label={t('Chambres', 'Slaapkamers')} name="chambres" type="number" value={form.chambres} onChange={handle('chambres')} placeholder="2" min="0" />
                <FormInput label={t('Salles de bain', 'Badkamers')} name="sallesDeBain" type="number" value={form.sallesDeBain} onChange={handle('sallesDeBain')} placeholder="1" min="0" />
              </div>
              <div className="bf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FormInput label={t('Surface (m²)', 'Oppervlakte (m²)')} name="surface" type="number" value={form.surface} onChange={handle('surface')} placeholder="85" min="0" />
                <FormInput label={t('Terrasse (m²)', 'Terras (m²)')} name="terrasse" type="number" value={form.terrasse} onChange={handle('terrasse')} placeholder="12" min="0" />
                <FormInput label={t('Jardin (m²)', 'Tuin (m²)')} name="jardin" type="number" value={form.jardin} onChange={handle('jardin')} placeholder="0" min="0" />
              </div>
            </FormSection>

            <FormSection icon={ic.zap} title={t('Performance énergétique (PEB)', 'Energieprestatie (EPC)')} subtitle={t('Facultatif', 'Optioneel')}>
              <div className="bf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FormInput label={t('N° de PEB', 'EPC-nummer')} name="pebNumero" value={form.pebNumero} onChange={handle('pebNumero')} placeholder="20230000123456" />
                <FormSelect label={t('Classe PEB', 'EPC-klasse')} value={form.pebClasse} onChange={(v) => setField('pebClasse', v)}
                  options={[{ value: '', label: t('Non renseigné', 'Niet ingevuld') }, ...PEB_CLASSES.map((c) => ({ value: c, label: c }))]} />
                <FormInput label={t('Consommation (kWh/an)', 'Verbruik (kWh/jaar)')} name="pebKwh" value={form.pebKwh} onChange={handle('pebKwh')} placeholder="145" />
              </div>
            </FormSection>

            <FormSection icon={ic.tag} title={t('Statut & visibilité', 'Status & zichtbaarheid')} subtitle={t('Le statut détermine si le bien est facturé', 'De status bepaalt of het pand gefactureerd wordt')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <StatutSelect value={form.statut} onChange={(v) => setField('statut', v)} />
                {(() => {
                  const st = STATUT_STYLE[form.statut] || STATUT_STYLE.ACTIF
                  const messages = lang === 'nl' ? {
                    ACTIF: <>Dit pand wordt <strong>meegeteld in uw abonnement</strong> — gefactureerd aan het tarief van uw formule, per actief pand en pro rata. Een pand dat offline wordt gezet of verkocht is, valt er automatisch uit.</>,
                    OPTION: <>Dit pand blijft <strong>online zichtbaar en meegeteld</strong> in uw abonnement. Op de fiche en in de catalogus verschijnt een banner “In optie”.</>,
                    HORS_LIGNE: <>Dit pand wordt <strong>niet meegeteld</strong> in uw abonnement en is niet zichtbaar voor het publiek zolang het offline staat.</>,
                    VENDU: <>Dit pand is gemarkeerd als <strong>verkocht</strong>: het valt buiten de facturatie en is niet meer zichtbaar voor het publiek.</>,
                  } : {
                    ACTIF: <>Ce bien sera <strong>compté dans votre abonnement</strong> — facturé au tarif de votre formule, par bien actif et au prorata. Un bien mis hors-ligne ou vendu en sort automatiquement.</>,
                    OPTION: <>Ce bien reste <strong>visible en ligne et compté</strong> dans votre abonnement. Un bandeau « Sous option » s'affiche sur la fiche et le catalogue.</>,
                    HORS_LIGNE: <>Ce bien <strong>n'est pas compté</strong> dans votre abonnement et n'apparaît pas au public tant qu'il reste hors-ligne.</>,
                    VENDU: <>Ce bien est marqué <strong>vendu</strong> : il sort du décompte de facturation et n'est plus visible au public.</>,
                  }
                  return (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: st.bg, border: `1.5px solid ${st.c}33`, borderRadius: 10, padding: '12px 14px' }}>
                      <span style={{ flexShrink: 0, display: 'flex', color: st.dot, marginTop: 1 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                      </span>
                      <p style={{ fontSize: 13, color: st.c, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                        {messages[form.statut]}
                      </p>
                    </div>
                  )
                })()}
              </div>
            </FormSection>

            <FormSection icon={ic.photo} title={t('Photos', "Foto's")} subtitle={t('Au moins une photo pour publier (10 max)', 'Minstens één foto om te publiceren (max. 10)')}>
              <PhotoUploader photos={photos} setPhotos={setPhotos} uploading={uploading} setUploading={setUploading} setError={setError} />
            </FormSection>

            <FormSection icon={ic.doc} title={t('Lien externe', 'Externe link')} subtitle={t('Vers la fiche du bien sur votre site', 'Naar de fiche van het pand op uw website')}>
              <FormInput label={t("URL de l'annonce", 'URL van de advertentie')} name="urlClient" type="url" value={form.urlClient} onChange={handle('urlClient')} placeholder={t('https://votre-site.be/bien/123', 'https://uw-website.be/pand/123')} />
            </FormSection>
          </div>

          {/* RÉCAP STICKY */}
          <FormRecap form={form} cfg={cfg} photos={photos} loading={loading} isFormValid={isFormValid} mode={mode} onDelete={() => setConfirmOpen(true)} deleting={deleting} />
        </div>
      </form>

      {/* Modale de confirmation premium (remplace le confirm() natif) */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmerSuppression}
        loading={deleting}
        title={t('Supprimer ce bien ?', 'Dit pand verwijderen?')}
        confirmLabel={t('Supprimer le bien', 'Pand verwijderen')}
        message={
          lang === 'nl' ? (
            <>
              {initial?.titre ? <>Het pand <strong style={{ color: '#193B5E' }}>{initial.titre}</strong> wordt definitief verwijderd. </> : 'Dit pand wordt definitief verwijderd. '}
              Deze actie kan niet ongedaan worden gemaakt.
            </>
          ) : (
            <>
              {initial?.titre ? <>Le bien <strong style={{ color: '#193B5E' }}>{initial.titre}</strong> sera définitivement supprimé. </> : 'Ce bien sera définitivement supprimé. '}
              Cette action est irréversible.
            </>
          )
        }
      />
    </div>
  )
}
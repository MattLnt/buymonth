'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { FormSelect } from '@/app/components/dashboard/FormSelect'
import { BienPublicCard } from '@/app/components/public/BienPublicCard'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

// Détecte un bien "neuf" sans moteur fiscal (Phase 2) : simple heuristique d'affichage sur type/titre/description.
function estNeuf(b) {
  const hay = `${b.type || ''} ${b.titre || ''} ${b.description || ''}`.toLowerCase()
  return hay.includes('neuf') || hay.includes('nouvelle construction') || hay.includes('sur plan')
}

export function BiensExplorer({ biens }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [province, setProvince] = useState('')
  const [ville, setVille] = useState('')
  const [minM, setMinM] = useState('')
  const [maxM, setMaxM] = useState('')
  const [chambres, setChambres] = useState(0)
  const [sdb, setSdb] = useState(0)
  const [surfaceMin, setSurfaceMin] = useState('')
  const [terrasse, setTerrasse] = useState(false)
  const [jardin, setJardin] = useState(false)
  const [neuf, setNeuf] = useState('') // '' | 'neuf' | 'existant'

  // autocomplete recherche libre (titre / mot-clé)
  const [showSug, setShowSug] = useState(false)
  const sugRef = useRef(null)

  // Bascule mobile + panneau de filtres repliable (style Airbnb)
  const [isMobile, setIsMobile] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Verrouille le scroll du body + ferme à Échap quand le sheet est ouvert
  useEffect(() => {
    if (!sheetOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setSheetOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [sheetOpen])

  // Villes disponibles, dépendantes de la province sélectionnée
  const villesDispo = useMemo(() => {
    const set = new Set()
    biens.forEach((b) => {
      if (province && b.province !== province) return
      if (b.ville) set.add(b.ville)
    })
    return [...set].sort((a, b) => a.localeCompare(b, 'fr'))
  }, [biens, province])

  // Si on change de province et que la ville choisie n'y est plus, on la réinitialise
  useEffect(() => {
    if (ville && !villesDispo.includes(ville)) setVille('')
  }, [villesDispo, ville])

  // Suggestions de recherche libre
  const suggestions = useMemo(() => {
    const v = q.trim().toLowerCase()
    if (!v) return []
    const set = new Set()
    biens.forEach((b) => {
      if (b.ville && b.ville.toLowerCase().includes(v)) set.add(b.ville)
      if (b.titre && b.titre.toLowerCase().includes(v)) set.add(b.titre)
    })
    return [...set].slice(0, 6)
  }, [q, biens])

  useEffect(() => {
    function onClick(e) {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Filtrage instantané en mémoire
  const filtered = useMemo(() => {
    const qLow = q.trim().toLowerCase()
    const minV = minM ? parseInt(minM, 10) : null
    const maxV = maxM ? parseInt(maxM, 10) : null
    const surfV = surfaceMin ? parseInt(surfaceMin, 10) : null

    return biens.filter((b) => {
      if (type && b.type !== type) return false
      if (province && b.province !== province) return false
      if (ville && b.ville !== ville) return false
      if (chambres && (b.chambres || 0) < chambres) return false
      if (sdb && (b.sallesDeBain || 0) < sdb) return false
      if (surfV && (b.surface || 0) < surfV) return false
      if (terrasse && !(b.terrasse && b.terrasse > 0)) return false
      if (jardin && !(b.jardin && b.jardin > 0)) return false
      if (neuf === 'neuf' && !estNeuf(b)) return false
      if (neuf === 'existant' && estNeuf(b)) return false
      if (minV && (b.mensualite || 0) < minV) return false
      if (maxV && (b.mensualite || 0) > maxV) return false
      if (qLow) {
        const hay = `${b.titre || ''} ${b.ville || ''} ${b.description || ''}`.toLowerCase()
        if (!hay.includes(qLow)) return false
      }
      return true
    })
  }, [biens, q, type, province, ville, minM, maxM, chambres, sdb, surfaceMin, terrasse, jardin, neuf])

  const hasFilters = q || type || province || ville || minM || maxM || chambres || sdb || surfaceMin || terrasse || jardin || neuf
  const activeCount = [q, type, province, ville, minM, maxM, surfaceMin, chambres > 0, sdb > 0, terrasse, jardin, neuf].filter(Boolean).length

  function reset() {
    setQ(''); setType(''); setProvince(''); setVille(''); setMinM(''); setMaxM('')
    setChambres(0); setSdb(0); setSurfaceMin(''); setTerrasse(false); setJardin(false); setNeuf('')
  }

  const compteur = (val, dec, inc) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={dec} style={{ width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>−</button>
      <div style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 10, background: '#FAFDFD', border: '1.5px solid #E8EDF2', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{val || 'Indifférent'}</div>
      <button onClick={inc} style={{ width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>+</button>
    </div>
  )

  // ————— Champs de filtre, réutilisés dans la sidebar desktop ET dans le sheet mobile —————
  const filterFields = (
    <>
      {/* Recherche libre avec autocomplete */}
      <div style={{ marginBottom: 20, position: 'relative' }} ref={sugRef}>
        <label style={labelStyle}>Recherche</label>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setShowSug(true) }}
          onFocus={() => setShowSug(true)}
          placeholder="Titre, mot-clé..."
          style={inputStyle}
        />
        {showSug && suggestions.length > 0 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 40, background: '#fff', border: '1px solid #EEF2F7', borderRadius: 10, boxShadow: '0 12px 32px rgba(25,59,94,0.12)', overflow: 'hidden', padding: 4 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setQ(s); setShowSug(false) }}
                style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, color: '#3D4759', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F5F8FB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Province */}
      <div style={{ marginBottom: 16 }}>
        <FormSelect label="Province" value={province} onChange={setProvince} options={['', ...PROVINCES].map((p) => ({ value: p, label: p || 'Toutes' }))} placeholder="Toutes" />
      </div>

      {/* Ville (dépend de la province) */}
      <div style={{ marginBottom: 20 }}>
        <FormSelect
          label="Ville"
          value={ville}
          onChange={setVille}
          options={['', ...villesDispo].map((v) => ({ value: v, label: v || (province ? 'Toutes les villes' : 'Toutes') }))}
          placeholder="Toutes"
        />
      </div>

      {/* Budget mensuel */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Budget mensuel</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="number" value={minM} onChange={(e) => setMinM(e.target.value)} placeholder="Min" style={{ ...inputStyle, paddingRight: 30 }} />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9AA2B4' }}>€</span>
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="number" value={maxM} onChange={(e) => setMaxM(e.target.value)} placeholder="Max" style={{ ...inputStyle, paddingRight: 30 }} />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9AA2B4' }}>€</span>
          </div>
        </div>
      </div>

      {/* Type */}
      <div style={{ marginBottom: 16 }}>
        <FormSelect label="Type de bien" value={type} onChange={setType} options={['', ...TYPES].map((t) => ({ value: t, label: t || 'Tous les types' }))} placeholder="Tous les types" />
      </div>

      {/* Neuf / Existant */}
      <div style={{ marginBottom: 20 }}>
        <FormSelect
          label="Neuf ou existant"
          value={neuf}
          onChange={setNeuf}
          options={[{ value: '', label: 'Indifférent' }, { value: 'neuf', label: 'Neuf' }, { value: 'existant', label: 'Existant' }]}
          placeholder="Indifférent"
        />
      </div>

      {/* Surface minimum */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Surface minimum (m²)</label>
        <input type="number" value={surfaceMin} onChange={(e) => setSurfaceMin(e.target.value)} placeholder="Ex. 80" style={inputStyle} />
      </div>

      {/* Chambres minimum */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Chambres minimum</label>
        {compteur(chambres, () => setChambres((n) => Math.max(0, n - 1)), () => setChambres((n) => n + 1))}
      </div>

      {/* Salles de bain minimum */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Salles de bain minimum</label>
        {compteur(sdb, () => setSdb((n) => Math.max(0, n - 1)), () => setSdb((n) => n + 1))}
      </div>

      {/* Extérieur */}
      <div>
        <label style={labelStyle}>Extérieur</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', fontSize: 13.5, color: '#3D4759', fontWeight: 500 }}>
            <input type="checkbox" checked={terrasse} onChange={(e) => setTerrasse(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#7CB8A8', cursor: 'pointer' }} />
            Terrasse
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', fontSize: 13.5, color: '#3D4759', fontWeight: 500 }}>
            <input type="checkbox" checked={jardin} onChange={(e) => setJardin(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#7CB8A8', cursor: 'pointer' }} />
            Jardin
          </label>
        </div>
      </div>
    </>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: 28, alignItems: 'start' }}>

      {/* SIDEBAR DESKTOP (≥ 901px) */}
      {!isMobile && (
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 22, position: 'sticky', top: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: 0 }}>Filtres</h3>
            {hasFilters && (
              <button onClick={reset} style={{ fontSize: 12.5, color: '#7CB8A8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Réinitialiser</button>
            )}
          </div>
          {filterFields}
        </div>
      )}

      {/* GRILLE DE RÉSULTATS */}
      <div style={{ minWidth: 0 }}>

        {/* Barre de filtres mobile (déclencheur du sheet) */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button
              onClick={() => setSheetOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 12, border: '1.5px solid #193B5E', background: '#fff', color: '#193B5E', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              Filtres
              {activeCount > 0 && (
                <span style={{ background: '#193B5E', color: '#fff', borderRadius: 999, minWidth: 20, height: 20, padding: '0 6px', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{activeCount}</span>
              )}
            </button>
            {hasFilters && (
              <button onClick={reset} style={{ fontSize: 13, color: '#7CB8A8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Réinitialiser</button>
            )}
          </div>
        )}

        <div style={{ fontSize: 14, color: '#5A6275', marginBottom: 18, fontWeight: 500 }}>
          {filtered.length} bien{filtered.length > 1 ? 's' : ''} {hasFilters ? 'correspondant' + (filtered.length > 1 ? 's' : '') : 'disponible' + (filtered.length > 1 ? 's' : '')}
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px dashed #D8DFE9', borderRadius: 16, padding: '64px 24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Aucun bien trouvé</h3>
            <p style={{ fontSize: 14, color: '#5A6275', margin: 0 }}>Essayez d'élargir vos critères de recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 22 }}>
            {filtered.map((bien) => (
              <BienPublicCard key={bien.id} bien={bien} />
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM SHEET MOBILE */}
      {isMobile && (
        <>
          <div
            onClick={() => setSheetOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(11,26,42,0.45)', opacity: sheetOpen ? 1 : 0, pointerEvents: sheetOpen ? 'auto' : 'none', transition: 'opacity .25s ease' }}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1201,
              background: '#fff', borderRadius: '20px 20px 0 0', maxHeight: '88dvh',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(11,26,42,0.2)',
              transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
            }}
          >
            {/* En-tête */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #EEF2F7', flex: 'none' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#193B5E' }}>Filtres</h3>
              <button onClick={() => setSheetOpen(false)} aria-label="Fermer" style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#193B5E' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              </button>
            </div>

            {/* Corps scrollable */}
            <div style={{ padding: '16px 20px 8px', overflowY: 'auto', flex: 1 }}>
              {filterFields}
            </div>

            {/* Pied : Réinitialiser + Voir X biens */}
            <div style={{ display: 'flex', gap: 12, padding: '14px 20px', borderTop: '1px solid #EEF2F7', flex: 'none' }}>
              <button onClick={reset} style={{ flex: '0 0 auto', padding: '13px 18px', borderRadius: 12, border: '1.5px solid #E8EDF2', background: '#fff', color: '#193B5E', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Réinitialiser</button>
              <button onClick={() => setSheetOpen(false)} style={{ flex: 1, padding: '13px 18px', borderRadius: 12, border: 'none', background: '#193B5E', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Voir {filtered.length} bien{filtered.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
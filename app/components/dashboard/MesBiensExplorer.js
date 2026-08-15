'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { BienCard } from './BienCard'
import { FormSelect } from './FormSelect'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']

const STATUT_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'ACTIF', label: 'Actifs (facturés)' },
  { value: 'OPTION', label: 'Sous option' },
  { value: 'HORS_LIGNE', label: 'Hors-ligne' },
  { value: 'VENDU', label: 'Vendus' },
]

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

export function MesBiensExplorer({ biens, statutInitial = '' }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [province, setProvince] = useState('')
  const [statut, setStatut] = useState(statutInitial)
  const [minM, setMinM] = useState('')
  const [maxM, setMaxM] = useState('')
  const [chambres, setChambres] = useState(0)

  const [showSug, setShowSug] = useState(false)
  const sugRef = useRef(null)

  // Bascule mobile + panneau de filtres repliable (bottom sheet)
  const [isMobile, setIsMobile] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

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

  const villes = useMemo(() => {
    const set = new Set()
    biens.forEach((b) => { if (b.ville) set.add(b.ville) })
    return [...set].sort((a, b) => a.localeCompare(b, 'fr'))
  }, [biens])

  const suggestions = useMemo(() => {
    const v = q.trim().toLowerCase()
    if (!v) return []
    return villes.filter((ville) => ville.toLowerCase().includes(v)).slice(0, 6)
  }, [q, villes])

  useEffect(() => {
    function onClick(e) {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = useMemo(() => {
    const qLow = q.trim().toLowerCase()
    const minV = minM ? parseInt(minM, 10) : null
    const maxV = maxM ? parseInt(maxM, 10) : null

    return biens.filter((b) => {
      if (type && b.type !== type) return false
      if (province && b.province !== province) return false
      if (statut && (b.statut || 'ACTIF') !== statut) return false
      if (chambres && (b.chambres || 0) < chambres) return false
      if (minV && (b.mensualite || 0) < minV) return false
      if (maxV && (b.mensualite || 0) > maxV) return false
      if (qLow) {
        const hay = `${b.titre || ''} ${b.ville || ''} ${b.province || ''}`.toLowerCase()
        if (!hay.includes(qLow)) return false
      }
      return true
    })
  }, [biens, q, type, province, statut, minM, maxM, chambres])

  const hasFilters = q || type || province || statut || minM || maxM || chambres
  const activeCount = [q, type, province, statut, minM, maxM, chambres > 0].filter(Boolean).length

  function reset() {
    setQ(''); setType(''); setProvince(''); setStatut(''); setMinM(''); setMaxM(''); setChambres(0)
  }

  // ————— Champs de filtre, réutilisés dans la sidebar desktop ET dans le sheet mobile —————
  const filterFields = (
    <>
      {/* Recherche ville autocomplete */}
      <div style={{ marginBottom: 18, position: 'relative' }} ref={sugRef}>
        <label style={labelStyle}>Recherche</label>
        <input value={q} onChange={(e) => { setQ(e.target.value); setShowSug(true) }} onFocus={() => setShowSug(true)} placeholder="Titre, ville..." style={inputStyle} />
        {showSug && suggestions.length > 0 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 40, background: '#fff', border: '1px solid #EEF2F7', borderRadius: 10, boxShadow: '0 12px 32px rgba(25,59,94,0.12)', overflow: 'hidden', padding: 4 }}>
            {suggestions.map((ville) => (
              <button key={ville} type="button" onClick={() => { setQ(ville); setShowSug(false) }}
                style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, color: '#3D4759', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F5F8FB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {ville}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Statut */}
      <div style={{ marginBottom: 18 }}>
        <FormSelect label="Statut" value={statut} onChange={setStatut} placeholder="Tous les statuts"
          options={STATUT_OPTIONS} />
      </div>

      {/* Budget mensuel */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Budget mensuel</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="number" value={minM} onChange={(e) => setMinM(e.target.value)} placeholder="Min" style={{ ...inputStyle, paddingRight: 26 }} />
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9AA2B4' }}>€</span>
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="number" value={maxM} onChange={(e) => setMaxM(e.target.value)} placeholder="Max" style={{ ...inputStyle, paddingRight: 26 }} />
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9AA2B4' }}>€</span>
          </div>
        </div>
      </div>

      {/* Type */}
      <div style={{ marginBottom: 18 }}>
        <FormSelect label="Type de bien" value={type} onChange={setType} placeholder="Tous les types"
          options={['', ...TYPES].map((t) => ({ value: t, label: t || 'Tous les types' }))} />
      </div>

      {/* Chambres */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Chambres minimum</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setChambres((n) => Math.max(0, n - 1))} style={{ width: 40, height: 40, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>−</button>
          <div style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 10, background: '#FAFDFD', border: '1.5px solid #E8EDF2', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{chambres || 'Indiff.'}</div>
          <button onClick={() => setChambres((n) => n + 1)} style={{ width: 40, height: 40, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>+</button>
        </div>
      </div>

      {/* Province */}
      <div>
        <FormSelect label="Province" value={province} onChange={setProvince} placeholder="Toutes"
          options={['', ...PROVINCES].map((p) => ({ value: p, label: p || 'Toutes' }))} />
      </div>
    </>
  )

  const ajouterBtn = (
    <Link href="/dashboard/client/biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#193B5E', color: '#fff', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      Ajouter un bien
    </Link>
  )

  return (
    <div>
      {/* En-tête : compteur portefeuille + Ajouter + Filtres (Filtres en mobile) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <p style={{ fontSize: 14.5, color: '#5A6275', margin: 0 }}>
          <strong style={{ color: '#193B5E' }}>{biens.length} bien{biens.length > 1 ? 's' : ''}</strong> dans votre portefeuille.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {ajouterBtn}
          {isMobile && (
            <button
              onClick={() => setSheetOpen(true)}
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 10, border: 'none', background: '#EEF2F7', color: '#193B5E', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              Filtres
              {activeCount > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -8, minWidth: 21, height: 21, padding: '0 5px', borderRadius: 999, background: '#193B5E', color: '#fff', fontSize: 11.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(25,59,94,0.28)' }}>{activeCount}</span>
              )}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: 24, alignItems: 'start' }}>

        {/* SIDEBAR DESKTOP (≥ 901px) */}
        {!isMobile && (
          <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 20, position: 'sticky', top: 92 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: 0 }}>Filtres</h3>
              {hasFilters && (
                <button onClick={reset} style={{ fontSize: 12, color: '#7CB8A8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Réinitialiser</button>
              )}
            </div>
            {filterFields}
          </div>
        )}

        {/* GRILLE DE RÉSULTATS */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, color: '#5A6275', marginBottom: 16, fontWeight: 500 }}>
            {hasFilters
              ? `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}`
              : `${filtered.length} bien${filtered.length > 1 ? 's' : ''} au total`}
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: '#fff', border: '1px dashed #D8DFE9', borderRadius: 16, padding: '56px 24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Aucun bien trouvé</h3>
              <p style={{ fontSize: 14, color: '#5A6275', margin: 0 }}>Essayez d'ajuster vos filtres.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {filtered.map((bien) => (
                <BienCard key={bien.id} bien={bien} />
              ))}
            </div>
          )}
        </div>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #EEF2F7', flex: 'none' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#193B5E' }}>Filtres</h3>
              <button onClick={() => setSheetOpen(false)} aria-label="Fermer" style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#193B5E' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              </button>
            </div>

            <div style={{ padding: '16px 20px 8px', overflowY: 'auto', flex: 1 }}>
              {filterFields}
            </div>

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
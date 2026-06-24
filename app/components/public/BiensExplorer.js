'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { FormSelect } from '@/app/components/dashboard/FormSelect'
import { BienPublicCard } from '@/app/components/public/BienPublicCard'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

export function BiensExplorer({ biens }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [province, setProvince] = useState('')
  const [minM, setMinM] = useState('')
  const [maxM, setMaxM] = useState('')
  const [chambres, setChambres] = useState(0)

  // autocomplete ville
  const [showSug, setShowSug] = useState(false)
  const sugRef = useRef(null)

  // Liste des villes distinctes (pour l'autocomplete)
  const villes = useMemo(() => {
    const set = new Set()
    biens.forEach((b) => { if (b.ville) set.add(b.ville) })
    return [...set].sort((a, b) => a.localeCompare(b, 'fr'))
  }, [biens])

  // Suggestions filtrées selon la saisie
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

  // Filtrage instantané en mémoire
  const filtered = useMemo(() => {
    const qLow = q.trim().toLowerCase()
    const minV = minM ? parseInt(minM, 10) : null
    const maxV = maxM ? parseInt(maxM, 10) : null

    return biens.filter((b) => {
      if (type && b.type !== type) return false
      if (province && b.province !== province) return false
      if (chambres && (b.chambres || 0) < chambres) return false
      if (minV && (b.mensualite || 0) < minV) return false
      if (maxV && (b.mensualite || 0) > maxV) return false
      if (qLow) {
        const hay = `${b.titre || ''} ${b.ville || ''} ${b.description || ''}`.toLowerCase()
        if (!hay.includes(qLow)) return false
      }
      return true
    })
  }, [biens, q, type, province, minM, maxM, chambres])

  const hasFilters = q || type || province || minM || maxM || chambres

  function reset() {
    setQ(''); setType(''); setProvince(''); setMinM(''); setMaxM(''); setChambres(0)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }} className="biens-layout">
      <style>{`@media (max-width: 900px){ .biens-layout { grid-template-columns: 1fr !important; } }`}</style>

      {/* FILTRES */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 22, position: 'sticky', top: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: 0 }}>Filtres</h3>
          {hasFilters && (
            <button onClick={reset} style={{ fontSize: 12.5, color: '#7CB8A8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Réinitialiser</button>
          )}
        </div>

        {/* Recherche ville avec autocomplete */}
        <div style={{ marginBottom: 20, position: 'relative' }} ref={sugRef}>
          <label style={labelStyle}>Ville ou mot-clé</label>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setShowSug(true) }}
            onFocus={() => setShowSug(true)}
            placeholder="Commencez à taper..."
            style={inputStyle}
          />
          {showSug && suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 40, background: '#fff', border: '1px solid #EEF2F7', borderRadius: 10, boxShadow: '0 12px 32px rgba(25,59,94,0.12)', overflow: 'hidden', padding: 4 }}>
              {suggestions.map((ville) => (
                <button
                  key={ville}
                  type="button"
                  onClick={() => { setQ(ville); setShowSug(false) }}
                  style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, color: '#3D4759', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F5F8FB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {ville}
                </button>
              ))}
            </div>
          )}
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
        <div style={{ marginBottom: 20 }}>
          <FormSelect label="Type de bien" value={type} onChange={setType} options={['', ...TYPES].map((t) => ({ value: t, label: t || 'Tous les types' }))} placeholder="Tous les types" />
        </div>

        {/* Chambres minimum */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Chambres minimum</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setChambres((n) => Math.max(0, n - 1))} style={{ width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>−</button>
            <div style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 10, background: '#FAFDFD', border: '1.5px solid #E8EDF2', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{chambres || 'Indifférent'}</div>
            <button onClick={() => setChambres((n) => n + 1)} style={{ width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>+</button>
          </div>
        </div>

        {/* Province */}
        <div>
          <FormSelect label="Province" value={province} onChange={setProvince} options={['', ...PROVINCES].map((p) => ({ value: p, label: p || 'Toutes' }))} placeholder="Toutes" />
        </div>
      </div>

      {/* GRILLE */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, color: '#5A6275', marginBottom: 18, fontWeight: 500 }}>
          {filtered.length} bien{filtered.length > 1 ? 's' : ''} {hasFilters ? 'correspondant' + (filtered.length > 1 ? 's' : '') : 'dans le réseau'}
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
    </div>
  )
}
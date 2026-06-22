'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormSelect } from '@/app/components/dashboard/FormSelect'
import { AddressInput } from '@/app/components/dashboard/AddressInput'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

export function BiensFilters({ initial = {} }) {
  const router = useRouter()
  const [q, setQ] = useState(initial.q || '')
  const [type, setType] = useState(initial.type || '')
  const [province, setProvince] = useState(initial.province || '')
  const [minM, setMinM] = useState(initial.min || '')
  const [maxM, setMaxM] = useState(initial.max || '')
  const [chambres, setChambres] = useState(parseInt(initial.chambres) || 0)

  function apply(next = {}) {
    const v = { q, type, province, min: minM, max: maxM, chambres, ...next }
    const sp = new URLSearchParams()
    if (v.q) sp.set('q', v.q)
    if (v.type) sp.set('type', v.type)
    if (v.province) sp.set('province', v.province)
    if (v.min) sp.set('min', v.min)
    if (v.max) sp.set('max', v.max)
    if (v.chambres) sp.set('chambres', v.chambres)
    router.push(`/biens?${sp.toString()}`)
  }

  function reset() {
    setQ(''); setType(''); setProvince(''); setMinM(''); setMaxM(''); setChambres(0)
    router.push('/biens')
  }

  const hasFilters = q || type || province || minM || maxM || chambres

  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 22, position: 'sticky', top: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: 0 }}>Filtres</h3>
        {hasFilters && (
          <button onClick={reset} style={{ fontSize: 12.5, color: '#7CB8A8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Réinitialiser</button>
        )}
      </div>

      {/* Budget mensuel */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Budget mensuel</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="number" value={minM} onChange={(e) => setMinM(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Min" style={{ ...inputStyle, paddingRight: 36 }} />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9AA2B4' }}>€</span>
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="number" value={maxM} onChange={(e) => setMaxM(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Max" style={{ ...inputStyle, paddingRight: 36 }} />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9AA2B4' }}>€</span>
          </div>
        </div>
      </div>

      {/* Type */}
      <div style={{ marginBottom: 20 }}>
        <FormSelect label="Type de bien" value={type} onChange={(v) => { setType(v); apply({ type: v }) }} options={['', ...TYPES].map((t) => ({ value: t, label: t || 'Tous les types' }))} placeholder="Tous les types" />
      </div>

      {/* Chambres minimum */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Chambres minimum</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => { const n = Math.max(0, chambres - 1); setChambres(n); apply({ chambres: n }) }} style={{ width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>−</button>
          <div style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 10, background: '#FAFDFD', border: '1.5px solid #E8EDF2', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{chambres || 'Indifférent'}</div>
          <button onClick={() => { const n = chambres + 1; setChambres(n); apply({ chambres: n }) }} style={{ width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#193B5E', fontWeight: 600 }}>+</button>
        </div>
      </div>

      {/* Province */}
      <div style={{ marginBottom: 20 }}>
        <FormSelect label="Province" value={province} onChange={(v) => { setProvince(v); apply({ province: v }) }} options={['', ...PROVINCES].map((p) => ({ value: p, label: p || 'Toutes' }))} placeholder="Toutes" />
      </div>

      {/* Recherche ville/mot-clé */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Recherche</label>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Ville, titre..." style={inputStyle} />
      </div>

      <button onClick={() => apply()} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Appliquer les filtres
      </button>
    </div>
  )
}
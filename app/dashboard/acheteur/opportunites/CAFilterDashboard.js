'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const CA_OPTIONS = [100000, 250000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000]

const formatCA = (val) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M €`
  return `${(val / 1000).toFixed(0)}k €`
}

export default function CAFilterDashboard({ currentMin, currentMax }) {
  const [min, setMin] = useState(currentMin || '')
  const [max, setMax] = useState(currentMax || '')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleApply = () => {
    if (min && max && parseInt(min) >= parseInt(max)) {
      setError('Le minimum doit être inférieur au maximum.')
      return
    }
    setError('')
    const p = new URLSearchParams(searchParams.toString())
    if (min) p.set('caMin', min)
    else p.delete('caMin')
    if (max) p.set('caMax', max)
    else p.delete('caMax')
    router.push(`/dashboard/acheteur/opportunites?${p.toString()}`)
  }

  const maxOptions = CA_OPTIONS.filter(s => !min || s > parseInt(min))

  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
        Chiffre d'affaires annuel
      </p>
      <div style={{ marginBottom: '8px' }}>
        <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0 0 4px', fontWeight: 500 }}>Minimum</p>
        <select value={min} onChange={e => { setMin(e.target.value); setMax(''); setError('') }}
          style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', color: min ? '#374151' : '#9ca3af', outline: 'none', background: 'white' }}>
          <option value="">Sélectionner...</option>
          {CA_OPTIONS.map(s => <option key={s} value={s}>{formatCA(s)}</option>)}
        </select>
      </div>
      {min && (
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0 0 4px', fontWeight: 500 }}>Maximum</p>
          <select value={max} onChange={e => { setMax(e.target.value); setError('') }}
            style={{ width: '100%', border: `1px solid ${error ? '#fecaca' : '#e5e7eb'}`, borderRadius: '8px', padding: '6px 8px', fontSize: '12px', color: max ? '#374151' : '#9ca3af', outline: 'none', background: 'white' }}>
            <option value="">Sans limite</option>
            {maxOptions.map(s => <option key={s} value={s}>{formatCA(s)}</option>)}
          </select>
        </div>
      )}
      {error && <p style={{ fontSize: '11px', color: '#ef4444', margin: '0 0 8px' }}>{error}</p>}
      {min && (
        <div style={{ background: 'rgba(255,90,31,0.1)', borderRadius: '8px', padding: '6px 10px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: '11px', color: '#FF5A1F', fontWeight: 600 }}>
            {formatCA(parseInt(min))} {max ? `→ ${formatCA(parseInt(max))}` : '→ sans limite'}
          </span>
        </div>
      )}
      <button onClick={handleApply} disabled={!min}
        style={{ width: '100%', background: min ? '#141414' : '#e5e7eb', color: min ? 'white' : '#9ca3af', fontSize: '12px', fontWeight: 600, padding: '7px', borderRadius: '8px', border: 'none', cursor: min ? 'pointer' : 'not-allowed' }}>
        Appliquer
      </button>
    </div>
  )
}
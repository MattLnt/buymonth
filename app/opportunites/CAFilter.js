'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const CA_OPTIONS = [100000, 250000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000]

const formatCA = (val) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M €`
  return `${(val / 1000).toFixed(0)}k €`
}

function CustomSelect({ value, placeholder, options, onChange, hasError }) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          width: '100%', padding: '8px 12px',
          borderRadius: 10, border: `1.5px solid ${hasError ? '#FCA5A5' : open ? '#FF5A1F' : value ? '#FF5A1F' : '#E5E7EB'}`,
          background: value ? 'rgba(255,90,31,0.06)' : '#FAFAFA',
          fontSize: 13, color: selected ? '#141414' : '#9CA3AF',
          cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s',
        }}>
        <span style={{ fontWeight: selected ? 600 : 400 }}>{selected ? selected.label : placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 20,
            background: '#fff', borderRadius: 12, border: '1px solid #F3F4F6',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <button type="button" onClick={() => { onChange(''); setOpen(false) }}
              style={{ display: 'block', width: '100%', padding: '9px 12px', textAlign: 'left', fontSize: 13, color: !value ? '#141414' : '#6B7280', fontWeight: !value ? 600 : 400, background: !value ? '#F9FAFB' : 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F9FAFB' }}>
              {placeholder}
            </button>
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false) }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 12px', textAlign: 'left', fontSize: 13, color: value === o.value ? '#141414' : '#6B7280', fontWeight: value === o.value ? 600 : 400, background: value === o.value ? '#F9FAFB' : 'transparent', border: 'none', cursor: 'pointer' }}>
                <span>{o.label}</span>
                {value === o.value && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function CAFilter({ currentMin, currentMax }) {
  const [min, setMin] = useState(currentMin ? String(currentMin) : '')
  const [max, setMax] = useState(currentMax ? String(currentMax) : '')
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
    router.push(`/opportunites?${p.toString()}`)
  }

  const minOptions = CA_OPTIONS.map(s => ({ value: String(s), label: formatCA(s) }))
  const maxOptions = CA_OPTIONS.filter(s => !min || s > parseInt(min)).map(s => ({ value: String(s), label: formatCA(s) }))

  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
        Chiffre d'affaires annuel
      </p>

      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>Minimum</p>
        <CustomSelect
          value={min}
          placeholder="Sélectionner..."
          options={minOptions}
          onChange={v => { setMin(v); setMax(''); setError('') }}
        />
      </div>

      {min && (
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>Maximum</p>
          <CustomSelect
            value={max}
            placeholder="Sans limite"
            options={maxOptions}
            onChange={v => { setMax(v); setError('') }}
            hasError={!!error}
          />
        </div>
      )}

      {error && (
        <p style={{ fontSize: 11, color: '#EF4444', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}

      {min && (
        <div style={{ background: 'rgba(255,90,31,0.08)', borderRadius: 8, padding: '7px 10px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,90,31,0.2)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: 11, color: '#D8480F', fontWeight: 600 }}>
            {formatCA(parseInt(min))} {max ? `→ ${formatCA(parseInt(max))}` : '→ sans limite'}
          </span>
        </div>
      )}

      <button
        onClick={handleApply}
        disabled={!min}
        style={{
          width: '100%', background: min ? '#141414' : '#F3F4F6',
          color: min ? '#fff' : '#9CA3AF',
          fontSize: 13, fontWeight: 600, padding: '9px',
          borderRadius: 10, border: 'none', cursor: min ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        Appliquer
      </button>
    </div>
  )
}
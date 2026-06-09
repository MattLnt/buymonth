'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function Switcher({ label, paramName, value, isActive }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleToggle = () => {
    const p = new URLSearchParams(searchParams.toString())
    const current = p.getAll(paramName)
    p.delete(paramName)
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    next.forEach(v => p.append(paramName, v))
    router.push(`/dashboard/acheteur/opportunites?${p.toString()}`, { scroll: false })
  }

  return (
    <button onClick={handleToggle}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 0', width: '100%' }}>
      <span style={{ fontSize: '13px', color: isActive ? '#141414' : '#6B7280', fontWeight: isActive ? 600 : 400, flex: 1, textAlign: 'left', lineHeight: 1.3 }}>
        {label}
      </span>
      <div style={{ width: '34px', height: '19px', borderRadius: '10px', background: isActive ? '#FF5A1F' : '#e5e7eb', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
        <div style={{ position: 'absolute', top: '2px', left: isActive ? '17px' : '2px', width: '15px', height: '15px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
      </div>
    </button>
  )
}

function CAFilter({ currentMin, currentMax }) {
  const CA_OPTIONS = [100000, 250000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000]
  const formatCA = (val) => val >= 1000000 ? `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M €` : `${(val / 1000).toFixed(0)}k €`

  const [min, setMin] = useState(currentMin || '')
  const [max, setMax] = useState(currentMax || '')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleApply = () => {
    if (min && max && parseInt(min) >= parseInt(max)) {
      setError('Min doit être < max')
      return
    }
    setError('')
    const p = new URLSearchParams(searchParams.toString())
    if (min) p.set('caMin', min); else p.delete('caMin')
    if (max) p.set('caMax', max); else p.delete('caMax')
    router.push(`/dashboard/acheteur/opportunites?${p.toString()}`)
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px' }}>Minimum</p>
        <select value={min} onChange={e => { setMin(e.target.value); setMax(''); setError('') }}
          style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 8px', fontSize: 12, outline: 'none', background: 'white', color: min ? '#374151' : '#9ca3af' }}>
          <option value="">Sélectionner...</option>
          {CA_OPTIONS.map(s => <option key={s} value={s}>{formatCA(s)}</option>)}
        </select>
      </div>
      {min && (
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px' }}>Maximum</p>
          <select value={max} onChange={e => { setMax(e.target.value); setError('') }}
            style={{ width: '100%', border: `1px solid ${error ? '#fecaca' : '#e5e7eb'}`, borderRadius: 8, padding: '6px 8px', fontSize: 12, outline: 'none', background: 'white', color: max ? '#374151' : '#9ca3af' }}>
            <option value="">Sans limite</option>
            {CA_OPTIONS.filter(s => !min || s > parseInt(min)).map(s => <option key={s} value={s}>{formatCA(s)}</option>)}
          </select>
        </div>
      )}
      {error && <p style={{ fontSize: 11, color: '#ef4444', margin: '0 0 8px' }}>{error}</p>}
      {min && (
        <div style={{ background: 'rgba(255,90,31,0.1)', borderRadius: 8, padding: '5px 10px', marginBottom: 8, fontSize: 11, color: '#FF5A1F', fontWeight: 600 }}>
          {formatCA(parseInt(min))} {max ? `→ ${formatCA(parseInt(max))}` : '→ sans limite'}
        </div>
      )}
      <button onClick={handleApply} disabled={!min}
        style={{ width: '100%', background: min ? '#141414' : '#e5e7eb', color: min ? '#fff' : '#9ca3af', fontSize: 12, fontWeight: 600, padding: '7px', borderRadius: 8, border: 'none', cursor: min ? 'pointer' : 'not-allowed' }}>
        Appliquer
      </button>
    </div>
  )
}

function Section({ title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid #F3F4F6' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#141414', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {count > 0 && (
            <span style={{ background: 'rgba(255,90,31,0.15)', color: '#C2410C', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>{count}</span>
          )}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function SidebarFiltres({ province, typeDeal, activite, caMin, caMax, provinces, deals, activites, hasFilters }) {
  const router = useRouter()

  const provinceCount = province.length
  const typeCount = typeDeal.length
  const activiteCount = activite.length
  const caCount = caMin || caMax ? 1 : 0

  return (
    <aside style={{ background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6', overflow: 'hidden', position: 'sticky', top: 80 }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#141414', margin: 0 }}>Filtres</h2>
        {hasFilters && (
          <button onClick={() => router.push('/dashboard/acheteur/opportunites')}
            style={{ fontSize: 11, color: '#FF5A1F', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Réinitialiser
          </button>
        )}
      </div>

      <Section title="Province" count={provinceCount} defaultOpen={provinceCount > 0}>
        {provinces.map(p => (
          <Switcher key={p} label={p} paramName="province" value={p} isActive={province.includes(p)} />
        ))}
      </Section>

      <Section title="Type de deal" count={typeCount} defaultOpen={typeCount > 0}>
        {deals.map(d => (
          <Switcher key={d.value} label={d.label} paramName="typeDeal" value={d.value} isActive={typeDeal.includes(d.value)} />
        ))}
      </Section>

      <Section title="Activité" count={activiteCount} defaultOpen={activiteCount > 0}>
        {activites.map(a => (
          <Switcher key={a} label={a} paramName="activite" value={a} isActive={activite.includes(a)} />
        ))}
      </Section>

      <Section title="Chiffre d'affaires annuel" count={caCount} defaultOpen={caCount > 0}>
        <CAFilter currentMin={caMin} currentMax={caMax} />
      </Section>
    </aside>
  )
}
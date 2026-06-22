'use client'

import { useState, useRef, useEffect } from 'react'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

// Mapping région Mapbox -> province belge
function extractProvince(feature) {
  const ctx = feature.context || []
  const region = ctx.find((c) => c.id?.startsWith('region'))
  return region?.text || ''
}
function extractCity(feature) {
  const ctx = feature.context || []
  const place = ctx.find((c) => c.id?.startsWith('place'))
  const locality = ctx.find((c) => c.id?.startsWith('locality'))
  return place?.text || locality?.text || ''
}

export function AddressInput({ label = 'Adresse', value, onSelect, onChange, placeholder = 'Rue, numéro, ville...', required }) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleInput(e) {
    const q = e.target.value
    onChange?.(q)
    if (timer.current) clearTimeout(timer.current)
    if (!q || q.length < 3) { setResults([]); setOpen(false); return }

    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${TOKEN}&country=be&language=fr&types=address,place,locality&limit=5`
        const res = await fetch(url)
        const data = await res.json()
        setResults(data.features || [])
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 280)
  }

  function pick(feature) {
    const adresse = feature.place_name?.replace(', Belgique', '') || feature.text
    onSelect?.({
      adresse,
      ville: extractCity(feature) || feature.text,
      province: extractProvince(feature),
    })
    setOpen(false)
    setResults([])
  }

  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}{required && <span style={{ color: '#7CB8A8' }}> *</span>}</label>}

      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA2B4" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
        </span>
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={(e) => { e.target.style.borderColor = '#7CB8A8'; if (results.length) setOpen(true) }}
          onBlur={(e) => (e.target.style.borderColor = '#E8EDF2')}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E', transition: 'border-color 0.2s' }}
        />
        {loading && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#A9B0BE' }}>...</span>}
      </div>

      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60, background: '#fff', border: '1px solid #EEF2F7', borderRadius: 12, boxShadow: '0 16px 40px rgba(25,59,94,0.14)', overflow: 'hidden', padding: 6 }}>
          {results.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => pick(f)}
              style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13.5, background: 'transparent', color: '#3D4759', display: 'flex', alignItems: 'center', gap: 10 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F8FB')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="1.8" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.place_name?.replace(', Belgique', '')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
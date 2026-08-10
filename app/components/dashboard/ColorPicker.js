'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// --- conversions couleur ---
function hexToRgb(hex) {
  const m = hex.replace('#', '')
  const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const int = parseInt(n, 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}
function rgbToHex(r, g, b) {
  const h = (v) => Math.round(v).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase()
}
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : d / max
  const v = max
  return { h, s, v }
}
function hsvToRgb(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }

export function ColorPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [hsv, setHsv] = useState(() => {
    const { r, g, b } = hexToRgb(value || '#000000')
    return rgbToHsv(r, g, b)
  })
  const wrapRef = useRef(null)
  const svRef = useRef(null)
  const hueRef = useRef(null)
  const dragRef = useRef(null) // 'sv' | 'hue' | null

  // Sync depuis la prop quand elle change de l'extérieur (et que le picker est fermé)
  useEffect(() => {
    if (open) return
    const { r, g, b } = hexToRgb(value || '#000000')
    setHsv(rgbToHsv(r, g, b))
  }, [value, open])

  // Fermeture au clic dehors
  useEffect(() => {
    if (!open) return
    function onDown(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const emit = useCallback((next) => {
    const { r, g, b } = hsvToRgb(next.h, next.s, next.v)
    onChange(rgbToHex(r, g, b))
  }, [onChange])

  // Gestion du drag (zone SV + barre teinte)
  const handleMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    if (dragRef.current === 'sv' && svRef.current) {
      const r = svRef.current.getBoundingClientRect()
      const s = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
      const v = Math.min(1, Math.max(0, 1 - (clientY - r.top) / r.height))
      setHsv((prev) => { const n = { ...prev, s, v }; emit(n); return n })
    } else if (dragRef.current === 'hue' && hueRef.current) {
      const r = hueRef.current.getBoundingClientRect()
      const h = Math.min(360, Math.max(0, ((clientX - r.left) / r.width) * 360))
      setHsv((prev) => { const n = { ...prev, h }; emit(n); return n })
    }
  }, [emit])

  useEffect(() => {
    function up() { dragRef.current = null }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', up)
    }
  }, [handleMove])

  function startSV(e) { dragRef.current = 'sv'; handleMove(e) }
  function startHue(e) { dragRef.current = 'hue'; handleMove(e) }

  function onHexInput(e) {
    let v = e.target.value.trim()
    if (!v.startsWith('#')) v = '#' + v
    onChange(v.toUpperCase())
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      const { r, g, b } = hexToRgb(v)
      setHsv(rgbToHsv(r, g, b))
    }
  }

  const hueColor = (() => { const { r, g, b } = hsvToRgb(hsv.h, 1, 1); return rgbToHex(r, g, b) })()

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}</label>}

      {/* Champ déclencheur : pastille + hex */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: '1.5px solid #E8EDF2', borderRadius: 10, padding: '6px 10px', background: '#fff', cursor: 'pointer' }}
      >
        <span style={{ width: 30, height: 30, borderRadius: 6, background: value, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: '#5A6B7D', fontWeight: 600 }}>{value}</span>
      </button>

      {/* Panneau du picker */}
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 60, width: 240, background: '#fff', border: '1px solid #EEF2F7', borderRadius: 12, boxShadow: '0 16px 40px rgba(25,59,94,0.18)', padding: 14 }}>
          {/* Zone saturation / luminosité */}
          <div
            ref={svRef}
            onMouseDown={startSV}
            onTouchStart={startSV}
            style={{
              position: 'relative', width: '100%', height: 150, borderRadius: 8, cursor: 'crosshair', marginBottom: 14,
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
            }}
          >
            <span style={{ position: 'absolute', left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.3)', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
          </div>

          {/* Barre de teinte */}
          <div
            ref={hueRef}
            onMouseDown={startHue}
            onTouchStart={startHue}
            style={{
              position: 'relative', width: '100%', height: 14, borderRadius: 8, cursor: 'pointer', marginBottom: 14,
              background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }}
          >
            <span style={{ position: 'absolute', left: `${(hsv.h / 360) * 100}%`, top: '50%', width: 16, height: 16, borderRadius: '50%', background: hueColor, border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.3)', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
          </div>

          {/* Champ hex */}
          <input
            value={value}
            onChange={onHexInput}
            maxLength={7}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #E8EDF2', fontSize: 13, fontWeight: 600, color: '#193B5E', outline: 'none', background: '#FAFDFD', boxSizing: 'border-box', fontFamily: 'monospace' }}
          />
        </div>
      )}
    </div>
  )
}
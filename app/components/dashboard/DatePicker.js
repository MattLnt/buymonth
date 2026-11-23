'use client'

import { useState, useRef, useEffect } from 'react'

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const JOURS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

// value/onChange au format 'YYYY-MM-DD' (string) ou '' si vide
export function DatePicker({ value, onChange, placeholder = 'Choisir une date', minDate, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = value ? parseISO(value) : null
  const [viewDate, setViewDate] = useState(selected || new Date())

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (selected) setViewDate(selected)
  }, [value])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Construit la grille du mois (lundi en premier)
  const firstDay = new Date(year, month, 1)
  let startWeekday = firstDay.getDay() // 0=dim
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1 // lundi=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const min = minDate ? (typeof minDate === 'string' ? parseISO(minDate) : minDate) : null
  const today = startOfDay(new Date())

  function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  function pick(date) {
    if (min && startOfDay(date) < startOfDay(min)) return
    onChange(toISO(date))
    setOpen(false)
  }

  const labelStyle = { display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}</label>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 10,
          border: `1.5px solid ${open ? '#7CB8A8' : '#E8EDF2'}`,
          background: '#FAFDFD', fontSize: 14.5, color: selected ? '#193B5E' : '#9AA2B4',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          cursor: 'pointer', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
          fontWeight: selected ? 600 : 400, textAlign: 'left',
        }}
      >
        <span>{selected ? formatFr(selected) : placeholder}</span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8A92A6" strokeWidth="1.8" style={{ flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 80,
          background: '#fff', border: '1px solid #EEF2F7', borderRadius: 14,
          boxShadow: '0 16px 44px rgba(25,59,94,0.16)', padding: 16, width: 290,
        }}>
          {/* En-tête mois */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} style={navBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#193B5E' }}>{MOIS[month]} {year}</span>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} style={navBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          {/* Jours de la semaine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
            {JOURS.map((j) => (
              <div key={j} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#A9B0BE', padding: '4px 0' }}>{j}</div>
            ))}
          </div>

          {/* Grille */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((date, i) => {
              if (!date) return <div key={i} />
              const isSel = isSameDay(date, selected)
              const isToday = isSameDay(date, today)
              const disabled = min && startOfDay(date) < startOfDay(min)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(date)}
                  disabled={disabled}
                  style={{
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 8, border: 'none', fontSize: 13,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    background: isSel ? '#7CB8A8' : 'transparent',
                    color: disabled ? '#D4DAE3' : isSel ? '#fff' : '#3D4759',
                    fontWeight: isSel ? 700 : isToday ? 700 : 500,
                    boxShadow: isToday && !isSel ? 'inset 0 0 0 1.5px #DCE6EF' : 'none',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { if (!isSel && !disabled) e.currentTarget.style.background = '#F0F5F8' }}
                  onMouseLeave={(e) => { if (!isSel && !disabled) e.currentTarget.style.background = 'transparent' }}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Pied : aujourd'hui / effacer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F2F5FA' }}>
            <button type="button" onClick={() => { onChange(''); setOpen(false) }} style={footBtn('#A9B0BE')}>Effacer</button>
            <button type="button" onClick={() => pick(new Date())} style={footBtn('#7CB8A8')}>Aujourd'hui</button>
          </div>
        </div>
      )}
    </div>
  )
}

const navBtn = { width: 30, height: 30, borderRadius: 8, border: '1px solid #EEF2F7', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A6275' }
const footBtn = (color) => ({ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color })

// ── Helpers dates ──
function parseISO(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
function formatFr(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}
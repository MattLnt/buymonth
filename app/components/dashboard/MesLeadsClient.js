'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const STATUTS = [
  'À contacter',
  'Contact en cours',
  'Projet futur',
  'Offre',
  'Compromis avec conditions',
  'Compromis sans conditions',
  'Vente',
  'Abandon',
  'Refus crédit',
  'Mauvaises coordonnées',
]

// Couleur par statut (pour la pastille)
const STATUT_COLOR = {
  'À contacter': { c: '#3B62A8', bg: 'rgba(78,125,212,0.12)' },
  'Contact en cours': { c: '#8A6D1B', bg: 'rgba(232,153,35,0.14)' },
  'Projet futur': { c: '#5A6B7D', bg: 'rgba(90,107,125,0.12)' },
  'Offre': { c: '#1B7A5E', bg: 'rgba(36,158,124,0.12)' },
  'Compromis avec conditions': { c: '#1B7A5E', bg: 'rgba(36,158,124,0.12)' },
  'Compromis sans conditions': { c: '#1B7A5E', bg: 'rgba(36,158,124,0.16)' },
  'Vente': { c: '#0F5132', bg: 'rgba(36,158,124,0.22)' },
  'Abandon': { c: '#8A92A6', bg: '#F0F2F6' },
  'Refus crédit': { c: '#C0392B', bg: 'rgba(229,72,77,0.12)' },
  'Mauvaises coordonnées': { c: '#8A92A6', bg: '#F0F2F6' },
}

function formatDateHeure(d) {
  const date = new Date(d)
  return date.toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })
    + ' · ' + date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
}

// Dropdown custom avec pastilles colorées — menu en position fixe, s'ouvre vers le haut si pas de place en bas
function StatutDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const col = STATUT_COLOR[value] || STATUT_COLOR['À contacter']

  function toggle() {
    if (disabled) return
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      // hauteur estimée du menu ; on l'ouvre vers le haut s'il n'y a pas la place en bas
      const MENU_H = 380
      const placeEnBas = window.innerHeight - r.bottom
      const versLeHaut = placeEnBas < MENU_H && r.top > placeEnBas
      setPos({
        top: versLeHaut ? undefined : r.bottom + 4,
        bottom: versLeHaut ? (window.innerHeight - r.top + 4) : undefined,
        left: r.left,
        minWidth: Math.max(r.width, 210),
      })
    }
    setOpen((o) => !o)
  }

  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (btnRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return
      setOpen(false)
    }
    function onScrollResize() { setOpen(false) }
    document.addEventListener('mousedown', onClick)
    window.addEventListener('scroll', onScrollResize, true)
    window.addEventListener('resize', onScrollResize)
    return () => {
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('scroll', onScrollResize, true)
      window.removeEventListener('resize', onScrollResize)
    }
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        disabled={disabled}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 10px 6px 12px', borderRadius: 20, border: 'none',
          cursor: disabled ? 'wait' : 'pointer', fontSize: 12.5, fontWeight: 700,
          color: col.c, background: col.bg, outline: 'none', whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: col.c, flexShrink: 0 }} />
        {value}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={col.c} strokeWidth="2.5" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && pos && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, bottom: pos.bottom, left: pos.left, minWidth: pos.minWidth, zIndex: 1000, background: '#fff', border: '1px solid #EEF2F7', borderRadius: 12, boxShadow: '0 12px 32px rgba(25,59,94,0.16)', padding: 5, maxHeight: '70vh', overflowY: 'auto' }}
        >
          {STATUTS.map((s) => {
            const sc = STATUT_COLOR[s] || STATUT_COLOR['À contacter']
            const actif = s === value
            return (
              <button
                key={s}
                type="button"
                onClick={() => { onChange(s); setOpen(false) }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8,
                  border: 'none', background: actif ? '#F5F8FB' : 'transparent', cursor: 'pointer',
                  fontSize: 13, fontWeight: actif ? 700 : 500, color: '#3D4759',
                  display: 'flex', alignItems: 'center', gap: 9,
                }}
                onMouseEnter={(e) => { if (!actif) e.currentTarget.style.background = '#FAFBFE' }}
                onMouseLeave={(e) => { if (!actif) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc.c, flexShrink: 0 }} />
                {s}
                {actif && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="3" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

export function MesLeadsClient({ leads }) {
  // état local des statuts (mise à jour optimiste)
  const [statuts, setStatuts] = useState(
    Object.fromEntries(leads.map((l) => [l.id, l.statutPromoteur || 'À contacter']))
  )
  const [saving, setSaving] = useState('')

  async function changerStatut(leadId, statut) {
    const ancien = statuts[leadId]
    setStatuts((s) => ({ ...s, [leadId]: statut })) // optimiste
    setSaving(leadId)
    try {
      const res = await fetch('/api/leads/statut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, statut }),
      })
      if (!res.ok) setStatuts((s) => ({ ...s, [leadId]: ancien })) // rollback
    } catch {
      setStatuts((s) => ({ ...s, [leadId]: ancien }))
    } finally {
      setSaving('')
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
          <thead>
            <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
              {['Contact', 'Bien', 'Projet', 'Unité', 'Statut', 'Reçu le'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const cur = statuts[lead.id]
              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E', marginBottom: 2 }}>{lead.nom || 'Sans nom'}</div>
                    <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.email || '—'}</div>
                    {lead.telephone && <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.telephone}</div>}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                    {lead.bien ? (
                      <Link href={`/biens/${lead.bien.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <div style={{ fontWeight: 600, color: '#193B5E', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          {lead.bien.titre}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.2" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </div>
                        {lead.bien.ville && <div style={{ fontSize: 12, color: '#A9B0BE' }}>{lead.bien.ville}</div>}
                      </Link>
                    ) : <span style={{ color: '#C2C8D4' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                    {lead.bien?.projet && lead.bien.projet !== 'Hors projet' ? lead.bien.projet : <span style={{ color: '#C2C8D4' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                    {lead.bien?.unite || <span style={{ color: '#C2C8D4' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <StatutDropdown value={cur} onChange={(s) => changerStatut(lead.id, s)} disabled={saving === lead.id} />
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                    {formatDateHeure(lead.createdAt)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
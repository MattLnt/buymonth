'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FormSelect } from './FormSelect'

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

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

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
          padding: '7px 12px 7px 14px', borderRadius: 20, border: 'none',
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

// Petit bloc info label + valeur
function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A9B0BE', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#3D4759', fontWeight: 600 }}>{value || <span style={{ color: '#C2C8D4', fontWeight: 400 }}>—</span>}</div>
    </div>
  )
}

// Carte KPI
function Kpi({ label, value, accent }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: accent || '#193B5E', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    </div>
  )
}

export function MesLeadsClient({ leads }) {
  // état local des statuts (mise à jour optimiste)
  const [statuts, setStatuts] = useState(
    Object.fromEntries(leads.map((l) => [l.id, l.statutPromoteur || 'À contacter']))
  )
  const [saving, setSaving] = useState('')

  // filtres
  const [q, setQ] = useState('')
  const [statutFiltre, setStatutFiltre] = useState('')

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

  if (leads.length === 0) {
    return (
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '48px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>
        Aucun lead pour le moment.
      </div>
    )
  }

  const totalLeads = leads.length
  const aContacter = Object.values(statuts).filter((s) => s === 'À contacter').length

  const qLow = q.trim().toLowerCase()
  const filtered = leads.filter((lead) => {
    const st = statuts[lead.id] || lead.statutPromoteur || 'À contacter'
    if (statutFiltre && st !== statutFiltre) return false
    if (qLow) {
      const hay = `${lead.nom || ''} ${lead.email || ''} ${lead.telephone || ''} ${lead.bien?.titre || ''} ${lead.bien?.projet || ''} ${lead.bien?.unite || ''}`.toLowerCase()
      if (!hay.includes(qLow)) return false
    }
    return true
  })

  const hasFilters = q || statutFiltre

  return (
    <div>
      <style>{`
        @media (max-width: 640px){
          .mesleads-body { grid-template-columns: 1fr !important; }
          .mesleads-filters { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* 2 KPI côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <Kpi label="Total des leads" value={totalLeads} />
        <Kpi label="À contacter" value={aContacter} accent="#3B62A8" />
      </div>

      {/* Recherche + filtre statut sur la même ligne */}
      <div className="mesleads-filters" style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A9B0BE', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher nom, email, bien..." style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <FormSelect value={statutFiltre} onChange={setStatutFiltre} placeholder="Tous les statuts"
          options={[{ value: '', label: 'Tous les statuts' }, ...STATUTS.map((s) => ({ value: s, label: s }))]} />
      </div>

      {/* Compteur */}
      <div style={{ fontSize: 13.5, color: '#5A6275', marginBottom: 14, fontWeight: 500 }}>
        {filtered.length} lead{filtered.length > 1 ? 's' : ''} {hasFilters ? 'trouvé' + (filtered.length > 1 ? 's' : '') : 'au total'}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '48px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>
          Aucun lead ne correspond à ces filtres.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((lead) => {
            const cur = statuts[lead.id]
            return (
              <div key={lead.id} style={{
                background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 20,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>

                {/* Ligne du haut : identité + statut */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', marginBottom: 6 }}>{lead.nom || 'Sans nom'}</div>
                    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#5A6275' }}>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#5A6275', textDecoration: 'none' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A9B0BE" strokeWidth="1.7"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
                          {lead.email}
                        </a>
                      )}
                      {lead.telephone && (
                        <a href={`tel:${lead.telephone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#5A6275', textDecoration: 'none' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A9B0BE" strokeWidth="1.7"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                          {lead.telephone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    <StatutDropdown value={cur} onChange={(s) => changerStatut(lead.id, s)} disabled={saving === lead.id} />
                  </div>
                </div>

                {/* Corps : infos bien */}
                <div className="mesleads-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, background: '#FAFBFE', borderRadius: 12, padding: '14px 16px' }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A9B0BE', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Bien</div>
                    {lead.bien ? (
                      <Link href={`/biens/${lead.bien.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: '#193B5E', fontSize: 13, fontWeight: 600 }}>
                        {lead.bien.titre}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                      </Link>
                    ) : <span style={{ fontSize: 13, color: '#C2C8D4' }}>—</span>}
                    {lead.bien?.ville && <div style={{ fontSize: 12, color: '#A9B0BE', marginTop: 2 }}>{lead.bien.ville}</div>}
                  </div>
                  <Info label="Projet" value={lead.bien?.projet && lead.bien.projet !== 'Hors projet' ? lead.bien.projet : null} />
                  <Info label="Unité" value={lead.bien?.unite} />
                </div>

                {/* Pied : date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#A9B0BE', borderTop: '1px solid #F4F7FB', paddingTop: 12 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Reçu le {formatDateHeure(lead.createdAt)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
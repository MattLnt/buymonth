'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormSelect } from './FormSelect'
import { Icon } from './Icon'
import { ConfirmModal } from './ConfirmModal'

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

const sourceLabel = {
  SIMULATEUR: { label: 'Simulateur', color: '#1C6B52', bg: 'rgba(124,184,168,0.16)' },
  WIDGET: { label: 'Widget', color: '#3B62A8', bg: 'rgba(91,141,239,0.14)' },
  CONTACT: { label: 'Contact', color: '#8A6D1B', bg: 'rgba(232,153,35,0.14)' },
}

// Statuts internes ADMIN (jeu distinct du promoteur)
const STATUTS_ADMIN = [
  'À contacter',
  'Contact en cours',
  'Projet futur',
  'Dossier introduit',
  'Dossier accepté',
  'Acte passé',
  'Abandon',
  'Refus crédit',
  'Mauvaises coordonnées',
]

const STATUT_COLOR = {
  'À contacter': { c: '#3B62A8', bg: 'rgba(78,125,212,0.12)' },
  'Contact en cours': { c: '#8A6D1B', bg: 'rgba(232,153,35,0.14)' },
  'Projet futur': { c: '#5A6B7D', bg: 'rgba(90,107,125,0.12)' },
  'Dossier introduit': { c: '#1B7A5E', bg: 'rgba(36,158,124,0.12)' },
  'Dossier accepté': { c: '#0F5132', bg: 'rgba(36,158,124,0.18)' },
  'Acte passé': { c: '#0F5132', bg: 'rgba(36,158,124,0.24)' },
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
      const MENU_H = 360
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
          {STATUTS_ADMIN.map((s) => {
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

export function AdminLeadsExplorer({ leads }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [source, setSource] = useState('')
  const [tri, setTri] = useState('recent')
  const [statuts, setStatuts] = useState(
    Object.fromEntries(leads.map((l) => [l.id, l.statutAdmin || 'À contacter']))
  )
  const [saving, setSaving] = useState('')
  const [deleting, setDeleting] = useState('')
  const [aSupprimer, setASupprimer] = useState(null) // lead ciblé par la modale de confirmation

  const sources = useMemo(() => {
    const set = new Set()
    leads.forEach((l) => { if (l.source) set.add(l.source) })
    return [...set]
  }, [leads])

  const filtered = useMemo(() => {
    const qLow = q.trim().toLowerCase()
    let res = leads.filter((l) => {
      if (source && l.source !== source) return false
      if (qLow) {
        const hay = `${l.nom || ''} ${l.societe || ''} ${l.email || ''} ${l.telephone || ''} ${l.bienTitre || ''} ${l.promoteur || ''} ${l.projet || ''} ${l.unite || ''}`.toLowerCase()
        if (!hay.includes(qLow)) return false
      }
      return true
    })

    res = [...res].sort((a, b) => {
      if (tri === 'revenu') return (b.revenu || 0) - (a.revenu || 0)
      if (tri === 'apport') return (b.apport || 0) - (a.apport || 0)
      return 0
    })
    return res
  }, [leads, q, source, tri])

  const hasFilters = q || source

  function reset() {
    setQ(''); setSource(''); setTri('recent')
  }

  async function changerStatut(leadId, statut) {
    const ancien = statuts[leadId]
    setStatuts((s) => ({ ...s, [leadId]: statut }))
    setSaving(leadId)
    try {
      const res = await fetch('/api/admin/leads/statut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, statut }),
      })
      if (!res.ok) setStatuts((s) => ({ ...s, [leadId]: ancien }))
    } catch {
      setStatuts((s) => ({ ...s, [leadId]: ancien }))
    } finally {
      setSaving('')
    }
  }

  async function confirmerSuppression() {
    if (!aSupprimer) return
    const leadId = aSupprimer.id
    setDeleting(leadId)
    try {
      const res = await fetch(`/api/admin/leads?id=${leadId}`, { method: 'DELETE' })
      if (res.ok) {
        setASupprimer(null)
        setDeleting('')
        router.refresh()
      } else {
        setDeleting('')
      }
    } catch {
      setDeleting('')
    }
  }

  return (
    <div>
      <style>{`
        @media (max-width: 800px){ .adm-leads-filters { grid-template-columns: 1fr !important; } }
        @media (max-width: 720px){ .adm-lead-body { grid-template-columns: 1fr !important; } .adm-lead-money { border-left: none !important; border-top: 1px solid #EEF2F7 !important; padding-left: 0 !important; padding-top: 16px !important; margin-top: 4px; } }
      `}</style>

      {/* Filtres */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }} className="adm-leads-filters">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A9B0BE', display: 'flex' }}>
              <Icon name="search" size={16} />
            </span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher nom, entreprise, email, bien, promoteur..." style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>

          <FormSelect value={source} onChange={setSource} placeholder="Toutes les sources"
            options={[{ value: '', label: 'Toutes les sources' }, ...sources.map((s) => ({ value: s, label: sourceLabel[s]?.label || s }))]} />

          <FormSelect value={tri} onChange={setTri} placeholder="Trier"
            options={[
              { value: 'recent', label: 'Plus récents' },
              { value: 'revenu', label: 'Revenus ↓' },
              { value: 'apport', label: 'Apport ↓' },
            ]} />
        </div>

        {hasFilters && (
          <div style={{ marginTop: 12 }}>
            <button onClick={reset} style={{ background: 'none', border: 'none', color: '#7CB8A8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Réinitialiser les filtres</button>
          </div>
        )}
      </div>

      {/* Compteur */}
      <div style={{ fontSize: 13.5, color: '#5A6275', marginBottom: 14, fontWeight: 500 }}>
        {filtered.length} demande{filtered.length > 1 ? 's' : ''} {hasFilters ? 'trouvée' + (filtered.length > 1 ? 's' : '') : 'au total'}
      </div>

      {/* Liste de cartes */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '48px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>
          Aucun lead ne correspond à ces filtres.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((lead) => {
            const src = sourceLabel[lead.source] || { label: lead.source, color: '#8A92A6', bg: '#F2F5FA' }
            const cur = statuts[lead.id]
            return (
              <div key={lead.id} style={{
                background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 20,
                opacity: deleting === lead.id ? 0.4 : 1, transition: 'opacity 0.2s ease',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>

                {/* Ligne du haut : identité + source + statut + suppr */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#193B5E' }}>{lead.nom || 'Sans nom'}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: src.color, background: src.bg, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.02em' }}>{src.label}</span>
                    </div>
                    {lead.societe && (
                      <div style={{ fontSize: 13, color: '#1C6B52', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /></svg>
                        {lead.societe}
                      </div>
                    )}
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <StatutDropdown value={cur} onChange={(s) => changerStatut(lead.id, s)} disabled={saving === lead.id} />
                    <button onClick={() => setASupprimer(lead)} disabled={deleting === lead.id} title="Supprimer (soft delete)"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '9px', borderRadius: 8, background: '#FDF0F0', color: '#E5484D', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </div>
                </div>

                {/* Corps : bien/promoteur à gauche, montants à droite */}
                <div className="adm-lead-body" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'stretch' }}>

                  {/* Colonne info bien */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, background: '#FAFBFE', borderRadius: 12, padding: '14px 16px' }}>
                    <Info label="Promoteur" value={lead.promoteur} />
                    <Info label="Projet" value={lead.projet} />
                    <Info label="Unité" value={lead.unite} />
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A9B0BE', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Bien</div>
                      {lead.bienTitre ? (
                        lead.bienId ? (
                          <a href={`/biens/${lead.bienId}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: '#193B5E', fontSize: 13, fontWeight: 600 }}>
                            {lead.bienTitre}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                          </a>
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#193B5E' }}>{lead.bienTitre}</span>
                        )
                      ) : <span style={{ fontSize: 13, color: '#C2C8D4' }}>—</span>}
                      {lead.bienVille && <div style={{ fontSize: 12, color: '#A9B0BE', marginTop: 2 }}>{lead.bienVille}</div>}
                    </div>
                  </div>

                  {/* Colonne montants */}
                  <div className="adm-lead-money" style={{ borderLeft: '1px solid #EEF2F7', paddingLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                    <Money label="Revenus mensuels" value={lead.revenu} accent="#193B5E" />
                    <Money label="Apport" value={lead.apport} accent="#1C6B52" />
                  </div>
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

      {/* Modale de confirmation premium */}
      <ConfirmModal
        open={!!aSupprimer}
        onClose={() => setASupprimer(null)}
        onConfirm={confirmerSuppression}
        loading={!!deleting}
        title="Supprimer ce lead ?"
        confirmLabel="Supprimer le lead"
        message={
          <>
            {aSupprimer?.nom ? <>Le lead <strong style={{ color: '#193B5E' }}>{aSupprimer.nom}</strong> sera retiré des listes. </> : 'Ce lead sera retiré des listes. '}
            Il s'agit d'une suppression logique : la trace du consentement est conservée en base (conformité RGPD).
          </>
        }
      />
    </div>
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

// Bloc montant, valeur sur UNE ligne
function Money({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A9B0BE', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
        {value ? `${value.toLocaleString('fr-BE')} €` : <span style={{ fontSize: 15, color: '#C2C8D4', fontWeight: 500 }}>Non renseigné</span>}
      </div>
    </div>
  )
}
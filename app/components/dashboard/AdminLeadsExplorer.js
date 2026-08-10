'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { FormSelect } from './FormSelect'
import { Icon } from './Icon'
import { ConfirmModal } from './ConfirmModal'

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

const sourceLabel = {
  SIMULATEUR: { label: 'Simulateur', color: '#7CB8A8', bg: 'rgba(124,184,168,0.14)' },
  WIDGET: { label: 'Widget', color: '#5B8DEF', bg: 'rgba(91,141,239,0.12)' },
  CONTACT: { label: 'Contact', color: '#E89923', bg: 'rgba(232,153,35,0.12)' },
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
      {/* Filtres */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }} className="adm-leads-filters">
          <style>{`
            @media (max-width: 800px){ .adm-leads-filters { grid-template-columns: 1fr !important; } }
          `}</style>

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

      {/* Tableau */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun lead ne correspond à ces filtres.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1080 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Contact', 'Promoteur', 'Bien', 'Projet', 'Unité', 'Revenus', 'Apport', 'Statut', 'Reçu le', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const src = sourceLabel[lead.source] || { label: lead.source, color: '#8A92A6', bg: '#F2F5FA' }
                  const cur = statuts[lead.id]
                  const col = STATUT_COLOR[cur] || STATUT_COLOR['À contacter']
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #F4F7FB', opacity: deleting === lead.id ? 0.4 : 1 }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E', marginBottom: 2 }}>{lead.nom || 'Sans nom'}</div>
                        {lead.societe && <div style={{ fontSize: 12.5, color: '#7CB8A8', fontWeight: 600 }}>{lead.societe}</div>}
                        <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.email || '—'}</div>
                        {lead.telephone && <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.telephone}</div>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759', fontWeight: 600 }}>
                        {lead.promoteur || <span style={{ color: '#C2C8D4', fontWeight: 400 }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                        {lead.bienTitre ? (
                          lead.bienId ? (
                            <a href={`/biens/${lead.bienId}`} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 6, textDecoration: 'none', color: '#193B5E' }}>
                              <span>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                  {lead.bienTitre}
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                </span>
                                {lead.bienVille && <span style={{ fontSize: 12, color: '#A9B0BE', fontWeight: 400 }}>{lead.bienVille}</span>}
                              </span>
                            </a>
                          ) : (
                            <>
                              <div style={{ fontWeight: 600 }}>{lead.bienTitre}</div>
                              {lead.bienVille && <div style={{ fontSize: 12, color: '#A9B0BE' }}>{lead.bienVille}</div>}
                            </>
                          )
                        ) : <span style={{ color: '#C2C8D4' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>{lead.projet || <span style={{ color: '#C2C8D4' }}>—</span>}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>{lead.unite || <span style={{ color: '#C2C8D4' }}>—</span>}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13.5, color: '#3D4759' }}>{lead.revenu ? `${lead.revenu.toLocaleString('fr-BE')} €` : '—'}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13.5, color: '#3D4759' }}>{lead.apport ? `${lead.apport.toLocaleString('fr-BE')} €` : '—'}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={cur}
                            onChange={(e) => changerStatut(lead.id, e.target.value)}
                            disabled={saving === lead.id}
                            style={{
                              appearance: 'none', WebkitAppearance: 'none',
                              padding: '6px 30px 6px 12px', borderRadius: 20,
                              border: 'none', cursor: 'pointer',
                              fontSize: 12.5, fontWeight: 700,
                              color: col.c, background: col.bg,
                              outline: 'none',
                            }}
                          >
                            {STATUTS_ADMIN.map((s) => <option key={s} value={s} style={{ color: '#193B5E', background: '#fff', fontWeight: 500 }}>{s}</option>)}
                          </select>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={col.c} strokeWidth="2.5" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                        {formatDateHeure(lead.createdAt)}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <button onClick={() => setASupprimer(lead)} disabled={deleting === lead.id} title="Supprimer (soft delete)"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: 8, background: '#FDF0F0', color: '#E5484D', border: 'none', cursor: 'pointer' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
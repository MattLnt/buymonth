'use client'

import { useState, useMemo } from 'react'
import { FormSelect } from './FormSelect'
import { Icon } from './Icon'

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

const sourceLabel = {
  SIMULATEUR: { label: 'Simulateur', color: '#7CB8A8', bg: 'rgba(124,184,168,0.14)' },
  WIDGET: { label: 'Widget', color: '#5B8DEF', bg: 'rgba(91,141,239,0.12)' },
  CONTACT: { label: 'Contact', color: '#E89923', bg: 'rgba(232,153,35,0.12)' },
}

export function AdminLeadsExplorer({ leads }) {
  const [q, setQ] = useState('')
  const [source, setSource] = useState('')
  const [tri, setTri] = useState('recent')

  // Sources réellement présentes (pour le filtre)
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
        const hay = `${l.nom || ''} ${l.email || ''} ${l.telephone || ''} ${l.bienTitre || ''}`.toLowerCase()
        if (!hay.includes(qLow)) return false
      }
      return true
    })

    res = [...res].sort((a, b) => {
      if (tri === 'revenu') return (b.revenu || 0) - (a.revenu || 0)
      if (tri === 'apport') return (b.apport || 0) - (a.apport || 0)
      return 0 // recent = ordre serveur (date desc)
    })
    return res
  }, [leads, q, source, tri])

  const hasFilters = q || source

  function reset() {
    setQ(''); setSource(''); setTri('recent')
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
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher nom, email, bien..." style={{ ...inputStyle, paddingLeft: 36 }} />
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
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Contact', 'Bien', 'Revenus', 'Apport', 'Source', 'Date'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const src = sourceLabel[lead.source] || { label: lead.source, color: '#8A92A6', bg: '#F2F5FA' }
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E', marginBottom: 2 }}>{lead.nom || 'Sans nom'}</div>
                        <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.email || '—'}</div>
                        {lead.telephone && <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.telephone}</div>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                        {lead.bienTitre ? (
                          lead.bienId ? (
                            <a href={`/biens/${lead.bienId}`} target="_blank" rel="noopener noreferrer" className="lead-bien-link"
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
                      <td style={{ padding: '14px 18px', fontSize: 13.5, color: '#3D4759' }}>{lead.revenu ? `${lead.revenu.toLocaleString('fr-BE')} €` : '—'}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13.5, color: '#3D4759' }}>{lead.apport ? `${lead.apport.toLocaleString('fr-BE')} €` : '—'}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: src.color, background: src.bg }}>{src.label}</span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
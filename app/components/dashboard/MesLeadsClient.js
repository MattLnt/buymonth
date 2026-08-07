'use client'

import { useState } from 'react'

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
              const col = STATUT_COLOR[cur] || STATUT_COLOR['À contacter']
              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E', marginBottom: 2 }}>{lead.nom || 'Sans nom'}</div>
                    <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.email || '—'}</div>
                    {lead.telephone && <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.telephone}</div>}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                    {lead.bien ? (
                      <>
                        <div style={{ fontWeight: 600 }}>{lead.bien.titre}</div>
                        {lead.bien.ville && <div style={{ fontSize: 12, color: '#A9B0BE' }}>{lead.bien.ville}</div>}
                      </>
                    ) : <span style={{ color: '#C2C8D4' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                    {lead.bien?.projet && lead.bien.projet !== 'Hors projet' ? lead.bien.projet : <span style={{ color: '#C2C8D4' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                    {lead.bien?.unite || <span style={{ color: '#C2C8D4' }}>—</span>}
                  </td>
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
                        {STATUTS.map((s) => <option key={s} value={s} style={{ color: '#193B5E', background: '#fff', fontWeight: 500 }}>{s}</option>)}
                      </select>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={col.c} strokeWidth="2.5" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
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
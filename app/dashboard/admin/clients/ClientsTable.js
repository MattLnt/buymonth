'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const planLabel = {
  CLASSIC: { label: 'Classic', color: '#5A6275', bg: '#F2F5FA' },
  PREMIUM: { label: 'Premium', color: '#7CB8A8', bg: 'rgba(124,184,168,0.14)' },
}

function essaiActifClient(c) {
  return c.trialEndsAt && new Date(c.trialEndsAt).getTime() > Date.now()
}

export function ClientsTable({ clients }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date' | 'biens' | 'plan'

  const filtered = useMemo(() => {
    let list = [...clients]

    // Recherche par nom d'agence
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((c) => (c.societe || '').toLowerCase().includes(q))

    // Tri
    if (sortBy === 'biens') {
      list.sort((a, b) => b.nbBiens - a.nbBiens)
    } else if (sortBy === 'plan') {
      const rank = { PREMIUM: 0, CLASSIC: 1 }
      list.sort((a, b) => (rank[a.plan] ?? 9) - (rank[b.plan] ?? 9))
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return list
  }, [clients, search, sortBy])

  const sortBtn = (key, label) => (
    <button
      onClick={() => setSortBy(key)}
      style={{
        padding: '8px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        border: `1.5px solid ${sortBy === key ? '#7CB8A8' : '#E8EDF2'}`,
        background: sortBy === key ? 'rgba(124,184,168,0.1)' : '#fff',
        color: sortBy === key ? '#193B5E' : '#5A6275',
      }}
    >
      {label}
    </button>
  )

  return (
    <>
      {/* Barre recherche + tri */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#A9B0BE" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une agence..."
            style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, color: '#8A92A6', fontWeight: 600, marginRight: 2 }}>Trier :</span>
          {sortBtn('date', 'Date')}
          {sortBtn('biens', 'Biens')}
          {sortBtn('plan', 'Plan')}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
            <thead>
              <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                {['Société', 'Contact', 'Biens', 'Plan', 'Essai', 'Inscrit le', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px 0', textAlign: 'center', color: '#A9B0BE', fontSize: 14 }}>Aucun client trouvé.</td></tr>
              ) : filtered.map((c) => {
                const plan = planLabel[c.plan] || planLabel.CLASSIC
                const enEssai = essaiActifClient(c)
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#16324F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7CB8A8', fontWeight: 700, fontSize: 15, flexShrink: 0, overflow: 'hidden' }}>
                          {c.logoUrl ? <img src={c.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (c.societe?.[0]?.toUpperCase() || '?')}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{c.societe || 'Sans nom'}</div>
                          {c.telephone && <div style={{ fontSize: 12, color: '#A9B0BE' }}>{c.telephone}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: '#5A6275' }}>{c.email || '—'}</td>
                    <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{c.nbBiens}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: plan.color, background: plan.bg }}>{plan.label}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {enEssai ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: '#249E7C', background: 'rgba(36,158,124,0.12)' }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#249E7C' }} />
                          {new Date(c.trialEndsAt).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit' })}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12.5, color: '#C2C8D4' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                      {new Date(c.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <Link href={`/dashboard/admin/clients/${c.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, background: '#193B5E', color: '#fff', fontSize: 12.5, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        Voir plus
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
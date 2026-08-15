'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'

const formuleLabel = {
  PRO: { label: 'Pro', color: '#5A6275', bg: '#F2F5FA' },
  PRO_PLUS: { label: 'Pro+', color: '#3B62A8', bg: 'rgba(78,125,212,0.12)' },
}

export function ClientsTable({ clients }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date' | 'biens' | 'formule'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const filtered = useMemo(() => {
    let list = [...clients]

    // Recherche par nom d'agence
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((c) => (c.societe || '').toLowerCase().includes(q))

    // Tri
    if (sortBy === 'biens') {
      list.sort((a, b) => b.nbBiens - a.nbBiens)
    } else if (sortBy === 'formule') {
      const rank = { PRO_PLUS: 0, PRO: 1 }
      list.sort((a, b) => (rank[a.formule] ?? 9) - (rank[b.formule] ?? 9))
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

  const avatar = (c) => (
    <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#16324F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7CB8A8', fontWeight: 700, fontSize: 16, flexShrink: 0, overflow: 'hidden' }}>
      {c.logoUrl ? <img src={c.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (c.societe?.[0]?.toUpperCase() || '?')}
    </div>
  )

  const formuleBadge = (c) => {
    const formule = formuleLabel[c.formule] || formuleLabel.PRO
    return <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: formule.color, background: formule.bg }}>{formule.label}</span>
  }

  const dateFmt = (c) => new Date(c.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })

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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: '#8A92A6', fontWeight: 600, marginRight: 2 }}>Trier :</span>
          {sortBtn('date', 'Date')}
          {sortBtn('biens', 'Biens')}
          {sortBtn('formule', 'Formule')}
        </div>
      </div>

      {/* MOBILE : cartes */}
      {isMobile ? (
        filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 14, padding: '40px 20px', textAlign: 'center', color: '#A9B0BE', fontSize: 14 }}>Aucun client trouvé.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((c) => (
              <div key={c.id} style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  {avatar(c)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.societe || 'Sans nom'}</div>
                    {c.telephone && <div style={{ fontSize: 12.5, color: '#A9B0BE' }}>{c.telephone}</div>}
                  </div>
                  {formuleBadge(c)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px', padding: '12px 14px', background: '#FAFBFE', borderRadius: 10, marginBottom: 14 }}>
                  <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Contact</div>
                    <div style={{ fontSize: 13.5, color: '#3D4759', wordBreak: 'break-word' }}>{c.email || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Biens</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{c.nbBiens}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Inscrit le</div>
                    <div style={{ fontSize: 13.5, color: '#3D4759' }}>{dateFmt(c)}</div>
                  </div>
                </div>

                <Link href={`/dashboard/admin/clients/${c.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 14px', borderRadius: 10, background: '#193B5E', color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
                  Voir plus
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
              </div>
            ))}
          </div>
        )
      ) : (
        /* DESKTOP : table */
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Société', 'Contact', 'Biens', 'Formule', 'Inscrit le', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px 0', textAlign: 'center', color: '#A9B0BE', fontSize: 14 }}>Aucun client trouvé.</td></tr>
                ) : filtered.map((c) => {
                  const formule = formuleLabel[c.formule] || formuleLabel.PRO
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
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: formule.color, background: formule.bg }}>{formule.label}</span>
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
      )}
    </>
  )
}
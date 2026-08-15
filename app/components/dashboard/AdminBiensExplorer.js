'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { FormSelect } from './FormSelect'
import { Icon } from './Icon'

const TYPES = ['Appartement', 'Maison', 'Studio', 'Villa', 'Terrain', 'Bureau', 'Commerce']
const PROVINCES = ['Anvers', 'Brabant flamand', 'Brabant wallon', 'Bruxelles', 'Flandre-Occidentale', 'Flandre-Orientale', 'Hainaut', 'Liège', 'Limbourg', 'Luxembourg', 'Namur']

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

export function AdminBiensExplorer({ biens }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [province, setProvince] = useState('')
  const [statut, setStatut] = useState('')
  const [tri, setTri] = useState('recent')
  const [isMobile, setIsMobile] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const filtered = useMemo(() => {
    const qLow = q.trim().toLowerCase()
    let res = biens.filter((b) => {
      if (type && b.type !== type) return false
      if (province && b.province !== province) return false
      if (statut === 'publie' && !b.published) return false
      if (statut === 'brouillon' && b.published) return false
      if (qLow) {
        const hay = `${b.titre || ''} ${b.ville || ''} ${b.societe || ''}`.toLowerCase()
        if (!hay.includes(qLow)) return false
      }
      return true
    })

    res = [...res].sort((a, b) => {
      if (tri === 'mensualite') return (b.mensualite || 0) - (a.mensualite || 0)
      if (tri === 'prix') return (b.prixTotal || 0) - (a.prixTotal || 0)
      if (tri === 'leads') return (b.nbLeads || 0) - (a.nbLeads || 0)
      return 0 // 'recent' = ordre d'origine (déjà trié par date desc côté serveur)
    })
    return res
  }, [biens, q, type, province, statut, tri])

  const hasFilters = q || type || province || statut
  const activeCount = [q, type, province, statut].filter(Boolean).length

  function reset() {
    setQ(''); setType(''); setProvince(''); setStatut(''); setTri('recent')
  }

  return (
    <div>
      {/* Barre de filtres */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 18, marginBottom: 18 }}>
        <style>{`
          @media (max-width: 1100px){ .adm-filters-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 600px){ .adm-filters-grid { grid-template-columns: 1fr !important; } }
        `}</style>

        {/* Bouton déplier/replier (mobile) */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: filtersOpen ? 16 : 0 }}>
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 11, border: '1.5px solid #193B5E', background: '#fff', color: '#193B5E', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              Filtres
              {activeCount > 0 && (
                <span style={{ background: '#193B5E', color: '#fff', borderRadius: 999, minWidth: 20, height: 20, padding: '0 6px', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{activeCount}</span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 2, transition: 'transform 0.18s', transform: filtersOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {hasFilters && (
              <button onClick={reset} style={{ background: 'none', border: 'none', color: '#7CB8A8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Réinitialiser</button>
            )}
          </div>
        )}

        {/* Grille de filtres : toujours visible en desktop, dépliable en mobile */}
        {(!isMobile || filtersOpen) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: 12, alignItems: 'end' }} className="adm-filters-grid">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A9B0BE', display: 'flex' }}>
              <Icon name="search" size={16} />
            </span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher bien ou promoteur..." style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>

          <FormSelect value={type} onChange={setType} placeholder="Tous les types"
            options={['', ...TYPES].map((t) => ({ value: t, label: t || 'Tous les types' }))} />

          <FormSelect value={province} onChange={setProvince} placeholder="Toutes provinces"
            options={['', ...PROVINCES].map((p) => ({ value: p, label: p || 'Toutes provinces' }))} />

          <FormSelect value={statut} onChange={setStatut} placeholder="Tous statuts"
            options={[{ value: '', label: 'Tous statuts' }, { value: 'publie', label: 'Publiés' }, { value: 'brouillon', label: 'Brouillons' }]} />

          <FormSelect value={tri} onChange={setTri} placeholder="Trier"
            options={[
              { value: 'recent', label: 'Plus récents' },
              { value: 'mensualite', label: 'Mensualité ↓' },
              { value: 'prix', label: 'Prix ↓' },
              { value: 'leads', label: 'Leads ↓' },
            ]} />
        </div>
        )}

        {!isMobile && hasFilters && (
          <div style={{ marginTop: 12 }}>
            <button onClick={reset} style={{ background: 'none', border: 'none', color: '#7CB8A8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Réinitialiser les filtres</button>
          </div>
        )}
      </div>

      {/* Compteur */}
      <div style={{ fontSize: 13.5, color: '#5A6275', marginBottom: 14, fontWeight: 500 }}>
        {filtered.length} bien{filtered.length > 1 ? 's' : ''} {hasFilters ? 'trouvé' + (filtered.length > 1 ? 's' : '') : 'au total'}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '48px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun bien ne correspond à ces filtres.</div>
      ) : isMobile ? (
        /* MOBILE : cartes */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((b) => (
            <div key={b.id} style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 56, height: 48, borderRadius: 8, background: b.images?.[0] ? `url(${b.images[0]}) center/cover` : '#EEF3FA', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.titre}</div>
                  <div style={{ fontSize: 12.5, color: '#A9B0BE' }}>{[b.ville, b.type].filter(Boolean).join(' · ') || '—'}</div>
                </div>
                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, flexShrink: 0, color: b.published ? '#249E7C' : '#A9B0BE', background: b.published ? 'rgba(36,158,124,0.12)' : '#F2F5FA' }}>
                  {b.published ? 'Publié' : 'Brouillon'}
                </span>
              </div>

              <div style={{ background: '#FAFBFE', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Promoteur</div>
                  <div style={{ fontSize: 13.5, color: '#3D4759', fontWeight: 600, wordBreak: 'break-word' }}>{b.societe || '—'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Mensualité</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#7CB8A8' }}>{b.mensualite ? `${b.mensualite.toLocaleString('fr-BE')} €` : '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Prix</div>
                    <div style={{ fontSize: 13.5, color: '#3D4759', fontWeight: 600 }}>{b.prixTotal ? `${b.prixTotal.toLocaleString('fr-BE')} €` : '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Leads</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#193B5E' }}>{b.nbLeads}</div>
                  </div>
                </div>
              </div>

              <Link href={`/biens/${b.id}`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', background: '#fff', color: '#193B5E', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
                Voir le bien
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* DESKTOP : table */
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Bien', 'Promoteur', 'Mensualité', 'Prix', 'Leads', 'Statut', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 40, borderRadius: 8, background: b.images?.[0] ? `url(${b.images[0]}) center/cover` : '#EEF3FA', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{b.titre}</div>
                          <div style={{ fontSize: 12, color: '#A9B0BE' }}>{[b.ville, b.type].filter(Boolean).join(' · ') || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: 13, color: '#5A6275' }}>{b.societe || '—'}</td>
                    <td style={{ padding: '12px 18px', fontSize: 14, fontWeight: 700, color: '#7CB8A8' }}>{b.mensualite?.toLocaleString('fr-BE')} €</td>
                    <td style={{ padding: '12px 18px', fontSize: 13, color: '#5A6275' }}>{b.prixTotal?.toLocaleString('fr-BE')} €</td>
                    <td style={{ padding: '12px 18px', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{b.nbLeads}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: b.published ? '#249E7C' : '#A9B0BE', background: b.published ? 'rgba(36,158,124,0.12)' : '#F2F5FA' }}>
                        {b.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <Link href={`/biens/${b.id}`} target="_blank" style={{ fontSize: 12.5, color: '#7CB8A8', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Voir →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
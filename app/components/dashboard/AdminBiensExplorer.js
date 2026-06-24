'use client'

import { useState, useMemo } from 'react'
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

  function reset() {
    setQ(''); setType(''); setProvince(''); setStatut(''); setTri('recent')
  }

  return (
    <div>
      {/* Barre de filtres */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: 12, alignItems: 'end' }} className="adm-filters-grid">
          <style>{`
            @media (max-width: 1100px){ .adm-filters-grid { grid-template-columns: 1fr 1fr !important; } }
            @media (max-width: 600px){ .adm-filters-grid { grid-template-columns: 1fr !important; } }
          `}</style>

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

        {hasFilters && (
          <div style={{ marginTop: 12 }}>
            <button onClick={reset} style={{ background: 'none', border: 'none', color: '#7CB8A8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Réinitialiser les filtres</button>
          </div>
        )}
      </div>

      {/* Compteur */}
      <div style={{ fontSize: 13.5, color: '#5A6275', marginBottom: 14, fontWeight: 500 }}>
        {filtered.length} bien{filtered.length > 1 ? 's' : ''} {hasFilters ? 'trouvé' + (filtered.length > 1 ? 's' : '') : 'au total'}
      </div>

      {/* Tableau */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun bien ne correspond à ces filtres.</div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
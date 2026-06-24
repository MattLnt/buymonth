'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from './Icon'

export function BienCard({ bien }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/biens?id=${bien.id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
      else setDeleting(false)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* image / placeholder */}
      <div style={{ height: 150, background: bien.images?.[0] ? `url(${bien.images[0]}) center/cover` : 'linear-gradient(135deg, #EEF3FA, #E3ECF5)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!bien.images?.[0] && <Icon name="building" size={36} color="#B7C4D6" />}
        <span style={{ position: 'absolute', top: 12, left: 12, background: bien.published ? 'rgba(36,158,124,0.92)' : 'rgba(138,146,166,0.92)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
          {bien.published ? 'Publié' : 'Brouillon'}
        </span>
        {/* Pastille leads en haut à droite */}
        <span style={{ position: 'absolute', top: 12, right: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: (bien.nbLeads || 0) > 0 ? 'rgba(25,59,94,0.92)' : 'rgba(255,255,255,0.92)', color: (bien.nbLeads || 0) > 0 ? '#fff' : '#8A92A6', fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          {bien.nbLeads || 0}
        </span>
      </div>

      {/* contenu */}
      <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 4px', lineHeight: 1.3 }}>{bien.titre}</h3>
        <div style={{ fontSize: 13, color: '#8A92A6', marginBottom: 12 }}>
          {[bien.ville, bien.province].filter(Boolean).join(', ') || 'Localisation non précisée'}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#7CB8A8', letterSpacing: '-0.02em' }}>{bien.mensualite} €<span style={{ fontSize: 13 }}>/mois</span></span>
          <span style={{ fontSize: 13, color: '#A9B0BE' }}>· {bien.prixTotal.toLocaleString('fr-BE')} €</span>
        </div>

        <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: '#5A6275', marginBottom: 16, flexWrap: 'wrap' }}>
          {bien.type && <span>{bien.type}</span>}
          {bien.chambres != null && <span>{bien.chambres} ch.</span>}
          {bien.surface != null && <span>{bien.surface} m²</span>}
        </div>

        {/* actions */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
          <Link href={`/dashboard/client/biens/${bien.id}`} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', borderRadius: 9, background: '#F2F5FA', color: '#193B5E', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Éditer
          </Link>

          {confirm ? (
            <div style={{ display: 'flex', gap: 6, flex: 1 }}>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '9px 8px', borderRadius: 9, background: '#E5484D', color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                {deleting ? '...' : 'Confirmer'}
              </button>
              <button onClick={() => setConfirm(false)} style={{ padding: '9px 10px', borderRadius: 9, background: '#F2F5FA', color: '#5A6275', border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                Non
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)} title="Supprimer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '9px 12px', borderRadius: 9, background: '#FDF0F0', color: '#E5484D', border: 'none', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
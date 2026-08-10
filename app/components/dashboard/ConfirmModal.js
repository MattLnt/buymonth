'use client'

import { useEffect } from 'react'

/*
 * Modale de confirmation réutilisable.
 * Props :
 *   open        : booléen — affiche ou non la modale
 *   onClose     : fn — appelée sur Annuler / clic dehors / Échap
 *   onConfirm   : fn — appelée sur le bouton de confirmation
 *   title       : titre (défaut « Confirmer l'action »)
 *   message     : texte explicatif (string ou node)
 *   confirmLabel: libellé du bouton d'action (défaut « Supprimer »)
 *   cancelLabel : libellé du bouton d'annulation (défaut « Annuler »)
 *   loading     : booléen — état en cours (désactive les boutons)
 *   danger      : booléen — bouton rouge (défaut true) ; sinon navy
 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  message = 'Cette action est définitive.',
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  loading = false,
  danger = true,
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape' && !loading) onClose?.() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, loading, onClose])

  if (!open) return null

  const accent = danger ? '#E5484D' : '#193B5E'
  const accentBg = danger ? 'rgba(229,72,77,0.1)' : 'rgba(25,59,94,0.08)'

  return (
    <div
      onClick={() => !loading && onClose?.()}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,36,56,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 24px 70px rgba(0,0,0,0.3)', position: 'relative' }}
      >
        {/* Icône */}
        <div style={{ width: 52, height: 52, borderRadius: 14, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#193B5E', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{title}</h3>
        <div style={{ fontSize: 14, color: '#5A6275', lineHeight: 1.6, margin: '0 0 24px' }}>{message}</div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={() => onClose?.()}
            disabled={loading}
            style={{ padding: '11px 18px', borderRadius: 10, background: '#F2F5FA', color: '#5A6275', border: 'none', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm?.()}
            disabled={loading}
            style={{ padding: '11px 20px', borderRadius: 10, background: accent, color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
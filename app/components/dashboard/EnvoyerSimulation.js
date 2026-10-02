'use client'

import { useEffect, useState } from 'react'

/*
 * Bouton « Envoyer la simulation » + petite fenêtre de saisie de l'adresse e-mail du client.
 * Le promoteur saisit l'adresse, BuyMonth envoie l'e-mail avec le lien de simulation du bien.
 * Props :
 *   bien    : { id, titre, published }
 *   variant : 'card' (bouton compact dans la carte) | 'header' (bouton plein dans l'en-tête de page)
 */
export function EnvoyerSimulation({ bien, variant = 'card' }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape' && !loading) fermer() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, loading])

  function fermer() {
    setOpen(false)
    setTimeout(() => { setEmail(''); setSent(false); setError('') }, 200)
  }

  async function envoyer(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/biens/envoyer-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bien.id, email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Envoi impossible.'); return }
      setSent(true)
    } catch {
      setError('Envoi impossible. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  const icone = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )

  const bouton = variant === 'header' ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
    >
      {icone}
      Envoyer la simulation
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      title="Envoyer le lien de simulation à un client"
      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', borderRadius: 9, background: '#193B5E', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
    >
      {icone}
      Envoyer la simulation
    </button>
  )

  return (
    <>
      {bouton}

      {open && (
        <div
          onClick={() => !loading && fermer()}
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,36,56,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <form
            onSubmit={envoyer}
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 440, boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: sent ? 'rgba(36,158,124,0.12)' : 'rgba(25,59,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              {sent ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#193B5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              )}
            </div>

            {sent ? (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#193B5E', margin: '0 0 8px', letterSpacing: '-0.01em' }}>Simulation envoyée</h3>
                <p style={{ fontSize: 14, color: '#5A6275', lineHeight: 1.6, margin: '0 0 24px' }}>
                  Votre client recevra dans quelques instants un e-mail BuyMonth avec le lien de simulation du bien <strong style={{ color: '#193B5E' }}>{bien.titre}</strong>.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => { setSent(false); setEmail('') }} style={{ padding: '11px 18px', borderRadius: 10, background: '#F2F5FA', color: '#5A6275', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Envoyer à un autre client
                  </button>
                  <button type="button" onClick={fermer} style={{ padding: '11px 20px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Fermer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#193B5E', margin: '0 0 8px', letterSpacing: '-0.01em' }}>Envoyer la simulation</h3>
                <p style={{ fontSize: 14, color: '#5A6275', lineHeight: 1.6, margin: '0 0 20px' }}>
                  Votre client recevra un e-mail BuyMonth, à votre nom, avec le lien pour simuler sa mensualité sur le bien <strong style={{ color: '#193B5E' }}>{bien.titre}</strong>.
                </p>

                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                  Adresse e-mail du client
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@exemple.be"
                  required
                  autoFocus
                  disabled={loading}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${error ? '#E5484D' : '#E8EDF2'}`, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.target.style.borderColor = '#7CB8A8')}
                  onBlur={(e) => (e.target.style.borderColor = error ? '#E5484D' : '#E8EDF2')}
                />
                {error && <p style={{ fontSize: 13, color: '#E5484D', margin: '8px 0 0', lineHeight: 1.5 }}>{error}</p>}

                <p style={{ fontSize: 12, color: '#8A92A6', margin: '14px 0 22px', lineHeight: 1.5 }}>
                  L'adresse sert uniquement à cet envoi et n'est pas conservée.
                </p>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" onClick={fermer} disabled={loading} style={{ padding: '11px 18px', borderRadius: 10, background: '#F2F5FA', color: '#5A6275', border: 'none', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                    Annuler
                  </button>
                  <button type="submit" disabled={loading || !email} style={{ padding: '11px 20px', borderRadius: 10, background: loading || !email ? '#E5E9F0' : '#193B5E', color: loading || !email ? '#9AA2B4' : '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : !email ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </>
  )
}

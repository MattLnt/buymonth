'use client'
import { useState } from 'react'
import Link from 'next/link'
import Logo from '../components/Logo'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/mot-de-passe-oublie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Une erreur est survenue')
      } else {
        setSent(true)
      }
    } catch {
      setError('Une erreur est survenue')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141414', padding: '24px', fontFamily: 'var(--font-sans)' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Logo dark height={28} />
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#141414', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Email envoyé</h1>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: '0 0 24px' }}>
                Si un compte existe avec l'adresse <strong style={{ color: '#141414' }}>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques instants. Pensez à vérifier vos spams.
              </p>
              <Link href="/login" style={{ display: 'inline-block', background: '#141414', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141414', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Mot de passe oublié ?</h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 24px', lineHeight: 1.6 }}>
                Entrez votre adresse email, nous vous enverrons un lien pour le réinitialiser.
              </p>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13, borderRadius: 12, padding: '12px 16px', marginBottom: 18 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com"
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#141414', outline: 'none', boxSizing: 'border-box', background: '#fafafa', marginBottom: 18 }}
                  onFocus={(e) => (e.target.style.borderColor = '#FF5A1F')} onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')} />
                <button type="submit" disabled={loading || !email}
                  style={{ width: '100%', background: loading || !email ? '#e5e7eb' : '#FF5A1F', color: loading || !email ? '#9ca3af' : '#141414', fontWeight: 700, padding: 14, borderRadius: 12, border: 'none', cursor: loading || !email ? 'not-allowed' : 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {loading
                    ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Envoi...</>
                    : 'Envoyer le lien →'}
                </button>
              </form>

              <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', margin: '20px 0 0' }}>
                <Link href="/login" style={{ color: '#141414', fontWeight: 700, textDecoration: 'none' }}>← Retour à la connexion</Link>
              </p>
            </>
          )}
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: '20px 0 0' }}>© 2026 Fiderio · Belgique</p>
      </div>
    </main>
  )
}
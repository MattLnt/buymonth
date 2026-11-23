'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const conditions = [
    { label: '9 caractères min.', ok: password.length >= 9 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Un chiffre', ok: /[0-9]/.test(password) },
    { label: 'Un symbole (!@#...)', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const allValid = conditions.every((c) => c.ok)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allValid) { setError('Le mot de passe ne respecte pas les critères de sécurité.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/reinitialiser-mot-de-passe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue')
      } else {
        setDone(true)
        setTimeout(() => router.push('/login'), 3000)
      }
    } catch {
      setError('Une erreur est survenue')
    }
    setLoading(false)
  }

  if (!token) {
    return (
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', boxShadow: '0 20px 60px rgba(15,42,64,0.4)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#193B5E', margin: '0 0 10px' }}>Lien invalide</h1>
        <p style={{ fontSize: 14, color: '#5A6275', lineHeight: 1.7, margin: '0 0 24px' }}>Ce lien de réinitialisation est incomplet. Refaites une demande depuis la page de connexion.</p>
        <Link href="/mot-de-passe-oublie" style={{ display: 'inline-block', background: '#193B5E', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          Refaire une demande
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', boxShadow: '0 20px 60px rgba(15,42,64,0.4)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(124,184,168,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#193B5E', margin: '0 0 10px' }}>Mot de passe modifié !</h1>
        <p style={{ fontSize: 14, color: '#5A6275', lineHeight: 1.7, margin: '0 0 24px' }}>Vous allez être redirigé vers la page de connexion...</p>
        <Link href="/login" style={{ display: 'inline-block', background: '#193B5E', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          Se connecter maintenant
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', boxShadow: '0 20px 60px rgba(15,42,64,0.4)' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#193B5E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Nouveau mot de passe</h1>
      <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 24px', lineHeight: 1.6 }}>Choisissez un nouveau mot de passe pour votre compte.</p>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, borderRadius: 12, padding: '12px 16px', marginBottom: 18 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Nouveau mot de passe</label>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Votre nouveau mot de passe"
            style={{ width: '100%', border: '1.5px solid #E8EDF2', borderRadius: 12, padding: '12px 44px 12px 14px', fontSize: 14, color: '#193B5E', outline: 'none', boxSizing: 'border-box', background: '#FAFDFD' }}
            onFocus={(e) => (e.target.style.borderColor = '#7CB8A8')} onBlur={(e) => (e.target.style.borderColor = '#E8EDF2')} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#A9B0BE' }}>
            {showPassword
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
          </button>
        </div>

        {password.length > 0 && (
          <div style={{ marginBottom: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {conditions.map((cond, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: cond.ok ? 'rgba(124,184,168,0.16)' : '#F3F4F6', border: '1.5px solid ' + (cond.ok ? '#7CB8A8' : '#E8EDF2'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cond.ok && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#249E7C" strokeWidth="2.5"><path d="M2 6l3 3 5-5"/></svg>}
                </div>
                <span style={{ fontSize: 11, color: cond.ok ? '#1C6B52' : '#9ca3af', fontWeight: cond.ok ? 600 : 400 }}>{cond.label}</span>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={!allValid || loading}
          style={{ width: '100%', background: !allValid || loading ? '#E8EDF2' : '#193B5E', color: !allValid || loading ? '#9ca3af' : '#fff', fontWeight: 700, padding: 14, borderRadius: 12, border: 'none', cursor: !allValid || loading ? 'not-allowed' : 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading
            ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Modification...</>
            : 'Modifier mon mot de passe →'}
        </button>
      </form>
    </div>
  )
}

export default function ReinitialiserMotDePassePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(150deg, #16324F 0%, #1D4267 55%, #245479 100%)', padding: '24px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em' }}>
            Buy<span style={{ color: '#7CB8A8' }}>Month</span>
          </Link>
        </div>
        <Suspense fallback={null}>
          <ResetForm />
        </Suspense>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '20px 0 0' }}>© 2026 BuyMonth · Belgique</p>
      </div>
    </main>
  )
}
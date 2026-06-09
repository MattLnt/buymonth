'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Logo from '../../components/Logo'

export default function RegisterAcheteurPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', role: 'ACHETEUR' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const conditions = [
    { label: '9 caractères min.', ok: form.password.length >= 9 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(form.password) },
    { label: 'Un chiffre', ok: /[0-9]/.test(form.password) },
    { label: 'Un symbole (!@#...)', ok: /[^A-Za-z0-9]/.test(form.password) },
  ]
  const allValid = conditions.every(c => c.ok)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allValid) { setError('Le mot de passe ne respecte pas les critères de sécurité.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.message || 'Une erreur est survenue'); setLoading(false); return }
    const signInRes = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    setLoading(false)
    if (signInRes?.error) { router.push('/login'); return }
    router.push('/dashboard/acheteur')
    router.refresh()
  }

  const inputStyle = { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px 12px 42px', fontSize: '14px', color: '#141414', outline: 'none', boxSizing: 'border-box', background: '#fafafa', transition: 'border-color 0.2s' }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', background: '#F6F8F6' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .register-left { display: none !important; }
          .register-right { padding: 0 !important; background: #141414 !important; align-items: flex-start !important; }
          .register-form-card { border-radius: 24px 24px 0 0 !important; min-height: calc(100vh - 220px) !important; }
          .register-mobile-hero { display: block !important; }
        }
        @media (min-width: 1025px) {
          .register-mobile-hero { display: none !important; }
          .register-form-card { border-radius: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      {/* Panneau gauche */}
      <div className="register-left" style={{ width: '52%', background: 'linear-gradient(160deg, #141414 0%, #1F1F22 50%, #141414 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,90,31,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,90,31,0.05)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo dark height={28} />
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,90,31,0.15)', border: '1px solid rgba(255,90,31,0.3)', borderRadius: '20px', padding: '6px 14px', marginBottom: '28px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF5A1F' }} />
            <span style={{ fontSize: '12px', color: '#FF5A1F', fontWeight: 600 }}>Compte Acheteur</span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 700, color: 'white', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Accédez à tous les<br />dossiers disponibles<br /><span style={{ color: '#FF5A1F' }}>en Belgique.</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '340px' }}>
            Trouvez le cabinet qui correspond à vos critères parmi toutes les opportunités disponibles.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              'Accès à tous les dossiers anonymisés',
              "Filtres par province, chiffre d'affaires annuel et type de transaction",
              'Alertes en temps réel sur les nouvelles opportunités',
              'Déblocage sécurisé avec CGV intégrées — 699 €/dossier',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,90,31,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pas de bloc tarif ici */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>© 2026 Fiderio · Belgique</p>
        </div>
      </div>

      {/* Panneau droit */}
      <div className="register-right" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'white', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Hero mobile */}
          <div className="register-mobile-hero" style={{ padding: '48px 28px 36px', position: 'relative', display: 'none' }}>
            <div style={{ position: 'absolute', top: 0, right: -28, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,90,31,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
              <Logo dark height={24} />
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1.2, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Créer un compte<br /><span style={{ color: '#FF5A1F' }}>acheteur</span>
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Accédez à tous les dossiers disponibles</p>
          </div>

          {/* Card formulaire */}
          <div className="register-form-card" style={{ background: '#fff', padding: '32px 28px', borderRadius: 0 }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#141414', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Créer un compte acheteur
              </h2>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Accédez à tous les dossiers disponibles</p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '13px', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="vous@exemple.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#FF5A1F'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="Votre mot de passe"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={e => e.target.style.borderColor = '#FF5A1F'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}>
                    {showPassword
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {conditions.map((cond, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, background: cond.ok ? 'rgba(255,90,31,0.1)' : '#f3f4f6', border: '1.5px solid ' + (cond.ok ? '#FF5A1F' : '#e5e7eb'), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                          {cond.ok && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M2 6l3 3 5-5"/></svg>}
                        </div>
                        <span style={{ fontSize: '11px', color: cond.ok ? '#FF5A1F' : '#9ca3af', fontWeight: cond.ok ? 600 : 400 }}>{cond.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={!allValid || loading}
                style={{ width: '100%', background: !allValid || loading ? '#e5e7eb' : '#FF5A1F', color: !allValid || loading ? '#9ca3af' : '#141414', fontWeight: 700, padding: '14px', borderRadius: '12px', border: 'none', cursor: !allValid || loading ? 'not-allowed' : 'pointer', fontSize: '15px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading
                  ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Création...</>
                  : 'Créer mon compte acheteur →'}
              </button>

              <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                Déjà un compte ?{' '}
                <Link href="/login" style={{ color: '#141414', fontWeight: 700, textDecoration: 'none' }}>Se connecter →</Link>
              </p>

              <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                En créant un compte, vous acceptez nos <Link href="/cgv" style={{ color: '#141414', fontWeight: 600, textDecoration: 'none' }}>CGV</Link>
              </p>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
              <span style={{ fontSize: '12px', color: '#d1d5db' }}>ou</span>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                Vous voulez vendre ?{' '}
                <Link href="/register/vendeur" style={{ color: '#141414', fontWeight: 700, textDecoration: 'none' }}>Créer un compte vendeur →</Link>
              </p>
              <p style={{ fontSize: '11px', color: '#d1d5db', margin: 0 }}>© 2026 Fiderio · Belgique</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
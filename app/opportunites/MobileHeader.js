'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import OpportuniteSwitcher from './OpportuniteSwitcher'
import CAFilter from './CAFilter'
import Logo from '@/app/components/Logo'

const provinces = ["Anvers", "Bruxelles", "Flandre orientale", "Flandre occidentale", "Brabant flamand", "Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur", "Limbourg"];
const deals = [
  { value: "VENTE", label: "Vente" },
  { value: "FUSION", label: "Fusion" },
  { value: "OUVERTURE_CAPITAL", label: "Ouverture du capital" },
  { value: "COLLABORATION", label: "Collaboration" },
];

const navLinks = [
  { href: "/opportunites", label: "Opportunités", desc: "Voir les dossiers disponibles" },
  { href: "/tarifs", label: "Tarifs", desc: "Simple et transparent" },
  { href: "/faq", label: "FAQ", desc: "Toutes vos questions" },
  { href: "/contact", label: "Contact", desc: "Notre équipe vous répond" },
];

export default function MobileHeader({ province, typeDeal, caMin, caMax, hasFilters, activeCount }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{`
        @media (min-width: 1025px) {
          .mobile-header-opportunites { display: none !important; }
          .mobile-menu-opp { display: none !important; }
        }
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes itemIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Barre sticky mobile */}
      <div className="mobile-header-opportunites" style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: menuOpen ? '#141414' : 'white',
        borderBottom: menuOpen ? '1px solid rgba(255,255,255,0.07)' : '1px solid #F3F4F6',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
          <Logo dark={menuOpen} height={20} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Bouton filtres */}
          <button onClick={() => setDrawerOpen(true)} style={{
            position: 'relative', flexShrink: 0,
            background: hasFilters ? '#141414' : '#F3F4F6',
            border: 'none', borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            color: hasFilters ? '#fff' : '#374151',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filtres
            {activeCount > 0 && (
              <div style={{ background: '#FF5A1F', color: '#141414', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeCount}
              </div>
            )}
          </button>

          {/* Burger menu */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, width: 36, height: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', height: 2, borderRadius: 2,
                background: menuOpen ? '#FF5A1F' : '#141414',
                width: i === 1 ? (menuOpen ? 22 : 14) : 22,
                transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'none') : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
                transition: 'all 0.3s ease',
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Menu fullscreen */}
      {menuOpen && (
        <div className="mobile-menu-opp" style={{
          position: 'fixed', inset: 0, zIndex: 29,
          background: '#141414',
          animation: 'menuIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex', flexDirection: 'column',
          paddingTop: 56,
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,90,31,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,90,31,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,90,31,0.1)', border: '1px solid rgba(255,90,31,0.2)', borderRadius: 20, padding: '5px 12px', marginBottom: 32, alignSelf: 'flex-start', animation: 'itemIn 0.4s ease 0.05s both' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF5A1F' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#FF5A1F', letterSpacing: '0.08em' }}>PLATEFORME PRIVÉE OFF-MARKET</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 36 }}>
              {navLinks.map((l, i) => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    animation: `itemIn 0.4s ease ${0.1 + i * 0.07}s both`,
                  }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3 }}>{l.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{l.desc}</div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,90,31,0.1)', border: '1px solid rgba(255,90,31,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'itemIn 0.4s ease 0.38s both' }}>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#FF5A1F', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#141414', textDecoration: 'none' }}>
                Commencer — C'est gratuit →
              </Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '15px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                Se connecter
              </Link>
            </div>
          </div>

          <div style={{ padding: '20px 28px 100px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>© 2026 Fiderio</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/cgv" onClick={() => setMenuOpen(false)} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>CGV</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>
        </div>
      )}

      {/* Drawer filtres */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, backdropFilter: 'blur(2px)' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'white', borderRadius: '20px 20px 0 0',
            zIndex: 101, maxHeight: '85vh', overflowY: 'auto',
            paddingBottom: 32,
            boxShadow: '0 -8px 32px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#E5E7EB' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 16px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#141414', margin: 0 }}>Filtres</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {hasFilters && (
                  <a href="/opportunites" style={{ fontSize: '13px', color: '#EF4444', textDecoration: 'none', fontWeight: 600 }}>Effacer tout</a>
                )}
                <button onClick={() => setDrawerOpen(false)}
                  style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Province</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {provinces.map(p => (
                    <OpportuniteSwitcher key={p} label={p} paramName="province" value={p} isActive={province === p} />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Type de transaction</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {deals.map(d => (
                    <OpportuniteSwitcher key={d.value} label={d.label} paramName="typeDeal" value={d.value} isActive={typeDeal === d.value} />
                  ))}
                </div>
              </div>
              <div>
                <CAFilter currentMin={caMin} currentMax={caMax} />
              </div>
            </div>
            <div style={{ padding: '0 20px' }}>
              <button onClick={() => setDrawerOpen(false)}
                style={{ width: '100%', background: '#141414', color: 'white', fontSize: '15px', fontWeight: 700, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                Voir les résultats
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
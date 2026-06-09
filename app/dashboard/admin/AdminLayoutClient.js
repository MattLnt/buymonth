'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Logo from '../../components/Logo'

const menuItems = [
  {
    section: 'TABLEAU DE BORD',
    items: [
      { href: '/dashboard/admin', label: 'Vue globale', shortLabel: 'Global', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    ]
  },
  {
    section: 'GESTION',
    items: [
      { href: '/dashboard/admin/opportunites', label: 'Opportunités', shortLabel: 'Dossiers', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
      { href: '/dashboard/admin/vendeurs', label: 'Vendeurs', shortLabel: 'Vendeurs', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
      { href: '/dashboard/admin/acheteurs', label: 'Acheteurs', shortLabel: 'Acheteurs', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
      { href: '/dashboard/admin/abonnements', label: 'Abonnements', shortLabel: 'Abonnements', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
      { href: '/dashboard/admin/blog', label: 'Blog', shortLabel: 'Blog', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    ]
  },
]

const allItems = menuItems.flatMap(g => g.items)

export default function AdminLayoutClient({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6F8' }}>
      <style>{`
        @media (max-width: 1024px) {
          .adm-desktop { display: none !important; }
          .adm-topbar { padding: 0 16px !important; }
          .adm-main { padding: 20px 16px 90px !important; }
          .adm-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .adm-stats-grid2 { grid-template-columns: 1fr 1fr !important; }
          .adm-main-grid { grid-template-columns: 1fr !important; }
          .adm-table-col { display: none !important; }
          .adm-table-row { grid-template-columns: 1fr 100px !important; }
          .adm-table-header { grid-template-columns: 1fr 100px !important; }
          .adm-filters { flex-direction: column !important; }
          .adm-filters input, .adm-filters button { width: 100% !important; }
        }
        @media (min-width: 1025px) { .adm-mobile { display: none !important; } }
        .adm-nav-item:hover { background: rgba(255,255,255,0.06) !important; }
        .adm-bottomnav::-webkit-scrollbar { display: none; }
        .adm-bottomnav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SIDEBAR DESKTOP */}
      <aside className="adm-desktop" style={{
        width: collapsed ? 68 : 240, flexShrink: 0, background: '#141414',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto', overflowX: 'hidden',
        transition: 'width 0.25s ease', zIndex: 50,
      }}>
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 64 }}>
          {!collapsed && (
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Logo dark height={22} />
              <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, letterSpacing: '0.1em', marginTop: 5 }}>ADMINISTRATION</div>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
              Accès administrateur
            </span>
          </div>
        )}

        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 12px', overflowY: 'auto' }}>
          {menuItems.map((group) => (
            <div key={group.section} style={{ marginBottom: 24 }}>
              {!collapsed && <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6 }}>{group.section}</div>}
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} className="adm-nav-item" title={collapsed ? item.label : ''}
                    style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, marginBottom: 2, textDecoration: 'none', background: isActive ? 'rgba(239,68,68,0.1)' : 'transparent', color: isActive ? '#EF4444' : '#9CA3AF', fontWeight: isActive ? 600 : 400, fontSize: 13, transition: 'all 0.15s', position: 'relative', borderLeft: isActive && !collapsed ? '2px solid #EF4444' : '2px solid transparent' }}>
                    <span style={{ flexShrink: 0, display: 'flex', color: isActive ? '#EF4444' : '#6B7280' }}>{item.icon}</span>
                    {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: collapsed ? '12px 8px' : '12px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="adm-nav-item" title={collapsed ? 'Déconnexion' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%', padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, background: 'transparent', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        <header className="adm-topbar" style={{ height: 64, background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0 }}>
          <div className="adm-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              <Logo height={22} />
            </Link>
            <div style={{ marginLeft: 'auto' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>A</div>
            </div>
          </div>
          <div className="adm-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Mode administration</span>
          </div>
          <div className="adm-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#141414' }}>Administrateur</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Accès complet</div>
            </div>
          </div>
        </header>

        <main className="adm-main" style={{ flex: 1, padding: '36px 40px', minWidth: 0 }}>
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="adm-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#141414', borderTop: '1px solid rgba(255,255,255,0.07)', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="adm-bottomnav" style={{ display: 'flex', overflowX: 'auto', height: 64, alignItems: 'center', padding: '0 4px' }}>
          {allItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '6px 10px', flexShrink: 0, minWidth: 52, position: 'relative' }}>
                <span style={{ color: isActive ? '#EF4444' : 'rgba(255,255,255,0.35)' }}>{item.icon}</span>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? '#EF4444' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{item.shortLabel}</span>
                {isActive && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />}
              </Link>
            )
          })}
          <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', flexShrink: 0, minWidth: 52 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Quitter</span>
          </button>
        </div>
      </div>
    </div>
  )
}
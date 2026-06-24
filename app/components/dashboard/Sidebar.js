'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Icon } from './Icon'

export function Sidebar({ items, societe, email }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href) =>
    href === pathname ||
    (href !== '/dashboard/client' && href !== '/dashboard/admin' && pathname.startsWith(href))

  // Aplatit les sections en liste simple (pour le mobile)
  const flatItems = items.flatMap((it) => (it.section ? it.items : [it]))

  // Rendu d'un lien (desktop)
  const renderLink = (item) => {
    const active = isActive(item.href)
    return (
      <Link key={item.href} href={item.href} className="bm-nav-item" title={collapsed ? item.label : ''}
        style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 11, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '11px 0' : '10px 11px', borderRadius: 9, marginBottom: 3, textDecoration: 'none', background: active ? 'rgba(124,184,168,0.16)' : 'transparent', color: active ? '#fff' : '#9CA8BA', fontWeight: active ? 600 : 500, fontSize: 13.5, transition: 'all 0.15s', borderLeft: active && !collapsed ? '2px solid #7CB8A8' : '2px solid transparent' }}>
        <span style={{ flexShrink: 0, display: 'flex', color: active ? '#7CB8A8' : '#6B7A90' }}>
          <Icon name={item.icon} size={18} />
        </span>
        {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
      </Link>
    )
  }

  return (
    <div style={{ display: 'contents' }}>
      <style>{`
        @media (max-width: 1024px) {
          .bm-desktop { display: none !important; }
          .bm-mobile { display: flex !important; }
        }
        @media (min-width: 1025px) { .bm-mobile { display: none !important; } }
        .bm-nav-item:hover { background: rgba(255,255,255,0.06) !important; }
        .bm-bottomnav::-webkit-scrollbar { display: none; }
        .bm-bottomnav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SIDEBAR DESKTOP */}
      <aside className="bm-desktop" style={{ width: collapsed ? 68 : 248, flexShrink: 0, background: '#16324F', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.25s ease', zIndex: 50 }}>
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)', minHeight: 64 }}>
          {!collapsed && (
            <Link href="/" style={{ fontSize: 21, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em' }}>
              Buy<span style={{ color: '#7CB8A8' }}>Month</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C8AA0', padding: 6, borderRadius: 6, display: 'flex', flexShrink: 0 }}>
            <Icon name="menu" size={18} />
          </button>
        </div>

        {!collapsed && societe && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7CB8A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#16324F', flexShrink: 0 }}>
              {societe?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12.5, color: '#F9FAFB', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{societe}</div>
              {email && <div style={{ fontSize: 11, color: '#7C8AA0', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>}
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '14px 12px', overflowY: 'auto' }}>
          {items.map((item, i) => {
            // Section avec titre + sous-liens
            if (item.section) {
              return (
                <div key={`sec-${i}`} style={{ marginTop: i > 0 ? 14 : 0, marginBottom: 4 }}>
                  {!collapsed && (
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#5E6E84', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 11px 8px' }}>
                      {item.section}
                    </div>
                  )}
                  {collapsed && i > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '8px 6px' }} />}
                  {item.items.map((sub) => renderLink(sub))}
                </div>
              )
            }
            // Lien simple
            return renderLink(item)
          })}
        </nav>

        <div style={{ padding: collapsed ? '12px 8px' : '12px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="bm-nav-item" title={collapsed ? 'Déconnexion' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 11, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%', padding: collapsed ? '11px 0' : '10px 11px', borderRadius: 9, background: 'transparent', border: 'none', color: '#7C8AA0', fontSize: 13.5, cursor: 'pointer' }}>
            <Icon name="logout" size={18} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* BOTTOM NAV MOBILE (liste aplatie) */}
      <div className="bm-mobile" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#16324F', borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="bm-bottomnav" style={{ display: 'flex', overflowX: 'auto', height: 64, alignItems: 'center', padding: '0 4px' }}>
          {flatItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '6px 12px', flexShrink: 0, minWidth: 60, position: 'relative' }}>
                <span style={{ color: active ? '#7CB8A8' : 'rgba(255,255,255,0.38)', display: 'flex' }}>
                  <Icon name={item.icon} size={20} />
                </span>
                <span style={{ fontSize: 9.5, fontWeight: active ? 700 : 500, color: active ? '#7CB8A8' : 'rgba(255,255,255,0.38)', whiteSpace: 'nowrap' }}>{item.short}</span>
                {active && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#7CB8A8' }} />}
              </Link>
            )
          })}
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', flexShrink: 0, minWidth: 60 }}>
            <span style={{ color: 'rgba(255,255,255,0.38)', display: 'flex' }}><Icon name="logout" size={20} /></span>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.38)' }}>Quitter</span>
          </button>
        </div>
      </div>
    </div>
  )
}
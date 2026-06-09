'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Logo from '../../components/Logo'

export default function DashboardAcheteurLayoutClient({ children, session }) {
  const [collapsed, setCollapsed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMsgChat, setIsMsgChat] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/messages/unread')
        if (!res.ok) return
        const data = await res.json()
        setUnreadCount(data.count)
      } catch (error) {}
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const show = () => setIsMsgChat(true)
    const hide = () => setIsMsgChat(false)
    window.addEventListener('msg-chat-open', show)
    window.addEventListener('msg-chat-close', hide)
    return () => {
      window.removeEventListener('msg-chat-open', show)
      window.removeEventListener('msg-chat-close', hide)
    }
  }, [])

  useEffect(() => {
    if (!pathname.includes('messages')) setIsMsgChat(false)
  }, [pathname])

  const menuItems = [
    {
      section: 'PRINCIPAL',
      items: [
        { href: '/dashboard/acheteur', label: 'Tableau de bord', shortLabel: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
        { href: '/dashboard/acheteur/opportunites', label: 'Opportunités', shortLabel: 'Dossiers', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { href: '/dashboard/acheteur/dossiers', label: 'Dossiers débloqués', shortLabel: 'Débloqués', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
        { href: '/dashboard/acheteur/alertes', label: 'Mes alertes', shortLabel: 'Alertes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
      ]
    },
    {
      section: 'COMMUNICATION',
      items: [
        { href: '/dashboard/acheteur/messages', label: 'Messages', shortLabel: 'Messages', badge: unreadCount, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
      ]
    },
    {
      section: 'COMPTE',
      items: [
        { href: '/dashboard/acheteur/forfait', label: 'Mon abonnement', shortLabel: 'Abonnement', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
        { href: '/dashboard/acheteur/profil', label: 'Mon profil', shortLabel: 'Profil', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        { href: '/dashboard/acheteur/mot-de-passe', label: 'Mot de passe', shortLabel: 'Sécurité', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
        { href: '/dashboard/acheteur/supprimer', label: 'Supprimer le compte', shortLabel: 'Supprimer', danger: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg> },
      ]
    },
  ]

  const allItems = menuItems.flatMap(g => g.items)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6F8' }}>
      <style>{`
        @media (max-width: 1024px) {
          .ach-desktop { display: none !important; }
          .ach-topbar { padding: 0 16px !important; }
          .ach-main { padding: 20px 16px 90px !important; }
        }
        @media (min-width: 1025px) { .ach-mobile { display: none !important; } }
        .ach-nav-item:hover { background: rgba(255,255,255,0.06) !important; }
        .ach-bottomnav::-webkit-scrollbar { display: none; }
        .ach-bottomnav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SIDEBAR DESKTOP */}
      <aside className="ach-desktop" style={{ width: collapsed ? 68 : 240, flexShrink: 0, background: '#141414', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.25s ease', zIndex: 50 }}>
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 64 }}>
          {!collapsed && (
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Logo dark height={22} />
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
        {!collapsed && (
          <Link href="/dashboard/acheteur/profil" style={{ textDecoration: 'none' }}>
            <div className="ach-nav-item" style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'background 0.15s' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF5A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#141414', flexShrink: 0 }}>
                {session?.user?.email?.[0]?.toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 12, color: '#F9FAFB', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.email}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>Acheteur</div>
              </div>
            </div>
          </Link>
        )}
        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 12px', overflowY: 'auto' }}>
          {menuItems.map((group) => (
            <div key={group.section} style={{ marginBottom: 24 }}>
              {!collapsed && <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6 }}>{group.section}</div>}
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} className="ach-nav-item" title={collapsed ? item.label : ''}
                    style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, marginBottom: 2, textDecoration: 'none', background: isActive ? 'rgba(255,90,31,0.15)' : 'transparent', color: item.danger ? '#F87171' : isActive ? '#FF5A1F' : '#9CA3AF', fontWeight: isActive ? 600 : 400, fontSize: 13, transition: 'all 0.15s', position: 'relative', borderLeft: isActive && !collapsed ? '2px solid #FF5A1F' : '2px solid transparent' }}>
                    <span style={{ flexShrink: 0, display: 'flex', color: item.danger ? '#F87171' : isActive ? '#FF5A1F' : '#6B7280' }}>{item.icon}</span>
                    {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                    {!collapsed && item.badge > 0 && <span style={{ background: '#FF5A1F', color: '#141414', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>{item.badge}</span>}
                    {collapsed && item.badge > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#FF5A1F' }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding: collapsed ? '12px 8px' : '12px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="ach-nav-item" title={collapsed ? 'Déconnexion' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%', padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, background: 'transparent', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>

        {/* TOPBAR — cachée en chat mobile */}
        {!isMsgChat && (
          <header className="ach-topbar" style={{ height: 64, background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0 }}>
            <div className="ach-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                <Logo height={22} />
              </Link>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href="/dashboard/acheteur/profil" style={{ textDecoration: 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FF5A1F', cursor: 'pointer' }}>
                    {session?.user?.email?.[0]?.toUpperCase()}
                  </div>
                </Link>
                <Link href="/dashboard/acheteur/opportunites" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FF5A1F', color: '#141414', padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Parcourir
                </Link>
              </div>
            </div>
            <div className="ach-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                <Logo height={20} />
              </Link>
            </div>
            <div className="ach-desktop" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/dashboard/acheteur/opportunites" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FF5A1F', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Parcourir
              </Link>
              <Link href="/dashboard/acheteur/profil" title="Mon profil" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FF5A1F' }}>
                    {session?.user?.email?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#141414', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.email}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>Acheteur</div>
                  </div>
                </div>
              </Link>
            </div>
          </header>
        )}

        <main className="ach-main" style={{ flex: 1, padding: isMsgChat ? 0 : '36px 40px', minWidth: 0 }}>
          {children}
        </main>
      </div>

      {/* BOTTOM NAV — cachée en chat mobile */}
      {!isMsgChat && (
        <div className="ach-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#141414', borderTop: '1px solid rgba(255,255,255,0.07)', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="ach-bottomnav" style={{ display: 'flex', overflowX: 'auto', height: 64, alignItems: 'center', padding: '0 4px' }}>
            {allItems.map(item => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '6px 10px', flexShrink: 0, minWidth: 52, position: 'relative' }}>
                  <span style={{ color: isActive ? '#FF5A1F' : item.danger ? '#F87171' : 'rgba(255,255,255,0.35)' }}>{item.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? '#FF5A1F' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{item.shortLabel}</span>
                  {isActive && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#FF5A1F' }} />}
                  {item.badge > 0 && !isActive && <div style={{ position: 'absolute', top: 4, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#FF5A1F' }} />}
                </Link>
              )
            })}
            <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', flexShrink: 0, minWidth: 52 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Quitter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
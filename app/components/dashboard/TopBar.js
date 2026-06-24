'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Icon } from './Icon'

const CLIENT_TITLES = [
  { match: '/dashboard/client/biens/nouveau', title: 'Ajouter un bien', parent: 'Mes biens', parentHref: '/dashboard/client/biens' },
  { match: '/dashboard/client/biens/', title: 'Détail du bien', parent: 'Mes biens', parentHref: '/dashboard/client/biens' },
  { match: '/dashboard/client/biens', title: 'Mes biens' },
  { match: '/dashboard/client/widgets/paiements', title: 'Historique des paiements', parent: 'Widgets', parentHref: '/dashboard/client/widgets' },
  { match: '/dashboard/client/widgets', title: 'Générateur de widget' },
  { match: '/dashboard/client/leads', title: 'Mes leads' },
  { match: '/dashboard/client/abonnement', title: 'Mon abonnement' },
  { match: '/dashboard/client/profil', title: 'Mon profil' },
  { match: '/dashboard/client', title: 'Tableau de bord' },
]

const ADMIN_TITLES = [
  { match: '/dashboard/admin/clients/', title: 'Fiche client', parent: 'Clients', parentHref: '/dashboard/admin/clients' },
  { match: '/dashboard/admin/clients', title: 'Promoteurs' },
  { match: '/dashboard/admin/biens', title: 'Tous les biens' },
  { match: '/dashboard/admin/leads', title: 'Tous les leads' },
  { match: '/dashboard/admin/parametres', title: 'Paramètres' },
  { match: '/dashboard/admin', title: "Vue d'ensemble" },
]

function resolveTitle(pathname, role) {
  const list = role === 'admin' ? ADMIN_TITLES : CLIENT_TITLES
  const found = list.find((t) => pathname.startsWith(t.match))
  return found || { title: 'Tableau de bord' }
}

export function TopBar({ societe, email, statut, role = 'client', collapsed, onToggle }) {
  const pathname = usePathname()
  const { title, parent, parentHref } = resolveTitle(pathname, role)

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const statutConfig = {
    active: { label: 'Abonné', color: '#7CB8A8', bg: 'rgba(124,184,168,0.16)', dot: '#7CB8A8' },
    trialing: { label: 'Essai gratuit', color: '#E8B563', bg: 'rgba(232,181,99,0.16)', dot: '#E8B563' },
    admin: { label: 'Administrateur', color: '#E8B563', bg: 'rgba(232,181,99,0.16)', dot: '#E8B563' },
    none: { label: 'Sans abonnement', color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.08)', dot: 'rgba(255,255,255,0.5)' },
  }
  const sc = statutConfig[statut] || statutConfig.none

  // Pastille cliquable seulement pour le client
  const statutHref = role === 'admin' ? null : '/dashboard/client/abonnement'

  // Menu déroulant selon le rôle
  const menuLinks = role === 'admin'
    ? [
        { label: 'Paramètres', href: '/dashboard/admin/parametres', icon: 'settings' },
        { label: 'Les biens', href: '/biens', icon: 'building' },
        { label: 'Voir le site', href: '/', icon: 'home' },
      ]
    : [
        { label: 'Mon profil', href: '/dashboard/client/profil', icon: 'settings' },
        { label: 'Mon abonnement', href: '/dashboard/client/abonnement', icon: 'card' },
        { label: 'Les biens', href: '/biens', icon: 'building' },
        { label: 'Voir le site', href: '/', icon: 'home' },
      ]

  const StatutPastille = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: sc.bg, padding: '8px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot }} />
      <span className="bm-topbar-statut-label" style={{ fontSize: 12.5, fontWeight: 600, color: sc.color }}>{sc.label}</span>
    </span>
  )

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'linear-gradient(100deg, #16324F 0%, #1D4267 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(25,59,94,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '0 24px', minHeight: 68 }} className="bm-topbar">
        <style>{`
          @media (max-width: 768px){
            .bm-topbar { padding: 0 16px !important; }
            .bm-topbar-statut-label { display: none !important; }
          }
        `}</style>

        {/* Gauche : bouton rétract + titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <button onClick={onToggle} aria-label="Réduire le menu"
            style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            <Icon name="menu" size={18} />
          </button>

          <div style={{ minWidth: 0 }}>
            {parent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 1 }}>
                <Link href={parentHref} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{parent}</Link>
                <span>/</span>
                <span style={{ color: '#7CB8A8', fontWeight: 600 }}>{title}</span>
              </div>
            )}
            <h1 style={{ fontSize: 19, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
          </div>
        </div>

        {/* Droite : statut + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {statutHref ? <Link href={statutHref} style={{ textDecoration: 'none' }}>{StatutPastille}</Link> : StatutPastille}

          <div style={{ position: 'relative' }} ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '5px 10px 5px 5px', cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7CB8A8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16324F', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {(societe || email || '?')[0]?.toUpperCase()}
              </div>
              <span className="bm-topbar-statut-label" style={{ fontSize: 13, fontWeight: 600, color: '#fff', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{societe || 'Mon compte'}</span>
              <Icon name="chevronDown" size={14} color="rgba(255,255,255,0.6)" />
            </button>

            {menuOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 220, background: '#fff', border: '1px solid #E6EBF2', borderRadius: 14, boxShadow: '0 12px 32px rgba(25,59,94,0.18)', padding: 8, zIndex: 50 }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #F2F5FA', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#193B5E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{societe || 'Mon compte'}</div>
                  {email && <div style={{ fontSize: 11.5, color: '#9AA2B4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>}
                </div>
                {menuLinks.map((m) => (
                  <Link key={m.href} href={m.href} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, textDecoration: 'none', color: '#3D4759', fontSize: 13, fontWeight: 500 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F5F8FB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Icon name={m.icon} size={16} color="#7CB8A8" />
                    {m.label}
                  </Link>
                ))}
                <div style={{ height: 1, background: '#F2F5FA', margin: '6px 0' }} />
                <button onClick={() => signOut({ callbackUrl: '/' })} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', color: '#E0564E', fontSize: 13, fontWeight: 600 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Icon name="logout" size={16} color="#E0564E" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function DashboardShell({ navItems, societe, email, statut, role = 'client', children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6FB' }}>
      <Sidebar items={navItems} societe={societe} email={email} collapsed={collapsed} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar societe={societe} email={email} statut={statut} role={role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <main style={{ flex: 1, padding: '28px 36px 96px', minWidth: 0 }} className="bm-main">
          <style>{`@media (max-width: 768px){ .bm-main { padding: 20px 18px 96px !important; } }`}</style>
          {children}
        </main>
      </div>
    </div>
  )
}
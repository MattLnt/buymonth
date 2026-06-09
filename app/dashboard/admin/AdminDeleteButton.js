'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDeleteButton({ userId, label }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Supprimer cet utilisateur définitivement ?')) return
    setLoading(true)
    await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      style={{background: 'none', border: '1px solid #fecaca', color: '#ef4444', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1}}>
      {loading ? '...' : label}
    </button>
  )
}
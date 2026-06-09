'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OpportuniteSwitcher({ label, paramName, value, isActive }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleToggle = () => {
    const p = new URLSearchParams(searchParams.toString())
    const current = p.getAll(paramName)
    p.delete(paramName)
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    next.forEach(v => p.append(paramName, v))
    router.push(`/opportunites?${p.toString()}`, { scroll: false })
  }

  return (
    <button
      onClick={handleToggle}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', width: '100%', textAlign: 'left' }}
    >
      <span style={{ fontSize: '13px', color: isActive ? '#141414' : '#374151', fontWeight: isActive ? 600 : 400, flex: 1, paddingRight: '8px', lineHeight: 1.3 }}>
        {label}
      </span>
      <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: isActive ? '#FF5A1F' : '#e5e7eb', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
        <div style={{ position: 'absolute', top: '2px', left: isActive ? '18px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
      </div>
    </button>
  )
}
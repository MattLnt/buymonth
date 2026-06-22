import { Icon } from './Icon'

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#193B5E', margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: '#5A6275', margin: '6px 0 0' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, trend, icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#8A92A6', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#193B5E', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
          {trend && <div style={{ fontSize: 12, color: '#249E7C', marginTop: 8, fontWeight: 600 }}>{trend}</div>}
        </div>
        {icon && (
          <span style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={icon} size={20} color="#7CB8A8" />
          </span>
        )}
      </div>
    </div>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, ...style }}>
      {children}
    </div>
  )
}

export function EmptyState({ icon = 'inbox', title, text, action }) {
  return (
    <div style={{ background: '#fff', border: '1px dashed #D8DFE9', borderRadius: 16, padding: '56px 24px', textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', width: 56, height: 56, borderRadius: 16, background: 'rgba(124,184,168,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon name={icon} size={26} color="#7CB8A8" />
      </span>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>{title}</h3>
      {text && <p style={{ fontSize: 14, color: '#5A6275', margin: '0 0 20px', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>{text}</p>}
      {action}
    </div>
  )
}
export function FormSection({ icon, title, subtitle, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#7CB8A8' }}>
          {icon}
        </span>
        <div>
          <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 13, color: '#8A92A6', margin: '2px 0 0' }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
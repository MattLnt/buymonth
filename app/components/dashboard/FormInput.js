'use client'

export function FormInput({ label, name, type = 'text', value, onChange, placeholder, required, min, max, step, suffix, rows = 4 }) {
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }
  const baseStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box',
    outline: 'none', background: '#FAFDFD', color: '#193B5E',
    transition: 'border-color 0.2s', fontFamily: 'inherit',
  }

  const onFocus = (e) => (e.target.style.borderColor = '#7CB8A8')
  const onBlur = (e) => (e.target.style.borderColor = '#E8EDF2')

  return (
    <div>
      {label && <label style={labelStyle}>{label}{required && <span style={{ color: '#7CB8A8' }}> *</span>}</label>}

      {type === 'textarea' ? (
        <textarea
          name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
          style={{ ...baseStyle, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur}
        />
      ) : suffix ? (
        <div style={{ position: 'relative' }}>
          <input
            type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
            required={required} min={min} max={max} step={step}
            style={{ ...baseStyle, paddingRight: 42 }} onFocus={onFocus} onBlur={onBlur}
          />
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 600, color: '#8A92A6', pointerEvents: 'none' }}>{suffix}</span>
        </div>
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          required={required} min={min} max={max} step={step}
          style={baseStyle} onFocus={onFocus} onBlur={onBlur}
        />
      )}
    </div>
  )
}
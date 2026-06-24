'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const NAVY = '#193B5E'
const TEAL = '#7CB8A8'
const PALETTE = ['#193B5E', '#7CB8A8', '#2E6388', '#A9D2C6', '#4A7DA8', '#D5E8E1', '#1D4267']

const cardStyle = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24 }
const titleStyle = { fontSize: 15, fontWeight: 700, color: '#193B5E', margin: '0 0 2px' }
const subStyle = { fontSize: 12.5, color: '#9AA2B4', margin: '0 0 20px' }

function CustomTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(25,59,94,0.1)' }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#193B5E', marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12.5, color: '#5A6275', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || p.payload?.fill }} />
          {p.name} : <strong style={{ color: '#193B5E' }}>{p.value}{suffix}</strong>
        </div>
      ))}
    </div>
  )
}

export function LeadsLineChart({ data }) {
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Leads reçus</h3>
      <p style={subStyle}>Évolution sur les 6 derniers mois</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" vertical={false} />
          <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="leads" name="Leads" stroke={TEAL} strokeWidth={3} dot={{ r: 4, fill: TEAL, strokeWidth: 0 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TypeDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Répartition des biens</h3>
      <p style={subStyle}>Par type de bien</p>
      {total === 0 ? (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA2B4', fontSize: 13 }}>Aucun bien à afficher</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none">
                {data.map((entry, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: PALETTE[i % PALETTE.length] }} />
                  <span style={{ fontSize: 13, color: '#5A6275' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#193B5E' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function VuesBarChart({ data }) {
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Biens les plus vus</h3>
      <p style={subStyle}>Top 5 par nombre de vues</p>
      {data.length === 0 ? (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA2B4', fontSize: 13 }}>Aucune vue pour l'instant</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="nom" tick={{ fontSize: 12, fill: '#5A6275' }} axisLine={false} tickLine={false} width={90} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,184,168,0.06)' }} />
            <Bar dataKey="vues" name="Vues" fill={NAVY} radius={[0, 6, 6, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
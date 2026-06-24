'use client'

import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const NAVY = '#193B5E'
const TEAL = '#7CB8A8'
const PALETTE = ['#7CB8A8', '#E8B563', '#8A92A6']

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

export function InscriptionsArea({ data }) {
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Inscriptions de promoteurs</h3>
      <p style={subStyle}>Évolution sur les 6 derniers mois</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="inscGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={NAVY} stopOpacity={0.25} />
              <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" vertical={false} />
          <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="clients" name="Inscriptions" stroke={NAVY} strokeWidth={3} fill="url(#inscGrad)" dot={{ r: 3, fill: NAVY }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RevenusArea({ data }) {
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Évolution des revenus</h3>
      <p style={subStyle}>Abonnements + widgets sur les 6 derniers mois</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" vertical={false} />
          <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip suffix=" €" />} />
          <Area type="monotone" dataKey="revenus" name="Revenus" stroke={TEAL} strokeWidth={3} fill="url(#revGrad)" dot={{ r: 3, fill: TEAL }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatutDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Statut des promoteurs</h3>
      <p style={subStyle}>Répartition par abonnement</p>
      {total === 0 ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA2B4', fontSize: 13 }}>Aucun client</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <ResponsiveContainer width={170} height={170}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={2} stroke="none">
                {data.map((entry, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column', gap: 10 }}>
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

export function LeadsBarChart({ data }) {
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Leads de la plateforme</h3>
      <p style={subStyle}>Par mois sur les 6 derniers mois</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" vertical={false} />
          <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9AA2B4' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,184,168,0.06)' }} />
          <Bar dataKey="leads" name="Leads" fill={TEAL} radius={[6, 6, 0, 0]} barSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
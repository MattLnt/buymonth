'use client'

import { useState } from 'react'

// Routage des leads d'un promoteur partenaire vers ses commerciaux
// (lot Matexi du 03/11/2026). Une regle = un projet (ou tout le portefeuille)
// et deux adresses qui se relaient, un lead chacun a tour de role.

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

const ligneVide = { projet: '', email1: '', email2: '', actif: true }

export function RoutageLeadsForm({ clientId, regles, projets }) {
  const [lignes, setLignes] = useState(
    regles.length
      ? regles.map((r) => ({ projet: r.projet || '', email1: r.email1 || '', email2: r.email2 || '', actif: r.actif }))
      : [{ ...ligneVide }],
  )
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  const setChamp = (i, k, v) => setLignes((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: v } : l)))
  const supprimer = (i) => setLignes((ls) => (ls.length === 1 ? [{ ...ligneVide }] : ls.filter((_, j) => j !== i)))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/routage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regles: lignes }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.error || 'Erreur.' }); setSaving(false); return }
      setLignes(
        data.regles?.length
          ? data.regles.map((r) => ({ projet: r.projet || '', email1: r.email1 || '', email2: r.email2 || '', actif: r.actif }))
          : [{ ...ligneVide }],
      )
      setMsg({ type: 'ok', text: 'Routage enregistré.' })
      setSaving(false)
    } catch {
      setMsg({ type: 'err', text: 'Erreur réseau.' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, marginBottom: 22 }}>
      <style>{`
        @media (max-width: 700px){
          .routage-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Routage des leads vers les commerciaux</h3>
      <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.6 }}>
        Chaque lead part aussi chez un commercial du promoteur, en texte brut, avec la référence du bien et la mention « Source&nbsp;: BuyMonth ».
        Avec deux adresses, les leads sont distribués à tour de rôle : un chez l&apos;un, le suivant chez l&apos;autre.
        Un lead n&apos;est jamais routé si le visiteur n&apos;a pas coché la transmission au promoteur. Laissez vide pour ne rien envoyer.
      </p>

      {lignes.map((l, i) => (
        <div key={i} style={{ border: '1px solid #EEF2F7', borderRadius: 12, padding: 16, marginBottom: 14, background: l.actif ? '#FAFBFE' : '#F6F7F9' }}>
          <div className="routage-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Projet</label>
              <input
                list={`projets-${i}`}
                value={l.projet}
                onChange={(e) => setChamp(i, 'projet', e.target.value)}
                placeholder="Tout le portefeuille"
                style={inputStyle}
              />
              <datalist id={`projets-${i}`}>
                {projets.map((p) => <option key={p} value={p} />)}
              </datalist>
            </div>
            <div>
              <label style={labelStyle}>Commercial 1</label>
              <input type="email" value={l.email1} onChange={(e) => setChamp(i, 'email1', e.target.value)} placeholder="prenom.nom@promoteur.be" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Commercial 2 (facultatif)</label>
              <input type="email" value={l.email2} onChange={(e) => setChamp(i, 'email2', e.target.value)} placeholder="prenom.nom@promoteur.be" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#5A6B7D', cursor: 'pointer' }}>
              <input type="checkbox" checked={l.actif} onChange={(e) => setChamp(i, 'actif', e.target.checked)} />
              Routage actif
            </label>
            <button type="button" onClick={() => supprimer(i)} style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Supprimer cette règle
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setLignes((ls) => [...ls, { ...ligneVide }])}
        style={{ padding: '10px 18px', borderRadius: 10, background: '#fff', color: '#193B5E', border: '1.5px solid #E8EDF2', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', marginBottom: 18 }}
      >
        + Ajouter une règle par projet
      </button>

      {msg && (
        <div style={{ marginBottom: 16, padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
          background: msg.type === 'ok' ? 'rgba(36,158,124,0.1)' : '#FEF2F2',
          border: `1px solid ${msg.type === 'ok' ? 'rgba(36,158,124,0.25)' : '#FECACA'}`,
          color: msg.type === 'ok' ? '#1B7A5E' : '#DC2626' }}>
          {msg.text}
        </div>
      )}

      <div>
        <button type="submit" disabled={saving} style={{ padding: '12px 24px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: saving ? 'wait' : 'pointer' }}>
          {saving ? 'Enregistrement...' : 'Enregistrer le routage'}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'

// Routage des leads vers les commerciaux d'un promoteur (lot Matexi du
// 03/11/2026). Le meme ecran sert aux deux cotes : l'admin BuyMonth ouvre la
// fonction pour le promoteur (interrupteur), et le promoteur saisit ensuite
// lui-meme les adresses de ses commerciaux depuis son compte.

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

const ligneVide = { projet: '', email1: '', email2: '', actif: true }

const enLignes = (regles) =>
  regles?.length
    ? regles.map((r) => ({ projet: r.projet || '', email1: r.email1 || '', email2: r.email2 || '', actif: r.actif }))
    : [{ ...ligneVide }]

export function RoutageLeadsForm({ endpoint, regles, projets = [], admin = false, routageActif = true }) {
  const [lignes, setLignes] = useState(enLignes(regles))
  const [ouvert, setOuvert] = useState(routageActif)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  const setChamp = (i, k, v) => setLignes((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: v } : l)))
  const supprimer = (i) => setLignes((ls) => (ls.length === 1 ? [{ ...ligneVide }] : ls.filter((_, j) => j !== i)))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regles: lignes, ...(admin ? { routageActif: ouvert } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.error || 'Erreur.' }); setSaving(false); return }
      setLignes(enLignes(data.regles))
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

      <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>
        {admin ? 'Routage des leads vers les commerciaux' : 'Mes commerciaux'}
      </h3>
      <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.6 }}>
        {admin
          ? "Ouvrez la fonction pour que le promoteur saisisse lui-même les adresses de ses commerciaux depuis son compte. Vous pouvez aussi les saisir ici, pour la mise en route ou un dépannage."
          : "Chaque demande reçue sur vos biens part aussi chez un de vos commerciaux, avec la référence du bien et les coordonnées de l'acheteur, prêtes à reprendre dans votre CRM."}
        {' '}Avec deux adresses, les demandes sont distribuées à tour de rôle : une chez l&apos;un, la suivante chez l&apos;autre.
        {admin ? '' : ' Laissez vide pour ne rien envoyer.'}
      </p>

      {admin && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 15px', marginBottom: 18, borderRadius: 10, border: '1.5px solid #E8EDF2', background: ouvert ? 'rgba(124,184,168,0.08)' : '#FAFBFE', fontSize: 13.5, fontWeight: 600, color: '#193B5E', cursor: 'pointer' }}>
          <input type="checkbox" checked={ouvert} onChange={(e) => setOuvert(e.target.checked)} />
          Activer le routage sur le compte de ce promoteur
        </label>
      )}

      {lignes.map((l, i) => (
        <div key={i} style={{ border: '1px solid #EEF2F7', borderRadius: 12, padding: 16, marginBottom: 14, background: l.actif ? '#FAFBFE' : '#F6F7F9' }}>
          <div className="routage-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Projet</label>
              <input
                list={`projets-${i}`}
                value={l.projet}
                onChange={(e) => setChamp(i, 'projet', e.target.value)}
                placeholder={admin ? 'Tout le portefeuille' : 'Tous mes biens'}
                style={inputStyle}
              />
              <datalist id={`projets-${i}`}>
                {projets.map((p) => <option key={p} value={p} />)}
              </datalist>
            </div>
            <div>
              <label style={labelStyle}>Commercial 1</label>
              <input type="email" value={l.email1} onChange={(e) => setChamp(i, 'email1', e.target.value)} placeholder="prenom.nom@societe.be" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Commercial 2 (facultatif)</label>
              <input type="email" value={l.email2} onChange={(e) => setChamp(i, 'email2', e.target.value)} placeholder="prenom.nom@societe.be" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#5A6B7D', cursor: 'pointer' }}>
              <input type="checkbox" checked={l.actif} onChange={(e) => setChamp(i, 'actif', e.target.checked)} />
              Envoi actif
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
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

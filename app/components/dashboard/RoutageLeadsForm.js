'use client'

import { useState } from 'react'
import { FormSelect } from './FormSelect'
import { Icon } from './Icon'

// Routage des leads vers les commerciaux d'un promoteur (lot Matexi du
// 03/11/2026). Le meme ecran sert aux deux cotes : l'admin BuyMonth ouvre la
// fonction pour le promoteur (interrupteur), et le promoteur saisit ensuite
// lui-meme les adresses de ses commerciaux depuis son compte.
//
// Une regle = un projet (ou tout le portefeuille) et autant de commerciaux que
// voulu ; ils recoivent les demandes a tour de role, dans l'ordre affiche.

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

const TOUS = '__tous__'

const ligneVide = () => ({ projet: '', emails: ['', ''], actif: true })

const enLignes = (regles) =>
  regles?.length
    ? regles.map((r) => ({
        projet: r.projet || '',
        emails: r.emails?.length ? [...r.emails] : [''],
        actif: r.actif,
      }))
    : [ligneVide()]

export function RoutageLeadsForm({ endpoint, regles, projets = [], admin = false, routageActif = true }) {
  const [lignes, setLignes] = useState(enLignes(regles))
  const [ouvert, setOuvert] = useState(routageActif)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  const majLigne = (i, maj) => setLignes((ls) => ls.map((l, j) => (j === i ? { ...l, ...maj } : l)))
  const supprimerLigne = (i) => setLignes((ls) => (ls.length === 1 ? [ligneVide()] : ls.filter((_, j) => j !== i)))

  const setEmail = (i, k, v) =>
    setLignes((ls) => ls.map((l, j) => (j === i ? { ...l, emails: l.emails.map((e, m) => (m === k ? v : e)) } : l)))
  const ajouterEmail = (i) =>
    setLignes((ls) => ls.map((l, j) => (j === i ? { ...l, emails: [...l.emails, ''] } : l)))
  const supprimerEmail = (i, k) =>
    setLignes((ls) =>
      ls.map((l, j) =>
        j === i ? { ...l, emails: l.emails.length === 1 ? [''] : l.emails.filter((_, m) => m !== k) } : l,
      ),
    )

  const optionsProjet = [
    { value: TOUS, label: admin ? 'Tout le portefeuille' : 'Tous mes biens' },
    ...projets.map((p) => ({ value: p, label: p })),
  ]

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
      setMsg({ type: 'ok', text: 'Enregistré.' })
      setSaving(false)
    } catch {
      setMsg({ type: 'err', text: 'Erreur réseau.' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, marginBottom: 22 }}>
      <style>{`
        @media (max-width: 760px){
          .routage-ligne { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>
        {admin ? 'Routage des leads vers les commerciaux' : 'Mes commerciaux'}
      </h3>
      <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.6, maxWidth: 640 }}>
        {admin
          ? "Ouvrez la fonction pour que le promoteur saisisse lui-même les adresses de ses commerciaux depuis son compte. Vous pouvez aussi les saisir ici, pour la mise en route ou un dépannage."
          : "Chaque demande reçue sur vos biens part aussi chez un de vos commerciaux, avec la référence du bien et les coordonnées de l'acheteur, prêtes à reprendre dans votre CRM."}
        {' '}Les commerciaux d&apos;une même règle se relaient : la première demande part chez le premier, la suivante chez le deuxième, et ainsi de suite dans l&apos;ordre affiché.
      </p>

      {admin && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 15px', marginBottom: 20, borderRadius: 10, border: `1.5px solid ${ouvert ? 'rgba(124,184,168,0.5)' : '#E8EDF2'}`, background: ouvert ? 'rgba(124,184,168,0.08)' : '#FAFBFE', fontSize: 13.5, fontWeight: 600, color: '#193B5E', cursor: 'pointer' }}>
          <input type="checkbox" checked={ouvert} onChange={(e) => setOuvert(e.target.checked)} />
          Activer le routage sur le compte de ce promoteur
        </label>
      )}

      {lignes.map((l, i) => (
        <div key={i} style={{ border: '1px solid #EEF2F7', borderRadius: 12, padding: 18, marginBottom: 14, background: l.actif ? '#FAFBFE' : '#F6F7F9' }}>
          <div className="routage-ligne" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' }}>
            <div>
              <label style={labelStyle}>Pour</label>
              <FormSelect
                value={l.projet || TOUS}
                onChange={(v) => majLigne(i, { projet: v === TOUS ? '' : v })}
                options={optionsProjet}
              />
              <p style={{ fontSize: 12, color: '#A9B0BE', margin: '8px 0 0', lineHeight: 1.5 }}>
                Une règle sur un projet précis l&apos;emporte sur la règle générale.
              </p>
            </div>

            <div>
              <label style={labelStyle}>Commerciaux, dans l&apos;ordre de la tournante</label>
              {l.emails.map((email, k) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: 'rgba(124,184,168,0.14)', color: '#4E8E7D', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {k + 1}
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(i, k, e.target.value)}
                    placeholder="prenom.nom@societe.be"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => supprimerEmail(i, k)}
                    title="Retirer ce commercial"
                    style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, border: '1.5px solid #E8EDF2', background: '#fff', color: '#A9B0BE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon name="close" size={14} color="#A9B0BE" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => ajouterEmail(i)}
                style={{ padding: '8px 14px', borderRadius: 9, background: '#fff', color: '#193B5E', border: '1.5px solid #E8EDF2', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 2 }}
              >
                + Ajouter un commercial
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid #EEF2F7', flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#5A6B7D', cursor: 'pointer' }}>
              <input type="checkbox" checked={l.actif} onChange={(e) => majLigne(i, { actif: e.target.checked })} />
              Envoi actif
            </label>
            <button type="button" onClick={() => supprimerLigne(i)} style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Supprimer cette règle
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setLignes((ls) => [...ls, ligneVide()])}
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

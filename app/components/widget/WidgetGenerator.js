'use client'

import { useState, useRef } from 'react'
import { FormSection } from '@/app/components/dashboard/FormSection'
import { FormSelect } from '@/app/components/dashboard/FormSelect'
import { ColorPicker } from '@/app/components/dashboard/ColorPicker'
import { Badge } from './Badge'
import { MENSUALITE_CONFIG } from '@/lib/mensualiteConfig'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : ''

const pct = (t) => new Intl.NumberFormat('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(t * 100) + ' %'

const ic = {
  bien: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  palette: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.555C21.965 6.012 17.461 2 12 2z" /></svg>,
  code: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
}

function buildSVG({ mensualite, premium, style, primaire, accent, fond, cTitre, cMentions, cCredit }) {
  const dark = style === 'dark'
  const bg = fond || (dark ? '#16324F' : '#FFFFFF')
  const textMain = cTitre || (dark ? '#FFFFFF' : '#16324F')
  const textMuted = cMentions || (dark ? '#9FB0C4' : '#8A92A6')
  const textCredit = cCredit || (dark ? '#9FB0C4' : '#8A92A6')
  const w = 320, h = 288
  const header = premium
    ? `<rect x="137" y="20" width="46" height="46" rx="10" fill="${accent}"/>`
    : `<text x="160" y="50" font-family="system-ui,Arial,sans-serif" font-size="22" font-weight="700" text-anchor="middle"><tspan fill="#FFFFFF">Buy</tspan><tspan fill="${accent}">Month</tspan></text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="16" fill="${bg}" stroke="#EEF2F7"/>
  <path d="M0 16 Q0 0 16 0 H304 Q320 0 320 16 V84 H0 Z" fill="${primaire}"/>
  ${header}
  <text x="160" y="128" font-family="system-ui,Arial,sans-serif" font-size="14" font-weight="600" fill="${textMain}" text-anchor="middle">Propriétaire de ce bien dès</text>
  <text x="160" y="178" font-family="system-ui,Arial,sans-serif" font-size="40" font-weight="700" fill="${accent}" text-anchor="middle">${mensualite ? mensualite.toLocaleString('fr-BE') : '—'} €<tspan font-size="19">/mois*</tspan></text>
  <line x1="24" y1="200" x2="296" y2="200" stroke="#EEF2F7"/>
  <text x="160" y="220" font-family="system-ui,Arial,sans-serif" font-size="8.5" fill="${textMuted}" text-anchor="middle">* Emprunter de l'argent coûte aussi de l'argent. Estimation indicative hors frais</text>
  <text x="160" y="233" font-family="system-ui,Arial,sans-serif" font-size="8.5" fill="${textMuted}" text-anchor="middle">(apport ${Math.round(MENSUALITE_CONFIG.apportPct * 100)} %, ${Math.round(MENSUALITE_CONFIG.dureeMois / 12)} ans, taux ${pct(MENSUALITE_CONFIG.tauxAnnuel)}, TAEG ${pct(MENSUALITE_CONFIG.taegAnnuel)}).</text>
  <text x="160" y="246" font-family="system-ui,Arial,sans-serif" font-size="8.5" fill="${textMuted}" text-anchor="middle">Sous réserve d'acceptation du crédit.</text>
  <text x="160" y="264" font-family="system-ui,Arial,sans-serif" font-size="9" font-weight="600" fill="${textCredit}" text-anchor="middle">Crédit : BuyMonth Finance — FSMA 1021.366.349</text>
</svg>`
}

export function WidgetGenerator({ biens, plan }) {
  const isPremiumPlan = plan === 'PRO_PLUS' || plan === 'PREMIUM'
  const [bienId, setBienId] = useState(biens[0]?.id || '')
  const [style, setStyle] = useState('light')
  const [premium, setPremium] = useState(false)
  const [couleurMode, setCouleurMode] = useState('buymonth')
  const [primaire, setPrimaire] = useState('#16324F')
  const [accent, setAccent] = useState('#7CB8A8')
  const [fond, setFond] = useState('#FFFFFF')
  const [cTitre, setCTitre] = useState('#16324F')
  const [cMentions, setCMentions] = useState('#8A92A6')
  const [cCredit, setCCredit] = useState('#8A92A6')
  const [logoUrl, setLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [copied, setCopied] = useState('')
  const logoInput = useRef(null)

  const bien = biens.find((b) => b.id === bienId)
  const mensualite = bien?.mensualite || null

  const perso = premium && couleurMode === 'perso'
  const effPrimaire = perso ? primaire : '#16324F'
  const effAccent = perso ? accent : '#7CB8A8'
  const effFond = perso ? fond : (style === 'dark' ? '#16324F' : '#FFFFFF')
  const effTitre = perso ? cTitre : (style === 'dark' ? '#FFFFFF' : '#16324F')
  const effMentions = perso ? cMentions : (style === 'dark' ? '#9FB0C4' : '#8A92A6')
  const effCredit = perso ? cCredit : (style === 'dark' ? '#9FB0C4' : '#8A92A6')

  const params = new URLSearchParams()
  if (bienId) params.set('bien', bienId)
  if (premium) params.set('premium', '1')
  if (style === 'dark') params.set('theme', 'dark')
  if (perso) {
    params.set('primaire', primaire.replace('#', ''))
    params.set('accent', accent.replace('#', ''))
    params.set('fond', fond.replace('#', ''))
    params.set('ctitre', cTitre.replace('#', ''))
    params.set('cmentions', cMentions.replace('#', ''))
    params.set('ccredit', cCredit.replace('#', ''))
  }
  if (premium && logoUrl) params.set('logo', encodeURIComponent(logoUrl))
  const embedUrl = `${BASE_URL}/embed/badge?${params.toString()}`

  // Lien du simulateur pour ce bien (bouton « Simuler ma mensualité »)
  const simulateurUrl = bienId ? `${BASE_URL}/biens/${bienId}#simuler` : `${BASE_URL}/biens`

  const iframeCode = `<iframe src="${embedUrl}" title="Mensualité BuyMonth" loading="lazy" referrerpolicy="no-referrer" style="border:0;width:344px;height:312px;"></iframe>`
  const htmlCode = `<a href="${bien?.urlClient || '#'}" target="_blank" rel="noopener" style="display:inline-block;text-decoration:none">\n  <img src="${BASE_URL}/api/widget/image?${params.toString()}" alt="Propriétaire dès ${mensualite} €/mois" style="width:320px;height:auto" />\n</a>`

  function copy(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 1800)
  }

  async function handleLogo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok && data.url) setLogoUrl(data.url)
    } catch {}
    finally {
      setUploadingLogo(false)
      if (logoInput.current) logoInput.current.value = ''
    }
  }

  function downloadSVG() {
    const svg = buildSVG({ mensualite, premium, style, primaire: effPrimaire, accent: effAccent, fond: effFond, cTitre: effTitre, cMentions: effMentions, cCredit: effCredit })
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `badge-buymonth-${bienId}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadPNG() {
    const svg = buildSVG({ mensualite, premium, style, primaire: effPrimaire, accent: effAccent, fond: effFond, cTitre: effTitre, cMentions: effMentions, cCredit: effCredit })
    const img = new Image()
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.onload = () => {
      const scale = 3
      const canvas = document.createElement('canvas')
      canvas.width = 320 * scale
      canvas.height = 288 * scale
      const ctx = canvas.getContext('2d')
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        const purl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = purl
        a.download = `badge-buymonth-${bienId}.png`
        a.click()
        URL.revokeObjectURL(purl)
      })
    }
    img.src = url
  }

  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }
  const sousTitre = { fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '4px 0 12px' }
  const toggleBtn = (active, disabled) => ({
    flex: 1, padding: '10px', borderRadius: 10,
    border: `1.5px solid ${active ? '#7CB8A8' : '#E8EDF2'}`,
    background: active ? 'rgba(124,184,168,0.1)' : '#fff',
    color: disabled ? '#B7C0CE' : '#193B5E', fontSize: 13, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
  })
  const preBox = { margin: 0, padding: '14px', paddingRight: 78, background: '#0F2438', color: '#A8C5D6', borderRadius: 10, fontSize: 11.5, overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.5, whiteSpace: 'pre', maxWidth: '100%', boxSizing: 'border-box' }
  const copyBtn = { position: 'absolute', top: 10, right: 10, padding: '6px 12px', borderRadius: 8, background: '#7CB8A8', color: '#16324F', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }

  const checker = `repeating-conic-gradient(#EAEFF5 0% 25%, #F7F9FC 0% 50%) 50% / 20px 20px`

  const bienOptions = biens.map((b) => ({
    value: b.id,
    label: `${b.titre} — ${b.mensualite} €/mois`,
  }))

  return (
    <div className="wg-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
      <style>{`@media (max-width: 1024px){ .wg-grid { grid-template-columns: 1fr !important; } }`}</style>

      {/* COLONNE CONFIG */}
      <div style={{ minWidth: 0 }}>
        <FormSection icon={ic.bien} title="Choisir un bien" subtitle="Le badge affichera sa mensualité">
          <FormSelect
            value={bienId}
            onChange={setBienId}
            options={bienOptions}
            placeholder="Sélectionner un bien"
          />
        </FormSection>

        <FormSection icon={ic.palette} title="Apparence" subtitle="Style et personnalisation">
          <label style={labelStyle}>Style</label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button type="button" onClick={() => setStyle('light')} style={toggleBtn(style === 'light')}>Clair</button>
            <button type="button" onClick={() => setStyle('dark')} style={toggleBtn(style === 'dark')}>Foncé</button>
          </div>

          <label style={labelStyle}>Thème</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setPremium(false)} style={toggleBtn(!premium)}>Classique</button>
            <button type="button" onClick={() => { if (isPremiumPlan) setPremium(true) }} disabled={!isPremiumPlan} style={toggleBtn(premium, !isPremiumPlan)}>
              Pro+{!isPremiumPlan && ' 🔒'}
            </button>
          </div>

          {!isPremiumPlan && (
            <p style={{ fontSize: 12, color: '#A9B0BE', margin: '14px 0 0', lineHeight: 1.5 }}>
              La personnalisation (logo, couleurs) est réservée à la formule Pro+.
            </p>
          )}

          {premium && isPremiumPlan && (
            <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid #F2F5FA' }}>
              <label style={labelStyle}>Votre logo</label>
              <input ref={logoInput} type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                {logoUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 56, height: 40, borderRadius: 8, background: '#16324F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                      <img src={logoUrl} alt="logo" style={{ maxHeight: 32, maxWidth: 48, objectFit: 'contain' }} />
                    </div>
                    <button type="button" onClick={() => setLogoUrl('')} style={{ fontSize: 12, color: '#E5484D', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Retirer</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => logoInput.current?.click()} disabled={uploadingLogo} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, border: '1.5px dashed #C8D4E2', background: '#FAFDFD', color: '#5A6B7D', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {uploadingLogo ? 'Envoi...' : '↑ Uploader mon logo'}
                  </button>
                )}
              </div>

              <label style={labelStyle}>Couleurs</label>
              <div style={{ display: 'flex', gap: 10, marginBottom: couleurMode === 'perso' ? 18 : 0 }}>
                <button type="button" onClick={() => setCouleurMode('buymonth')} style={toggleBtn(couleurMode === 'buymonth')}>Couleurs BuyMonth</button>
                <button type="button" onClick={() => setCouleurMode('perso')} style={toggleBtn(couleurMode === 'perso')}>Personnalisées</button>
              </div>

              {couleurMode === 'perso' && (
                <>
                  {/* Couleurs du badge */}
                  <p style={sousTitre}>Couleurs du badge</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                    <ColorPicker label="Couleur principale" value={primaire} onChange={setPrimaire} />
                    <ColorPicker label="Couleur mensualité" value={accent} onChange={setAccent} />
                    <ColorPicker label="Couleur de fond" value={fond} onChange={setFond} />
                  </div>

                  {/* Couleurs des textes */}
                  <p style={sousTitre}>Couleurs des textes</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <ColorPicker label="Titre" value={cTitre} onChange={setCTitre} />
                    <ColorPicker label="Mentions légales" value={cMentions} onChange={setCMentions} />
                    <ColorPicker label="Ligne crédit" value={cCredit} onChange={setCCredit} />
                  </div>
                </>
              )}
            </div>
          )}
        </FormSection>

        {/* Code d'intégration — toujours disponible (widget gratuit/inclus) */}
        <FormSection icon={ic.code} title="Code d'intégration" subtitle="Copiez le code sur le site du bien">
          <label style={labelStyle}>Option A — iframe (recommandée)</label>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <pre style={preBox}>{iframeCode}</pre>
            <button type="button" onClick={() => copy(iframeCode, 'iframe')} style={copyBtn}>{copied === 'iframe' ? 'Copié ✓' : 'Copier'}</button>
          </div>
          <label style={labelStyle}>Option B — image (HTML)</label>
          <div style={{ position: 'relative' }}>
            <pre style={preBox}>{htmlCode}</pre>
            <button type="button" onClick={() => copy(htmlCode, 'html')} style={copyBtn}>{copied === 'html' ? 'Copié ✓' : 'Copier'}</button>
          </div>
        </FormSection>
      </div>

      {/* COLONNE PREVIEW */}
      <div style={{ position: 'sticky', top: 24, minWidth: 0 }}>
        <div style={{ background: checker, border: '1px solid #EEF2F7', borderRadius: 16, padding: 28, display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Badge mensualite={mensualite} premium={premium} theme={style} couleurPrimaire={effPrimaire} couleurAccent={effAccent} couleurFond={effFond} couleurTitre={effTitre} couleurMentions={effMentions} couleurCredit={effCredit} logoUrl={premium ? logoUrl : null} width={280} />
        </div>

        {/* Bouton « Simuler ma mensualité » → simulateur du bien */}
        <a href={simulateurUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 10, background: '#7CB8A8', color: '#0F2A22', textDecoration: 'none', fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /></svg>
          Simuler ma mensualité
        </a>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={downloadSVG} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Télécharger SVG
          </button>
          <button type="button" onClick={downloadPNG} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#fff', color: '#193B5E', border: '1.5px solid #E8EDF2', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Télécharger PNG
          </button>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useRef, useEffect } from 'react'
import { FormSection } from '@/app/components/dashboard/FormSection'
import { FormSelect } from '@/app/components/dashboard/FormSelect'
import { Badge } from './Badge'
import { WidgetPaymentModal } from './WidgetPaymentModal'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : ''

const ic = {
  bien: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  palette: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.555C21.965 6.012 17.461 2 12 2z" /></svg>,
  code: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
}

function buildSVG({ mensualite, premium, theme, primaire, accent }) {
  const dark = theme === 'dark'
  const bg = dark ? '#16324F' : '#FFFFFF'
  const textMain = dark ? '#FFFFFF' : '#16324F'
  const textMuted = dark ? '#9FB0C4' : '#8A92A6'
  const w = 320, h = 280
  const header = premium
    ? `<rect x="137" y="20" width="46" height="46" rx="10" fill="${accent}"/>`
    : `<text x="160" y="50" font-family="system-ui,Arial,sans-serif" font-size="22" font-weight="700" text-anchor="middle"><tspan fill="#FFFFFF">Buy</tspan><tspan fill="${accent}">Month</tspan></text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="16" fill="${bg}" stroke="#EEF2F7"/>
  <path d="M0 16 Q0 0 16 0 H304 Q320 0 320 16 V84 H0 Z" fill="${primaire}"/>
  ${header}
  <text x="160" y="128" font-family="system-ui,Arial,sans-serif" font-size="14" font-weight="600" fill="${textMain}" text-anchor="middle">Propriétaire de ce bien dès</text>
  <text x="160" y="178" font-family="system-ui,Arial,sans-serif" font-size="40" font-weight="700" fill="${accent}" text-anchor="middle">${mensualite ? mensualite.toLocaleString('fr-BE') : '—'} €<tspan font-size="19">/mois</tspan></text>
  <line x1="24" y1="200" x2="296" y2="200" stroke="#EEF2F7"/>
  <text x="160" y="222" font-family="system-ui,Arial,sans-serif" font-size="9" fill="${textMuted}" text-anchor="middle">Simulation indicative (apport 10 %, 25 ans, TAEG 3,45 % hors assurances).</text>
  <text x="160" y="236" font-family="system-ui,Arial,sans-serif" font-size="9" fill="${textMuted}" text-anchor="middle">Sous réserve d'acceptation du crédit par l'organisme prêteur.</text>
  <text x="160" y="256" font-family="system-ui,Arial,sans-serif" font-size="9" font-weight="600" fill="${textMuted}" text-anchor="middle">JG Management — FSMA 1021.366.349</text>
</svg>`
}

export function WidgetGenerator({ biens, plan }) {
  const isPremiumPlan = plan === 'PREMIUM'
  const [bienId, setBienId] = useState(biens[0]?.id || '')
  const [theme, setTheme] = useState('light')
  const [premium, setPremium] = useState(false)
  const [couleurMode, setCouleurMode] = useState('buymonth')
  const [primaire, setPrimaire] = useState('#16324F')
  const [accent, setAccent] = useState('#7CB8A8')
  const [logoUrl, setLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [copied, setCopied] = useState('')
  const logoInput = useRef(null)

  const [biensPayes, setBiensPayes] = useState([])
  const [credits, setCredits] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [genLoading, setGenLoading] = useState(false)
  const [genError, setGenError] = useState('')

  const bien = biens.find((b) => b.id === bienId)
  const mensualite = bien?.mensualite || null
  const paye = biensPayes.includes(bienId)

  // Charge biens payés + crédits gratuits au montage
  useEffect(() => {
    Promise.all([
      fetch('/api/widget/payes').then((r) => r.json()).catch(() => ({})),
      fetch('/api/widget/credits').then((r) => r.json()).catch(() => ({})),
    ]).then(([payes, cr]) => {
      if (Array.isArray(payes.bienIds)) setBiensPayes(payes.bienIds)
      if (typeof cr.creditsRestants === 'number') setCredits(cr.creditsRestants)
    }).finally(() => setLoaded(true))
  }, [])

  const effPrimaire = premium && couleurMode === 'perso' ? primaire : '#16324F'
  const effAccent = premium && couleurMode === 'perso' ? accent : '#7CB8A8'

  const params = new URLSearchParams()
  if (bienId) params.set('bien', bienId)
  if (premium) params.set('premium', '1')
  if (theme === 'dark') params.set('theme', 'dark')
  if (premium && couleurMode === 'perso') {
    params.set('primaire', primaire.replace('#', ''))
    params.set('accent', accent.replace('#', ''))
  }
  if (premium && logoUrl) params.set('logo', encodeURIComponent(logoUrl))
  const embedUrl = `${BASE_URL}/embed/badge?${params.toString()}`

  const iframeCode = `<iframe src="${embedUrl}" title="Mensualité BuyMonth" loading="lazy" referrerpolicy="no-referrer" style="border:0;width:344px;height:304px;"></iframe>`
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

  // Génération via crédit gratuit (pas de Stripe)
  async function genererGratuit() {
    setGenLoading(true); setGenError('')
    try {
      const res = await fetch('/api/widget/payer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bienId }),
      })
      const data = await res.json()
      if (!res.ok) { setGenError(data.error || 'Erreur.'); setGenLoading(false); return }
      if (data.gratuit || data.dejaPaye) {
        setBiensPayes((prev) => prev.includes(bienId) ? prev : [...prev, bienId])
        setCredits((c) => Math.max(0, c - 1))
      } else if (data.clientSecret) {
        // plus de crédit → bascule sur la modale payante
        setShowPayment(true)
      }
    } catch {
      setGenError('Erreur réseau.')
    }
    setGenLoading(false)
  }

  function downloadSVG() {
    const svg = buildSVG({ mensualite, premium, theme, primaire: effPrimaire, accent: effAccent })
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `badge-buymonth-${bienId}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadPNG() {
    const svg = buildSVG({ mensualite, premium, theme, primaire: effPrimaire, accent: effAccent })
    const img = new Image()
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.onload = () => {
      const scale = 3
      const canvas = document.createElement('canvas')
      canvas.width = 320 * scale
      canvas.height = 280 * scale
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
    badge: biensPayes.includes(b.id) ? { label: 'Généré', color: '#249E7C', bg: 'rgba(36,158,124,0.12)', dot: true } : null,
  }))

  return (
    <div className="wg-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
      <style>{`@media (max-width: 1024px){ .wg-grid { grid-template-columns: 1fr !important; } }`}</style>

      {showPayment && bien && (
        <WidgetPaymentModal
          bien={bien}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setBiensPayes((prev) => prev.includes(bienId) ? prev : [...prev, bienId]); setShowPayment(false) }}
        />
      )}

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

        <FormSection icon={ic.palette} title="Apparence" subtitle="Thème et personnalisation">
          <label style={labelStyle}>Thème</label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button type="button" onClick={() => setTheme('light')} style={toggleBtn(theme === 'light')}>Clair</button>
            <button type="button" onClick={() => setTheme('dark')} style={toggleBtn(theme === 'dark')}>Foncé</button>
          </div>

          <label style={labelStyle}>Type de partenaire</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setPremium(false)} style={toggleBtn(!premium)}>Classique</button>
            <button type="button" onClick={() => { if (isPremiumPlan) setPremium(true) }} disabled={!isPremiumPlan} style={toggleBtn(premium, !isPremiumPlan)}>
              Premium{!isPremiumPlan && ' 🔒'}
            </button>
          </div>

          {!isPremiumPlan && (
            <p style={{ fontSize: 12, color: '#A9B0BE', margin: '14px 0 0', lineHeight: 1.5 }}>
              La personnalisation (logo, couleurs) est réservée au forfait Premium.
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
              <div style={{ display: 'flex', gap: 10, marginBottom: couleurMode === 'perso' ? 16 : 0 }}>
                <button type="button" onClick={() => setCouleurMode('buymonth')} style={toggleBtn(couleurMode === 'buymonth')}>Couleurs BuyMonth</button>
                <button type="button" onClick={() => setCouleurMode('perso')} style={toggleBtn(couleurMode === 'perso')}>Personnalisées</button>
              </div>

              {couleurMode === 'perso' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Couleur principale</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #E8EDF2', borderRadius: 10, padding: '6px 10px' }}>
                      <input type="color" value={primaire} onChange={(e) => setPrimaire(e.target.value)} style={{ width: 30, height: 30, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none', flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: '#5A6B7D' }}>{primaire}</span>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Couleur accent</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #E8EDF2', borderRadius: 10, padding: '6px 10px' }}>
                      <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} style={{ width: 30, height: 30, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none', flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: '#5A6B7D' }}>{accent}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* Code d'intégration — verrouillé si non payé/généré */}
        <FormSection icon={ic.code} title="Code d'intégration" subtitle={paye ? 'Copiez le code sur le site du bien' : 'Générez votre widget pour obtenir le code'}>
          {!loaded ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#8A92A6', fontSize: 13.5 }}>Vérification...</div>
          ) : paye ? (
            <>
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
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: 14, background: 'rgba(124,184,168,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              </div>
              <p style={{ fontSize: 14, color: '#193B5E', fontWeight: 600, margin: '0 0 4px' }}>Widget non généré pour ce bien</p>

              {credits > 0 ? (
                <>
                  <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 6px', lineHeight: 1.5 }}>
                    Vous disposez de widgets gratuits offerts.
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(36,158,124,0.1)', color: '#1B7A5E', fontSize: 12.5, fontWeight: 700, padding: '5px 12px', borderRadius: 20, marginBottom: 18 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#249E7C' }} />
                    {credits} widget{credits > 1 ? 's' : ''} gratuit{credits > 1 ? 's' : ''} restant{credits > 1 ? 's' : ''}
                  </div>
                  {genError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13, borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>{genError}</div>}
                  <div>
                    <button type="button" onClick={genererGratuit} disabled={genLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 26px', borderRadius: 11, background: '#7CB8A8', color: '#0F2A22', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: genLoading ? 'wait' : 'pointer' }}>
                      {genLoading ? 'Génération...' : 'Générer gratuitement'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.5 }}>
                    Générez votre widget pour ce bien (90 € une fois) et obtenez le code à intégrer sur votre site.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 26px', borderRadius: 11, background: 'linear-gradient(135deg, #1D4267 0%, #16324F 100%)', color: '#fff', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <span style={{ display: 'flex', width: 26, height: 26, borderRadius: 8, background: 'rgba(124,184,168,0.18)', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#7CB8A8" stroke="#7CB8A8" strokeWidth="1.5" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    </span>
                    Générer mon widget — 90 €
                  </button>
                </>
              )}
            </div>
          )}
        </FormSection>
      </div>

      {/* COLONNE PREVIEW */}
      <div style={{ position: 'sticky', top: 24, minWidth: 0 }}>
        <div style={{ background: checker, border: '1px solid #EEF2F7', borderRadius: 16, padding: 28, display: 'flex', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
          <Badge mensualite={mensualite} premium={premium} theme={theme} couleurPrimaire={effPrimaire} couleurAccent={effAccent} logoUrl={premium ? logoUrl : null} width={280} />
          {loaded && !paye && (
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(22,50,79,0.85)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>Aperçu</div>
          )}
        </div>

        {paye && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={downloadSVG} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Télécharger SVG
            </button>
            <button type="button" onClick={downloadPNG} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#fff', color: '#193B5E', border: '1.5px solid #E8EDF2', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Télécharger PNG
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
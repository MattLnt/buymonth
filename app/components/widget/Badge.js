'use client'

import { MENSUALITE_CONFIG, avertissementLegal, identificationFinance, noteEstimation } from '@/lib/mensualiteConfig'
import { locale, makeT } from '@/lib/i18n/config'
import { useLang } from '@/app/components/i18n/LangProvider'

// Composant badge pur (présentation). Utilisé par /embed/badge ET la preview du générateur.
// lang : 'fr' ou 'nl'. Priorité à la prop (sur /embed/badge : ?lang= de l'iframe ; dans le générateur :
// langue choisie pour le widget), sinon langue du site via useLang().

export function Badge({
  mensualite,
  prix,
  premium = false,
  theme = 'light',
  couleurPrimaire = '#16324F',
  couleurAccent = '#7CB8A8',
  couleurFond = null,
  couleurTitre = null,
  couleurMentions = null,
  couleurCredit = null,
  logoUrl = null,
  width = 320,
  cfg = null,
  lang: langProp = null,
}) {
  const { lang: langSite } = useLang()
  const lang = langProp === 'nl' || langProp === 'fr' ? langProp : langSite
  const t = makeT(lang)
  const dark = theme === 'dark'
  const bg = couleurFond || (dark ? '#16324F' : '#FFFFFF')
  const headerBg = couleurPrimaire
  const textMain = couleurTitre || (dark ? '#FFFFFF' : '#16324F')
  const textMuted = couleurMentions || (dark ? 'rgba(255,255,255,0.6)' : '#8A92A6')
  const textCredit = couleurCredit || (dark ? 'rgba(255,255,255,0.6)' : '#8A92A6')
  const border = dark ? 'rgba(255,255,255,0.1)' : '#EEF2F7'

  const c = { ...MENSUALITE_CONFIG, ...(cfg || {}) }
  const pct = (v) => new Intl.NumberFormat(locale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v * 100) + ' %'

  return (
    <div style={{ width, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', borderRadius: 16, overflow: 'hidden', border: `1px solid ${border}`, background: bg, boxShadow: '0 8px 28px rgba(22,50,79,0.12)' }}>
      {/* Header */}
      <div style={{ background: headerBg, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 56 }}>
        {premium && logoUrl ? (
          <img src={logoUrl} alt={t('Logo', 'Logo')} style={{ maxHeight: 32, maxWidth: 180, objectFit: 'contain' }} />
        ) : premium && !logoUrl ? (
          <span style={{ width: 30, height: 30, borderRadius: 8, background: couleurAccent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={couleurPrimaire} strokeWidth="2.2"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z" /></svg>
          </span>
        ) : (
          <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Buy<span style={{ color: couleurAccent }}>Month</span>
          </div>
        )}
      </div>

      {/* Corps */}
      <div style={{ padding: '22px 20px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: textMain, marginBottom: 10 }}>{t('Propriétaire de ce bien dès', 'Eigenaar van dit pand vanaf')}</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: couleurAccent, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {mensualite ? mensualite.toLocaleString(locale(lang)) : '—'} €<span style={{ fontSize: 19 }}>{t('/mois*', '/maand*')}</span>
        </div>

        <div style={{ fontSize: 9.5, color: textMuted, marginTop: 16, lineHeight: 1.5, borderTop: `1px solid ${border}`, paddingTop: 12 }}>
          * {avertissementLegal(lang)} {noteEstimation(lang)}{' '}
          {t(
            `Sur base d'un exemple représentatif (apport ${Math.round(c.apportPct * 100)} %, durée ${Math.round(c.dureeMois / 12)} ans, taux débiteur ${pct(c.tauxAnnuel)}, TAEG ${pct(c.taegAnnuel)}). Sous réserve d'acceptation du dossier.`,
            `Op basis van een representatief voorbeeld (eigen inbreng ${Math.round(c.apportPct * 100)} %, looptijd ${Math.round(c.dureeMois / 12)} jaar, debetrentevoet ${pct(c.tauxAnnuel)}, JKP ${pct(c.taegAnnuel)}). Onder voorbehoud van aanvaarding van het dossier.`
          )}
          <div style={{ marginTop: 6, fontWeight: 600, color: textCredit }}>{identificationFinance(lang)}</div>
        </div>
      </div>
    </div>
  )
}
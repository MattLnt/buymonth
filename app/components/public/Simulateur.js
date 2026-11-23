'use client'

import { useState, useEffect } from 'react'
import { evalueBien } from '@/lib/capacite'
import { MENSUALITE_CONFIG, avertissementLegal, identificationFinance } from '@/lib/mensualiteConfig'
import { libelleBienExterne } from '@/lib/bienExterne'
import { useLang } from '@/app/components/i18n/LangProvider'
import { locale } from '@/lib/i18n/config'

const labelStyle = { display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }
const inputStyle = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #E8EDF2', fontSize: 14.5, boxSizing: 'border-box', outline: 'none', background: '#FAFDFD', color: '#193B5E' }

function Euro({ children }) {
  return <div style={{ position: 'relative' }}>{children}<span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 13.5, color: '#9AA2B4', pointerEvents: 'none' }}>€</span></div>
}

const pct = (v, lang) => new Intl.NumberFormat(locale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v * 100) + ' %'
const euro = (n, lang) => (n || 0).toLocaleString(locale(lang)) + ' €'

export function Simulateur({ bien, cfg, onStepChange }) {
  const { lang, t } = useLang()
  const [step, setStep] = useState(1)
  // L'apport peut arriver pré-rempli du configurateur d'un partenaire (cf. lib/bienExterne.js)
  const [sim, setSim] = useState({ revenus: '', apport: bien?.apport ? String(bien.apport) : '', creditsEnCours: '' })
  const [contact, setContact] = useState({ nom: '', societe: '', email: '', telephone: '' })
  const [consentPromoteur, setConsentPromoteur] = useState(false)
  const [consentFinance, setConsentFinance] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cfgM = { ...MENSUALITE_CONFIG, ...(cfg || {}) }
  const dureeAns = Math.round(cfgM.dureeMois / 12)

  useEffect(() => { onStepChange?.(step) }, [step, onStepChange])

  const setS = (k) => (e) => setSim({ ...sim, [k]: e.target.value })
  const setC = (k) => (e) => setContact({ ...contact, [k]: e.target.value })

  async function soumettre(e) {
    e.preventDefault()
    if (!sim.revenus) { setError(t('Indiquez vos revenus.', 'Vul uw inkomen in.')); return }
    if (!contact.email && !contact.telephone) { setError(t('Un email ou un téléphone est requis.', 'Een e-mailadres of telefoonnummer is verplicht.')); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bienId: bien?.id || null,
          bienExterne: libelleBienExterne(bien),
          nom: contact.nom,
          societe: contact.societe,
          email: contact.email,
          telephone: contact.telephone,
          revenu: sim.revenus,
          apport: sim.apport,
          consentPromoteur,
          consentFinance,
          source: bien?.externe ? bien.source : 'SIMULATEUR',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || t('Erreur.', 'Fout.')); setLoading(false); return }

      const r = evalueBien({ revenus: sim.revenus, apport: sim.apport, creditsEnCours: sim.creditsEnCours, prixBien: bien?.prixDecaisse || bien?.prixTotal || 0 }, cfgM)
      setResult(r)
      setLoading(false)
      setStep(2)
    } catch {
      setError(t('Erreur réseau.', 'Netwerkfout.')); setLoading(false)
    }
  }

  const apportPrisEnCompte = parseInt(sim.apport, 10) || 0
  const budgetTotalMax = result ? (result.capitalEmpruntable || 0) + apportPrisEnCompte : 0

  if (step === 2 && result) {
    return (
      <div className="sim-step2-padding">
        <style>{`
          .sim-step2-padding { padding: 28px 24px; }
          @media (max-width: 600px){
            .sim-step2-padding { padding: 24px 16px; }
          }
        `}</style>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: '50%', background: 'rgba(36,158,124,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>{t('Votre demande est enregistrée', 'Uw aanvraag is geregistreerd')}</h2>
          <p style={{ fontSize: 13.5, color: '#5A6275', margin: 0, lineHeight: 1.5, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            {t(
              "Voici votre capacité d'emprunt estimée. Un conseiller BuyMonth Finance vous recontactera pour l'affiner.",
              'Dit is uw geschatte leencapaciteit. Een medewerker van BuyMonth Finance neemt contact met u op om ze te verfijnen.'
            )}
          </p>
        </div>

        <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 14, padding: '16px 14px' }}>
          {[
            { label: t('Mensualité maximale', 'Maximaal maandbedrag'), value: euro(result.mensualiteMax, lang) },
            { label: t('Capital empruntable max', 'Maximaal leenbaar kapitaal'), value: euro(result.capitalEmpruntable, lang) },
            { label: t('Apport pris en compte', 'Eigen inbreng in rekening gebracht'), value: euro(apportPrisEnCompte, lang) },
            { label: t('Budget total maximum', 'Maximaal totaalbudget'), value: euro(budgetTotalMax, lang), strong: true },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>{row.label}</span>
              <span style={{ fontSize: row.strong ? 18 : 14.5, fontWeight: 700, color: row.strong ? '#7CB8A8' : '#fff', whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10.5, color: '#8A92A6', margin: '12px 0 0', lineHeight: 1.45 }}>
          {t(
            `Estimation indicative, hors droits d'enregistrement et frais de notaire, sur base d'un crédit à ${dureeAns} ans, taux débiteur ${pct(cfgM.tauxAnnuel, lang)}, TAEG ${pct(cfgM.taegAnnuel, lang)}. Le budget total maximum additionne le capital empruntable et votre apport. Indicatif uniquement.`,
            `Indicatieve raming, exclusief registratierechten en notariskosten, op basis van een krediet op ${dureeAns} jaar, debetrentevoet ${pct(cfgM.tauxAnnuel, lang)}, JKP ${pct(cfgM.taegAnnuel, lang)}. Het maximale totaalbudget telt het leenbare kapitaal en uw eigen inbreng op. Uitsluitend indicatief.`
          )}
        </p>

        <button type="button" onClick={() => setStep(1)} style={{ width: '100%', padding: '11px', marginTop: 12, borderRadius: 10, background: 'transparent', color: '#5A6275', border: '1.5px solid #E8EDF2', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {t('← Modifier mes informations', '← Mijn gegevens wijzigen')}
        </button>

        <p style={{ fontSize: 10, color: '#A9B0BE', margin: '12px 0 0', lineHeight: 1.4, textAlign: 'center' }}>
          {avertissementLegal(lang)} {identificationFinance(lang)}
        </p>
      </div>
    )
  }

  return (
    <div className="sim-wrap" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden' }}>
      <style>{`
        /* auto-fit : sur la page /simulateur (panneau étroit), les champs passent l'un sous l'autre au lieu d'être coupés (test Vizion du 16/11, point 7) */
        .sim-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
        .sim-right-panel { padding: 28px 24px; }
        @media (max-width: 720px){
          .sim-wrap { grid-template-columns: 1fr !important; }
          .sim-left { display: none !important; }
          .sim-row { grid-template-columns: 1fr !important; gap: 10px; }
          .sim-right-panel { padding: 24px 16px; }
        }
      `}</style>

      {/* PANNEAU GAUCHE */}
      <div className="sim-left" style={{ background: 'linear-gradient(160deg, #16324F 0%, #1D4267 100%)', padding: 28, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,184,168,0.16)', border: '1px solid rgba(124,184,168,0.3)', borderRadius: 20, padding: '5px 12px', marginBottom: 18, alignSelf: 'flex-start' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7CB8A8' }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7CB8A8', letterSpacing: '0.05em' }}>{t('SIMULATION GRATUITE', 'GRATIS SIMULATIE')}</span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{t("Votre capacité d'emprunt", 'Uw leencapaciteit')}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.55 }}>
            {bien?.titre ? t(`Pour « ${bien.titre} ». `, `Voor “${bien.titre}”. `) : ''}{t('Estimez en une minute ce que vous pouvez emprunter, sans engagement.', 'Bereken in een minuut hoeveel u kunt lenen, vrijblijvend.')}
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 24 }}>
            {[t('Réponse immédiate', 'Onmiddellijk antwoord'), t('Sans engagement', 'Vrijblijvend'), t('Étude par un conseiller BuyMonth Finance', 'Studie door een medewerker van BuyMonth Finance')].map((txt) => (
              <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(124,184,168,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.82)' }}>{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PANNEAU DROIT */}
      <div className="sim-right-panel">
        <form onSubmit={soumettre}>
          <div className="sim-row" style={{ marginBottom: 10 }}>
            <div>
              <label style={labelStyle}>{t('Revenus nets mensuels', 'Maandelijks netto-inkomen')}</label>
              <Euro><input type="number" value={sim.revenus} onChange={setS('revenus')} placeholder="3500" style={{ ...inputStyle, paddingRight: 34 }} /></Euro>
            </div>
            <div>
              <label style={labelStyle}>{t('Apport disponible', 'Beschikbare eigen inbreng')}</label>
              <Euro><input type="number" value={sim.apport} onChange={setS('apport')} placeholder="30000" style={{ ...inputStyle, paddingRight: 34 }} /></Euro>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{t('Crédits en cours (mensualités)', 'Lopende kredieten (maandbedragen)')}</label>
            <Euro><input type="number" value={sim.creditsEnCours} onChange={setS('creditsEnCours')} placeholder="0" style={{ ...inputStyle, paddingRight: 34 }} /></Euro>
          </div>

          <div style={{ borderTop: '1px solid #F2F5FA', paddingTop: 14, marginBottom: 4 }}>
            <p style={{ fontSize: 12, color: '#5A6275', margin: '0 0 12px', lineHeight: 1.45 }}>
              {t(
                "Recevez une étude de financement personnalisée, gratuite et sans engagement : laissez vos coordonnées et cochez les cases ci-dessous. C'est facultatif.",
                'Ontvang een gepersonaliseerde financieringsstudie, gratis en vrijblijvend: laat uw gegevens achter en vink de vakjes hieronder aan. Dit is optioneel.'
              )}
            </p>
            <div className="sim-row" style={{ marginBottom: 10 }}>
              <div>
                <label style={labelStyle}>{t('Nom complet', 'Volledige naam')}</label>
                <input value={contact.nom} onChange={setC('nom')} placeholder={t('Votre nom', 'Uw naam')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('Entreprise', 'Bedrijf')} <span style={{ textTransform: 'none', fontWeight: 500, color: '#A9B0BE' }}>{t('(opt.)', '(opt.)')}</span></label>
                <input value={contact.societe} onChange={setC('societe')} placeholder={t('Via une société', 'Via een vennootschap')} style={inputStyle} />
              </div>
            </div>
            <div className="sim-row" style={{ marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>{t('Email', 'E-mail')}</label>
                <input type="email" value={contact.email} onChange={setC('email')} placeholder={t('vous@email.com', 'u@email.com')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('Téléphone', 'Telefoon')}</label>
                <input value={contact.telephone} onChange={setC('telephone')} placeholder="+32 ..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Deux consentements distincts, non coches, aucun obligatoire : le resultat
              de la simulation s'affiche quel que soit le choix (annexe 1, section 2). */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={consentPromoteur} onChange={(e) => setConsentPromoteur(e.target.checked)} style={{ marginTop: 2, width: 15, height: 15, flexShrink: 0, cursor: 'pointer', accentColor: '#7CB8A8' }} />
              <span style={{ fontSize: 11, color: '#5A6275', lineHeight: 1.4 }}>
                {t(
                  "J'accepte que mes coordonnées soient transmises au promoteur du bien consulté, afin qu'il puisse me recontacter.",
                  'Ik ga ermee akkoord dat mijn gegevens worden doorgegeven aan de projectontwikkelaar van het bekeken pand, zodat die contact met mij kan opnemen.'
                )}
              </span>
            </label>
            <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={consentFinance} onChange={(e) => setConsentFinance(e.target.checked)} style={{ marginTop: 2, width: 15, height: 15, flexShrink: 0, cursor: 'pointer', accentColor: '#7CB8A8' }} />
              <span style={{ fontSize: 11, color: '#5A6275', lineHeight: 1.4 }}>
                {t(
                  "J'accepte que mes coordonnées soient transmises à BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit, pour une étude de financement.",
                  'Ik ga ermee akkoord dat mijn gegevens worden doorgegeven aan BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar, voor een financieringsstudie.'
                )}
              </span>
            </label>
            <p style={{ fontSize: 10.5, color: '#A9B0BE', margin: 0, lineHeight: 1.45 }}>
              {t("Les deux cases sont facultatives et indépendantes : votre résultat s'affiche dans tous les cas.", 'Beide vakjes zijn optioneel en onafhankelijk van elkaar: uw resultaat wordt hoe dan ook getoond.')}{' '}
              <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: '#7CB8A8', fontWeight: 600 }}>{t('Confidentialité', 'Privacy')}</a>.
            </p>
          </div>

          {error && <p style={{ color: '#E5484D', fontSize: 12.5, margin: '0 0 12px' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 10, background: '#193B5E', color: '#fff', border: 'none', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? t('Envoi...', 'Versturen...') : t('Voir ma capacité', 'Mijn leencapaciteit bekijken')}
          </button>

          {/* Pas de n° FSMA ici : une publicité pour un crédit ne peut pas faire référence à l'inscription
              de l'intermédiaire (art. VII.123 §2 CDE). Le numéro reste sur /mentions-legales (test Vizion du 16/11, point 4). */}
          <p style={{ fontSize: 9.5, color: '#A9B0BE', margin: '10px 0 0', lineHeight: 1.45, textAlign: 'center' }}>
            {t(
              "Simulation indicative, sans valeur contractuelle. Plateforme éditée par BuyMonth SRL (BCE 1041.967.664), qui n'est pas intermédiaire de crédit.",
              'Indicatieve simulatie, zonder contractuele waarde. Platform uitgegeven door BuyMonth SRL (KBO 1041.967.664), die geen kredietbemiddelaar is.'
            )}{' '}
            {t(
              'Partenaire crédit : BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit.',
              'Kredietpartner: BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar.'
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
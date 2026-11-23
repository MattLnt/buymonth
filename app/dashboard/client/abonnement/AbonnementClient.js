'use client'

/*
 * Page Abonnement du promoteur — refonte du 06/10/2026.
 *
 * L'ancienne version ouvrait sur un gros montant mensuel. Le promoteur voyait
 * « 135 € / mois » juste a cote de « Aucun abonnement » et ne faisait pas le lien
 * avec le fait que ses biens n'etaient pas diffuses : il ne savait pas ce qu'on
 * attendait de lui.
 *
 * Principe retenu : on ouvre sur la CONSEQUENCE (« vos biens ne sont pas encore
 * visibles »), pas sur le prix. L'action devient evidente, le prix vient ensuite
 * pour la justifier. Une seule action principale par etat.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GestionAbonnement } from './GestionAbonnement'
import { useLang } from '@/app/components/i18n/LangProvider'
import { locale } from '@/lib/i18n/config'

const TARIF = { PRO: 39, PRO_PLUS: 45 }
const RANG = { PRO: 0, PRO_PLUS: 1 }
const FORMULE_LABEL = { PRO: 'BuyMonth Pro', PRO_PLUS: 'BuyMonth Pro+' }

const features = (t) => ({
  PRO: [
    t('Plateforme de gestion du portefeuille', 'Platform voor het beheer van uw portefeuille'),
    t('Badges, widgets & QR codes illimités', 'Onbeperkt badges, widgets & QR-codes'),
    t('Pages de simulation dédiées', 'Eigen simulatiepagina’s'),
    t('Tableau de bord & statistiques', 'Dashboard & statistieken'),
    t('Diffusion sur la vitrine publique', 'Publicatie op de publieke etalage'),
    t('Hébergement, maintenance & support', 'Hosting, onderhoud & support'),
  ],
  PRO_PLUS: [
    t('Tous les services BuyMonth Pro', 'Alle diensten van BuyMonth Pro'),
    t('Marque blanche (badges & widgets à vos couleurs)', 'White label (badges & widgets in uw kleuren)'),
    t('Encodage et mises à jour pris en charge par BuyMonth', 'Invoer en updates verzorgd door BuyMonth'),
    t('Mise en avant prioritaire sur la vitrine', 'Prioritaire zichtbaarheid op de etalage'),
  ],
})

// Statuts de bien, et si le statut entre dans la facturation
const statuts = (t) => [
  { cle: 'ACTIF', un: t('disponible', 'beschikbaar'), plusieurs: t('disponibles', 'beschikbaar'), facture: true, couleur: '#249E7C' },
  { cle: 'OPTION', un: t('sous option', 'in optie'), plusieurs: t('sous option', 'in optie'), facture: true, couleur: '#E89923' },
  { cle: 'HORS_LIGNE', un: t('hors ligne', 'offline'), plusieurs: t('hors ligne', 'offline'), facture: false, couleur: '#8A92A6' },
  { cle: 'VENDU', un: t('vendu', 'verkocht'), plusieurs: t('vendus', 'verkocht'), facture: false, couleur: '#5A6B7D' },
]

const NAVY = '#193B5E'

function formatDateL(ms, lang) {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString(locale(lang), { day: 'numeric', month: 'long', year: 'numeric' })
}

function euroL(n, lang) {
  return (n || 0).toLocaleString(locale(lang)) + ' €'
}

const carte = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 26 }

function Check({ couleur = '#249E7C', fond = 'rgba(36,158,124,0.1)' }) {
  return (
    <span style={{ width: 18, height: 18, borderRadius: '50%', background: fond, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={couleur} strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>
    </span>
  )
}

function Bandeau({ ton, children }) {
  const tons = {
    info: { bg: 'rgba(78,125,212,0.08)', bd: 'rgba(78,125,212,0.3)', fg: '#2E5AA8' },
    succes: { bg: 'rgba(36,158,124,0.1)', bd: 'rgba(36,158,124,0.25)', fg: '#1B7A5E' },
    alerte: { bg: '#FFF7ED', bd: '#FED7AA', fg: '#C2620C' },
    erreur: { bg: 'rgba(229,72,77,0.08)', bd: 'rgba(229,72,77,0.2)', fg: '#E5484D' },
  }
  const c = tons[ton] || tons.info
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.bd}`, borderRadius: 12, padding: '14px 18px', marginBottom: 18 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: c.fg, lineHeight: 1.6 }}>{children}</span>
    </div>
  )
}

export function AbonnementClient({
  subStatus,
  formule = 'PRO',
  details,
  createdAt,
  facturation,
  changementProgramme = null,
  premierPrelevement = null,
  joursRestants = 0,
  prorata = 0,
  premiereFacture = 0,
  essaiAdmin = false,
  finGrace = null,
  dansGrace = false,
}) {
  const router = useRouter()
  const { lang, t } = useLang()
  const formatDate = (ms) => formatDateL(ms, lang)
  const euro = (n) => euroL(n, lang)
  const FEATURES = features(t)
  const STATUTS = statuts(t)
  const htva = t('HTVA', 'excl. btw')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const estActif = subStatus === 'active' || subStatus === 'trialing'
  const enRetard = subStatus === 'past_due'
  const resiliation = details?.cancelAtPeriodEnd

  const f = facturation || { formuleLabel: 'BuyMonth Pro', actifs: 0, total: 0, unitaire: 39, montantMensuel: 0, surMesure: false, parStatut: {} }
  const nbFactures = f.actifs || 0
  const parStatut = f.parStatut || {}
  const nbNonFactures = Math.max(0, (f.total || 0) - nbFactures)

  function souscrire() {
    window.location.href = '/dashboard/client/abonnement/checkout'
  }

  // Plus de renvoi vers le portail Stripe : tout se gere dans la section
  // « Gerer mon abonnement », en bas de cette page.
  function gerer() {
    document.getElementById('gestion-abonnement')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function changerFormule(cible) {
    setLoading(cible); setError(''); setMessage('')
    try {
      const res = await fetch('/api/abonnement/formule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formule: cible }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || t('Erreur.', 'Fout.')); setLoading(''); return }
      setMessage(data.message || t('Formule mise à jour.', 'Formule bijgewerkt.'))
      setLoading('')
      router.refresh()
    } catch {
      setError(t('Erreur réseau.', 'Netwerkfout.')); setLoading('')
    }
  }

  /* --------------------------------------------------------------- *
   * Bloc principal — ce qu'il faut comprendre en trois secondes
   * --------------------------------------------------------------- */
  function BlocPrincipal() {
    // Le titre parle toujours des BIENS, jamais de l'abonnement :
    // c'est ce qui rend l'action a faire evidente.
    let eyebrow, titre, sousTitre, bouton, action, tonBouton

    if (estActif) {
      eyebrow = subStatus === 'trialing' && essaiAdmin ? t("PÉRIODE D'ESSAI", 'PROEFPERIODE') : t('ABONNEMENT ACTIF', 'ABONNEMENT ACTIEF')
      titre = nbFactures > 1
        ? t(`Vos ${nbFactures} biens sont diffusés sur BuyMonth`, `Uw ${nbFactures} panden staan online op BuyMonth`)
        : nbFactures === 1
          ? t('Votre bien est diffusé sur BuyMonth', 'Uw pand staat online op BuyMonth')
          : t('Votre abonnement est actif', 'Uw abonnement is actief')
      sousTitre = nbFactures > 0
        ? t(`${nbFactures > 1 ? 'Ils apparaissent' : 'Il apparaît'} sur la vitrine, dans les résultats de recherche et dans vos widgets.`, `${nbFactures > 1 ? 'Ze verschijnen' : 'Het verschijnt'} op de etalage, in de zoekresultaten en in uw widgets.`)
        : t("Mettez un bien en ligne pour qu'il soit diffusé. Sans bien en ligne, rien ne vous est facturé.", 'Zet een pand online om het te publiceren. Zonder pand online betaalt u niets.')
      bouton = t('Gérer mon abonnement', 'Mijn abonnement beheren')
      action = gerer
      tonBouton = 'clair'
    } else if (enRetard) {
      eyebrow = t('PRÉLÈVEMENT REFUSÉ', 'BETALING GEWEIGERD')
      // Pendant le delai de grace les biens restent en ligne : le dire, sinon le
      // promoteur croit que son catalogue est deja coupe et panique pour rien.
      titre = dansGrace ? t('Votre dernier prélèvement a échoué', 'Uw laatste betaling is mislukt') : t('Vos biens ne sont plus diffusés', 'Uw panden staan niet langer online')
      sousTitre = dansGrace
        ? t(`Vos biens restent en ligne jusqu'au ${formatDate(finGrace)}. Mettez votre moyen de paiement à jour avant cette date pour qu'ils y restent.`, `Uw panden blijven online tot ${formatDate(finGrace)}. Werk uw betaalmethode vóór die datum bij zodat ze online blijven.`)
        : t("Le délai de régularisation est dépassé et vos biens ont été retirés du site. Ils reviendront en ligne dès que le paiement sera régularisé.", 'De termijn om te regulariseren is verstreken en uw panden zijn van de site gehaald. Ze komen terug online zodra de betaling in orde is.')
      bouton = t('Régulariser mon paiement', 'Mijn betaling in orde brengen')
      action = gerer
      tonBouton = 'alerte'
    } else if (nbFactures > 0) {
      eyebrow = t('ACTIVATION REQUISE', 'ACTIVERING VEREIST')
      titre = nbFactures > 1
        ? t(`Vos ${nbFactures} biens ne sont pas encore visibles`, `Uw ${nbFactures} panden zijn nog niet zichtbaar`)
        : t("Votre bien n'est pas encore visible", 'Uw pand is nog niet zichtbaar')
      sousTitre = t(`Activez votre abonnement pour ${nbFactures > 1 ? 'les publier' : 'le publier'} sur la vitrine BuyMonth et commencer à recevoir des leads.`, `Activeer uw abonnement om ${nbFactures > 1 ? 'ze' : 'het'} op de BuyMonth-etalage te publiceren en leads te ontvangen.`)
      bouton = t('Activer mon abonnement', 'Mijn abonnement activeren')
      action = souscrire
      tonBouton = 'vert'
    } else {
      eyebrow = t('AUCUN BIEN EN LIGNE', 'GEEN PAND ONLINE')
      titre = t('Ajoutez un bien pour commencer', 'Voeg een pand toe om te beginnen')
      sousTitre = t("L'abonnement se calcule sur vos biens en ligne. Tant que vous n'en avez aucun, il n'y a rien à payer et rien à activer.", 'Het abonnement wordt berekend op uw panden online. Zolang u er geen hebt, is er niets te betalen en niets te activeren.')
      bouton = t('Ajouter un bien', 'Een pand toevoegen')
      action = () => { window.location.href = '/dashboard/client/biens/nouveau' }
      tonBouton = 'vert'
    }

    const fondBouton = tonBouton === 'clair' ? '#fff' : tonBouton === 'alerte' ? '#E89923' : '#7CB8A8'
    const texteBouton = tonBouton === 'clair' ? '#16324F' : tonBouton === 'alerte' ? '#fff' : '#0F2A22'

    return (
      <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 18, padding: 30, position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ position: 'absolute', top: -60, right: -50, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="abo-hero" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7CB8A8', letterSpacing: '0.09em', marginBottom: 10 }}>{eyebrow}</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>{titre}</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.65, maxWidth: 520 }}>{sousTitre}</p>
          </div>

          <button onClick={action}
            style={{
              padding: '15px 26px', borderRadius: 12, background: fondBouton, color: texteBouton,
              border: 'none', fontSize: 14.5, fontWeight: 700, cursor: 'pointer',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>
            {bouton}
          </button>
        </div>

        {/* Le prix et la date viennent en second : ils justifient l'action, ils ne la remplacent pas */}
        {nbFactures > 0 && (
          <div className="abo-chiffres" style={{ position: 'relative', marginTop: 24, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em' }}>
                {estActif ? t('PRÉLEVÉ CHAQUE MOIS', 'MAANDELIJKS AFGESCHREVEN') : t('COÛT MENSUEL', 'MAANDELIJKSE KOST')}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{euro(f.montantMensuel)}</span>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)' }}>{htva}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>
                {nbFactures} {nbFactures > 1 ? t('biens', 'panden') : t('bien', 'pand')} × {euro(f.unitaire)}
              </div>
            </div>

            {premierPrelevement && !enRetard && (
              <div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em' }}>
                  {estActif ? t('PROCHAIN PRÉLÈVEMENT', 'VOLGENDE AFSCHRIJVING') : t('PREMIER PRÉLÈVEMENT', 'EERSTE AFSCHRIJVING')}
                </div>
                {estActif ? (
                  <>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{formatDate(details?.currentPeriodEnd || premierPrelevement)}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{t('puis le 1er de chaque mois', 'daarna op de 1e van elke maand')}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{formatDate(premierPrelevement)}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 4, maxWidth: 330, lineHeight: 1.55 }}>
                      {t(
                        `${euro(premiereFacture)} HTVA : ${euro(prorata)} pour les ${joursRestants} jour${joursRestants > 1 ? 's' : ''} restant${joursRestants > 1 ? 's' : ''} du mois, puis ${euro(f.montantMensuel)} pour le mois suivant.`,
                        `${euro(premiereFacture)} excl. btw: ${euro(prorata)} voor de ${joursRestants} resterende ${joursRestants > 1 ? 'dagen' : 'dag'} van de maand, daarna ${euro(f.montantMensuel)} voor de volgende maand.`
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {!estActif && !enRetard && nbFactures > 0 && (
          <div style={{ position: 'relative', marginTop: 18, background: 'rgba(124,184,168,0.14)', border: '1px solid rgba(124,184,168,0.3)', borderRadius: 10, padding: '11px 15px' }}>
            <span style={{ fontSize: 13, color: '#CFE6DC', fontWeight: 600 }}>
              {t(
                `Rien n’est prélevé aujourd’hui. Vos biens sont publiés dès l’activation, et la première facture tombe le ${formatDate(premierPrelevement)}.`,
                `Vandaag wordt er niets afgeschreven. Uw panden worden gepubliceerd zodra u activeert, en de eerste factuur volgt op ${formatDate(premierPrelevement)}.`
              )}
            </span>
          </div>
        )}

        {f.surMesure && (
          <div style={{ position: 'relative', marginTop: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, color: 'rgba(255,255,255,0.8)' }}>
            {t('Au-delà de 125 biens en ligne, une offre sur mesure s’applique — contactez-nous.', 'Vanaf 125 panden online geldt een aanbod op maat — neem contact met ons op.')}
          </div>
        )}
      </div>
    )
  }

  /* --------------------------------------------------------------- *
   * D'ou vient le montant — la question n°2 de tout promoteur
   * --------------------------------------------------------------- */
  function Decompte() {
    const lignes = STATUTS.map((st) => ({ ...st, nb: parStatut[st.cle] || 0 })).filter((l) => l.nb > 0)

    return (
      <div style={carte}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: '0 0 4px' }}>{t('D’où vient ce montant', 'Hoe dit bedrag tot stand komt')}</h3>
        <p style={{ fontSize: 12.5, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.6 }}>
          {lang === 'nl' ? (
            <>Enkel panden die <strong style={{ color: '#5A6275' }}>beschikbaar</strong> of <strong style={{ color: '#5A6275' }}>in optie</strong> zijn, worden gefactureerd.</>
          ) : (
            <>Seuls les biens <strong style={{ color: '#5A6275' }}>disponibles</strong> et <strong style={{ color: '#5A6275' }}>sous option</strong> sont facturés.</>
          )}
        </p>

        {lignes.length === 0 ? (
          <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>{t('Vous n’avez pas encore de bien.', 'U hebt nog geen pand.')}</p>
        ) : (
          <div>
            {lignes.map((l) => (
              <div key={l.cle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #F2F5FA' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: '#3D4759' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.couleur, flexShrink: 0 }} />
                  {l.nb} {l.nb > 1 ? t('biens', 'panden') : t('bien', 'pand')} {l.nb > 1 ? l.plusieurs : l.un}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: l.facture ? NAVY : '#A9B0BE' }}>
                  {l.facture ? euro(l.nb * f.unitaire) : t('non facturé', 'niet gefactureerd')}
                </span>
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{t('Total mensuel', 'Maandtotaal')}</span>
              <span style={{ fontSize: 19, fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' }}>
                {euro(f.montantMensuel)} <span style={{ fontSize: 12.5, fontWeight: 600, color: '#8A92A6' }}>{htva}</span>
              </span>
            </div>
          </div>
        )}

        {nbNonFactures > 0 && (
          <p style={{ fontSize: 12, color: '#A9B0BE', margin: '14px 0 0', lineHeight: 1.55 }}>
            {t(
              `${nbNonFactures} bien${nbNonFactures > 1 ? 's' : ''} hors ligne ou vendu${nbNonFactures > 1 ? 's' : ''} — ils restent dans votre espace mais ne vous coûtent rien.`,
              `${nbNonFactures} ${nbNonFactures > 1 ? 'panden' : 'pand'} offline of verkocht — ${nbNonFactures > 1 ? 'ze blijven' : 'het blijft'} in uw account maar ${nbNonFactures > 1 ? 'kosten' : 'kost'} u niets.`
            )}
          </p>
        )}

        <Link href="/dashboard/client/biens" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 13, fontWeight: 600, color: '#249E7C', textDecoration: 'none' }}>
          {t('Gérer mes biens', 'Mijn panden beheren')}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </Link>
      </div>
    )
  }

  /* --------------------------------------------------------------- *
   * Recapitulatif administratif
   * --------------------------------------------------------------- */
  function Recap() {
    const lignes = [
      { label: t('Formule', 'Formule'), value: f.formuleLabel },
      { label: t('Tarif par bien', 'Tarief per pand'), value: `${euro(f.unitaire)} / ${t('mois', 'maand')}` },
      subStatus === 'trialing' && essaiAdmin && details?.trialEnd && { label: t("Fin de l'essai", 'Einde proefperiode'), value: formatDate(details.trialEnd) },
      !estActif && !enRetard && premierPrelevement && { label: t('Premier mois complet', 'Eerste volledige maand'), value: formatDate(premierPrelevement) },
      estActif && !resiliation && { label: t('Prochain prélèvement', 'Volgende afschrijving'), value: formatDate(details?.currentPeriodEnd || premierPrelevement) },
      enRetard && dansGrace && { label: t('Biens en ligne jusqu’au', 'Panden online tot'), value: formatDate(finGrace), couleur: '#C2620C' },
      resiliation && { label: t("Fin d'accès", 'Einde toegang'), value: formatDate(details?.cancelAt || details?.currentPeriodEnd), couleur: '#E5484D' },
      { label: t('Client depuis', 'Klant sinds'), value: formatDate(new Date(createdAt).getTime()) },
    ].filter(Boolean)

    return (
      <div style={carte}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: '0 0 18px' }}>{t('Votre contrat', 'Uw contract')}</h3>
        {lignes.map((l, i) => (
          <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < lignes.length - 1 ? '1px solid #F2F5FA' : 'none' }}>
            <span style={{ fontSize: 13, color: '#8A92A6' }}>{l.label}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: l.couleur || NAVY }}>{l.value}</span>
          </div>
        ))}

        <div style={{ marginTop: 16, padding: '12px 14px', background: '#FAFBFE', borderRadius: 10, border: '1px solid #F2F5FA' }}>
          <p style={{ fontSize: 12, color: '#8A92A6', margin: 0, lineHeight: 1.6 }}>
            {lang === 'nl' ? (
              <>
                Het abonnement wordt betaald op de <strong style={{ color: '#5A6275' }}>1e van elke maand</strong>, op basis van het aantal panden dat op die datum online staat.
                De opstartkosten (1.490 € excl. btw, eenmalig) worden apart gefactureerd, buiten het platform.
              </>
            ) : (
              <>
                L&rsquo;abonnement se paie le <strong style={{ color: '#5A6275' }}>1er de chaque mois</strong>, sur le nombre de biens en ligne à cette date.
                Les frais de mise en service (1 490 € HTVA, une seule fois) sont facturés séparément, hors plateforme.
              </>
            )}
          </p>
        </div>


      </div>
    )
  }

  /* --------------------------------------------------------------- *
   * Formules
   * --------------------------------------------------------------- */
  function CarteFormule({ cle }) {
    const estLaSienne = formule === cle
    const estUpgrade = RANG[cle] > RANG[formule]
    const proPlus = cle === 'PRO_PLUS'
    const cout = nbFactures * TARIF[cle]

    // Sans abonnement, la formule « actuelle » n'est qu'une preselection :
    // son bouton doit mener au paiement, sinon la carte est une impasse.
    let label = null
    let action = null
    if (estLaSienne && !estActif) { label = t(`Activer avec ${FORMULE_LABEL[cle]}`, `Activeren met ${FORMULE_LABEL[cle]}`); action = souscrire }
    else if (!estLaSienne && !estActif) { label = t(`Choisir ${FORMULE_LABEL[cle]}`, `${FORMULE_LABEL[cle]} kiezen`); action = () => changerFormule(cle) }
    else if (!estLaSienne && estUpgrade) { label = t(`Passer à ${FORMULE_LABEL[cle]}`, `Overstappen naar ${FORMULE_LABEL[cle]}`); action = () => changerFormule(cle) }
    else if (!estLaSienne) { label = t(`Revenir à ${FORMULE_LABEL[cle]}`, `Terug naar ${FORMULE_LABEL[cle]}`); action = () => changerFormule(cle) }

    const badge = estLaSienne ? (estActif ? t('VOTRE FORMULE', 'UW FORMULE') : t('SÉLECTIONNÉE', 'GESELECTEERD')) : (proPlus ? 'PREMIUM' : null)

    return (
      <div style={{
        position: 'relative', background: '#fff',
        border: estLaSienne ? '2px solid #7CB8A8' : `1.5px solid ${proPlus ? 'rgba(78,125,212,0.3)' : '#EEF2F7'}`,
        borderRadius: 18, padding: 26, display: 'flex', flexDirection: 'column',
      }}>
        {badge && (
          <span style={{
            position: 'absolute', top: 18, right: 18, fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em',
            background: estLaSienne ? 'rgba(124,184,168,0.16)' : 'rgba(78,125,212,0.12)',
            color: estLaSienne ? '#1B7A5E' : '#4E7DD4',
          }}>{badge}</span>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: proPlus ? '#4E7DD4' : '#8A92A6', marginBottom: 10 }}>
          {FORMULE_LABEL[cle].toUpperCase()}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: NAVY, letterSpacing: '-0.02em' }}>{TARIF[cle]} €</span>
          <span style={{ fontSize: 13, color: '#8A92A6' }}>{t('/ bien / mois HTVA', '/ pand / maand excl. btw')}</span>
        </div>

        <div style={{ fontSize: 13, color: '#5A6275', marginBottom: 20, fontWeight: 600, minHeight: 20 }}>
          {nbFactures > 0
            ? t(`Avec ${nbFactures > 1 ? `vos ${nbFactures} biens` : 'votre bien'} en ligne : ${euro(cout)} / mois`, `Met ${nbFactures > 1 ? `uw ${nbFactures} panden` : 'uw pand'} online: ${euro(cout)} / maand`)
            : t('Aucun bien en ligne pour le moment', 'Momenteel geen pand online')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22, flex: 1 }}>
          {FEATURES[cle].map((ft) => (
            <div key={ft} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              <Check couleur={proPlus ? '#4E7DD4' : '#249E7C'} fond={proPlus ? 'rgba(78,125,212,0.12)' : 'rgba(36,158,124,0.1)'} />
              <span style={{ fontSize: 13, color: '#3D4759', lineHeight: 1.45 }}>{ft}</span>
            </div>
          ))}
        </div>

        {label ? (
          <button onClick={action} disabled={loading === cle}
            style={{
              width: '100%', padding: '13px', borderRadius: 11, border: 'none',
              background: estLaSienne ? '#7CB8A8' : proPlus ? '#4E7DD4' : NAVY,
              color: estLaSienne ? '#0F2A22' : '#fff',
              fontSize: 14, fontWeight: 700, cursor: loading === cle ? 'wait' : 'pointer',
            }}>
            {loading === cle ? t('Traitement…', 'Bezig…') : label}
          </button>
        ) : (
          <div style={{ width: '100%', padding: '13px', borderRadius: 11, background: 'rgba(124,184,168,0.12)', color: '#1B7A5E', fontSize: 13.5, fontWeight: 700, textAlign: 'center' }}>
            {t('Formule en cours', 'Huidige formule')}
          </div>
        )}
      </div>
    )
  }

  /* --------------------------------------------------------------- */

  return (
    <div>
      <style>{`
        @media (max-width: 900px){
          .abo-colonnes { grid-template-columns: 1fr !important; }
          .abo-formules { grid-template-columns: 1fr !important; }
          .abo-hero > button { width: 100%; }
          .abo-chiffres { gap: 22px !important; }
        }
      `}</style>

      {changementProgramme && (
        <Bandeau ton="info">
          {t(
            `Changement programmé : vous passerez en ${changementProgramme.formuleCibleLabel}${changementProgramme.dateEffet ? ` le ${formatDate(changementProgramme.dateEffet)}` : ' à la fin de votre période en cours'}. D’ici là, vous conservez votre formule actuelle.`,
            `Geplande wijziging: u stapt over naar ${changementProgramme.formuleCibleLabel}${changementProgramme.dateEffet ? ` op ${formatDate(changementProgramme.dateEffet)}` : ' aan het einde van uw lopende periode'}. Tot dan behoudt u uw huidige formule.`
          )}
        </Bandeau>
      )}
      {resiliation && (
        <Bandeau ton="alerte">
          {t(
            `Votre abonnement est résilié et prendra fin le ${formatDate(details.cancelAt || details.currentPeriodEnd)}. Vous gardez l’accès jusqu’à cette date.`,
            `Uw abonnement is opgezegd en loopt af op ${formatDate(details.cancelAt || details.currentPeriodEnd)}. U behoudt toegang tot die datum.`
          )}
        </Bandeau>
      )}
      {message && <Bandeau ton="succes">{message}</Bandeau>}
      {error && <Bandeau ton="erreur">{error}</Bandeau>}

      <BlocPrincipal />

      <div className="abo-colonnes" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start', marginBottom: 26 }}>
        <Decompte />
        <Recap />
      </div>

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY, margin: '0 0 4px' }}>
          {estActif ? t('Changer de formule', 'Van formule veranderen') : t('Choisissez votre formule', 'Kies uw formule')}
        </h3>
        <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.6 }}>
          {estActif
            ? t('Le passage à la formule supérieure est immédiat et facturé au prorata. Le passage à la formule inférieure prend effet le 1er du mois suivant.', 'Overstappen naar de hogere formule gebeurt onmiddellijk en wordt pro rata gefactureerd. Overstappen naar de lagere formule gaat in op de 1e van de volgende maand.')
            : t('Les deux formules se facturent au bien en ligne. Vous pourrez en changer à tout moment.', 'Beide formules worden per pand online gefactureerd. U kunt op elk moment van formule veranderen.')}
        </p>
        <div className="abo-formules" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <CarteFormule cle="PRO" />
          <CarteFormule cle="PRO_PLUS" />
        </div>
      </div>

      <div id="gestion-abonnement" style={{ scrollMarginTop: 90 }}>
        <GestionAbonnement actif={estActif || enRetard} />
      </div>

      <p style={{ fontSize: 12, color: '#A9B0BE', margin: '24px 0 0', lineHeight: 1.6, textAlign: 'center' }}>
        {t('Paiement sécurisé via Stripe. Aucune donnée bancaire n’est conservée par BuyMonth.', 'Beveiligde betaling via Stripe. BuyMonth bewaart geen bankgegevens.')}
      </p>
    </div>
  )
}

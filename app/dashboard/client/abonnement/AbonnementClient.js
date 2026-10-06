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

const TARIF = { PRO: 39, PRO_PLUS: 45 }
const RANG = { PRO: 0, PRO_PLUS: 1 }
const FORMULE_LABEL = { PRO: 'BuyMonth Pro', PRO_PLUS: 'BuyMonth Pro+' }

const FEATURES = {
  PRO: [
    'Plateforme de gestion du portefeuille',
    'Badges, widgets & QR codes illimités',
    'Pages de simulation dédiées',
    'Tableau de bord & statistiques',
    'Diffusion sur la vitrine publique',
    'Hébergement, maintenance & support',
  ],
  PRO_PLUS: [
    'Tous les services BuyMonth Pro',
    'Marque blanche (badges & widgets à vos couleurs)',
    'Encodage et mises à jour pris en charge par BuyMonth',
    'Mise en avant prioritaire sur la vitrine',
  ],
}

// Statuts de bien, et si le statut entre dans la facturation
const STATUTS = [
  { cle: 'ACTIF', un: 'disponible', plusieurs: 'disponibles', facture: true, couleur: '#249E7C' },
  { cle: 'OPTION', un: 'sous option', plusieurs: 'sous option', facture: true, couleur: '#E89923' },
  { cle: 'HORS_LIGNE', un: 'hors ligne', plusieurs: 'hors ligne', facture: false, couleur: '#8A92A6' },
  { cle: 'VENDU', un: 'vendu', plusieurs: 'vendus', facture: false, couleur: '#5A6B7D' },
]

const NAVY = '#193B5E'

function formatDate(ms) {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function euro(n) {
  return (n || 0).toLocaleString('fr-BE') + ' €'
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
  const t = tons[ton] || tons.info
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.bd}`, borderRadius: 12, padding: '14px 18px', marginBottom: 18 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: t.fg, lineHeight: 1.6 }}>{children}</span>
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
}) {
  const router = useRouter()
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

  async function gerer() {
    setLoading('portal'); setError('')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      setError(data.error || 'Erreur.'); setLoading('')
    } catch { setError('Erreur réseau.'); setLoading('') }
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
      if (!res.ok) { setError(data.error || 'Erreur.'); setLoading(''); return }
      setMessage(data.message || 'Formule mise à jour.')
      setLoading('')
      router.refresh()
    } catch {
      setError('Erreur réseau.'); setLoading('')
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
      eyebrow = subStatus === 'trialing' ? "PÉRIODE D'ESSAI" : 'ABONNEMENT ACTIF'
      titre = nbFactures > 1
        ? `Vos ${nbFactures} biens sont diffusés sur BuyMonth`
        : nbFactures === 1
          ? 'Votre bien est diffusé sur BuyMonth'
          : 'Votre abonnement est actif'
      sousTitre = nbFactures > 0
        ? `${nbFactures > 1 ? 'Ils apparaissent' : 'Il apparaît'} sur la vitrine, dans les résultats de recherche et dans vos widgets.`
        : "Mettez un bien en ligne pour qu'il soit diffusé. Sans bien en ligne, rien ne vous est facturé."
      bouton = loading === 'portal' ? 'Ouverture…' : 'Gérer mon abonnement'
      action = gerer
      tonBouton = 'clair'
    } else if (enRetard) {
      eyebrow = 'PAIEMENT EN ÉCHEC'
      titre = 'Vos biens ne sont plus diffusés'
      sousTitre = "Le dernier prélèvement n'a pas abouti. Mettez votre moyen de paiement à jour pour les remettre en ligne."
      bouton = loading === 'portal' ? 'Ouverture…' : 'Mettre à jour mon paiement'
      action = gerer
      tonBouton = 'alerte'
    } else if (nbFactures > 0) {
      eyebrow = 'ACTIVATION REQUISE'
      titre = nbFactures > 1
        ? `Vos ${nbFactures} biens ne sont pas encore visibles`
        : "Votre bien n'est pas encore visible"
      sousTitre = `Activez votre abonnement pour ${nbFactures > 1 ? 'les publier' : 'le publier'} sur la vitrine BuyMonth et commencer à recevoir des leads.`
      bouton = 'Activer mon abonnement'
      action = souscrire
      tonBouton = 'vert'
    } else {
      eyebrow = 'AUCUN BIEN EN LIGNE'
      titre = 'Ajoutez un bien pour commencer'
      sousTitre = "L'abonnement se calcule sur vos biens en ligne. Tant que vous n'en avez aucun, il n'y a rien à payer et rien à activer."
      bouton = 'Ajouter un bien'
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

          <button onClick={action} disabled={loading === 'portal'}
            style={{
              padding: '15px 26px', borderRadius: 12, background: fondBouton, color: texteBouton,
              border: 'none', fontSize: 14.5, fontWeight: 700, cursor: loading === 'portal' ? 'wait' : 'pointer',
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
                {estActif ? 'PRÉLEVÉ CHAQUE MOIS' : 'COÛT MENSUEL'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{euro(f.montantMensuel)}</span>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)' }}>HTVA</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>
                {nbFactures} bien{nbFactures > 1 ? 's' : ''} × {euro(f.unitaire)}
              </div>
            </div>

            {premierPrelevement && !enRetard && (
              <div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em' }}>
                  {estActif ? 'PROCHAIN PRÉLÈVEMENT' : "À L'ACTIVATION, AUJOURD'HUI"}
                </div>
                {estActif ? (
                  <>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{formatDate(details?.currentPeriodEnd || premierPrelevement)}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>puis le 1er de chaque mois</div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                      <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{euro(prorata)}</span>
                      <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)' }}>HTVA</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 3, maxWidth: 300, lineHeight: 1.5 }}>
                      {joursRestants} jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''} du mois, puis {euro(f.montantMensuel)} le {formatDate(premierPrelevement)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {f.surMesure && (
          <div style={{ position: 'relative', marginTop: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, color: 'rgba(255,255,255,0.8)' }}>
            Au-delà de 125 biens en ligne, une offre sur mesure s&rsquo;applique — contactez-nous.
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
        <h3 style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: '0 0 4px' }}>D&rsquo;où vient ce montant</h3>
        <p style={{ fontSize: 12.5, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.6 }}>
          Seuls les biens <strong style={{ color: '#5A6275' }}>disponibles</strong> et <strong style={{ color: '#5A6275' }}>sous option</strong> sont facturés.
        </p>

        {lignes.length === 0 ? (
          <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>Vous n&rsquo;avez pas encore de bien.</p>
        ) : (
          <div>
            {lignes.map((l) => (
              <div key={l.cle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #F2F5FA' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: '#3D4759' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.couleur, flexShrink: 0 }} />
                  {l.nb} bien{l.nb > 1 ? 's' : ''} {l.nb > 1 ? l.plusieurs : l.un}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: l.facture ? NAVY : '#A9B0BE' }}>
                  {l.facture ? euro(l.nb * f.unitaire) : 'non facturé'}
                </span>
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Total mensuel</span>
              <span style={{ fontSize: 19, fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' }}>
                {euro(f.montantMensuel)} <span style={{ fontSize: 12.5, fontWeight: 600, color: '#8A92A6' }}>HTVA</span>
              </span>
            </div>
          </div>
        )}

        {nbNonFactures > 0 && (
          <p style={{ fontSize: 12, color: '#A9B0BE', margin: '14px 0 0', lineHeight: 1.55 }}>
            {nbNonFactures} bien{nbNonFactures > 1 ? 's' : ''} hors ligne ou vendu{nbNonFactures > 1 ? 's' : ''} — ils restent dans votre espace mais ne vous coûtent rien.
          </p>
        )}

        <Link href="/dashboard/client/biens" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 13, fontWeight: 600, color: '#249E7C', textDecoration: 'none' }}>
          Gérer mes biens
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
      { label: 'Formule', value: f.formuleLabel },
      { label: 'Tarif par bien', value: `${euro(f.unitaire)} / mois` },
      subStatus === 'trialing' && details?.trialEnd && { label: "Fin de l'essai", value: formatDate(details.trialEnd) },
      !estActif && !enRetard && premierPrelevement && { label: 'Premier mois complet', value: formatDate(premierPrelevement) },
      estActif && !resiliation && { label: 'Prochain prélèvement', value: formatDate(details?.currentPeriodEnd || premierPrelevement) },
      resiliation && { label: "Fin d'accès", value: formatDate(details?.cancelAt || details?.currentPeriodEnd), couleur: '#E5484D' },
      { label: 'Client depuis', value: formatDate(new Date(createdAt).getTime()) },
    ].filter(Boolean)

    return (
      <div style={carte}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: '0 0 18px' }}>Votre contrat</h3>
        {lignes.map((l, i) => (
          <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < lignes.length - 1 ? '1px solid #F2F5FA' : 'none' }}>
            <span style={{ fontSize: 13, color: '#8A92A6' }}>{l.label}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: l.couleur || NAVY }}>{l.value}</span>
          </div>
        ))}

        <div style={{ marginTop: 16, padding: '12px 14px', background: '#FAFBFE', borderRadius: 10, border: '1px solid #F2F5FA' }}>
          <p style={{ fontSize: 12, color: '#8A92A6', margin: 0, lineHeight: 1.6 }}>
            L&rsquo;abonnement se paie le <strong style={{ color: '#5A6275' }}>1er de chaque mois</strong>, sur le nombre de biens en ligne à cette date.
            Les frais de mise en service (1 490 € HTVA, une seule fois) sont facturés séparément, hors plateforme.
          </p>
        </div>

        {estActif && (
          <button onClick={gerer} disabled={loading === 'portal'}
            style={{ width: '100%', marginTop: 16, padding: '12px', borderRadius: 10, background: '#F5F8FB', color: NAVY, border: '1px solid #E6EDF4', fontSize: 13.5, fontWeight: 600, cursor: loading === 'portal' ? 'wait' : 'pointer' }}>
            {loading === 'portal' ? 'Ouverture…' : 'Carte bancaire, factures et résiliation'}
          </button>
        )}
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
    if (estLaSienne && !estActif) { label = `Activer avec ${FORMULE_LABEL[cle]}`; action = souscrire }
    else if (!estLaSienne && !estActif) { label = `Choisir ${FORMULE_LABEL[cle]}`; action = () => changerFormule(cle) }
    else if (!estLaSienne && estUpgrade) { label = `Passer à ${FORMULE_LABEL[cle]}`; action = () => changerFormule(cle) }
    else if (!estLaSienne) { label = `Revenir à ${FORMULE_LABEL[cle]}`; action = () => changerFormule(cle) }

    const badge = estLaSienne ? (estActif ? 'VOTRE FORMULE' : 'SÉLECTIONNÉE') : (proPlus ? 'PREMIUM' : null)

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
          <span style={{ fontSize: 13, color: '#8A92A6' }}>/ bien / mois HTVA</span>
        </div>

        <div style={{ fontSize: 13, color: '#5A6275', marginBottom: 20, fontWeight: 600, minHeight: 20 }}>
          {nbFactures > 0
            ? `Avec ${nbFactures > 1 ? `vos ${nbFactures} biens` : 'votre bien'} en ligne : ${euro(cout)} / mois`
            : 'Aucun bien en ligne pour le moment'}
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
            {loading === cle ? 'Traitement…' : label}
          </button>
        ) : (
          <div style={{ width: '100%', padding: '13px', borderRadius: 11, background: 'rgba(124,184,168,0.12)', color: '#1B7A5E', fontSize: 13.5, fontWeight: 700, textAlign: 'center' }}>
            Formule en cours
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
          Changement programmé : vous passerez en {changementProgramme.formuleCibleLabel}
          {changementProgramme.dateEffet ? ` le ${formatDate(changementProgramme.dateEffet)}` : ' à la fin de votre période en cours'}.
          D&rsquo;ici là, vous conservez votre formule actuelle.
        </Bandeau>
      )}
      {resiliation && (
        <Bandeau ton="alerte">
          Votre abonnement est résilié et prendra fin le {formatDate(details.cancelAt || details.currentPeriodEnd)}. Vous gardez l&rsquo;accès jusqu&rsquo;à cette date.
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
          {estActif ? 'Changer de formule' : 'Choisissez votre formule'}
        </h3>
        <p style={{ fontSize: 13, color: '#8A92A6', margin: '0 0 18px', lineHeight: 1.6 }}>
          {estActif
            ? 'Le passage à la formule supérieure est immédiat et facturé au prorata. Le passage à la formule inférieure prend effet le 1er du mois suivant.'
            : 'Les deux formules se facturent au bien en ligne. Vous pourrez en changer à tout moment.'}
        </p>
        <div className="abo-formules" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <CarteFormule cle="PRO" />
          <CarteFormule cle="PRO_PLUS" />
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#A9B0BE', margin: '24px 0 0', lineHeight: 1.6, textAlign: 'center' }}>
        Paiement sécurisé via Stripe. Aucune donnée bancaire n&rsquo;est conservée par BuyMonth.
      </p>
    </div>
  )
}

import { Resend } from 'resend'
import { makeT, locale, normLang } from '@/lib/i18n/config'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Domaine buymonth.be vérifié dans Resend — envoi vers n'importe quelle adresse.
const FROM = 'BuyMonth <noreply@buymonth.be>'

const FOOTER_LEGAL = 'BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit'
const FOOTER_LEGAL_NL = 'BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar'
const footer = (lang) => (normLang(lang) === 'nl' ? FOOTER_LEGAL_NL : FOOTER_LEGAL)

// Les fonctions acceptent `lang` ('fr' par défaut, ou 'nl').
// L'e-mail de contact reste en français : il ne part que chez BuyMonth.

export async function envoyerEmailLead({ lead, bien, destinataires, lang = 'fr' }) {
  if (!resend) return { skipped: 'no_api_key' }
  if (!destinataires || destinataires.length === 0) return { skipped: 'no_recipients' }
  const t = makeT(lang)

  const ligne = (label, val) => val
    ? `<tr><td style="padding:10px 0;color:#8A92A6;font-size:13px;border-bottom:1px solid #F0F3F7">${label}</td><td style="padding:10px 0;color:#193B5E;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #F0F3F7">${val}</td></tr>`
    : ''

  const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#EEF1F6;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <tr><td style="background:#16324F;border-radius:16px 16px 0 0;padding:28px 32px">
          <span style="font-size:20px;font-weight:700;color:#fff">Buy<span style="color:#7CB8A8">Month</span></span>
        </td></tr>

        <tr><td style="background:#1D4267;padding:36px 32px">
          <div style="display:inline-block;background:rgba(124,184,168,0.18);color:#7CB8A8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">${t('NOUVEAU LEAD', 'NIEUWE LEAD')}</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.2">${t("Une demande vient d'arriver", 'Er is een nieuwe aanvraag binnengekomen')}</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0">${t("Un visiteur a complété le simulateur sur l'un de vos biens. Voici ses coordonnées.", 'Een bezoeker heeft de simulator ingevuld voor een van uw panden. Hier zijn de gegevens.')}</p>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${ligne(t('Nom', 'Naam'), lead.nom)}
            ${ligne(t('Entreprise', 'Bedrijf'), lead.societe)}
            ${ligne(t('Email', 'E-mail'), lead.email)}
            ${ligne(t('Téléphone', 'Telefoon'), lead.telephone)}
            ${ligne(t('Bien concerné', 'Betrokken pand'), bien?.titre)}
            ${ligne(t('Projet', 'Project'), bien?.projet && bien.projet !== 'Hors projet' ? bien.projet : null)}
            ${ligne(t('Unité', 'Unit'), bien?.unite)}
            ${ligne(t('Localisation', 'Locatie'), bien?.ville)}
            ${ligne(t('Source', 'Bron'), lead.source)}
            ${ligne(t('Transmission au promoteur', 'Doorgifte aan de projectontwikkelaar'), lead.consentPromoteur ? t('Autorisée', 'Toegestaan') : t('NON autorisée', 'NIET toegestaan'))}
            ${ligne(t('Transmission à BuyMonth Finance', 'Doorgifte aan BuyMonth Finance'), lead.consentFinance ? t('Autorisée', 'Toegestaan') : t('NON autorisée', 'NIET toegestaan'))}
          </table>
          <p style="font-size:12px;color:#A9B0BE;margin:24px 0 0;line-height:1.5">${t('Recontactez ce prospect rapidement pour maximiser vos chances de conversion.', 'Neem snel contact op met deze prospect om uw kans op een verkoop te vergroten.')}</p>
        </td></tr>

        <tr><td style="padding:20px 32px;text-align:center">
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — ${footer(lang)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: destinataires,
      subject: `${t('Nouveau lead', 'Nieuwe lead')} — ${lead.nom || lead.email || t('demande de simulation', 'simulatieaanvraag')}`,
      html,
    })
    if (res.error) {
      console.error('[EMAIL] Resend error:', res.error)
      return { ok: false, error: res.error }
    }
    return { ok: true, id: res.data?.id }
  } catch (e) {
    console.error('[EMAIL] Exception:', e?.message)
    return { error: e?.message || 'send_failed' }
  }
}

export async function envoyerEmailContact({ nom, email, sujet, message, destinataires }) {
  if (!resend) return { skipped: 'no_api_key' }
  if (!destinataires || destinataires.length === 0) return { skipped: 'no_recipients' }

  const ligne = (label, val) => val
    ? `<tr><td style="padding:10px 0;color:#8A92A6;font-size:13px;border-bottom:1px solid #F0F3F7;white-space:nowrap;padding-right:16px">${label}</td><td style="padding:10px 0;color:#193B5E;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #F0F3F7">${val}</td></tr>`
    : ''

  const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#EEF1F6;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <tr><td style="background:#16324F;border-radius:16px 16px 0 0;padding:28px 32px">
          <span style="font-size:20px;font-weight:700;color:#fff">Buy<span style="color:#7CB8A8">Month</span></span>
        </td></tr>

        <tr><td style="background:#1D4267;padding:36px 32px">
          <div style="display:inline-block;background:rgba(124,184,168,0.18);color:#7CB8A8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">MESSAGE DE CONTACT</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.2">Nouveau message reçu</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0">Un visiteur vous a écrit via le formulaire de contact du site.</p>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${ligne('Nom', nom)}
            ${ligne('Email', email)}
            ${ligne('Sujet', sujet)}
          </table>
          <div style="margin-top:20px;padding:18px 20px;background:#FAFBFE;border:1px solid #EEF2F7;border-radius:12px">
            <p style="font-size:11px;font-weight:700;color:#8A92A6;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px">Message</p>
            <p style="font-size:14px;color:#193B5E;line-height:1.7;margin:0;white-space:pre-wrap">${(message || '').replace(/</g, '&lt;')}</p>
          </div>
          <p style="font-size:12px;color:#A9B0BE;margin:24px 0 0;line-height:1.5">Vous pouvez répondre directement à ${email}.</p>
        </td></tr>

        <tr><td style="padding:20px 32px;text-align:center">
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — ${FOOTER_LEGAL}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: destinataires,
      reply_to: email,
      subject: `Contact — ${sujet || 'Nouveau message'}`,
      html,
    })
    if (res.error) {
      console.error('[EMAIL] Resend error:', res.error)
      return { ok: false, error: res.error }
    }
    return { ok: true, id: res.data?.id }
  } catch (e) {
    console.error('[EMAIL] Exception:', e?.message)
    return { error: e?.message || 'send_failed' }
  }
}

// Réinitialisation de mot de passe (promoteurs + admin — même flux)
export async function sendResetPassword(email, resetUrl, lang = 'fr') {
  if (!resend) return { skipped: 'no_api_key' }
  if (!email || !resetUrl) return { skipped: 'missing_params' }
  const t = makeT(lang)

  const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF1F6;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <tr><td style="background:#16324F;border-radius:16px 16px 0 0;padding:28px 32px">
          <span style="font-size:20px;font-weight:700;color:#fff">Buy<span style="color:#7CB8A8">Month</span></span>
        </td></tr>

        <tr><td style="background:#1D4267;padding:36px 32px">
          <div style="display:inline-block;background:rgba(124,184,168,0.18);color:#7CB8A8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">${t('MOT DE PASSE', 'WACHTWOORD')}</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.2">${t('Réinitialisez votre mot de passe', 'Stel uw wachtwoord opnieuw in')}</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0 0 28px">${t('Vous avez demandé la réinitialisation de votre mot de passe. Ce lien est valable', 'U hebt gevraagd om uw wachtwoord opnieuw in te stellen. Deze link is geldig gedurende')} <strong style="color:#fff">${t('1 heure', '1 uur')}</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#7CB8A8;color:#0F2A22;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">${t('Définir un nouveau mot de passe', 'Nieuw wachtwoord instellen')} →</a>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <p style="font-size:13px;color:#5A6B7D;margin:0 0 12px;line-height:1.7">${t('Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :', 'Werkt de knop niet? Kopieer dan deze link in uw browser:')}</p>
          <p style="font-size:12px;color:#3B62A8;margin:0 0 24px;word-break:break-all;line-height:1.5">${resetUrl}</p>
          <div style="background:#FAFBFE;border-radius:10px;padding:14px 18px;border-left:3px solid #7CB8A8">
            <p style="font-size:12px;color:#5A6B7D;margin:0;line-height:1.6">${t("Vous n'êtes pas à l'origine de cette demande ? Ignorez cet email — votre mot de passe actuel reste inchangé.", 'Hebt u deze aanvraag niet gedaan? Negeer dan deze e-mail — uw huidige wachtwoord blijft ongewijzigd.')}</p>
          </div>
        </td></tr>

        <tr><td style="padding:20px 32px;text-align:center">
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — ${footer(lang)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: email,
      subject: t('Réinitialisation de votre mot de passe — BuyMonth', 'Uw wachtwoord opnieuw instellen — BuyMonth'),
      html,
    })
    if (res.error) {
      console.error('[EMAIL] Resend error:', res.error)
      return { ok: false, error: res.error }
    }
    return { ok: true, id: res.data?.id }
  } catch (e) {
    console.error('[EMAIL] Exception:', e?.message)
    return { error: e?.message || 'send_failed' }
  }
}

// Lien de simulation envoyé par le promoteur à son client (bouton « Envoyer la simulation » sur la fiche bien).
// Volontairement minimal : pas de traçage, l'adresse n'est pas conservée. Le client coche lui-même
// la case de consentement sur la page de simulation ; rien n'est transmis à BuyMonth Finance avant.
export async function envoyerEmailSimulation({ email, bien, promoteur, url, lang = 'fr' }) {
  if (!resend) return { skipped: 'no_api_key' }
  if (!email || !url) return { skipped: 'missing_params' }
  const t = makeT(lang)

  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const titre = esc(bien?.titre)
  const lieu = esc([bien?.ville, bien?.province].filter(Boolean).join(', '))
  const adresse = esc([bien?.adresse, bien?.ville, bien?.province].filter(Boolean).join(', '))
  const surface = bien?.surface ? `${Number(bien.surface)} m²` : null
  const societe = esc(promoteur?.societe || t('votre promoteur', 'uw projectontwikkelaar'))
  // Aucun montant dans cet e-mail : l'avertissement légal et l'exemple représentatif
  // ne figurent que sur la page de simulation (dossier client du 05/10/2026, point 6).

  const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF1F6;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <tr><td style="background:#16324F;border-radius:16px 16px 0 0;padding:28px 32px">
          <span style="font-size:20px;font-weight:700;color:#fff">Buy<span style="color:#7CB8A8">Month</span></span>
        </td></tr>

        <tr><td style="background:#1D4267;padding:36px 32px">
          <div style="display:inline-block;background:rgba(124,184,168,0.18);color:#7CB8A8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">${t('VOTRE SIMULATION', 'UW SIMULATIE')}</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.2">${t(`${societe} vous invite à simuler votre mensualité`, `${societe} nodigt u uit om uw maandbedrag te berekenen`)}</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0 0 28px">${t(`Découvrez en quelques secondes ce que représenterait, chaque mois, l'acquisition du bien <strong style="color:#fff">${titre}</strong>${lieu ? ` à ${lieu}` : ''}.`, `Ontdek in enkele seconden wat de aankoop van het pand <strong style="color:#fff">${titre}</strong>${lieu ? ` in ${lieu}` : ''} u elke maand zou kosten.`)}</p>
          <a href="${url}" style="display:inline-block;background:#7CB8A8;color:#0F2A22;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">${t('Simuler ma mensualité', 'Bereken mijn maandbedrag')} →</a>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px">
            <tr><td style="padding:10px 0;color:#8A92A6;font-size:13px;border-bottom:1px solid #F0F3F7">${t('Bien', 'Pand')}</td><td style="padding:10px 0;color:#193B5E;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #F0F3F7">${titre}</td></tr>
            ${adresse ? `<tr><td style="padding:10px 0;color:#8A92A6;font-size:13px;border-bottom:1px solid #F0F3F7">${t('Adresse', 'Adres')}</td><td style="padding:10px 0;color:#193B5E;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #F0F3F7">${adresse}</td></tr>` : ''}
            ${surface ? `<tr><td style="padding:10px 0;color:#8A92A6;font-size:13px;border-bottom:1px solid #F0F3F7">${t('Surface', 'Oppervlakte')}</td><td style="padding:10px 0;color:#193B5E;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #F0F3F7">${surface}</td></tr>` : ''}
          </table>
          <p style="font-size:13px;color:#5A6B7D;margin:0 0 22px;line-height:1.7">${t('Après votre simulation, vous pourrez, si vous le souhaitez, demander une étude de financement à BuyMonth Finance, intermédiaire de crédit. Cette démarche est facultative.', 'Na uw simulatie kunt u, als u dat wenst, een financieringsstudie aanvragen bij BuyMonth Finance, kredietbemiddelaar. Dat is vrijblijvend.')}</p>
          <p style="font-size:13px;color:#5A6B7D;margin:0 0 12px;line-height:1.7">${t('Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :', 'Werkt de knop niet? Kopieer dan deze link in uw browser:')}</p>
          <p style="font-size:12px;color:#3B62A8;margin:0 0 24px;word-break:break-all;line-height:1.5">${url}</p>
          <div style="background:#FAFBFE;border-radius:10px;padding:14px 18px;border-left:3px solid #7CB8A8">
            <p style="font-size:12px;color:#5A6B7D;margin:0;line-height:1.6">${t(`Vous recevez cet e-mail parce que ${societe} vous a invité à simuler la mensualité de ce bien. Votre adresse n'est pas conservée par BuyMonth : elle a servi uniquement à cet envoi, et aucune donnée ne nous est transmise tant que vous n'avez pas complété la simulation et donné votre accord.`, `U ontvangt deze e-mail omdat ${societe} u heeft uitgenodigd om het maandbedrag van dit pand te berekenen. BuyMonth bewaart uw adres niet: het werd enkel voor deze verzending gebruikt, en er worden geen gegevens aan ons doorgegeven zolang u de simulatie niet hebt ingevuld en uw toestemming niet hebt gegeven.`)}</p>
          </div>
        </td></tr>

        <tr><td style="padding:20px 32px;text-align:center">
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — ${footer(lang)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    // Le dossier client du 05/10/2026 demande un envoi depuis info@buymonth.be,
    // au nom du promoteur : c'est lui que le destinataire a contacté.
    const nomExpediteur = String(promoteur?.societe || 'BuyMonth').replace(/["<>]/g, '').split(/\s+/).join(' ').trim() || 'BuyMonth'
    const res = await resend.emails.send({
      from: `${nomExpediteur} via BuyMonth <info@buymonth.be>`,
      to: email,
      subject: t(
        `${promoteur?.societe || 'Votre promoteur'} vous invite à simuler votre mensualité — ${bien?.titre || 'BuyMonth'}`,
        `${promoteur?.societe || 'Uw projectontwikkelaar'} nodigt u uit om uw maandbedrag te berekenen — ${bien?.titre || 'BuyMonth'}`,
      ),
      html,
    })
    if (res.error) {
      console.error('[EMAIL] Resend error:', res.error)
      return { ok: false, error: res.error }
    }
    return { ok: true, id: res.data?.id }
  } catch (e) {
    console.error('[EMAIL] Exception:', e?.message)
    return { error: e?.message || 'send_failed' }
  }
}
/*
 * Relance en cas de prelevement refuse.
 * Le promoteur doit l'apprendre par nous, pas en decouvrant que ses biens ont
 * disparu du site. On annonce donc la date a laquelle la diffusion s'arrete.
 */
export async function envoyerEmailImpaye({ email, societe, montant, devise, urlFacture, finGrace, lang = 'fr' }) {
  if (!resend) return { skipped: 'no_api_key' }
  if (!email) return { skipped: 'no_recipient' }
  const t = makeT(lang)

  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const somme = typeof montant === 'number'
    ? `${(montant / 100).toLocaleString(locale(lang), { minimumFractionDigits: 2 })} ${String(devise || 'eur').toUpperCase()}`
    : null
  const dateLimite = finGrace
    ? new Date(finGrace).toLocaleDateString(locale(lang), { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF1F6;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <tr><td style="background:#16324F;border-radius:16px 16px 0 0;padding:28px 32px">
          <span style="font-size:20px;font-weight:700;color:#fff">Buy<span style="color:#7CB8A8">Month</span></span>
        </td></tr>

        <tr><td style="background:#1D4267;padding:36px 32px">
          <div style="display:inline-block;background:rgba(232,153,35,0.2);color:#E8B563;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">${t('PAIEMENT REFUSÉ', 'BETALING GEWEIGERD')}</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.25">${t("Votre dernier prélèvement n'a pas abouti", 'Uw laatste domiciliëring is mislukt')}</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.65;margin:0">${t(`Bonjour ${esc(societe) || ''}, votre banque a refusé le prélèvement de votre abonnement BuyMonth${somme ? ` d'un montant de ${somme}` : ''}.`, `Beste ${esc(societe) || ''}, uw bank heeft de domiciliëring voor uw BuyMonth-abonnement${somme ? ` van ${somme}` : ''} geweigerd.`)}</p>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <p style="font-size:14px;color:#3D4759;line-height:1.7;margin:0 0 20px">
            ${t("Il s'agit le plus souvent d'un plafond atteint, d'une carte renouvelée ou d'une provision insuffisante. La régularisation prend deux minutes.", 'Meestal gaat het om een bereikte limiet, een vernieuwde kaart of onvoldoende saldo. Dit rechtzetten duurt twee minuten.')}
          </p>

          ${dateLimite ? `
          <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:14px 18px;margin-bottom:22px">
            <p style="font-size:13px;color:#C2620C;margin:0;line-height:1.6"><strong>${t(`Vos biens restent en ligne jusqu'au ${dateLimite}.`, `Uw panden blijven online tot ${dateLimite}.`)}</strong> ${t("Passé cette date, ils sont retirés de la vitrine BuyMonth et vos widgets cessent de s'afficher, jusqu'à régularisation.", 'Na die datum worden ze van de BuyMonth-etalage gehaald en worden uw widgets niet meer getoond, tot de betaling in orde is.')}</p>
          </div>` : ''}

          ${urlFacture ? `<a href="${urlFacture}" style="display:inline-block;background:#193B5E;color:#fff;padding:14px 26px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">${t('Régler ma facture', 'Mijn factuur betalen')}</a>` : ''}

          <p style="font-size:12.5px;color:#8A92A6;margin:22px 0 0;line-height:1.6">
            ${t("Vous pouvez aussi mettre à jour votre moyen de paiement depuis votre espace, rubrique Abonnement. Si vous pensez qu'il s'agit d'une erreur, répondez à cet e-mail.", 'U kunt uw betaalmethode ook bijwerken in uw account, onder Abonnement. Denkt u dat het om een vergissing gaat? Antwoord dan op deze e-mail.')}
          </p>
        </td></tr>

        <tr><td style="padding:20px 32px;text-align:center">
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — ${footer(lang)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: email,
      subject: t('Votre prélèvement BuyMonth a été refusé', 'Uw BuyMonth-domiciliëring werd geweigerd'),
      html,
    })
    if (res.error) {
      console.error('[EMAIL] Resend error:', res.error)
      return { ok: false, error: res.error }
    }
    return { ok: true, id: res.data?.id }
  } catch (e) {
    console.error('[EMAIL] Exception:', e?.message)
    return { error: e?.message || 'send_failed' }
  }
}

// E-mail d'un lead vers le commercial d'un promoteur partenaire (lot Matexi du
// 03/11/2026). Mise en page BuyMonth comme les autres notifications, avec un
// bloc de reprise en bas et une version texte en repli : le partenaire recopie
// ou importe ces lignes dans son CRM, et la mention « Source : BuyMonth »
// marque l'origine du lead.
export async function envoyerEmailLeadCommercial({ lead, bien, destinataire, lang = 'fr' }) {
  if (!resend) return { skipped: 'no_api_key' }
  if (!destinataire) return { skipped: 'no_recipient' }
  const t = makeT(lang)

  const projet = bien?.projet && bien.projet !== 'Hors projet' ? bien.projet : null
  const reference = [projet, bien?.unite ? `${t('unité', 'unit')} ${bien.unite}` : null]
    .filter(Boolean).join(' — ') || bien?.titre || lead.bienExterne || t('non précisée', 'niet opgegeven')

  const recu = new Date(lead.createdAt).toLocaleString(locale(lang), { dateStyle: 'long', timeStyle: 'short' })

  const ligne = (label, val) => val
    ? `<tr><td style="padding:10px 0;color:#8A92A6;font-size:13px;border-bottom:1px solid #F0F3F7">${label}</td><td style="padding:10px 0;color:#193B5E;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #F0F3F7">${val}</td></tr>`
    : ''

  const lien = (label, val, href) => val
    ? `<tr><td style="padding:10px 0;color:#8A92A6;font-size:13px;border-bottom:1px solid #F0F3F7">${label}</td><td style="padding:10px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #F0F3F7"><a href="${href}${val}" style="color:#193B5E;text-decoration:none">${val}</a></td></tr>`
    : ''

  const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#EEF1F6;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <tr><td style="background:#16324F;border-radius:16px 16px 0 0;padding:28px 32px">
          <span style="font-size:20px;font-weight:700;color:#fff">Buy<span style="color:#7CB8A8">Month</span></span>
        </td></tr>

        <tr><td style="background:#1D4267;padding:36px 32px">
          <div style="display:inline-block;background:rgba(124,184,168,0.18);color:#7CB8A8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">${t('NOUVEAU LEAD', 'NIEUWE LEAD')}</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.2">${reference}</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0">${t('Un acheteur vous est attribué sur ce bien. Ses coordonnées sont ci-dessous.', 'Er werd u een koper toegewezen voor dit pand. De gegevens vindt u hieronder.')}</p>
        </td></tr>

        <tr><td style="background:#fff;padding:32px">
          <p style="font-size:12px;font-weight:700;color:#8A92A6;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px">${t('Le contact', 'Het contact')}</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${ligne(t('Nom', 'Naam'), lead.nom)}
            ${lien('E-mail', lead.email, 'mailto:')}
            ${lien(t('Téléphone', 'Telefoon'), lead.telephone, 'tel:')}
          </table>

          <p style="font-size:12px;font-weight:700;color:#8A92A6;text-transform:uppercase;letter-spacing:0.05em;margin:28px 0 6px">${t('Le bien', 'Het pand')}</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${ligne(t('Référence', 'Referentie'), reference)}
            ${ligne(t('Projet', 'Project'), projet)}
            ${ligne(t('Unité', 'Unit'), bien?.unite)}
            ${ligne(t('Intitulé', 'Benaming'), bien?.titre)}
            ${ligne(t('Localisation', 'Locatie'), bien?.ville)}
            ${ligne(t('Demande reçue le', 'Aanvraag ontvangen op'), recu)}
            ${ligne(t('Source', 'Bron'), 'BuyMonth')}
          </table>

          <div style="margin-top:28px;padding:16px 18px;background:#F7F9FC;border:1px solid #EEF2F7;border-radius:12px">
            <p style="font-size:11px;font-weight:700;color:#8A92A6;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px">${t('À reprendre dans votre CRM', 'Over te nemen in uw CRM')}</p>
            <p style="font-family:'SFMono-Regular',Consolas,monospace;font-size:12.5px;color:#5A6B7D;line-height:1.7;margin:0">
              ${[lead.nom, lead.email, lead.telephone, reference, t('Source : BuyMonth', 'Bron: BuyMonth')].filter(Boolean).join('<br>')}
            </p>
          </div>

          <p style="font-size:12px;color:#A9B0BE;margin:22px 0 0;line-height:1.5">${t('Ce visiteur a autorisé la transmission de ses coordonnées', 'Deze bezoeker heeft toestemming gegeven om de gegevens door te geven')}${lead.consentAt ? ` ${t('le', 'op')} ${new Date(lead.consentAt).toLocaleString(locale(lang), { dateStyle: 'long', timeStyle: 'short' })}` : ''}. ${t('Vous pouvez répondre directement à cet e-mail pour le recontacter.', 'U kunt rechtstreeks op deze e-mail antwoorden om contact op te nemen.')}</p>
        </td></tr>

        <tr><td style="background:#fff;border-radius:0 0 16px 16px;height:8px"></td></tr>

        <tr><td style="padding:20px 32px;text-align:center">
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — ${footer(lang)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`

  // Repli texte, pour les clients de messagerie qui n'affichent pas le HTML
  const l = (label, val) => (val ? label + ' : ' + val + '\n' : '')
  const texte =
    t('Nouveau lead BuyMonth', 'Nieuwe BuyMonth-lead') + '\n\n' +
    l(t('Nom', 'Naam'), lead.nom) + l('E-mail', lead.email) + l(t('Telephone', 'Telefoon'), lead.telephone) +
    '\n' + l(t('Reference du bien', 'Referentie van het pand'), reference) + l(t('Bien', 'Pand'), bien?.titre) + l(t('Localisation', 'Locatie'), bien?.ville) +
    l(t('Demande recue le', 'Aanvraag ontvangen op'), recu) +
    '\n' + t('Source : BuyMonth', 'Bron: BuyMonth') + '\n' +
    '\n' + footer(lang) + '\n'

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: [destinataire],
      ...(lead.email ? { replyTo: lead.email } : {}),
      subject: `${t('Nouveau lead BuyMonth', 'Nieuwe BuyMonth-lead')} — ${reference}`,
      html,
      text: texte,
    })
    if (res.error) {
      console.error('[EMAIL] Resend error:', res.error)
      return { ok: false, error: res.error }
    }
    return { ok: true, id: res.data?.id }
  } catch (e) {
    console.error('[EMAIL] Exception:', e?.message)
    return { error: e?.message || 'send_failed' }
  }
}

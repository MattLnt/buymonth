import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Domaine de test Resend tant que buymonth.be n'est pas vérifié.
// IMPORTANT : avec onboarding@resend.dev, l'envoi ne marche QUE vers l'email du compte Resend.
const FROM = 'BuyMonth <onboarding@resend.dev>'

const FOOTER_LEGAL = 'BuyMonth Finance (JG Management SRL, FSMA 1021.366.349)'

export async function envoyerEmailLead({ lead, bien, destinataires }) {
  if (!resend) return { skipped: 'no_api_key' }
  if (!destinataires || destinataires.length === 0) return { skipped: 'no_recipients' }

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
          <div style="display:inline-block;background:rgba(124,184,168,0.18);color:#7CB8A8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">NOUVEAU LEAD</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.2">Une demande vient d'arriver</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0">Un visiteur a complété le simulateur sur l'un de vos biens. Voici ses coordonnées.</p>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${ligne('Nom', lead.nom)}
            ${ligne('Email', lead.email)}
            ${ligne('Téléphone', lead.telephone)}
            ${ligne('Bien concerné', bien?.titre)}
            ${ligne('Projet', bien?.projet && bien.projet !== 'Hors projet' ? bien.projet : null)}
            ${ligne('Unité', bien?.unite)}
            ${ligne('Localisation', bien?.ville)}
            ${ligne('Source', lead.source)}
          </table>
          <p style="font-size:12px;color:#A9B0BE;margin:24px 0 0;line-height:1.5">Recontactez ce prospect rapidement pour maximiser vos chances de conversion.</p>
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
      subject: `Nouveau lead — ${lead.nom || lead.email || 'demande de simulation'}`,
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
export async function sendResetPassword(email, resetUrl) {
  if (!resend) return { skipped: 'no_api_key' }
  if (!email || !resetUrl) return { skipped: 'missing_params' }

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
          <div style="display:inline-block;background:rgba(124,184,168,0.18);color:#7CB8A8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.05em">MOT DE PASSE</div>
          <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 10px;line-height:1.2">Réinitialisez votre mot de passe</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0 0 28px">Vous avez demandé la réinitialisation de votre mot de passe. Ce lien est valable <strong style="color:#fff">1 heure</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#7CB8A8;color:#0F2A22;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">Définir un nouveau mot de passe →</a>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <p style="font-size:13px;color:#5A6B7D;margin:0 0 12px;line-height:1.7">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
          <p style="font-size:12px;color:#3B62A8;margin:0 0 24px;word-break:break-all;line-height:1.5">${resetUrl}</p>
          <div style="background:#FAFBFE;border-radius:10px;padding:14px 18px;border-left:3px solid #7CB8A8">
            <p style="font-size:12px;color:#5A6B7D;margin:0;line-height:1.6">Vous n'êtes pas à l'origine de cette demande ? Ignorez cet email — votre mot de passe actuel reste inchangé.</p>
          </div>
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
      to: email,
      subject: 'Réinitialisation de votre mot de passe — BuyMonth',
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
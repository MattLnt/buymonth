import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Domaine de test Resend tant que popmyfig.com n'est pas vérifié.
// IMPORTANT : avec onboarding@resend.dev, l'envoi ne marche QUE vers l'email du compte Resend.
const FROM = 'BuyMonth <onboarding@resend.dev>'

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
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.6;margin:0">Un visiteur a complété le simulateur de capacité d'emprunt. Voici ses informations.</p>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${ligne('Nom', lead.nom)}
            ${ligne('Email', lead.email)}
            ${ligne('Téléphone', lead.telephone)}
            ${ligne('Revenus déclarés', lead.revenu ? `${lead.revenu.toLocaleString('fr-BE')} €` : null)}
            ${ligne('Apport déclaré', lead.apport ? `${lead.apport.toLocaleString('fr-BE')} €` : null)}
            ${ligne('Bien concerné', bien?.titre)}
            ${ligne('Localisation', bien?.ville)}
            ${ligne('Source', lead.source)}
          </table>
          <p style="font-size:12px;color:#A9B0BE;margin:24px 0 0;line-height:1.5">Recontactez ce prospect rapidement pour maximiser vos chances de conversion.</p>
        </td></tr>

        <tr><td style="padding:20px 32px;text-align:center">
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — JG Management (FSMA 1021.366.349)</p>
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
          <p style="color:#A9B0BE;font-size:12px;margin:0">© 2026 BuyMonth — JG Management (FSMA 1021.366.349)</p>
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
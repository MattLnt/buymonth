import { sendEmail } from './resend'

const BASE_URL = process.env.NEXTAUTH_URL || 'https://courtier-tawny.vercel.app'
const LOGO_IMG = `<img src="${BASE_URL}/brokeris-logo-email.png" alt="Fiderio" height="28" style="display:block;border:0;" />`

export async function sendWelcomeVendeur(email) {
  await sendEmail({
    to: email,
    subject: 'Bienvenue sur Fiderio',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#141414;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>${LOGO_IMG}</td>
                <td align="right"><span style="background:rgba(255,90,31,0.15);color:#FF5A1F;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">COMPTE VENDEUR</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#1F1F22;padding:48px 40px 40px;">
            <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em;line-height:1.2;">Votre compte est<br><span style="color:#FF5A1F;">prêt à l'emploi</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0 0 32px;">Bienvenue sur la plateforme privée off-market dédiée à la cession de cabinets comptables en Belgique. Votre espace vendeur est maintenant actif.</p>
            <a href="${BASE_URL}/dashboard/vendeur/nouvelle-opportunite" style="display:inline-block;background:#FF5A1F;color:#141414;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Déposer mon opportunité →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 28px;">COMMENT ÇA MARCHE</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:0 0 20px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:16px;">
                    <div style="width:32px;height:32px;background:#141414;border-radius:8px;text-align:center;line-height:32px;color:#FF5A1F;font-size:12px;font-weight:700;">01</div>
                  </td>
                  <td>
                    <p style="font-size:14px;font-weight:700;color:#141414;margin:0 0 4px;">Déposez votre opportunité</p>
                    <p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Renseignez les informations de votre portefeuille. Vos coordonnées restent strictement confidentielles.</p>
                  </td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:0 0 20px;border-top:1px solid #F9FAFB;">
                <table cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
                  <td style="vertical-align:top;padding-right:16px;">
                    <div style="width:32px;height:32px;background:#141414;border-radius:8px;text-align:center;line-height:32px;color:#FF5A1F;font-size:12px;font-weight:700;">02</div>
                  </td>
                  <td>
                    <p style="font-size:14px;font-weight:700;color:#141414;margin:0 0 4px;">Les acheteurs consultent</p>
                    <p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Les acheteurs abonnés voient votre opportunité anonymisée et peuvent décider de la débloquer.</p>
                  </td>
                </tr></table>
              </td></tr>
              <tr><td style="border-top:1px solid #F9FAFB;">
                <table cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
                  <td style="vertical-align:top;padding-right:16px;">
                    <div style="width:32px;height:32px;background:#141414;border-radius:8px;text-align:center;line-height:32px;color:#FF5A1F;font-size:12px;font-weight:700;">03</div>
                  </td>
                  <td>
                    <p style="font-size:14px;font-weight:700;color:#141414;margin:0 0 4px;">Mise en relation</p>
                    <p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Quand un acheteur débloque votre dossier (699€), vous êtes mis en contact directement.</p>
                  </td>
                </tr></table>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#F9FAFB;padding:28px 40px;border-top:1px solid #F3F4F6;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>
                <p style="font-size:14px;font-weight:600;color:#141414;margin:0 0 4px;">Prêt à commencer ?</p>
                <p style="font-size:13px;color:#6B7280;margin:0;">Déposez votre première opportunité en quelques minutes.</p>
              </td>
              <td align="right">
                <a href="${BASE_URL}/dashboard/vendeur" style="display:inline-block;background:#141414;color:#ffffff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Mon espace →</a>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#141414;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Fiderio — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF5A1F;font-size:12px;text-decoration:none;">courtier-tawny.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  })
}

export async function sendWelcomeAcheteur(email) {
  await sendEmail({
    to: email,
    subject: 'Bienvenue sur Fiderio',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#141414;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>${LOGO_IMG}</td>
              <td align="right"><span style="background:rgba(255,90,31,0.15);color:#FF5A1F;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">COMPTE ACHETEUR</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#1F1F22;padding:48px 40px 40px;">
            <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em;line-height:1.2;">Accédez au marché<br><span style="color:#FF5A1F;">off-market belge</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0 0 32px;">Votre compte acheteur est créé. Abonnez-vous pour accéder à toutes les opportunités de cession de cabinets comptables disponibles sur la plateforme.</p>
            <a href="${BASE_URL}/dashboard/acheteur/forfait" style="display:inline-block;background:#FF5A1F;color:#141414;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">S'abonner — 59€/mois →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 28px;">CE QUE VOUS OBTENEZ</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:0 0 18px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:14px;font-size:20px;width:36px;">🔍</td>
                  <td><p style="font-size:14px;font-weight:700;color:#141414;margin:0 0 3px;">Toutes les opportunités</p><p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Accès illimité aux portefeuilles disponibles avec détails complets.</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:18px 0;border-top:1px solid #F9FAFB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:14px;font-size:20px;width:36px;">🎯</td>
                  <td><p style="font-size:14px;font-weight:700;color:#141414;margin:0 0 3px;">Filtres avancés</p><p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Filtrez par province, chiffre d'affaires annuel, type de transaction.</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:18px 0;border-top:1px solid #F9FAFB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:14px;font-size:20px;width:36px;">🔔</td>
                  <td><p style="font-size:14px;font-weight:700;color:#141414;margin:0 0 3px;">Alertes en temps réel</p><p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Recevez un email dès qu'une nouvelle opportunité est publiée.</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:18px 0 0;border-top:1px solid #F9FAFB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:14px;font-size:20px;width:36px;">🔓</td>
                  <td><p style="font-size:14px;font-weight:700;color:#141414;margin:0 0 3px;">Déblocage à l'unité</p><p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Accédez aux coordonnées du vendeur pour 699€ par dossier.</p></td>
                </tr></table>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#141414;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>
                <p style="font-size:13px;color:#9CA3AF;margin:0 0 4px;">Abonnement mensuel</p>
                <p style="font-size:32px;font-weight:700;color:#ffffff;margin:0;letter-spacing:-0.02em;">59 €<span style="font-size:16px;color:#6B7280;font-weight:400;"> / mois</span></p>
                <p style="font-size:12px;color:#6B7280;margin:8px 0 0;">Sans engagement — Résiliable à tout moment</p>
              </td>
              <td align="right" style="vertical-align:middle;">
                <a href="${BASE_URL}/dashboard/acheteur/forfait" style="display:inline-block;background:#FF5A1F;color:#141414;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">S'abonner →</a>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#0E0E10;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Fiderio — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF5A1F;font-size:12px;text-decoration:none;">courtier-tawny.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  })
}

export async function sendAlerteNouvelleOpportunite(email, opportunite) {
  const typeDealLabel = [].concat(opportunite.typeDeal).map(t => String(t).replace(/_/g, ' ')).join(' · ')
  await sendEmail({
    to: email,
    subject: 'Nouvelle opportunité disponible — Fiderio',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#141414;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>${LOGO_IMG}</td>
              <td align="right"><span style="background:rgba(255,90,31,0.15);color:#FF5A1F;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">NOUVELLE OPPORTUNITÉ</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#1F1F22;padding:48px 40px 40px;">
            <div style="display:inline-block;background:rgba(255,90,31,0.15);color:#FF5A1F;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:20px;letter-spacing:0.05em;">${typeDealLabel}</div>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 12px;letter-spacing:-0.02em;line-height:1.2;">Une nouvelle opportunité<br>vient d'être publiée</h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0;">Consultez les détails et déverrouillez les coordonnées si elle vous intéresse.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px;">APERÇU DU DOSSIER</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;">
              <tr style="background:#F9FAFB;">
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;border-bottom:1px solid #F3F4F6;">Province</td>
                <td style="padding:14px 20px;color:#141414;font-weight:700;font-size:13px;text-align:right;border-bottom:1px solid #F3F4F6;">${opportunite.province}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;border-bottom:1px solid #F3F4F6;">Chiffre d'affaires annuel</td>
                <td style="padding:14px 20px;color:#FF5A1F;font-weight:700;font-size:16px;text-align:right;border-bottom:1px solid #F3F4F6;">${(opportunite.chiffreAffaires / 1000).toFixed(0)}k €</td>
              </tr>
              <tr style="background:#F9FAFB;">
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;">Type de transaction</td>
                <td style="padding:14px 20px;color:#141414;font-weight:700;font-size:13px;text-align:right;">${typeDealLabel}</td>
              </tr>
            </table>

            <div style="background:#F9FAFB;border-radius:10px;padding:16px 20px;margin:24px 0;border-left:3px solid #FF5A1F;">
              <p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">🔒 Les détails complets (nombre de clients, collaborateurs, activités) sont accessibles avec votre abonnement.</p>
            </div>

            <a href="${BASE_URL}/dashboard/acheteur/opportunites" style="display:inline-block;background:#141414;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Voir le dossier complet →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#F9FAFB;padding:24px 40px;border-top:1px solid #F3F4F6;">
            <p style="color:#9CA3AF;font-size:12px;margin:0;line-height:1.6;">
              Vous recevez cet email car vous êtes abonné aux alertes Fiderio.
              <a href="${BASE_URL}/dashboard/acheteur/forfait" style="color:#FF5A1F;text-decoration:none;">Gérer mes alertes</a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#141414;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Fiderio — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF5A1F;font-size:12px;text-decoration:none;">courtier-tawny.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  })
}

export async function sendDeblocageConfirme(email, opportunite, pack) {
  const packLabels = {
    1: "Pack 1 — Mise en relation (1,5%)",
    2: "Pack 2 — Intégration Métier (3,5%)",
    3: "Pack 3 — Communication & Transition (3,5%)",
    4: "Pack 4 — Full Premium (5%)",
  }
  await sendEmail({
    to: email,
    subject: 'Dossier débloqué — Fiderio',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#141414;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>${LOGO_IMG}</td>
              <td align="right"><span style="background:rgba(16,185,129,0.15);color:#10B981;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">DOSSIER DÉBLOQUÉ</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#1F1F22;padding:48px 40px 40px;">
            <div style="width:56px;height:56px;background:rgba(16,185,129,0.15);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:20px;">✓</div>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 12px;letter-spacing:-0.02em;line-height:1.2;">Dossier débloqué<br><span style="color:#10B981;">avec succès !</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0;">Les coordonnées complètes du vendeur sont maintenant accessibles dans votre espace.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px;">RÉCAPITULATIF</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#F9FAFB;">
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;border-bottom:1px solid #F3F4F6;">Province</td>
                <td style="padding:14px 20px;color:#141414;font-weight:700;font-size:13px;text-align:right;border-bottom:1px solid #F3F4F6;">${opportunite.province}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;border-bottom:1px solid #F3F4F6;">Chiffre d'affaires annuel</td>
                <td style="padding:14px 20px;color:#FF5A1F;font-weight:700;font-size:16px;text-align:right;border-bottom:1px solid #F3F4F6;">${(opportunite.chiffreAffaires / 1000).toFixed(0)}k €</td>
              </tr>
              <tr style="background:#F9FAFB;">
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;border-bottom:1px solid #F3F4F6;">Pack choisi</td>
                <td style="padding:14px 20px;color:#141414;font-weight:700;font-size:13px;text-align:right;border-bottom:1px solid #F3F4F6;">${packLabels[pack] || 'Pack sélectionné'}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;">Montant payé</td>
                <td style="padding:14px 20px;color:#141414;font-weight:700;font-size:13px;text-align:right;">699 €</td>
              </tr>
            </table>

            <div style="background:#F0FDF4;border-radius:12px;padding:20px;border:1px solid #BBF7D0;margin-bottom:28px;">
              <p style="color:#15803D;font-weight:700;font-size:14px;margin:0 0 6px;">📋 Prochaines étapes</p>
              <p style="color:#16A34A;font-size:13px;margin:0;line-height:1.6;">Rendez-vous dans votre espace pour consulter les coordonnées du vendeur et initier la prise de contact.</p>
            </div>

            <a href="${BASE_URL}/dashboard/acheteur/dossiers" style="display:inline-block;background:#141414;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Voir mes dossiers débloqués →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#141414;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Fiderio — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF5A1F;font-size:12px;text-decoration:none;">courtier-tawny.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  })
}

export async function envoyerAlertesNouvelleOpportunite(opportunite) {
  const { prisma } = await import('./prisma')

  const abonnes = await prisma.acheteur.findMany({
    where: {
      subStatus: 'active',
      alertesEmail: true,
      OR: [
        { alerteProvinces: { isEmpty: true } },
        { alerteProvinces: { has: opportunite.province } },
      ],
    },
    select: { user: { select: { email: true } } },
  })

  const results = await Promise.allSettled(
    abonnes.map((a) => sendAlerteNouvelleOpportunite(a.user.email, opportunite))
  )
  console.log(`Alertes nouvelle opportunité : ${results.length} envoi(s)`)
}

export async function sendDossierDebloqueVendeur(email, opportunite, pack) {
  const packLabels = {
    1: "Pack 1 — Mise en relation (1,5%)",
    2: "Pack 2 — Intégration Métier (3,5%)",
    3: "Pack 3 — Communication & Transition (3,5%)",
    4: "Pack 4 — Full Premium (5%)",
  }
  await sendEmail({
    to: email,
    subject: 'Un acheteur a débloqué votre dossier — Fiderio',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#141414;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>${LOGO_IMG}</td>
              <td align="right"><span style="background:rgba(16,185,129,0.15);color:#10B981;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">ACHETEUR INTÉRESSÉ</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#1F1F22;padding:48px 40px 40px;">
            <div style="width:56px;height:56px;background:rgba(16,185,129,0.15);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:20px;">🎉</div>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 12px;letter-spacing:-0.02em;line-height:1.2;">Un acheteur a débloqué<br><span style="color:#10B981;">votre dossier !</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0;">Un acheteur abonné vient de payer pour accéder aux coordonnées de votre portefeuille. Il dispose maintenant de vos informations de contact et peut vous joindre directement.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px;">DOSSIER CONCERNÉ</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#F9FAFB;">
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;border-bottom:1px solid #F3F4F6;">Province</td>
                <td style="padding:14px 20px;color:#141414;font-weight:700;font-size:13px;text-align:right;border-bottom:1px solid #F3F4F6;">${opportunite.province}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;border-bottom:1px solid #F3F4F6;">Chiffre d'affaires annuel</td>
                <td style="padding:14px 20px;color:#FF5A1F;font-weight:700;font-size:16px;text-align:right;border-bottom:1px solid #F3F4F6;">${(opportunite.chiffreAffaires / 1000).toFixed(0)}k €</td>
              </tr>
              <tr style="background:#F9FAFB;">
                <td style="padding:14px 20px;color:#6B7280;font-size:13px;">Pack d'accompagnement choisi</td>
                <td style="padding:14px 20px;color:#141414;font-weight:700;font-size:13px;text-align:right;">${packLabels[pack] || 'Pack sélectionné'}</td>
              </tr>
            </table>

            <div style="background:#F9FAFB;border-radius:10px;padding:16px 20px;margin-bottom:28px;border-left:3px solid #FF5A1F;">
              <p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">💬 Une conversation sécurisée a été ouverte avec cet acheteur dans votre messagerie. Vous pouvez échanger dès maintenant — ou attendre qu'il vous contacte directement.</p>
            </div>

            <a href="${BASE_URL}/dashboard/vendeur/messages" style="display:inline-block;background:#141414;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Ouvrir ma messagerie →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#141414;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Fiderio — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF5A1F;font-size:12px;text-decoration:none;">courtier-tawny.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  })
}

export async function sendResetPassword(email, resetUrl) {
  await sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe — Fiderio',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#141414;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>${LOGO_IMG}</td>
              <td align="right"><span style="background:rgba(255,90,31,0.15);color:#FF5A1F;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">MOT DE PASSE</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#1F1F22;padding:48px 40px 40px;">
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 12px;letter-spacing:-0.02em;line-height:1.2;">Réinitialisez votre<br><span style="color:#FF5A1F;">mot de passe</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0 0 32px;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en définir un nouveau. Ce lien est valable <strong style="color:#fff;">1 heure</strong>.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#FF5A1F;color:#141414;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Définir un nouveau mot de passe →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:32px 40px;">
            <p style="font-size:13px;color:#6B7280;margin:0 0 12px;line-height:1.7;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
            <p style="font-size:12px;color:#D8480F;margin:0 0 24px;word-break:break-all;line-height:1.5;">${resetUrl}</p>
            <div style="background:#F9FAFB;border-radius:10px;padding:14px 18px;border-left:3px solid #FF5A1F;">
              <p style="font-size:12px;color:#6B7280;margin:0;line-height:1.6;">🔒 Vous n'êtes pas à l'origine de cette demande ? Ignorez simplement cet email — votre mot de passe actuel reste inchangé.</p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="background:#141414;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Fiderio — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF5A1F;font-size:12px;text-decoration:none;">Fiderio</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  })
}
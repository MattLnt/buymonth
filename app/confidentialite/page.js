import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

const sections = [
  {
    titre: "1. Responsable du traitement",
    contenu: `La présente politique de confidentialité décrit la manière dont Fiderio (ci-après « nous ») collecte, utilise et protège les données personnelles des utilisateurs de la plateforme accessible à l'adresse fiderio.be.

Le responsable du traitement est :
- [Dénomination sociale], [forme juridique]
- Numéro d'entreprise (BCE) : [à compléter]
- Siège social : [à compléter]
- Email : contact@fiderio.be

Nous traitons vos données conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel.`
  },
  {
    titre: "2. Données collectées",
    contenu: `**Données de compte** : adresse email et mot de passe (stocké sous forme chiffrée) lors de la création de votre compte.

**Données vendeur** : nom du bureau comptable, nom du dirigeant, téléphone, adresse. Ces données ne sont jamais affichées publiquement et ne sont communiquées qu'aux acheteurs ayant procédé au déblocage payant du dossier concerné.

**Données acheteur** : informations de profil professionnel et préférences d'alertes.

**Données de dossiers** : les informations relatives aux portefeuilles déposés (province, chiffre d'affaires annuel, activités, type de transaction, effectifs) sont publiées sous forme anonymisée.

**Données d'utilisation** : statistiques de consultation des dossiers, messages échangés via la messagerie interne, journaux techniques de connexion.

**Données de paiement** : vos données bancaires sont traitées exclusivement par notre prestataire de paiement Stripe et ne transitent jamais par nos serveurs. Nous conservons uniquement les identifiants de transaction et l'historique de facturation.`
  },
  {
    titre: "3. Finalités et bases légales du traitement",
    contenu: `Nous traitons vos données pour les finalités suivantes :

**Exécution du contrat** : création et gestion de votre compte, mise en relation entre vendeurs et acheteurs, traitement des abonnements et des déblocages, accès à la messagerie sécurisée.

**Consentement** : envoi d'alertes email lors de la publication de nouvelles opportunités (désactivables à tout moment depuis votre tableau de bord).

**Intérêt légitime** : amélioration de la plateforme, prévention de la fraude, sécurité des comptes.

**Obligation légale** : conservation des documents comptables et de facturation conformément à la législation belge.`
  },
  {
    titre: "4. Destinataires et sous-traitants",
    contenu: `Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales.

Elles sont traitées par les sous-traitants techniques suivants, dans le cadre strict de leurs missions :
- Stripe (traitement des paiements)
- Resend (envoi des emails transactionnels et alertes)
- Cloudinary (hébergement des fichiers et images)
- Vercel (hébergement de la plateforme)
- Railway (hébergement de la base de données)

Certains de ces prestataires sont établis en dehors de l'Union européenne. Dans ce cas, les transferts sont encadrés par des garanties appropriées au sens du RGPD (clauses contractuelles types de la Commission européenne).

Les coordonnées d'un vendeur ne sont communiquées à un acheteur qu'après déblocage payant du dossier concerné.`
  },
  {
    titre: "5. Durée de conservation",
    contenu: `Vos données sont conservées pendant toute la durée de vie de votre compte.

En cas de suppression de votre compte, vos données personnelles sont effacées dans un délai raisonnable, à l'exception des données dont la conservation est requise par la loi (documents de facturation : 7 ans conformément à la législation comptable belge) et de celles nécessaires à la constatation, l'exercice ou la défense de droits en justice.`
  },
  {
    titre: "6. Vos droits",
    contenu: `Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
- Droit d'accès : obtenir une copie des données que nous détenons sur vous
- Droit de rectification : corriger des données inexactes ou incomplètes
- Droit à l'effacement : demander la suppression de vos données
- Droit à la portabilité : recevoir vos données dans un format structuré
- Droit d'opposition et de limitation du traitement
- Droit de retirer votre consentement à tout moment (notamment pour les alertes email)

Pour exercer ces droits, contactez-nous à contact@fiderio.be. Nous répondons dans un délai d'un mois.

Vous disposez également du droit d'introduire une réclamation auprès de l'Autorité de protection des données belge (APD) : www.autoriteprotectiondonnees.be.`
  },
  {
    titre: "7. Cookies",
    contenu: `La plateforme utilise uniquement des cookies strictement nécessaires à son fonctionnement :
- Cookie de session d'authentification (maintien de votre connexion)
- Cookies techniques de sécurité

Nous n'utilisons aucun cookie publicitaire ni traceur à des fins de marketing. Ces cookies essentiels ne nécessitent pas de consentement préalable au sens de la réglementation.`
  },
  {
    titre: "8. Sécurité",
    contenu: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des communications (HTTPS), hachage des mots de passe, accès restreint aux données, hébergement auprès de prestataires certifiés.

L'anonymat des vendeurs constitue un principe central de la plateforme : aucune information identifiable n'est accessible aux autres utilisateurs avant un déblocage payant.`
  },
  {
    titre: "9. Modifications de la présente politique",
    contenu: `Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. En cas de modification substantielle, les utilisateurs seront informés par email ou via la plateforme. La date de dernière mise à jour figure en haut de cette page.`
  },
  {
    titre: "10. Contact",
    contenu: `Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à : contact@fiderio.be`
  },
];

export default function ConfidentialitePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>

      <style>{`
        @media (max-width: 768px) {
          .cgv-hero { padding: 72px 24px 48px !important; }
          .cgv-hero h1 { font-size: 28px !important; }
          .cgv-content { padding: 40px 20px !important; }
        }
      `}</style>

      <PublicNav />

      <div style={{ paddingTop: 64 }}>

        <div className="cgv-hero" style={{ background: "#141414", padding: "80px 48px 72px", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 14px" }}>LÉGAL</p>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em" }}>
            Politique de confidentialité
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Dernière mise à jour : juin 2026
          </p>
        </div>

        <div className="cgv-content" style={{ maxWidth: 800, margin: "0 auto", padding: "80px 48px" }}>

          {sections.map((section, i) => (
            <div key={i} style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#141414", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                {section.titre}
              </h2>
              <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.9 }}>
                {section.contenu.split('\n').map((line, j) => (
                  line.trim() === '' ? (
                    <br key={j} />
                  ) : line.startsWith('**') && line.endsWith('**') ? (
                    <p key={j} style={{ fontWeight: 700, color: "#374151", margin: "12px 0 4px" }}>
                      {line.replace(/\*\*/g, '')}
                    </p>
                  ) : line.startsWith('- ') ? (
                    <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "4px 0" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 4 }}><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{line.replace('- ', '')}</span>
                    </div>
                  ) : (
                    <p key={j} style={{ margin: "0 0 8px" }}>
                      {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
                        part.startsWith('**') ? <strong key={k} style={{ color: "#374151" }}>{part.replace(/\*\*/g, '')}</strong> : part
                      )}
                    </p>
                  )
                ))}
              </div>
              {i < sections.length - 1 && <div style={{ height: 1, background: "#F3F4F6", marginTop: 48 }} />}
            </div>
          ))}

          <div style={{ background: "#F9FAFB", borderRadius: 16, border: "1px solid #F3F4F6", padding: "32px", textAlign: "center", marginTop: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: "0 0 8px" }}>Une question sur vos données ?</p>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>Notre équipe vous répond sous 24h ouvrées.</p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141414", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Nous contacter →
            </Link>
          </div>
        </div>

        <PublicFooter />
      </div>
    </div>
  );
}
import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

const sections = [
  {
    titre: "1. Objet et champ d'application",
    contenu: `Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l'utilisation de la plateforme Fiderio (ci-après « la Plateforme »), accessible à l'adresse fiderio.be.

La Plateforme est éditée par Fiderio, société de droit belge. En accédant à la Plateforme et en utilisant ses services, l'utilisateur accepte sans réserve les présentes CGV.

La Plateforme est exclusivement destinée aux professionnels de la comptabilité en Belgique (experts-comptables, fiduciaires, et tout professionnel souhaitant céder ou acquérir un cabinet comptable).`
  },
  {
    titre: "2. Description des services",
    contenu: `La Plateforme propose trois types de services :

**Service Vendeur (gratuit)** : Permet aux comptables vendeurs de déposer des opportunités anonymisées sur la Plateforme. Ce service est entièrement gratuit et sans limite de dépôt.

**Abonnement Acheteur (59€/mois)** : Permet aux acheteurs d'accéder à l'ensemble des opportunités disponibles, d'utiliser les filtres avancés et de recevoir des alertes. L'abonnement est sans engagement et résiliable à tout moment.

**Déblocage de dossier (699€/dossier)** : Permet à un acheteur abonné d'accéder aux coordonnées complètes d'un vendeur et de choisir un pack d'accompagnement. Le déblocage est un paiement unique qui donne un accès permanent au dossier.`
  },
  {
    titre: "3. Inscription et compte utilisateur",
    contenu: `L'accès aux services de la Plateforme nécessite la création d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription.

L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toutes les actions effectuées depuis son compte. En cas de suspicion d'utilisation non autorisée, l'utilisateur doit immédiatement contacter Fiderio.

Fiderio se réserve le droit de suspendre ou de supprimer tout compte en cas de violation des présentes CGV.`
  },
  {
    titre: "4. Tarifs et conditions de paiement",
    contenu: `**Abonnement Acheteur** : 59€ TTC par mois, prélevé automatiquement via Stripe. L'abonnement est sans engagement minimum et peut être résilié à tout moment depuis le tableau de bord. La résiliation prend effet à la fin de la période de facturation en cours.

**Déblocage de dossier** : 699€ TTC par dossier, paiement unique. Une fois le paiement effectué, l'accès au dossier est permanent et non révocable.

**Pack d'accompagnement** : La commission d'accompagnement est calculée sur le chiffre d'affaires annuel de la fiduciaire au moment de la transaction :
- Pack 1 (Mise en relation) : 1,5%
- Pack 2 (Intégration Métier) : 3,5%
- Pack 3 (Communication & Transition) : 3,5%
- Pack 4 (Full Premium) : 5%

Tous les paiements sont traités via Stripe et sont soumis aux conditions de sécurité de ce prestataire.`
  },
  {
    titre: "5. Politique d'annulation et de remboursement",
    contenu: `**Abonnement Acheteur** : L'abonnement peut être résilié à tout moment. Aucun remboursement ne sera effectué pour la période en cours. La résiliation prend effet à la fin du mois en cours.

**Déblocage de dossier** : Les déblocages de dossiers sont non remboursables une fois les coordonnées du vendeur révélées à l'acheteur, conformément à l'article VI.53, 13° du Code de droit économique belge relatif aux exceptions au droit de rétractation pour les contenus numériques.

En cas de dysfonctionnement technique avéré de la Plateforme empêchant l'accès aux coordonnées, Fiderio s'engage à traiter toute demande de remboursement dans les meilleurs délais.`
  },
  {
    titre: "6. Anonymat et confidentialité des données",
    contenu: `Fiderio garantit l'anonymat total des vendeurs. Aucune information identifiable (nom, adresse, logo, email, téléphone) n'est visible par les acheteurs avant déblocage payant.

Les données personnelles des utilisateurs sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi belge du 30 juillet 2018. Fiderio s'engage à ne jamais vendre ni céder les données personnelles de ses utilisateurs à des tiers.

Les données de paiement sont traitées exclusivement par Stripe et ne sont jamais stockées sur les serveurs de Fiderio.`
  },
  {
    titre: "7. Obligations et responsabilités des utilisateurs",
    contenu: `L'utilisateur s'engage à :
- Utiliser la Plateforme exclusivement à des fins professionnelles légales
- Fournir des informations exactes et véridiques dans ses dossiers
- Ne pas tenter de contourner les systèmes de sécurité de la Plateforme
- Respecter la confidentialité des informations auxquelles il accède
- Ne pas reproduire, diffuser ou revendre les informations obtenues via la Plateforme

Fiderio ne peut être tenu responsable des transactions conclues entre vendeurs et acheteurs, ni de la véracité des informations fournies par les utilisateurs.`
  },
  {
    titre: "8. Propriété intellectuelle",
    contenu: `L'ensemble des éléments constituant la Plateforme (design, textes, logos, fonctionnalités, code source) est la propriété exclusive de Fiderio et est protégé par les lois belges et internationales relatives à la propriété intellectuelle.

Toute reproduction, représentation, modification ou exploitation de ces éléments sans autorisation expresse est strictement interdite.`
  },
  {
    titre: "9. Limitation de responsabilité",
    contenu: `Fiderio met tout en œuvre pour assurer la disponibilité et le bon fonctionnement de la Plateforme, mais ne peut garantir une disponibilité ininterrompue.

Fiderio ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme, des informations qui y sont publiées, ou des transactions conclues entre utilisateurs.

La responsabilité de Fiderio est limitée au montant des sommes effectivement perçues auprès de l'utilisateur concerné au cours des 12 derniers mois.`
  },
  {
    titre: "10. Modification des CGV",
    contenu: `Fiderio se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront informés de toute modification substantielle par email. La poursuite de l'utilisation de la Plateforme après notification vaut acceptation des nouvelles CGV.`
  },
  {
    titre: "11. Droit applicable et juridiction compétente",
    contenu: `Les présentes CGV sont soumises au droit belge. En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGV, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux de Bruxelles seront seuls compétents.

Pour toute question relative aux présentes CGV, vous pouvez nous contacter à : contact@fiderio.be`
  },
];

export default function CGVPage() {
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
            Conditions générales de vente
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
                    <p key={j} style={{ margin: "0 0 8px" }}>{line}</p>
                  )
                ))}
              </div>
              {i < sections.length - 1 && <div style={{ height: 1, background: "#F3F4F6", marginTop: 48 }} />}
            </div>
          ))}

          <div style={{ background: "#F9FAFB", borderRadius: 16, border: "1px solid #F3F4F6", padding: "32px", textAlign: "center", marginTop: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: "0 0 8px" }}>Une question sur nos CGV ?</p>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>Notre équipe est disponible pour répondre à vos questions juridiques.</p>
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
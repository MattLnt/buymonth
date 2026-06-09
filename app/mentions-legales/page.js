import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

const sections = [
  {
    titre: "1. Éditeur du site",
    contenu: `La plateforme Fiderio, accessible à l'adresse fiderio.be, est éditée par :

- Dénomination sociale : [à compléter]
- Forme juridique : [à compléter]
- Numéro d'entreprise (BCE) : [à compléter]
- Numéro de TVA : [à compléter]
- Siège social : [à compléter]
- Email : contact@fiderio.be

Responsable de la publication : [à compléter]`
  },
  {
    titre: "2. Hébergement",
    contenu: `La plateforme est hébergée par :

Vercel Inc.
440 N Barranca Avenue #4133
Covina, CA 91723, États-Unis
vercel.com

La base de données est hébergée par :

Railway Corp.
fiderio.be s'appuie sur les services de Railway (railway.com) pour l'hébergement de ses données.`
  },
  {
    titre: "3. Activité",
    contenu: `Fiderio est une plateforme privée de mise en relation entre professionnels du comptabilité, dédiée à la cession et à l'acquisition de cabinets comptables en Belgique.

La plateforme s'adresse exclusivement à un public professionnel.`
  },
  {
    titre: "4. Propriété intellectuelle",
    contenu: `L'ensemble des éléments composant la plateforme (structure, design, textes, logos, graphismes, fonctionnalités, code source, base de données) est protégé par le droit de la propriété intellectuelle.

Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.

Toute exploitation non autorisée de la plateforme ou de l'un de ses éléments sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions légales en vigueur.`
  },
  {
    titre: "5. Responsabilité",
    contenu: `Les informations publiées sur la plateforme par les utilisateurs (dossiers de cession, profils) relèvent de la responsabilité exclusive de leurs auteurs. Fiderio agit en qualité d'intermédiaire technique de mise en relation et n'est pas partie aux transactions conclues entre vendeurs et acheteurs.

Fiderio met tout en œuvre pour assurer l'exactitude des informations diffusées sur la plateforme et la disponibilité du service, sans toutefois pouvoir garantir une exactitude ou une disponibilité absolues.

Les liens hypertextes éventuellement présents sur la plateforme peuvent renvoyer vers des sites tiers dont Fiderio ne contrôle pas le contenu.`
  },
  {
    titre: "6. Données personnelles et cookies",
    contenu: `Le traitement des données personnelles des utilisateurs et l'utilisation des cookies sont détaillés dans notre Politique de confidentialité, accessible à l'adresse fiderio.be/confidentialite.

Conformément au RGPD, vous disposez de droits d'accès, de rectification, d'effacement, de portabilité, d'opposition et de limitation sur vos données. Pour les exercer : contact@fiderio.be.`
  },
  {
    titre: "7. Droit applicable",
    contenu: `Les présentes mentions légales sont régies par le droit belge. Tout litige relatif à l'utilisation de la plateforme relève de la compétence exclusive des tribunaux de Bruxelles, sous réserve des dispositions légales impératives applicables.

Pour toute question : contact@fiderio.be`
  },
];

export default function MentionsLegalesPage() {
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
            Mentions légales
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
            <p style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: "0 0 8px" }}>Une question ?</p>
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
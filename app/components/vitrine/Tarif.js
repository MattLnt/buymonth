export default function Tarif() {
  return (
    <section className="pad tint" id="tarif">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Modèle tarifaire</span>
          <h2>Deux formules, un tarif qui suit votre portefeuille.</h2>
          <p className="lead">
            Vous ne payez que vos biens actifs — soit à partir de{" "}
            <b style={{ color: "var(--navy)" }}>1,30 € par jour et par bien</b>. Et aucune commission
            sur vos ventes.
          </p>
        </div>
        <div className="equation reveal">
          <div className="eq-card setup">
            <span className="num">1</span>
            <div className="lbl">Mise en service — une seule fois</div>
            <div className="amt">
              1.490 € <small>HTVA</small>
            </div>
            <p>
              Paramétrage du compte, personnalisation, formation et accompagnement — identique pour
              les deux formules.
            </p>
          </div>
          <div className="eq-plus">+</div>
          <div className="eq-card abo">
            <span className="num">2</span>
            <div className="lbl">Abonnement mensuel</div>
            <div className="amt">
              39 € <small>ou</small> 45 € <small>/ bien actif / mois</small>
            </div>
            <p>
              Selon la formule choisie, Pro ou Pro+. Le décompte des biens actifs est revu chaque
              mois.
            </p>
          </div>
        </div>
        <div className="plans">
          <div className="plan reveal">
            <h3>BuyMonth Pro</h3>
            <p className="pdesc">
              L'essentiel pour une présence efficace : intégration, visibilité et suivi des leads.
            </p>
            <div className="price">
              <b>39 €</b> <span>HTVA / bien actif / mois</span>
            </div>
            <ul>
              <li>Plateforme de gestion du portefeuille</li>
              <li>Badges, widgets &amp; QR codes illimités</li>
              <li>Pages de simulation dédiées</li>
              <li>Tableau de bord &amp; statistiques</li>
              <li>Diffusion sur la vitrine publique</li>
              <li>Hébergement, maintenance &amp; support</li>
            </ul>
          </div>
          <div className="plan plus reveal">
            <h3>BuyMonth Pro+</h3>
            <p className="pdesc">
              Tout Pro, plus la personnalisation et la délégation complète de la gestion.
            </p>
            <div className="price">
              <b>45 €</b> <span>HTVA / bien actif / mois</span>
            </div>
            <ul>
              <li>Tous les services BuyMonth Pro</li>
              <li className="hl">Marque blanche : badges &amp; widgets à vos couleurs</li>
              <li className="hl">Encodage et mises à jour pris en charge par BuyMonth</li>
              <li className="hl">Mise en avant prioritaire sur la vitrine</li>
            </ul>
          </div>
        </div>
        <div className="pnote pnote-full reveal">
          <b>Vous ne payez que vos biens actifs</b>
          Le décompte est revu chaque mois : la facturation suit votre portefeuille, et un bien vendu
          sort automatiquement du décompte. Portefeuilles de plus de 125 biens : offre sur mesure.
        </div>
      </div>
    </section>
  );
}
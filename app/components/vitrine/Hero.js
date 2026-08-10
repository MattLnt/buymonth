import Link from "next/link";

export default function Hero() {
  return (
    <header className="hero">
      <span className="blob b1" />
      <span className="blob b2" />
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Plateforme marketing pour promoteurs</span>
          <h1>
            Vendez vos biens en <span className="hl">mensualités</span>, pas en prix globaux.
          </h1>
          <p>
            BuyMonth transforme chaque prix de vente en une estimation mensuelle claire, affichée
            sur vos supports — badges, widgets, QR codes — et convertit les visiteurs de vos annonces
            en acquéreurs dont le budget a déjà été étudié.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/register">
              Commencer →
            </Link>
            <Link className="btn btn-ghost" href="/pro/contact">
              Réserver une démo
            </Link>
          </div>
          <p className="aud">
            Pensé pour : <b>Promoteurs</b> · Constructeurs · Agences · Notaires · Courtiers
          </p>
        </div>

        <div className="reveal in">
          <div className="dash">
            <div className="dash-top">
              <span className="hello">Bonjour, Delvaux Promotions 👋</span>
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="dash-stats">
              <div className="st">
                <b>24</b>
                <small>Biens actifs</small>
              </div>
              <div className="st acc">
                <b>58</b>
                <small>Leads reçus</small>
              </div>
              <div className="st">
                <b>1 320</b>
                <small>Vues totales</small>
              </div>
              <div className="st acc">
                <b>1 674 €</b>
                <small>Mensualité moy.</small>
              </div>
            </div>
            <div className="dash-bien">
              <div className="db-photo">
                <span className="roof" />
                <span className="tag">Nouvelle résidence</span>
              </div>
              <div className="db-body">
                <div className="nm">
                  Résidence Les Tilleuls — App. B2.03 <small>· 2 ch · 94 m² · terrasse sud</small>
                </div>
                <div className="prix">
                  Prix de vente{" "}
                  <b>
                    250.000 € <span>HTVA**</span>
                  </b>{" "}
                  <small>** soit 302.500 € TVA 21 % incluse</small>
                </div>
                <div className="reframe" style={{ marginTop: 8 }}>
                  <div className="badge" style={{ flex: 1 }}>
                    <div className="cal">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} />
                      ))}
                    </div>
                    <div className="val">
                      <small className="apd">À partir de</small>
                      <b>
                        1.290 €<span>/mois*</span>
                      </b>
                    </div>
                  </div>
                </div>
                <p className="disclaimer">
                  * Attention, emprunter de l'argent coûte aussi de l'argent. Simulation indicative —
                  hypothèses validées et supervisées par BuyMonth Finance.
                </p>
                <div className="mini-cta">Simuler mon budget mensuel</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
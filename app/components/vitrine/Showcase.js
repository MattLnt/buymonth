export default function Showcase() {
  return (
    <section className="pad tint" id="vitrine">
      <div className="wrap vitrine-grid">
        <div className="reveal">
          <span className="eyebrow">En plus de vos supports</span>
          <h2>Une vitrine où les acheteurs pensent déjà en mensualités.</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            Vos biens sont aussi diffusés sur la vitrine BuyMonth — un canal d'acquisition
            supplémentaire, qui s'ajoute à votre site sans jamais le remplacer.
          </p>
          <div className="args">
            <div className="varg">
              <span className="vic">✓</span>
              <div>
                <b>Une audience qui vous cherche déjà.</b> Chaque visiteur de la vitrine raisonne en
                budget mensuel : il arrive éduqué à votre langage de vente. Et plus la vitrine
                s'étoffe, plus elle attire d'acheteurs — l'audience profite à chacun de vos biens.
              </div>
            </div>
            <div className="varg">
              <span className="vic">✓</span>
              <div>
                <b>Vous gardez la main.</b> Vous choisissez les biens que vous y exposez, et votre
                badge fonctionne sur votre propre site indépendamment de la vitrine.
              </div>
            </div>
            <div className="varg">
              <span className="vic">✓</span>
              <div>
                <b>En Pro+, vos biens passent devant.</b> Mise en avant prioritaire sur la vitrine, à
                vos couleurs.
              </div>
            </div>
          </div>
        </div>
        <div className="reveal">
          <div className="vitrine-card">
            <div className="vh">
              Vitrine BuyMonth <small>Tous les biens · en €/mois</small>
            </div>
            <div className="vrow hlrow">
              <span className="ph" />
              <div className="vt">
                <b>Résidence Les Tilleuls — App. B2.03</b>
                <small>
                  <b>Pro+</b> · 2 ch · 94 m² · Delvaux Promotions
                </small>
              </div>
              <span className="vm">
                <small>À partir de</small>
                <b>1.290 €/mois*</b>
              </span>
            </div>
            <div className="vrow">
              <span className="ph" />
              <div className="vt">
                <b>Clos du Verger — Maison 3 façades</b>
                <small>3 ch · 142 m² · jardin</small>
              </div>
              <span className="vm">
                <small>À partir de</small>
                <b>1.640 €/mois*</b>
              </span>
            </div>
            <div className="vrow">
              <span className="ph" />
              <div className="vt">
                <b>Quai des Aulnes — App. penthouse</b>
                <small>2 ch · 118 m² · terrasse</small>
              </div>
              <span className="vm">
                <small>À partir de</small>
                <b>1.980 €/mois*</b>
              </span>
            </div>
            <p className="vnote">
              * Attention, emprunter de l'argent coûte aussi de l'argent. Simulations indicatives —
              hypothèses validées par BuyMonth Finance.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* Lignes de la carte vitrine : restructuration sur petit écran.
           Scopé sous #vitrine, ne touche pas le reste du site. */
        @media (max-width: 560px) {
          #vitrine .vrow {
            flex-wrap: wrap;
            align-items: flex-start;
            column-gap: 12px;
            row-gap: 10px;
            padding: 12px;
          }
          #vitrine .vrow .vt {
            flex: 1 1 0;
            min-width: 0;
          }
          /* Titre entier, plus d'ellipse écrasée */
          #vitrine .vrow .vt b {
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            line-height: 1.25;
          }
          /* Prix : barre pleine largeur sur sa propre ligne, aucun débordement */
          #vitrine .vrow .vm {
            flex: 0 0 100%;
            width: 100%;
            box-sizing: border-box;
            margin-left: 0;
            text-align: left;
            display: flex;
            align-items: baseline;
            gap: 6px;
            padding: 6px 12px;
          }
          #vitrine .vrow .vm small {
            display: inline;
          }
        }
      `}</style>
    </section>
  );
}
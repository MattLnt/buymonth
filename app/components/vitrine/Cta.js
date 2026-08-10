import Link from "next/link";

export default function Cta() {
  return (
    <section className="pad" id="contact" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="band reveal">
          <h2>Prêt à accélérer vos ventes ?</h2>
          <p>
            Rejoignez les promoteurs et agences qui misent sur une innovation concrète et mesurable.
            Et si on testait BuyMonth sur vos prochains biens ?
          </p>
          <Link
            className="btn btn-primary"
            href="/contact?sujet=demo"
            style={{ padding: "14px 30px", fontSize: "1rem" }}
          >
            Réserver ma démo
          </Link>
        </div>
      </div>
    </section>
  );
}
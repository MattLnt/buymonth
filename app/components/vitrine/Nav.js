import Link from "next/link";
import CalMark from "./CalMark";

export default function Nav() {
  return (
    <nav>
      <div className="wrap nav-in">
        <Link className="brand" href="/">
          <CalMark size={34} />
          BuyMonth
        </Link>
        <div className="nav-links">
          <a href="#solution">Solution</a>
          <a href="#vitrine">Les biens</a>
          <a href="#process">Process</a>
          <a href="#tarif">Tarifs</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <Link className="nav-login" href="/login">
            Connexion
          </Link>
          <Link className="btn btn-primary" href="/contact">
            Réserver une démo
          </Link>
        </div>
      </div>
    </nav>
  );
}
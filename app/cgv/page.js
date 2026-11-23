/*
 * Conditions générales d'utilisation — texte de l'annexe 2 du dossier développeur
 * du 05/10/2026, rédigé par le client et intégré tel quel.
 */

import Link from 'next/link'
import PageLegale, { carte, H2, P, Liste, Fort, Lien } from '@/app/components/public/PageLegale'

export const metadata = {
  title: 'Conditions générales d’utilisation — BuyMonth',
}

export default function CGVPage() {
  return (
    <PageLegale titre={'Conditions générales d’utilisation'} maj="5 octobre 2026">
      <div style={carte} className="lg-card">
        <P style={{ margin: 0 }}>
          Ces conditions fixent les règles d&rsquo;utilisation du site buymonth.be. En utilisant le site, vous les
          acceptez.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>1. Qui édite le site ?</H2>
        <P style={{ margin: 0 }}>
          Le site est édité par <Fort>BuyMonth SRL</Fort>, Rue Lucien Poncelet 58, 4520 Wanze, Belgique, BCE
          1041.967.664, <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>. Les informations complètes
          figurent dans les{' '}
          <Link href="/mentions-legales" style={{ color: '#249E7C', fontWeight: 600 }}>
            mentions légales
          </Link>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>2. À quoi sert le site ?</H2>
        <P>
          BuyMonth permet d&rsquo;afficher des biens immobiliers avec une mensualité indicative à côté de leur
          prix, et de mettre en relation les personnes intéressées avec le promoteur du bien.
        </P>
        <P style={{ margin: 0 }}>
          L&rsquo;utilisation du site par les particuliers est gratuite. Les services proposés aux promoteurs et
          aux professionnels de l&rsquo;immobilier font l&rsquo;objet d&rsquo;un contrat distinct, qui prévaut sur
          les présentes conditions.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>3. Ce que BuyMonth fait et ne fait pas</H2>
        <P>
          BuyMonth SRL n&rsquo;est ni prêteur, ni intermédiaire de crédit, ni agent immobilier. Elle ne donne
          aucun conseil en crédit, n&rsquo;analyse pas votre solvabilité et ne propose aucun contrat de crédit.
          Elle n&rsquo;est pas partie à la vente du bien, qui se conclut uniquement entre vous et le promoteur.
        </P>
        <P style={{ margin: 0 }}>
          Les hypothèses de simulation (apport, durée, taux, TAEG) sont fournies par BuyMonth Finance, nom
          commercial de JG Management SRL, intermédiaire de crédit. Toute étude de financement et tout conseil en
          crédit sont réalisés exclusivement par BuyMonth Finance, sous sa propre responsabilité et uniquement si
          vous en faites la demande.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>4. Mensualités et simulations</H2>
        <P>
          <Fort>Attention, emprunter de l&rsquo;argent coûte aussi de l&rsquo;argent.</Fort>
        </P>
        <P>
          Les montants exprimés en euros par mois sont des estimations indicatives. Ils sont calculés sur la base
          des hypothèses de l&rsquo;exemple représentatif qui les accompagne, hors droits d&rsquo;enregistrement
          et frais de notaire.
        </P>
        <P>
          Ces montants ne constituent ni une offre de crédit, ni un engagement, ni une garantie d&rsquo;obtenir un
          financement. L&rsquo;octroi d&rsquo;un crédit dépend toujours de l&rsquo;analyse de votre situation et
          de l&rsquo;acceptation de votre dossier par un prêteur. La mensualité réelle peut différer du montant
          affiché.
        </P>
        <P style={{ margin: 0 }}>
          Une simulation ne vous engage à rien. Son résultat vous est affiché que vous acceptiez ou non la
          transmission de vos coordonnées.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>5. Mise en relation</H2>
        <P style={{ margin: 0 }}>
          Vos coordonnées ne sont transmises au promoteur ou à BuyMonth Finance que si vous cochez la case
          correspondante. Chaque case est facultative. Le détail figure dans la{' '}
          <Link href="/confidentialite" style={{ color: '#249E7C', fontWeight: 600 }}>
            politique de confidentialité
          </Link>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>6. Annonces immobilières</H2>
        <P style={{ margin: 0 }}>
          Les annonces (prix, descriptions, plans, images, disponibilité) sont fournies par les promoteurs, qui
          sont seuls responsables de leur exactitude et de leur mise à jour. BuyMonth SRL ne garantit ni la
          disponibilité d&rsquo;un bien ni l&rsquo;absence d&rsquo;erreur dans une annonce. Les caractéristiques
          d&rsquo;un bien doivent toujours être vérifiées auprès du promoteur avant toute décision.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>7. Bon usage du site</H2>
        <P>
          Vous vous engagez à utiliser le site de bonne foi, à fournir des informations exactes et à ne pas :
        </P>
        <Liste>
          <li>perturber le fonctionnement du site ou tenter d&rsquo;y accéder sans autorisation ;</li>
          <li>extraire ou copier son contenu de manière automatisée ;</li>
          <li>utiliser le site à des fins illégales ou pour le compte d&rsquo;un tiers sans son accord.</li>
        </Liste>
      </div>

      <div style={carte} className="lg-card">
        <H2>8. Disponibilité</H2>
        <P style={{ margin: 0 }}>
          Nous mettons tout en œuvre pour que le site soit accessible et à jour, sans pouvoir le garantir en
          permanence. Le site peut être interrompu pour maintenance ou modifié sans préavis.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>9. Responsabilité</H2>
        <P>
          Les informations du site sont fournies à titre indicatif et ne remplacent pas un conseil personnalisé.
          BuyMonth SRL n&rsquo;est pas responsable des décisions prises sur la seule base d&rsquo;une mensualité
          affichée, du contenu des annonces, des services de BuyMonth Finance ou des promoteurs, ni des sites
          tiers vers lesquels le site renvoie.
        </P>
        <P style={{ margin: 0 }}>
          Rien dans ces conditions ne limite la responsabilité de BuyMonth SRL en cas de dol, de faute lourde, de
          manquement à une obligation essentielle ou d&rsquo;atteinte aux droits que la loi reconnaît aux
          consommateurs.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>10. Propriété intellectuelle</H2>
        <P style={{ margin: 0 }}>
          La marque BuyMonth, le logo, les textes, les interfaces et le code du site appartiennent à BuyMonth SRL
          ou à ses partenaires. Les annonces restent la propriété des promoteurs. Toute reproduction sans
          autorisation écrite est interdite.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>11. Données personnelles et cookies</H2>
        <P style={{ margin: 0 }}>
          Le traitement de vos données et l&rsquo;usage des cookies sont décrits dans la{' '}
          <Link href="/confidentialite" style={{ color: '#249E7C', fontWeight: 600 }}>
            politique de confidentialité
          </Link>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>12. Modification des conditions</H2>
        <P style={{ margin: 0 }}>
          Nous pouvons modifier ces conditions. La version applicable est celle publiée sur le site au moment de
          votre visite.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>13. Droit applicable et litiges</H2>
        <P>
          Ces conditions sont soumises au droit belge. En cas de difficulté, contactez-nous d&rsquo;abord à{' '}
          <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien> afin de chercher une solution amiable.
        </P>
        <P>
          À défaut d&rsquo;accord, les tribunaux de l&rsquo;arrondissement judiciaire de Liège sont compétents. Si
          vous êtes consommateur, vous conservez le droit de saisir le tribunal de votre domicile.
        </P>
        <P style={{ margin: 0 }}>
          Pour toute réclamation relative à un service de crédit, adressez-vous à BuyMonth Finance, dont les
          coordonnées et le service de médiation (Ombudsfin) figurent dans les{' '}
          <Link href="/mentions-legales" style={{ color: '#249E7C', fontWeight: 600 }}>
            mentions légales
          </Link>
          .
        </P>
      </div>
    </PageLegale>
  )
}

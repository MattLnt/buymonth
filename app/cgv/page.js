/*
 * Conditions générales d'utilisation — texte de l'annexe 2 du dossier développeur
 * du 05/10/2026, rédigé par le client et intégré tel quel.
 */

import Link from 'next/link'
import PageLegale, { carte, H2, P, Liste, Fort, Lien } from '@/app/components/public/PageLegale'
import { getT } from '@/lib/i18n/server'

export async function generateMetadata() {
  const { t } = await getT()
  return {
    title: t('Conditions générales d’utilisation — BuyMonth', 'Algemene gebruiksvoorwaarden — BuyMonth'),
  }
}

// Le texte français et sa traduction néerlandaise sont écrits en entier, côte à
// côte (CorpsFR / CorpsNL), plutôt que phrase par phrase avec t().
export default async function CGVPage() {
  const { lang, t } = await getT()
  return (
    <PageLegale
      titre={t('Conditions générales d’utilisation', 'Algemene gebruiksvoorwaarden')}
      maj={t('5 octobre 2026', '5 oktober 2026')}
    >
      {lang === 'nl' ? <CorpsNL /> : <CorpsFR />}
    </PageLegale>
  )
}

function CorpsFR() {
  return (
    <>
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
    </>
  )
}

function CorpsNL() {
  return (
    <>
      <div style={carte} className="lg-card">
        <P style={{ margin: 0 }}>
          Deze voorwaarden bepalen de regels voor het gebruik van de website buymonth.be. Door de website te
          gebruiken, aanvaardt u ze.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>1. Wie geeft de website uit?</H2>
        <P style={{ margin: 0 }}>
          De website wordt uitgegeven door <Fort>BuyMonth SRL</Fort>, Rue Lucien Poncelet 58, 4520 Wanze, België,
          ondernemingsnummer (KBO) 1041.967.664, <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>. De
          volledige gegevens staan in de{' '}
          <Link href="/mentions-legales" style={{ color: '#249E7C', fontWeight: 600 }}>
            juridische vermeldingen
          </Link>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>2. Waarvoor dient de website?</H2>
        <P>
          Met BuyMonth kunnen vastgoedpanden worden getoond met een indicatief maandbedrag naast hun prijs, en
          kunnen geïnteresseerden in contact worden gebracht met de projectontwikkelaar van het pand.
        </P>
        <P style={{ margin: 0 }}>
          Het gebruik van de website door particulieren is gratis. De diensten die aan projectontwikkelaars en
          vastgoedprofessionals worden aangeboden, maken het voorwerp uit van een afzonderlijke overeenkomst, die
          voorrang heeft op deze voorwaarden.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>3. Wat BuyMonth wel en niet doet</H2>
        <P>
          BuyMonth SRL is geen kredietgever, geen kredietbemiddelaar en geen vastgoedmakelaar. Zij verstrekt geen
          enkel kredietadvies, onderzoekt uw kredietwaardigheid niet en biedt geen enkele kredietovereenkomst aan.
          Zij is geen partij bij de verkoop van het pand, die uitsluitend tussen u en de projectontwikkelaar wordt
          gesloten.
        </P>
        <P style={{ margin: 0 }}>
          De simulatieparameters (eigen inbreng, looptijd, rentevoet, JKP) worden aangeleverd door BuyMonth
          Finance, handelsnaam van JG Management SRL, kredietbemiddelaar. Elk financieringsonderzoek en elk
          kredietadvies wordt uitsluitend verricht door BuyMonth Finance, onder haar eigen verantwoordelijkheid en
          enkel als u daarom verzoekt.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>4. Maandbedragen en simulaties</H2>
        <P>
          <Fort>Let op, geld lenen kost ook geld.</Fort>
        </P>
        <P>
          De bedragen uitgedrukt in euro per maand zijn indicatieve ramingen. Ze worden berekend op basis van de
          parameters van het representatief voorbeeld dat erbij vermeld staat, exclusief registratierechten en
          notariskosten.
        </P>
        <P>
          Deze bedragen vormen geen kredietaanbod, geen verbintenis en geen garantie op het verkrijgen van een
          financiering. De toekenning van een krediet hangt steeds af van de analyse van uw situatie en van de
          aanvaarding van uw dossier door een kredietgever. Het werkelijke maandbedrag kan afwijken van het
          getoonde bedrag.
        </P>
        <P style={{ margin: 0 }}>
          Een simulatie verbindt u tot niets. Het resultaat wordt u getoond, ongeacht of u al dan niet instemt met
          het doorgeven van uw contactgegevens.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>5. In contact brengen</H2>
        <P style={{ margin: 0 }}>
          Uw contactgegevens worden enkel aan de projectontwikkelaar of aan BuyMonth Finance doorgegeven als u het
          betreffende vakje aanvinkt. Elk vakje is facultatief. De details staan in het{' '}
          <Link href="/confidentialite" style={{ color: '#249E7C', fontWeight: 600 }}>
            privacybeleid
          </Link>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>6. Vastgoedadvertenties</H2>
        <P style={{ margin: 0 }}>
          De advertenties (prijzen, beschrijvingen, plannen, beelden, beschikbaarheid) worden aangeleverd door de
          projectontwikkelaars, die als enige verantwoordelijk zijn voor de juistheid en de bijwerking ervan.
          BuyMonth SRL garandeert noch de beschikbaarheid van een pand, noch de afwezigheid van fouten in een
          advertentie. De kenmerken van een pand moeten vóór elke beslissing altijd bij de projectontwikkelaar
          worden nagegaan.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>7. Correct gebruik van de website</H2>
        <P>
          U verbindt zich ertoe de website te goeder trouw te gebruiken, juiste informatie te verstrekken en niet:
        </P>
        <Liste>
          <li>de werking van de website te verstoren of te proberen er zonder toestemming toegang toe te krijgen;</li>
          <li>de inhoud ervan op geautomatiseerde wijze te extraheren of te kopiëren;</li>
          <li>de website te gebruiken voor onwettige doeleinden of voor rekening van een derde zonder diens toestemming.</li>
        </Liste>
      </div>

      <div style={carte} className="lg-card">
        <H2>8. Beschikbaarheid</H2>
        <P style={{ margin: 0 }}>
          Wij stellen alles in het werk om de website toegankelijk en up-to-date te houden, zonder dit permanent te
          kunnen garanderen. De website kan voor onderhoud worden onderbroken of zonder voorafgaande kennisgeving
          worden gewijzigd.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>9. Aansprakelijkheid</H2>
        <P>
          De informatie op de website wordt ter indicatie verstrekt en vervangt geen persoonlijk advies. BuyMonth
          SRL is niet aansprakelijk voor beslissingen die uitsluitend op basis van een getoond maandbedrag worden
          genomen, voor de inhoud van de advertenties, voor de diensten van BuyMonth Finance of van de
          projectontwikkelaars, noch voor websites van derden waarnaar de website verwijst.
        </P>
        <P style={{ margin: 0 }}>
          Niets in deze voorwaarden beperkt de aansprakelijkheid van BuyMonth SRL in geval van bedrog, zware fout,
          tekortkoming in een wezenlijke verbintenis of aantasting van de rechten die de wet aan consumenten
          toekent.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>10. Intellectuele eigendom</H2>
        <P style={{ margin: 0 }}>
          Het merk BuyMonth, het logo, de teksten, de interfaces en de code van de website behoren toe aan BuyMonth
          SRL of aan haar partners. De advertenties blijven eigendom van de projectontwikkelaars. Elke reproductie
          zonder schriftelijke toestemming is verboden.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>11. Persoonsgegevens en cookies</H2>
        <P style={{ margin: 0 }}>
          De verwerking van uw gegevens en het gebruik van cookies worden beschreven in het{' '}
          <Link href="/confidentialite" style={{ color: '#249E7C', fontWeight: 600 }}>
            privacybeleid
          </Link>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>12. Wijziging van de voorwaarden</H2>
        <P style={{ margin: 0 }}>
          Wij kunnen deze voorwaarden wijzigen. De toepasselijke versie is die welke op het moment van uw bezoek op
          de website is gepubliceerd.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>13. Toepasselijk recht en geschillen</H2>
        <P>
          Deze voorwaarden zijn onderworpen aan het Belgisch recht. Neem bij problemen eerst contact met ons op via{' '}
          <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien> om samen naar een minnelijke oplossing te
          zoeken.
        </P>
        <P>
          Bij gebrek aan akkoord zijn de rechtbanken van het gerechtelijk arrondissement Luik bevoegd. Als u
          consument bent, behoudt u het recht om de zaak aanhangig te maken bij de rechtbank van uw woonplaats.
        </P>
        <P style={{ margin: 0 }}>
          Voor elke klacht over een kredietdienst kunt u terecht bij BuyMonth Finance, waarvan de contactgegevens
          en de ombudsdienst (Ombudsfin) vermeld staan in de{' '}
          <Link href="/mentions-legales" style={{ color: '#249E7C', fontWeight: 600 }}>
            juridische vermeldingen
          </Link>
          .
        </P>
      </div>
    </>
  )
}

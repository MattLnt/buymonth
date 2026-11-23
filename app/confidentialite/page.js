/*
 * Politique de confidentialité — texte de l'annexe 1 du dossier développeur du
 * 05/10/2026, rédigé par le client et intégré tel quel, à deux adaptations près
 * validées par Valentino :
 *   - 05/10 : la liste des sous-traitants (section 4) ne citait que Vercel.
 *     Railway, Cloudinary, Mapbox, Resend et Stripe y ont été ajoutés.
 *   - 06/10 : la section 8 décrivait un bandeau cookies et une catégorie
 *     « mesure d'audience » inexistants. Elle décrit maintenant la réalité :
 *     uniquement des cookies strictement nécessaires, donc pas de bandeau. La
 *     ligne « Mesurer l'audience du site » a été retirée du tableau de la
 *     section 3. Si un outil de suivi est ajouté un jour, il faudra remettre
 *     un bandeau de consentement et réadapter cette page.
 *
 * Reste à trancher par le client : le tableau de la section 3 annonce un
 * effacement à 30 jours de l'adresse utilisée pour envoyer un lien de
 * simulation, alors que cette adresse n'est pas conservée du tout.
 */

import Link from 'next/link'
import PageLegale, { carte, H2, P, Liste, Fort, Lien, Tableau } from '@/app/components/public/PageLegale'
import { getT } from '@/lib/i18n/server'

export async function generateMetadata() {
  const { t } = await getT()
  return {
    title: t('Politique de confidentialité — BuyMonth', 'Privacybeleid — BuyMonth'),
  }
}

// Le texte français et sa traduction néerlandaise sont écrits en entier, côte à
// côte (CorpsFR / CorpsNL), plutôt que phrase par phrase avec t().
export default async function ConfidentialitePage() {
  const { lang, t } = await getT()
  return (
    <PageLegale titre={t('Politique de confidentialité', 'Privacybeleid')} maj={t('5 octobre 2026', '5 oktober 2026')}>
      {lang === 'nl' ? <CorpsNL /> : <CorpsFR />}
    </PageLegale>
  )
}

const FINALITES_FR = [
  [
    'Calculer et afficher votre simulation, répondre à votre demande',
    'Mesures précontractuelles prises à votre demande (art. 6.1.b)',
    '12 mois après le dernier contact',
  ],
  [
    'Transmettre vos coordonnées au promoteur du bien consulté',
    'Votre consentement, donné par une case dédiée (art. 6.1.a)',
    'Jusqu’au retrait du consentement, au plus 24 mois',
  ],
  [
    'Transmettre vos coordonnées à BuyMonth Finance pour une étude de financement',
    'Votre consentement, donné par une case distincte (art. 6.1.a)',
    'Jusqu’au retrait du consentement, au plus 24 mois',
  ],
  [
    'Vous envoyer, à la demande du promoteur que vous avez contacté, un lien vers la simulation d’un bien',
    'Intérêt légitime (art. 6.1.f)',
    '30 jours si vous ne réalisez pas de simulation',
  ],
  [
    'Répondre aux demandes des professionnels et gérer la relation commerciale',
    'Mesures précontractuelles ou contrat (art. 6.1.b), intérêt légitime (art. 6.1.f)',
    'Durée de la relation, puis 3 ans',
  ],
  [
    'Assurer la sécurité et le bon fonctionnement du site',
    'Intérêt légitime (art. 6.1.f)',
    '12 mois',
  ],
  [
    'Respecter nos obligations légales (comptabilité, fiscalité)',
    'Obligation légale (art. 6.1.c)',
    'Jusqu’à 10 ans, selon les délais légaux de conservation comptable et fiscale',
  ],
]

function CorpsFR() {
  return (
    <>
      <div style={carte} className="lg-card">
        <P style={{ margin: 0 }}>
          BuyMonth SRL respecte votre vie privée. Cette politique explique quelles données personnelles nous
          collectons sur buymonth.be, pourquoi, à qui nous les transmettons et quels sont vos droits.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>1. Qui est responsable de vos données ?</H2>
        <P>
          Le responsable du traitement est <Fort>BuyMonth SRL</Fort>, Rue Lucien Poncelet 58, 4520 Wanze,
          Belgique, inscrite à la BCE sous le numéro 1041.967.664.
        </P>
        <P>
          Pour toute question relative à vos données : <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>.
        </P>
        <P style={{ margin: 0 }}>
          BuyMonth SRL édite une plateforme d&rsquo;affichage de biens immobiliers en mensualités et de mise en
          relation entre promoteurs et acheteurs. BuyMonth SRL n&rsquo;est pas intermédiaire de crédit : elle ne
          réalise aucun conseil en crédit ni aucune analyse de solvabilité.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>2. Quelles données collectons-nous ?</H2>
        <P>
          Nous collectons uniquement les données que vous nous communiquez et celles liées à votre navigation.
        </P>
        <Liste>
          <li>
            <Fort>Lorsque vous réalisez une simulation ou demandez à être recontacté :</Fort> nom, prénom,
            adresse e-mail, numéro de téléphone, bien ou projet consulté, paramètres de votre simulation (par
            exemple apport et durée).
          </li>
          <li>
            <Fort>Lorsqu&rsquo;un promoteur que vous avez contacté vous envoie un lien de simulation via BuyMonth :</Fort>{' '}
            votre adresse e-mail, communiquée par ce promoteur.
          </li>
          <li>
            <Fort>Lorsque vous nous contactez en tant que professionnel :</Fort> nom, prénom, fonction, société,
            adresse e-mail, numéro de téléphone, contenu de votre message.
          </li>
          <li>
            <Fort>Lorsque vous naviguez sur le site :</Fort> données techniques (adresse IP, type d&rsquo;appareil
            et de navigateur, pages consultées, date et heure) et les cookies strictement nécessaires au
            fonctionnement du site (voir point 8).
          </li>
        </Liste>
        <P>
          Nous ne collectons aucune donnée sensible (santé, opinions, etc.) et le site ne s&rsquo;adresse pas aux
          mineurs.
        </P>
        <P style={{ margin: 0 }}>
          Le résultat d&rsquo;une simulation vous est affiché dans tous les cas. Il ne dépend pas de votre accord
          pour la transmission de vos données à des tiers. La communication de vos coordonnées est facultative :
          sans elles, nous ne pouvons simplement pas vous recontacter.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>3. Pourquoi utilisons-nous vos données ?</H2>
        <Tableau entetes={['Finalité', 'Base légale (RGPD)', 'Durée de conservation']} lignes={FINALITES_FR} />
        <P>
          Chaque consentement est facultatif et indépendant des autres. Vous pouvez le retirer à tout moment en
          écrivant à <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>, sans que cela ne remette en
          cause les traitements déjà effectués.
        </P>
        <P style={{ margin: 0 }}>
          Nous ne prenons aucune décision automatisée produisant des effets juridiques à votre égard. Les
          mensualités affichées sont des estimations indicatives et ne constituent pas une offre de crédit.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>4. À qui transmettons-nous vos données ?</H2>
        <P>Nous ne vendons jamais vos données. Elles sont transmises uniquement aux destinataires suivants.</P>
        <Liste>
          <li>
            <Fort>Le promoteur du bien qui vous intéresse</Fort>, si vous avez coché la case correspondante. Il
            devient alors responsable de l&rsquo;usage qu&rsquo;il fait de vos données.
          </li>
          <li>
            <Fort>BuyMonth Finance</Fort> (nom commercial de JG Management SRL, Rue Lucien Poncelet 58, 4520
            Antheit, intermédiaire de crédit), si vous avez coché la case correspondante. BuyMonth Finance traite
            vos données en tant que responsable de traitement distinct, selon sa propre politique de
            confidentialité (contact :{' '}
            <Lien href="mailto:info@buymonth-finance.be">info@buymonth-finance.be</Lien>).
          </li>
          <li>
            <Fort>Nos sous-traitants techniques</Fort>, qui agissent sur nos instructions : Vercel Inc.
            (hébergement du site), Railway (hébergement de la base de données, Pays-Bas), Cloudinary (stockage et
            diffusion des photos des biens), Mapbox (géocodage des adresses des biens), Resend (envoi des
            e-mails) et Stripe (paiement des abonnements des promoteurs).
          </li>
          <li>
            <Fort>Les autorités</Fort>, lorsque la loi nous y oblige.
          </li>
        </Liste>
      </div>

      <div style={carte} className="lg-card">
        <H2>5. Vos données quittent-elles l&rsquo;Union européenne ?</H2>
        <P style={{ margin: 0 }}>
          Les données sont stockées sur des serveurs situés dans l&rsquo;Union européenne. Notre hébergeur, Vercel
          Inc., est toutefois une société établie aux États-Unis. Tout accès éventuel depuis ce pays est encadré
          par les garanties prévues par le RGPD : Vercel Inc. est certifiée au titre du Data Privacy Framework
          UE–États-Unis et liée par les clauses contractuelles types de la Commission européenne.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>6. Comment protégeons-nous vos données ?</H2>
        <P style={{ margin: 0 }}>
          Nous appliquons des mesures techniques et organisationnelles adaptées : connexion chiffrée (HTTPS),
          accès limité aux personnes qui en ont besoin, sous-traitants liés par contrat. En cas de violation de
          données présentant un risque pour vous, nous vous en informerons conformément à la loi.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>7. Quels sont vos droits ?</H2>
        <P>Vous pouvez à tout moment, gratuitement :</P>
        <Liste>
          <li>accéder à vos données et en obtenir une copie ;</li>
          <li>faire corriger des données inexactes ;</li>
          <li>demander leur effacement ;</li>
          <li>demander la limitation de leur traitement ;</li>
          <li>vous opposer à un traitement fondé sur notre intérêt légitime, et à toute prospection ;</li>
          <li>recevoir vos données dans un format réutilisable (portabilité) ;</li>
          <li>retirer un consentement donné.</li>
        </Liste>
        <P>
          Pour exercer vos droits, écrivez à <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>. Nous
          répondons dans un délai d&rsquo;un mois. En cas de doute sur votre identité, nous pouvons vous demander
          un justificatif.
        </P>
        <P style={{ margin: 0 }}>
          Si vos données ont été transmises à un promoteur ou à BuyMonth Finance, vous pouvez aussi exercer vos
          droits directement auprès d&rsquo;eux.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>8. Cookies</H2>
        <P>
          Un cookie est un petit fichier déposé sur votre appareil lors de votre visite. Le site n&rsquo;utilise
          que des cookies <Fort>strictement nécessaires</Fort> à son fonctionnement : ils maintiennent la
          connexion d&rsquo;un promoteur à son espace et assurent la sécurité du site.
        </P>
        <P>
          Nous ne déposons aucun cookie publicitaire, aucun cookie de mesure d&rsquo;audience et aucun cookie de
          suivi de votre navigation sur d&rsquo;autres sites.
        </P>
        <P>
          Ces cookies étant indispensables au service que vous demandez, la loi ne requiert pas votre
          consentement : il n&rsquo;y a donc pas de bandeau cookies sur ce site. Vous pouvez les supprimer ou les
          bloquer dans les réglages de votre navigateur, mais la connexion à un espace promoteur ne fonctionnera
          alors plus.
        </P>
        <P style={{ margin: 0 }}>
          Si nous ajoutons un jour un outil de mesure d&rsquo;audience ou tout autre cookie non essentiel, nous
          mettrons en place un bandeau de consentement et nous adapterons cette page. Pour toute question sur les
          cookies : <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>9. Réclamation</H2>
        <P style={{ margin: 0 }}>
          Si vous estimez que vos données ne sont pas traitées correctement, contactez-nous d&rsquo;abord à{' '}
          <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>. Vous pouvez aussi introduire une
          réclamation auprès de l&rsquo;Autorité de protection des données : Rue de la Presse 35, 1000 Bruxelles,{' '}
          <Lien href="mailto:contact@apd-gba.be">contact@apd-gba.be</Lien>,{' '}
          <Lien href="https://www.autoriteprotectiondonnees.be" externe>
            www.autoriteprotectiondonnees.be
          </Lien>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>10. Modifications</H2>
        <P style={{ margin: 0 }}>
          Nous pouvons adapter cette politique, notamment si le site ou la loi évolue. La version en vigueur est
          celle publiée sur cette page, avec sa date de mise à jour.
        </P>
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#8A92A6', marginTop: 8, lineHeight: 1.7 }}>
        Voir aussi :{' '}
        <Link href="/mentions-legales" style={{ color: '#249E7C', fontWeight: 600 }}>
          Mentions légales
        </Link>
        {' · '}
        <Link href="/cgv" style={{ color: '#249E7C', fontWeight: 600 }}>
          Conditions générales
        </Link>
      </p>
    </>
  )
}

const FINALITES_NL = [
  [
    'Uw simulatie berekenen en tonen, uw aanvraag beantwoorden',
    'Precontractuele maatregelen genomen op uw verzoek (art. 6.1.b)',
    '12 maanden na het laatste contact',
  ],
  [
    'Uw contactgegevens doorgeven aan de projectontwikkelaar van het geraadpleegde pand',
    'Uw toestemming, gegeven via een specifiek vakje (art. 6.1.a)',
    'Tot de intrekking van de toestemming, maximaal 24 maanden',
  ],
  [
    'Uw contactgegevens doorgeven aan BuyMonth Finance voor een financieringsonderzoek',
    'Uw toestemming, gegeven via een afzonderlijk vakje (art. 6.1.a)',
    'Tot de intrekking van de toestemming, maximaal 24 maanden',
  ],
  [
    'U, op verzoek van de projectontwikkelaar met wie u contact hebt opgenomen, een link naar de simulatie van een pand sturen',
    'Gerechtvaardigd belang (art. 6.1.f)',
    '30 dagen als u geen simulatie uitvoert',
  ],
  [
    'Aanvragen van professionals beantwoorden en de handelsrelatie beheren',
    'Precontractuele maatregelen of overeenkomst (art. 6.1.b), gerechtvaardigd belang (art. 6.1.f)',
    'Duur van de relatie, daarna 3 jaar',
  ],
  [
    'De veiligheid en de goede werking van de website verzekeren',
    'Gerechtvaardigd belang (art. 6.1.f)',
    '12 maanden',
  ],
  [
    'Onze wettelijke verplichtingen nakomen (boekhouding, fiscaliteit)',
    'Wettelijke verplichting (art. 6.1.c)',
    'Tot 10 jaar, volgens de wettelijke bewaartermijnen op boekhoudkundig en fiscaal vlak',
  ],
]

function CorpsNL() {
  return (
    <>
      <div style={carte} className="lg-card">
        <P style={{ margin: 0 }}>
          BuyMonth SRL respecteert uw privacy. Dit beleid legt uit welke persoonsgegevens wij op buymonth.be
          verzamelen, waarom, aan wie wij ze doorgeven en welke rechten u hebt.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>1. Wie is verantwoordelijk voor uw gegevens?</H2>
        <P>
          De verwerkingsverantwoordelijke is <Fort>BuyMonth SRL</Fort>, Rue Lucien Poncelet 58, 4520 Wanze,
          België, ingeschreven in de KBO onder het ondernemingsnummer 1041.967.664.
        </P>
        <P>
          Voor elke vraag over uw gegevens: <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>.
        </P>
        <P style={{ margin: 0 }}>
          BuyMonth SRL geeft een platform uit dat vastgoedpanden in maandbedragen toont en projectontwikkelaars en
          kopers met elkaar in contact brengt. BuyMonth SRL is geen kredietbemiddelaar: zij verstrekt geen enkel
          kredietadvies en voert geen enkele kredietwaardigheidsanalyse uit.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>2. Welke gegevens verzamelen wij?</H2>
        <P>
          Wij verzamelen uitsluitend de gegevens die u ons meedeelt en de gegevens die verband houden met uw
          surfgedrag.
        </P>
        <Liste>
          <li>
            <Fort>Wanneer u een simulatie uitvoert of vraagt om gecontacteerd te worden:</Fort> naam, voornaam,
            e-mailadres, telefoonnummer, geraadpleegd pand of project, parameters van uw simulatie (bijvoorbeeld
            eigen inbreng en looptijd).
          </li>
          <li>
            <Fort>Wanneer een projectontwikkelaar met wie u contact hebt opgenomen u via BuyMonth een simulatielink stuurt:</Fort>{' '}
            uw e-mailadres, meegedeeld door die projectontwikkelaar.
          </li>
          <li>
            <Fort>Wanneer u als professional contact met ons opneemt:</Fort> naam, voornaam, functie, bedrijf,
            e-mailadres, telefoonnummer, inhoud van uw bericht.
          </li>
          <li>
            <Fort>Wanneer u op de website surft:</Fort> technische gegevens (IP-adres, type toestel en browser,
            geraadpleegde pagina&rsquo;s, datum en uur) en de cookies die strikt noodzakelijk zijn voor de werking
            van de website (zie punt 8).
          </li>
        </Liste>
        <P>
          Wij verzamelen geen gevoelige gegevens (gezondheid, overtuigingen enz.) en de website is niet bestemd
          voor minderjarigen.
        </P>
        <P style={{ margin: 0 }}>
          Het resultaat van een simulatie wordt u in alle gevallen getoond. Het hangt niet af van uw toestemming
          voor het doorgeven van uw gegevens aan derden. Het meedelen van uw contactgegevens is facultatief:
          zonder die gegevens kunnen wij u eenvoudigweg niet contacteren.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>3. Waarom gebruiken wij uw gegevens?</H2>
        <Tableau entetes={['Doeleinde', 'Rechtsgrond (AVG)', 'Bewaartermijn']} lignes={FINALITES_NL} />
        <P>
          Elke toestemming is facultatief en staat los van de andere. U kunt ze op elk moment intrekken door te
          schrijven naar <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>, zonder dat dit afbreuk doet
          aan de verwerkingen die al zijn uitgevoerd.
        </P>
        <P style={{ margin: 0 }}>
          Wij nemen geen enkele geautomatiseerde beslissing die rechtsgevolgen voor u heeft. De getoonde
          maandbedragen zijn indicatieve ramingen en vormen geen kredietaanbod.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>4. Aan wie geven wij uw gegevens door?</H2>
        <P>Wij verkopen uw gegevens nooit. Ze worden uitsluitend doorgegeven aan de volgende ontvangers.</P>
        <Liste>
          <li>
            <Fort>De projectontwikkelaar van het pand dat u interesseert</Fort>, als u het betreffende vakje hebt
            aangevinkt. Hij wordt dan verantwoordelijk voor het gebruik dat hij van uw gegevens maakt.
          </li>
          <li>
            <Fort>BuyMonth Finance</Fort> (handelsnaam van JG Management SRL, Rue Lucien Poncelet 58, 4520
            Antheit, kredietbemiddelaar), als u het betreffende vakje hebt aangevinkt. BuyMonth Finance verwerkt uw
            gegevens als afzonderlijke verwerkingsverantwoordelijke, volgens haar eigen privacybeleid (contact:{' '}
            <Lien href="mailto:info@buymonth-finance.be">info@buymonth-finance.be</Lien>).
          </li>
          <li>
            <Fort>Onze technische verwerkers</Fort>, die volgens onze instructies handelen: Vercel Inc. (hosting
            van de website), Railway (hosting van de database, Nederland), Cloudinary (opslag en weergave van de
            foto&rsquo;s van de panden), Mapbox (geocodering van de adressen van de panden), Resend (verzending
            van de e-mails) en Stripe (betaling van de abonnementen van de projectontwikkelaars).
          </li>
          <li>
            <Fort>De autoriteiten</Fort>, wanneer de wet ons daartoe verplicht.
          </li>
        </Liste>
      </div>

      <div style={carte} className="lg-card">
        <H2>5. Verlaten uw gegevens de Europese Unie?</H2>
        <P style={{ margin: 0 }}>
          De gegevens worden opgeslagen op servers in de Europese Unie. Onze hostingprovider, Vercel Inc., is
          echter een vennootschap gevestigd in de Verenigde Staten. Elke eventuele toegang vanuit dat land valt
          onder de waarborgen die de AVG voorziet: Vercel Inc. is gecertificeerd onder het EU-VS Data Privacy
          Framework en gebonden door de modelcontractbepalingen van de Europese Commissie.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>6. Hoe beschermen wij uw gegevens?</H2>
        <P style={{ margin: 0 }}>
          Wij passen gepaste technische en organisatorische maatregelen toe: versleutelde verbinding (HTTPS),
          toegang beperkt tot de personen die ze nodig hebben, verwerkers die contractueel gebonden zijn. Bij een
          inbreuk in verband met persoonsgegevens die een risico voor u inhoudt, brengen wij u daarvan op de
          hoogte overeenkomstig de wet.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>7. Welke rechten hebt u?</H2>
        <P>U kunt op elk moment en kosteloos:</P>
        <Liste>
          <li>uw gegevens inzien en er een kopie van verkrijgen;</li>
          <li>onjuiste gegevens laten verbeteren;</li>
          <li>de wissing ervan vragen;</li>
          <li>de beperking van de verwerking ervan vragen;</li>
          <li>bezwaar maken tegen een verwerking op basis van ons gerechtvaardigd belang, en tegen elke vorm van direct marketing;</li>
          <li>uw gegevens ontvangen in een herbruikbaar formaat (overdraagbaarheid);</li>
          <li>een gegeven toestemming intrekken.</li>
        </Liste>
        <P>
          Om uw rechten uit te oefenen, schrijft u naar <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>.
          Wij antwoorden binnen een termijn van één maand. Bij twijfel over uw identiteit kunnen wij u om een
          bewijsstuk vragen.
        </P>
        <P style={{ margin: 0 }}>
          Als uw gegevens werden doorgegeven aan een projectontwikkelaar of aan BuyMonth Finance, kunt u uw rechten
          ook rechtstreeks bij hen uitoefenen.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>8. Cookies</H2>
        <P>
          Een cookie is een klein bestand dat tijdens uw bezoek op uw toestel wordt geplaatst. De website gebruikt
          uitsluitend cookies die <Fort>strikt noodzakelijk</Fort> zijn voor de werking ervan: ze houden de
          verbinding van een projectontwikkelaar met zijn account in stand en verzekeren de veiligheid van de
          website.
        </P>
        <P>
          Wij plaatsen geen advertentiecookies, geen cookies voor bezoekersstatistieken en geen cookies die uw
          surfgedrag op andere websites volgen.
        </P>
        <P>
          Omdat deze cookies onmisbaar zijn voor de dienst die u vraagt, vereist de wet uw toestemming niet: er is
          op deze website dus geen cookiebanner. U kunt ze verwijderen of blokkeren in de instellingen van uw
          browser, maar dan werkt het inloggen op een account voor projectontwikkelaars niet meer.
        </P>
        <P style={{ margin: 0 }}>
          Als wij ooit een tool voor bezoekersstatistieken of een andere niet-essentiële cookie toevoegen, zullen
          wij een toestemmingsbanner invoeren en deze pagina aanpassen. Voor elke vraag over cookies:{' '}
          <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>.
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>9. Klacht</H2>
        <P style={{ margin: 0 }}>
          Als u van mening bent dat uw gegevens niet correct worden verwerkt, neem dan eerst contact met ons op via{' '}
          <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>. U kunt ook een klacht indienen bij de
          Gegevensbeschermingsautoriteit: Drukpersstraat 35, 1000 Brussel,{' '}
          <Lien href="mailto:contact@apd-gba.be">contact@apd-gba.be</Lien>,{' '}
          <Lien href="https://www.gegevensbeschermingsautoriteit.be" externe>
            www.gegevensbeschermingsautoriteit.be
          </Lien>
          .
        </P>
      </div>

      <div style={carte} className="lg-card">
        <H2>10. Wijzigingen</H2>
        <P style={{ margin: 0 }}>
          Wij kunnen dit beleid aanpassen, met name als de website of de wet verandert. De geldende versie is die
          welke op deze pagina is gepubliceerd, met de datum van de laatste bijwerking.
        </P>
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#8A92A6', marginTop: 8, lineHeight: 1.7 }}>
        Zie ook:{' '}
        <Link href="/mentions-legales" style={{ color: '#249E7C', fontWeight: 600 }}>
          Juridische vermeldingen
        </Link>
        {' · '}
        <Link href="/cgv" style={{ color: '#249E7C', fontWeight: 600 }}>
          Algemene voorwaarden
        </Link>
      </p>
    </>
  )
}

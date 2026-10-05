/*
 * Politique de confidentialité — texte de l'annexe 1 du dossier développeur du
 * 05/10/2026, rédigé par le client et intégré tel quel.
 *
 * Deux points du texte ne correspondent pas encore au site et ont été signalés au
 * client le 05/10/2026 : la section 8 décrit un bandeau cookies et une catégorie
 * « mesure d'audience » alors qu'aucun cookie non essentiel n'est déposé, et le
 * tableau de la section 3 annonce un effacement à 30 jours de l'adresse utilisée
 * pour l'envoi d'un lien de simulation, alors que cette adresse n'est pas
 * conservée du tout. Le texte reste publié tel qu'il a été transmis : c'est au
 * client de l'ajuster s'il le souhaite.
 *
 * Seul ajout valide avec le client (accord de Valentino, 05/10/2026) : la liste
 * des sous-traitants de la section 4 ne citait que Vercel. Railway, Cloudinary,
 * Mapbox, Resend et Stripe y ont ete ajoutes.
 */

import Link from 'next/link'
import PageLegale, { carte, H2, P, Liste, Fort, Lien, Tableau } from '@/app/components/public/PageLegale'

export const metadata = {
  title: 'Politique de confidentialité — BuyMonth',
}

const FINALITES = [
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
    'Mesurer l’audience du site',
    'Votre consentement, donné via le bandeau cookies (art. 6.1.a)',
    '13 mois',
  ],
  [
    'Respecter nos obligations légales (comptabilité, fiscalité)',
    'Obligation légale (art. 6.1.c)',
    'Jusqu’à 10 ans, selon les délais légaux de conservation comptable et fiscale',
  ],
]

const COOKIES = [
  [
    'Cookies strictement nécessaires',
    'Fonctionnement et sécurité du site, mémorisation de vos choix en matière de cookies',
    'Non requis',
  ],
  [
    'Cookies de mesure d’audience',
    'Statistiques de fréquentation pour améliorer le site',
    'Requis',
  ],
]

export default function ConfidentialitePage() {
  return (
    <PageLegale titre="Politique de confidentialité" maj="5 octobre 2026">
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
            et de navigateur, pages consultées, date et heure) et, selon vos choix, données issues des cookies
            (voir point 8).
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
        <Tableau entetes={['Finalité', 'Base légale (RGPD)', 'Durée de conservation']} lignes={FINALITES} />
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
            e-mails) et Stripe (paiement des abonnements des promoteurs). Le cas échéant, notre prestataire de
            mesure d&rsquo;audience.
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
          Un cookie est un petit fichier déposé sur votre appareil lors de votre visite. Le site utilise deux
          catégories de cookies.
        </P>
        <Tableau entetes={['Catégorie', 'À quoi ils servent', 'Votre accord']} lignes={COOKIES} />
        <P>
          La liste à jour des cookies utilisés (nom, fournisseur, durée) est accessible depuis le bandeau cookies
          ou sur simple demande à <Lien href="mailto:info@buymonth.be">info@buymonth.be</Lien>.
        </P>
        <P style={{ margin: 0 }}>
          Lors de votre première visite, un bandeau vous permet d&rsquo;accepter ou de refuser les cookies non
          nécessaires. Refuser est aussi simple qu&rsquo;accepter et n&rsquo;empêche pas d&rsquo;utiliser le site.
          Vous pouvez modifier votre choix à tout moment via le lien « Gérer les cookies » en bas de page, ou dans
          les réglages de votre navigateur.
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
    </PageLegale>
  )
}

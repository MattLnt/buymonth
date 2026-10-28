# Faux configurateur — banc de test de l'intégration partenaire

Maquette interne qui rejoue le parcours d'un configurateur de promoteur, pour tester
l'intégration BuyMonth de bout en bout. Aucun lien avec la société Vizion, et rien ici
n'est déployé : le dossier vit en dehors de `app/`.

Les deux bouts de l'intégration convenue avec Vizion :

1. **Mensualité en temps réel** — le configurateur appelle `POST /api/calculate-monthly`
   à chaque changement d'option et affiche la mensualité à côté du prix.
   (brief `docs/Specification_API_Buymonth.pdf`)
2. **Renvoi en fin de parcours** — le bouton envoie le visiteur sur `/simulateur` avec la
   configuration en paramètres d'URL, et le formulaire se pré-remplit.
   (accord du 07/07/2026, lecture des paramètres dans `lib/bienExterne.js`)

La clé API reste côté serveur : le navigateur n'appelle que ce serveur-ci, jamais BuyMonth
directement. C'est le montage recommandé à Vizion, qui évite d'exposer la clé dans la page.

## Lancer

```bash
node tools/faux-configurateur/serveur.js
```

Le configurateur écoute sur <http://localhost:4000> et vise `http://localhost:3123`
par défaut, c'est-à-dire le serveur de dev (`npx next dev -p 3123`).

Pour tester contre la production une fois déployé :

```bash
BUYMONTH=https://buymonth.be node tools/faux-configurateur/serveur.js
```

La clé est lue automatiquement dans `.env.local` (`VIZION_API_KEY`, première clé de la
liste). Elle peut aussi être passée en variable d'environnement.

## Ce que la page affiche

L'encart de droite montre, sous la mensualité, le détail de chaque appel : code HTTP,
temps de réponse, prix envoyé, prix financé, durée, taux et TAEG — ainsi que l'URL de
renvoi construite en direct. C'est ce qu'il faut regarder pour diagnostiquer.

## Attention

Soumettre le formulaire du simulateur **crée un vrai lead** dans la base pointée par
`.env.local`, et déclenche les emails de notification. En pointant sur la base de
production, penser à supprimer le lead de test ensuite.

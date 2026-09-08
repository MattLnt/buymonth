import { redirect } from 'next/navigation'

// Lancement : la home est la vitrine promoteur.
// L'écran de choix (accueil double entrée) est désactivé le temps que la partie
// particulier ne soit pas ouverte au public — il suffira de restaurer ce fichier pour le réactiver.
export default function Home() {
  redirect('/pro')
}
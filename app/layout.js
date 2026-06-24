import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BuyMonth — Votre bien immobilier en mensualités',
  description: "BuyMonth permet aux promoteurs et agences d'afficher leurs biens immobiliers en mensualité plutôt qu'en prix total. Simulez votre capacité d'emprunt en quelques clics.",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
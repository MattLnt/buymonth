import { Fraunces, Montserrat } from 'next/font/google'
import './globals.css'
import SessionProviderWrapper from '@/app/components/SessionProviderWrapper'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://buymonth.be'),
  title: {
    default: 'BuyMonth — Votre bien immobilier en mensualités',
    template: '%s — BuyMonth',
  },
  description:
    "BuyMonth permet aux promoteurs et agences d'afficher leurs biens immobiliers en mensualité plutôt qu'en prix total. Simulez votre capacité d'emprunt en quelques clics.",
  keywords: [
    'BuyMonth',
    'immobilier',
    'mensualité',
    'promoteur',
    'simulateur de crédit',
    'capacité d\'emprunt',
    'Belgique',
  ],
  authors: [{ name: 'BuyMonth' }],
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_BE',
    url: 'https://buymonth.be',
    siteName: 'BuyMonth',
    title: 'BuyMonth — Votre bien immobilier en mensualités',
    description:
      "Affichez et visualisez chaque bien immobilier en mensualité plutôt qu'en prix total.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuyMonth — Votre bien immobilier en mensualités',
    description:
      "Affichez et visualisez chaque bien immobilier en mensualité plutôt qu'en prix total.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  themeColor: '#183b5e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${montserrat.variable}`}>
      <body className={montserrat.className} suppressHydrationWarning>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
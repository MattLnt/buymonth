import { Fraunces, Montserrat } from 'next/font/google'
import './globals.css'
import SessionProviderWrapper from '@/app/components/SessionProviderWrapper'
import { LangProvider } from '@/app/components/i18n/LangProvider'
import { getLang } from '@/lib/i18n/server'

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

const META = {
  fr: {
    title: 'BuyMonth — Votre bien immobilier en mensualités',
    description:
      "BuyMonth permet aux promoteurs et agences d'afficher leurs biens immobiliers en mensualité plutôt qu'en prix total. Simulez votre capacité d'emprunt en quelques clics.",
    short: "Affichez et visualisez chaque bien immobilier en mensualité plutôt qu'en prix total.",
    keywords: ['BuyMonth', 'immobilier', 'mensualité', 'promoteur', 'simulateur de crédit', "capacité d'emprunt", 'Belgique'],
    og: 'fr_BE',
  },
  nl: {
    title: 'BuyMonth — Uw vastgoed in maandbedragen',
    description:
      'Met BuyMonth tonen projectontwikkelaars en vastgoedkantoren hun panden in maandbedragen in plaats van de totale prijs. Bereken uw leencapaciteit in enkele klikken.',
    short: 'Toon en bekijk elk vastgoed in maandbedragen in plaats van de totale prijs.',
    keywords: ['BuyMonth', 'vastgoed', 'maandbedrag', 'projectontwikkelaar', 'kredietsimulator', 'leencapaciteit', 'België'],
    og: 'nl_BE',
  },
}

export async function generateMetadata() {
  const lang = await getLang()
  const m = META[lang]
  return {
    metadataBase: new URL('https://buymonth.be'),
    title: { default: m.title, template: '%s — BuyMonth' },
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: 'BuyMonth' }],
    icons: { icon: '/favicon.ico' },
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: m.og,
      alternateLocale: lang === 'nl' ? ['fr_BE'] : ['nl_BE'],
      url: 'https://buymonth.be',
      siteName: 'BuyMonth',
      title: m.title,
      description: m.short,
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.short },
    robots: { index: true, follow: true },
  }
}

export const viewport = {
  themeColor: '#183b5e',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }) {
  const lang = await getLang()
  return (
    <html lang={lang} className={`${fraunces.variable} ${montserrat.variable}`}>
      <body className={montserrat.className} suppressHydrationWarning>
        <SessionProviderWrapper>
          <LangProvider lang={lang}>
            {children}
          </LangProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
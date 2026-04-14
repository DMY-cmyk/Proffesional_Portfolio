import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { siteMetadata } from './metadata'
import { ThemeProvider } from '@/hooks/use-theme'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PageTransition } from '@/components/motion/page-transition'
import { JsonLd } from '@/components/layout/json-ld'
import { PreloadLinks } from '@/components/layout/preload-links'
import { ClientMotion } from '@/components/motion/client-motion'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const newsreader = Newsreader({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata = siteMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';if(t==='dark')document.documentElement.classList.add('dark')})()`,
          }}
        />
        <PreloadLinks />
      </head>
      <body className="min-h-screen">
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <JsonLd />
        <ThemeProvider>
          <ClientMotion />
          <Navbar />
          <PageTransition>
            <main id="main-content" className="pt-24">{children}</main>
          </PageTransition>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
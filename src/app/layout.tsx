import dynamic from 'next/dynamic'
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { siteMetadata } from './metadata'
import { ThemeProvider } from '@/hooks/use-theme'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CustomCursor } from '@/components/motion/custom-cursor'
import { PageTransition } from '@/components/motion/page-transition'
import { JsonLd } from '@/components/layout/json-ld'

const AuroraBackground = dynamic(
  () => import('@/components/motion/aurora-background').then((m) => ({ default: m.AuroraBackground })),
  { loading: () => null }
)

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: 'italic',
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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <JsonLd />
        <ThemeProvider>
          <AuroraBackground />
          <CustomCursor />
          <Navbar />
          <PageTransition>
            <main className="pt-16">{children}</main>
          </PageTransition>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { siteMetadata } from './metadata'
import { ThemeProvider } from '@/hooks/use-theme'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AuroraBackground } from '@/components/motion/aurora-background'
import { CustomCursor } from '@/components/motion/custom-cursor'
import { PageTransition } from '@/components/motion/page-transition'
import { JsonLd } from '@/components/layout/json-ld'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = siteMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
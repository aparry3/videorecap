import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import CookieBanner from '@/components/cookies/CookieBanner'
import { CookieConsentProvider } from '@/components/cookies/CookieConsentContext'
import {UserProvider} from '@auth0/nextjs-auth0/client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Video Greeting Cards - Better Letter Card Co.',
  description: 'Send a video with your next greeting card. Upload your own photo and video, and Better Letter will automatically mail a physcial card that your loved ones can scan to watch your video.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload stylesheet" href="https://fonts.googleapis.com/css2?family=Cutive&family=Homemade+Apple&family=Montagu+Slab:opsz,wght@16..144,200;16..144,700&family=Montserrat:wght@400;700&family=Whisper&display=swap"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" id="viewportMeta" />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsentProvider>
          <UserProvider>
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ? (
              <GoogleAnalytics ga_id= 
              {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
            ) : null}
          </UserProvider>
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  )
}

import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  preload: false,
});

// Metadata
export const metadata = {
  title: {
    default: 'College Event Platform',
    template: '%s | College Event Platform',
  },
  description: 'Luxury college event and club management platform with modern design',
  keywords: ['college', 'events', 'clubs', 'management', 'platform', 'luxury'],
  authors: [{ name: 'College Event Platform Team' }],
  creator: 'College Event Platform',
  publisher: 'College Event Platform',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'College Event Platform',
    description: 'Luxury college event and club management platform',
    siteName: 'College Event Platform',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'College Event Platform',
    description: 'Luxury college event and club management platform',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Manifest
  manifest: '/site.webmanifest',
};

// Viewport configuration (separate export for Next.js 14)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// Root layout component
export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={cn(
        'dark', // Force dark mode for luxury theme
        inter.variable,
        plusJakarta.variable,
        jetbrainsMono.variable
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        

      </head>
      
      <body 
        className={cn(
          'min-h-screen bg-bg-primary font-inter antialiased',
          'selection:bg-accent-primary/30 selection:text-white'
        )}
        suppressHydrationWarning
      >
        {/* Background gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary pointer-events-none" />
        
        {/* Ambient light effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontFamily: 'var(--font-inter)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        
        {/* Development tools (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="glass-morphism rounded-lg p-2 text-xs text-chrome-300 font-mono">
              <div>Mode: {process.env.NODE_ENV}</div>
              <div>API: {process.env.NEXT_PUBLIC_API_URL}</div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
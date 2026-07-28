import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { QueryProvider } from '@/components/layout/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils/cn';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IRON Creator OS — AI-Powered Content Engine',
    template: '%s | IRON Creator OS',
  },
  description:
    'Turn one livestream into a complete content engine. AI automatically detects viral moments, generates clips with captions and hooks, then publishes them across every social platform.',
  keywords: [
    'livestream',
    'clips',
    'AI',
    'content creation',
    'Twitch',
    'YouTube',
    'TikTok',
    'Kick',
    'social media publishing',
  ],
  authors: [{ name: 'IRON Creator OS' }],
  creator: 'IRON Creator OS',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'IRON Creator OS',
    title: 'IRON Creator OS — AI-Powered Content Engine',
    description:
      'Turn one livestream into a complete content engine. AI clips, captions, hooks, and publishing — all automatic.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRON Creator OS — AI-Powered Content Engine',
    description:
      'Turn one livestream into a complete content engine. AI clips, captions, hooks, and publishing — all automatic.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(inter.variable, jetbrainsMono.variable, 'dark')}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
            <QueryProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className: 'glass-elevated',
                  duration: 4000,
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

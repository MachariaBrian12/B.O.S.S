import type { Metadata } from 'next';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import CookieBanner from '@/components/CookieBanner';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { SentryUserSync } from '@/components/SentryUserSync';
import { PostHogProvider } from '@/components/PostHogProvider';

export const metadata: Metadata = {
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }],
    apple: '/apple-touch-icon.png',
  },
  title: 'B.O.S.S',
  description: 'AI SaaS Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <PostHogProvider>
        <AccessibilityProvider>
        <SentryUserSync />
        <CurrencyProvider>
          {children}
          <CookieBanner />
          <AccessibilityWidget />
        </CurrencyProvider>
        </AccessibilityProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

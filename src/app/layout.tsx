import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from '@/hooks/useSession';
import faviconSvg from '@/assets/images/favicon.svg';

const siteName = 'Inventory Management';
const siteDescription = 'Enterprise inventory control, warehouse tracking, and stock flow management.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  icons: {
    icon: { url: faviconSvg.src, type: 'image/svg+xml' },
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

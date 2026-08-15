import type { Metadata } from 'next';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SkipLink } from '@/components/layout/SkipLink';
import { site } from '@/content';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const headlineFont = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-headline', display: 'swap' });

export const metadata: Metadata = {
  // Required for per-project OG images (page.tsx's generateMetadata) to
  // resolve as absolute URLs instead of relative paths that social
  // crawlers can't follow. Override via NEXT_PUBLIC_SITE_URL if the
  // deploy target changes from the current Firebase Hosting URL.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-q2zw3.web.app'),
  title: `${site.name} - ${site.title}`,
  description: `Portfolio of ${site.name}, a ${site.title.toLowerCase()} and full-stack developer.`,
};

// Runs before hydration so the correct theme class is on <html> for the
// very first paint — otherwise every dark-mode visitor sees a light flash.
// Must stay in sync with ThemeProvider's resolveTheme() and storageKey.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('portfolio-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, headlineFont.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-body antialiased">
        <SkipLink />
        <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

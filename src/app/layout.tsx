import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { site } from '@/content';

export const metadata: Metadata = {
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sour+Gummy:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

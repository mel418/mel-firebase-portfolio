import type { SiteIdentity } from './types';

/**
 * Single source of truth for identity/bio/socials/avatar.
 * Previously duplicated 2-5x across page.tsx, RightNowPlayingPanel.tsx,
 * AppSidebar.tsx, and MobileBottomNav.tsx with slightly different wording
 * each time — this file is the fix.
 */
export const site: SiteIdentity = {
  name: 'Melody Gatan',
  title: 'Software Engineer',
  roles: ['Full-Stack', 'AI Applications', 'Real-Time Systems'],
  location: 'Bellflower, CA',
  status: 'Open to Work',
  headline: 'I build full-stack products with AI and real-time data, and ship them to real users.',
  bio: "B.S. in Computer Science from CSULB (Dec 2025). I built a Claude-powered finance app with Plaid and Stripe, and an ordering kiosk that handled 200+ orders at a corporate event. I'm looking for a software engineering role where I can keep shipping.",
  bioShort: "Full-stack engineer & CSULB CS grad. I ship AI-powered and real-time apps. Open to work! \u{1F44B}",
  email: 'melodygatan@gmail.com',
  resumeHref: '/Melody_Gatan_Resume.pdf',
  avatar: {
    src: '/PFP2.webp',
    alt: 'Melody Gatan',
    width: 600,
    height: 600,
    tint: '142 34% 18%', // matches --forest-700 (globals.css)
  },
  heroArtwork: {
    src: '/lofiPFP.webp',
    alt: 'Melody Gatan',
    width: 900,
    height: 506,
    tint: '142 34% 18%',
  },
  socials: [
    { type: 'github', label: 'GitHub', href: 'https://github.com/mel418' },
    { type: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/melody-gatan' },
    { type: 'email', label: 'Email', href: 'mailto:melodygatan@gmail.com' },
  ],
  highlights: [
    { value: '3.66', label: 'GPA', detail: 'B.S. Computer Science, CSULB' },
    { value: '200+', label: 'live orders', detail: 'one corporate event, one kiosk' },
    { value: '5', label: 'honors terms', detail: "3× President's, 2× Dean's List" },
    { value: '2nd', label: 'place', detail: 'MarinaHacks 2023' },
  ],
};

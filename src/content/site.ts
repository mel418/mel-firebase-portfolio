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
  roles: ['Full-Stack Developer', 'AI Tinkerer', 'Matcha Connoisseur'],
  location: 'Bellflower, CA',
  status: 'Open to Work',
  bio: "I build full-stack apps by day and drink way too much matcha by night. Fresh CS grad from CSULB, 2nd place at MarinaHacks, and always looking for the next thing to build.",
  bioShort: "Full-stack engineer & CS grad from CSULB. I build production apps by day and drink too much matcha by night. Open to work! \u{1F44B}",
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
};

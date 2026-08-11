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
    src: '/PFP2.JPG',
    alt: 'Melody Gatan',
    width: 912,
    height: 912,
    tint: '100 30% 50%',
  },
  heroArtwork: {
    src: '/lofiPFP.png',
    alt: 'Melody Gatan',
    width: 1024,
    height: 576,
    tint: '100 30% 50%',
  },
  socials: [
    { type: 'github', label: 'GitHub', href: 'https://github.com/mel418' },
    { type: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/melody-gatan' },
    { type: 'email', label: 'Email', href: 'mailto:melodygatan@gmail.com' },
  ],
};

import { Github, Linkedin, FileText } from 'lucide-react';
import { CopyEmailButton } from '@/components/contact/ContactActions';
import { site } from '@/content';

const iconFor = { github: Github, linkedin: Linkedin } as const;

/** Contact, replacing the old mailto: form — which silently fails to
 *  submit in every modern browser, on a job-seeking portfolio. A large,
 *  unmissable email address plus a copy button is more reliable than a
 *  form that looks like it works but doesn't, and needs no backend. */
export function SideB() {
  const emailSocial = site.socials.find((s) => s.type === 'email')!;
  const externalSocials = site.socials.filter((s) => s.type === 'github' || s.type === 'linkedin');

  return (
    <div className="space-y-8">
      <p className="max-w-lg text-base leading-relaxed text-foreground/80 sm:text-lg">
        Have a question or want to build something together? My inbox is always open — I&apos;ll get back to you as soon as I can.
      </p>

      <div className="space-y-3">
        <a
          href={emailSocial.href}
          className="block break-all font-headline text-3xl font-bold tracking-tight text-accent-ink transition-colors hover:text-primary sm:text-4xl"
        >
          {site.email}
        </a>
        <CopyEmailButton email={site.email} />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
        {externalSocials.map((social) => {
          const Icon = iconFor[social.type as keyof typeof iconFor];
          return (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              {social.label}
            </a>
          );
        })}
        <a
          href={site.resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
        >
          <FileText className="h-4 w-4" />
          Resume
        </a>
      </div>
    </div>
  );
}

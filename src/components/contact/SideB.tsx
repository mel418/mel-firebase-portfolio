import { Github, Linkedin, FileText } from 'lucide-react';
import { CopyEmailButton } from '@/components/contact/ContactActions';
import { VinylRecord } from '@/components/props/VinylRecord';
import { site } from '@/content';

const iconFor = { github: Github, linkedin: Linkedin } as const;

const PILL =
  'inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-accent-ink';

/** Contact, replacing the old mailto: form — which silently fails to submit
 *  in every modern browser, on a job-seeking portfolio. A large, unmissable
 *  email address plus a copy button is more reliable than a form that looks
 *  like it works but doesn't, and needs no backend. */
export function SideB() {
  const emailSocial = site.socials.find((s) => s.type === 'email')!;
  const externalSocials = site.socials.filter((s) => s.type === 'github' || s.type === 'linkedin');

  return (
    <div className="grid items-center gap-16 md:grid-cols-[1fr_13rem]">
      <div className="space-y-10">
        <p className="max-w-lg text-base leading-relaxed text-foreground/80 sm:text-lg">
          I&apos;m looking for a full-time software engineering role. If you&apos;re hiring, or just want to talk about something I built, email is the fastest way to reach me.
        </p>

        <div className="space-y-5">
          <a
            href={emailSocial.href}
            className="block break-all font-headline text-2xl font-bold tracking-tight text-accent-ink transition-colors hover:text-primary sm:text-4xl"
          >
            {site.email}
          </a>
          <CopyEmailButton email={site.email} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {externalSocials.map((social) => {
            const Icon = iconFor[social.type as keyof typeof iconFor];
            return (
              <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className={PILL}>
                <Icon className="h-4 w-4" />
                {social.label}
              </a>
            );
          })}
          <a href={site.resumeHref} target="_blank" rel="noopener noreferrer" className={PILL}>
            <FileText className="h-4 w-4" />
            Résumé
          </a>
        </div>
      </div>

      <VinylRecord className="mx-auto w-44 md:w-full" />
    </div>
  );
}

import { ImageResponse } from 'next/og';
import { site } from '@/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Default share card for the base site — project pages get their own via
// page.tsx's generateMetadata (their own artwork + tagline). This is what
// renders for the bare URL or any section anchor.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'hsl(142, 34%, 18%)',
          fontFamily: 'sans-serif',
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'hsl(105, 18%, 60%)',
          }}
        >
          Now Playing
        </span>
        <span
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: 'hsl(42, 33%, 96%)',
            marginTop: 24,
          }}
        >
          {site.name}
        </span>
        <span
          style={{
            fontSize: 34,
            color: 'hsl(105, 18%, 60%)',
            marginTop: 20,
          }}
        >
          {site.roles.join(' · ')}
        </span>
      </div>
    ),
    { ...size }
  );
}

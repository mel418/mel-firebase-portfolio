import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// A simple record-and-monogram mark — no external asset needed. Matches
// the site's forest-green signature color (see --forest-700, globals.css).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'hsl(142, 34%, 18%)',
          borderRadius: '50%',
        }}
      >
        <span
          style={{
            fontFamily: 'sans-serif',
            fontSize: 17,
            fontWeight: 700,
            color: 'hsl(42, 33%, 96%)',
            letterSpacing: '-0.02em',
          }}
        >
          M
        </span>
      </div>
    ),
    { ...size }
  );
}

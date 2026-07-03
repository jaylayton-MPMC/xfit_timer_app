import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '110px',
      }}
    >
      <div
        style={{
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 160,
          color: '#22c55e',
          letterSpacing: '-6px',
          lineHeight: 1,
        }}
      >
        WOD
      </div>
    </div>,
    size,
  );
}

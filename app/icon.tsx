import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 512,
        height: 512,
        background: '#050505',
        borderRadius: '104px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Arc ring — text nodes not supported by @vercel/og SVG renderer, use div overlay */}
      <svg width="512" height="512" viewBox="0 0 512 512" style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle cx="256" cy="256" r="180" fill="none" stroke="#161616" strokeWidth="54"/>
        <path d="M 256,76 A 180,180 0 0,1 422.9,323.5" fill="none" stroke="#22c55e" strokeWidth="46"/>
        <path d="M 411.9,346 A 180,180 0 0,1 114.2,366.9" fill="none" stroke="#3b82f6" strokeWidth="46"/>
        <path d="M 100.1,346 A 180,180 0 0,1 231.0,77.8" fill="none" stroke="#a855f7" strokeWidth="46"/>
      </svg>
      <div
        style={{
          position: 'absolute',
          color: '#f5f5f5',
          fontSize: 108,
          fontWeight: 900,
          fontFamily: 'Arial Black, Arial, sans-serif',
          letterSpacing: '-3px',
          lineHeight: 1,
          marginTop: '32px',
          display: 'flex',
        }}
      >
        WOD
      </div>
    </div>,
    size,
  );
}

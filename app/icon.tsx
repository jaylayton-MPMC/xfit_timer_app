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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '104px',
      }}
    >
      <svg width="512" height="512" viewBox="0 0 512 512">
        <circle cx="256" cy="256" r="180" fill="none" stroke="#161616" strokeWidth="54"/>
        <path d="M 256,76 A 180,180 0 0,1 422.9,323.5" fill="none" stroke="#22c55e" strokeWidth="46"/>
        <path d="M 411.9,346 A 180,180 0 0,1 114.2,366.9" fill="none" stroke="#3b82f6" strokeWidth="46"/>
        <path d="M 100.1,346 A 180,180 0 0,1 231.0,77.8" fill="none" stroke="#a855f7" strokeWidth="46"/>
        <text x="256" y="288" fontFamily="Arial Black,Arial,sans-serif" fontSize="108" fontWeight="900" fill="#f5f5f5" textAnchor="middle">WOD</text>
      </svg>
    </div>,
    size,
  );
}

/* ============================================================
   P6-T3: CallIcon — Hand-drawn SVG video-call icon
   REQ-001 Phase 6 | 小星 Star Kids

   A handset-style phone with a small screen hinting at video.
   Uneven stroke widths, deep brown #6B4226.
   ============================================================ */

export function CallIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Handset body — slightly asymmetrical rounded rect */}
      <rect
        x="3.5"
        y="9"
        width="11"
        height="17"
        rx="3.5"
        ry="4"
        stroke="#6B4226"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Screen area inside handset — warm semi-transparent fill */}
      <rect
        x="5.5"
        y="11"
        width="7"
        height="9"
        rx="1.5"
        ry="1.8"
        fill="rgba(232, 197, 109, 0.18)"
        stroke="#6B4226"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Little star icon on screen */}
      <path
        d="M8.5 14 L9.2 15.2 L10.5 15.4 L9.8 16.4 L9.9 17.7 L8.5 17 L7.1 17.7 L7.2 16.4 L6.5 15.4 L7.8 15.2 Z"
        fill="rgba(232, 197, 109, 0.35)"
        stroke="#6B4226"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />

      {/* Speaker grille — small uneven lines */}
      <line x1="5.5" y1="22.5" x2="11" y2="22" stroke="#6B4226" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="24" x2="11.5" y2="24.2" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />

      {/* Handset curve (receiver) — top arc */}
      <path
        d="M13 11 Q18 4 24 8.5"
        stroke="#6B4226"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13 14 Q17.5 8 23 12"
        stroke="#6B4226"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Handset curve (receiver) — bottom arc */}
      <path
        d="M13 24 Q18 30 24 25.5"
        stroke="#6B4226"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13 21 Q17.5 26 23 22"
        stroke="#6B4226"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Connecting vertical line */}
      <line x1="23.5" y1="12" x2="23.5" y2="22.5" stroke="#6B4226" strokeWidth="1.8" strokeLinecap="round" />

      {/* Small lens dot on the curve */}
      <circle cx="20" cy="17" r="1.8" fill="rgba(107, 66, 38, 0.5)" stroke="#6B4226" strokeWidth="1" />
    </svg>
  )
}

export default CallIcon

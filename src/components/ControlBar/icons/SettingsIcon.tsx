/* ============================================================
   P6-T3: SettingsIcon — Hand-drawn SVG gear/settings icon
   REQ-001 Phase 6 | 小星 Star Kids

   A gear with irregular teeth — hand-drawn aesthetic.
   Uneven stroke widths, deep brown #6B4226.
   ============================================================ */

export function SettingsIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer gear teeth — drawn as individual bumps for hand-drawn feel */}
      {/* Top teeth */}
      <path d="M14.5 2 L15.5 4.5 L16.5 2" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 3 L11.5 5.5 L10 3.5" stroke="#6B4226" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 3 L21 3.5 L19.5 5.5" stroke="#6B4226" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Right teeth */}
      <path d="M29 14.5 L26.5 15.5 L29 16.5" stroke="#6B4226" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 11 L25.5 11.5 L28.5 10" stroke="#6B4226" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 19.5 L25.5 21 L28.5 19.5" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Bottom teeth */}
      <path d="M16.5 29 L15.5 26.5 L14.5 29" stroke="#6B4226" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 28 L19.5 25.5 L19.5 28.5" stroke="#6B4226" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 28.5 L12.5 25.5 L10 28" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Left teeth */}
      <path d="M3 16.5 L5.5 15.5 L3 14.5" stroke="#6B4226" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5 L6.5 21 L3.5 19.5" stroke="#6B4226" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 11 L6.5 11.5 L3.5 10" stroke="#6B4226" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />

      {/* Gear body — slightly irregular circle */}
      <circle
        cx="16"
        cy="15.5"
        r="8.5"
        stroke="#6B4226"
        strokeWidth="2.5"
      />

      {/* Inner circle — slight offset for hand-drawn feel */}
      <circle
        cx="16.2"
        cy="15.3"
        r="4"
        stroke="#6B4226"
        strokeWidth="1.5"
      />

      {/* Center dot */}
      <circle
        cx="16"
        cy="15.5"
        r="1.8"
        fill="rgba(232, 197, 109, 0.22)"
        stroke="#6B4226"
        strokeWidth="1.2"
      />

      {/* Spokes — slightly irregular */}
      <line x1="16" y1="8" x2="16" y2="11.5" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16.3" y1="19.5" x2="15.8" y2="23" stroke="#6B4226" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="9" y1="15.5" x2="12" y2="15" stroke="#6B4226" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="16" x2="23.5" y2="15.5" stroke="#6B4226" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default SettingsIcon

/* ============================================================
   P6-T3: StarIcon — Hand-drawn SVG star/favorite icon
   REQ-001 Phase 6 | 小星 Star Kids

   A 5-pointed star with warm semi-transparent fill.
   Uneven stroke widths, deep brown #6B4226.
   Slightly irregular points for hand-drawn charm.
   ============================================================ */

export function StarIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main star shape — 5-pointed with irregular vertices */}
      <path
        d="
          M16.2 3.5
          L19 12 L18.8 12.2
          L27.5 13.5 L27.5 14
          L21.5 20 L21.8 20.8
          L22.5 28.5 L21.5 28
          L16.2 24 L15.8 24.2
          L10.8 28 L9.8 28.5
          L10.5 20.8 L10.8 20
          L4.5 14 L4.5 13.5
          L13 12.2 L12.8 12
          Z
        "
        fill="rgba(232, 197, 109, 0.2)"
        stroke="#6B4226"
        strokeWidth="2.3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Inner star highlight — smaller, lighter */}
      <path
        d="
          M16.1 8
          L17.6 13 L17.5 13.2
          L22.8 14 L17.2 17.8 L17.4 18.5
          L18 23 L16.1 21.5 L15.8 21.6
          L13.8 23 L14.4 18.5 L14.6 17.8
          L9 14 L14.2 13.2 L14.1 13
          Z
        "
        fill="rgba(245, 215, 110, 0.12)"
        stroke="#6B4226"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Small sparkle dots around the star */}
      <circle cx="5" cy="9" r="1" fill="rgba(232, 197, 109, 0.5)" />
      <circle cx="27" cy="8" r="0.8" fill="rgba(232, 197, 109, 0.4)" />
      <circle cx="4.5" cy="22" r="0.7" fill="rgba(232, 197, 109, 0.35)" />
      <circle cx="28" cy="23" r="0.9" fill="rgba(232, 197, 109, 0.45)" />
    </svg>
  )
}

export default StarIcon

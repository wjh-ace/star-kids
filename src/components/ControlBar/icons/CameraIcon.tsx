/* ============================================================
   P6-T3: CameraIcon — Hand-drawn SVG camera icon
   REQ-001 Phase 6 | 小星 Star Kids

   A camera body with lens, slightly irregular for hand-drawn feel.
   Uneven stroke widths, deep brown #6B4226.
   ============================================================ */

export function CameraIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Camera body — slightly irregular rectangle */}
      <rect
        x="4"
        y="10"
        width="23"
        height="16"
        rx="3.5"
        ry="4"
        stroke="#6B4226"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Flash/viewfinder bump on top — slightly asymmetric */}
      <path
        d="M11 9.5 L12.5 6.5 L20 6 L21.5 9"
        stroke="#6B4226"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Flash dot — small filled circle with warm tint */}
      <circle
        cx="24"
        cy="12.5"
        r="2.8"
        fill="rgba(232, 197, 109, 0.2)"
        stroke="#6B4226"
        strokeWidth="1.7"
      />

      {/* Lens — outer ring, slightly off-perfect circle */}
      <ellipse
        cx="14"
        cy="18.5"
        rx="6.5"
        ry="6.8"
        stroke="#6B4226"
        strokeWidth="2.3"
      />

      {/* Lens — inner ring */}
      <ellipse
        cx="14.2"
        cy="18.3"
        rx="4"
        ry="4.2"
        stroke="#6B4226"
        strokeWidth="1.6"
      />

      {/* Lens — center reflection dot */}
      <circle
        cx="13"
        cy="16.5"
        r="1.5"
        fill="rgba(232, 197, 109, 0.25)"
        stroke="#6B4226"
        strokeWidth="1"
      />

      {/* Small decoration line on body — hand-drawn wobble */}
      <path
        d="M24 15 Q25 15.5 24.5 17 Q24.5 18.5 25 20"
        stroke="#6B4226"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bottom grip dots */}
      <circle cx="10" cy="24" r="0.7" fill="#6B4226" />
      <circle cx="14" cy="24" r="0.9" fill="#6B4226" />
      <circle cx="18" cy="24" r="0.7" fill="#6B4226" />
    </svg>
  )
}

export default CameraIcon

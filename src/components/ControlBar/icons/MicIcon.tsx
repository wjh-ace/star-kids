/* ============================================================
   P6-T3: MicIcon — Hand-drawn SVG microphone icon
   REQ-001 Phase 6 | 小星 Star Kids

   Uneven stroke widths simulate hand-drawn pen strokes.
   Deep brown #6B4226, no fill, slightly irregular paths.
   ============================================================ */

export function MicIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Mic body — slightly asymmetrical rounded rectangle */}
      <rect
        x="12.5"
        y="3"
        width="7"
        height="14"
        rx="3.8"
        ry="3.5"
        stroke="#6B4226"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner mic grill lines — varying stroke widths for hand-drawn feel */}
      <line
        x1="14"
        y1="8"
        x2="18"
        y2="8"
        stroke="#6B4226"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="13.5"
        y1="11"
        x2="18.5"
        y2="11.2"
        stroke="#6B4226"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="14.2"
        x2="18.2"
        y2="13.8"
        stroke="#6B4226"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Mic bottom arc — slightly uneven */}
      <path
        d="M10 17.5 Q12 19 14 21 Q16 22.5 18 21 Q20 19 22 17.5"
        stroke="#6B4226"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mic stand — vertical line with slight wobble */}
      <path
        d="M15.8 21 L16 28 L16.2 28.5"
        stroke="#6B4226"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mic base — slightly tilted horizontal line */}
      <line
        x1="12"
        y1="29"
        x2="20.5"
        y2="28.5"
        stroke="#6B4226"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sound wave left */}
      <path
        d="M5 10.5 Q3.5 16 5.5 21.5"
        stroke="#6B4226"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sound wave right */}
      <path
        d="M27 10.5 Q28.5 16 26.5 21.5"
        stroke="#6B4226"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export default MicIcon

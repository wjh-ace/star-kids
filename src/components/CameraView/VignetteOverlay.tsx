/* ============================================================
   P3-T3b: VignetteOverlay — Soft Dark Corners + Warm Light
   REQ-001 Phase 3 | 小星 Star Kids

   Renders a vignette effect on top of the camera video:
   - Darkened edges (inset box-shadow)
   - Warm light scattering inward from the frame edges

   The vignette is subtle — it should not obscure the video,
   only add depth and warmth, as if looking through a real
   wooden window frame.
   ============================================================ */

function VignetteOverlay() {
  return (
    <>
      {/* ====================================================
          Dark vignette — inset shadow creates darkened edges
          ==================================================== */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 80px 20px rgba(0, 0, 0, 0.25)',
        }}
      />

      {/* ====================================================
          Warm light — subtle amber glow radiating inward
          from the edges, simulating warm cabin light
          ==================================================== */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          background: [
            'radial-gradient(',
            'ellipse 90% 90% at 50% 50%,',
            'transparent 60%,',
            'rgba(232, 197, 109, 0.08) 85%,',
            'rgba(232, 197, 109, 0.15) 100%',
            ')',
          ].join(''),
        }}
      />
    </>
  )
}

export default VignetteOverlay

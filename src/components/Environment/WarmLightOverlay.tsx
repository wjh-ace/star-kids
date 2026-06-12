/**
 * WarmLightOverlay — full-screen warm directional light gradient (UX-R15)
 * Simulates natural light coming from the upper-left (window direction).
 * Uses radial-gradient to create a soft, non-uniform warm light cast.
 */
function WarmLightOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background:
          'radial-gradient(ellipse at 25% 25%, transparent 0%, rgba(107,66,38,0.08) 60%, rgba(107,66,38,0.15) 100%)',
      }}
    />
  )
}

export default WarmLightOverlay

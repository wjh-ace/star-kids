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
          'radial-gradient(ellipse 80% 60% at 25% 25%, rgba(255,220,160,0.12) 0%, rgba(255,200,120,0.05) 40%, transparent 70%)',
      }}
    />
  )
}

export default WarmLightOverlay

/**
 * NightLamp — bottom-right warm lamp with radial-glow halo
 * Simple lamp stand + shade + warm light aura
 */
function NightLamp() {
  return (
    <div
      style={{
        position: 'fixed',
        right: '8%',
        bottom: '5%',
        width: '60px',
        height: '100px',
        filter: 'blur(4px)',
        opacity: 0.5,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'softPulse 3s ease-in-out infinite',
      }}
    >
      {/* Warm light glow halo — rendered behind the lamp */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '80px',
          background:
            'radial-gradient(circle at center, rgba(245,215,110,0.6) 0%, rgba(232,197,109,0.25) 35%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Lamp shade — inverted trapezoid / triangle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '22px solid var(--color-wood-light)',
          opacity: 0.9,
        }}
      />
      {/* Shade bottom cap */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '4px',
          backgroundColor: 'var(--color-wood-mid)',
          borderRadius: '2px',
        }}
      />

      {/* Lamp pole / body */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '6px',
          height: '54px',
          backgroundColor: 'var(--color-wood-dark)',
          borderRadius: '2px',
        }}
      />

      {/* Lamp base — wider rounded rectangle */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '36px',
          height: '10px',
          backgroundColor: 'var(--color-wood-dark)',
          borderRadius: '3px 3px 5px 5px',
        }}
      />
      {/* Base top highlight */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '5px',
          backgroundColor: 'var(--color-wood-mid)',
          borderRadius: '3px',
        }}
      />
    </div>
  )
}

export default NightLamp

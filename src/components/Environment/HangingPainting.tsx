/**
 * HangingPainting — top-right corner blurred wall decoration (UX-R14)
 * Simple wooden frame + canvas, slight tilt, gentle sway animation
 */
function HangingPainting() {
  return (
    <div
      style={{
        position: 'fixed',
        right: '3.2%',
        top: '5.3%',
        width: '90px',
        height: '110px',
        filter: 'blur(5px)',
        opacity: 0.5,
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'rotate(-2deg)',
        transformOrigin: 'top center',
        animation: 'paintingSway 8s ease-in-out infinite',
      }}
    >
      {/* Hanging wire / string */}
      <div
        style={{
          position: 'absolute',
          top: '-18px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '20px',
          backgroundColor: 'var(--color-wood-dark)',
        }}
      />
      {/* Nail / hook */}
      <div
        style={{
          position: 'absolute',
          top: '-18px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '6px',
          height: '3px',
          backgroundColor: 'var(--color-honey)',
          borderRadius: '1px',
        }}
      />

      {/* Outer frame */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '6px solid var(--color-wood-mid)',
          borderRadius: '5px 3px 4px 2px',
          backgroundColor: 'var(--color-wood-dark)',
          boxShadow: `
            inset 1px 2px 8px rgba(62, 30, 15, 0.25),
            2px 3px 8px rgba(107,66,38,0.3)
          `,
        }}
      />

      {/* Inner canvas — warm sky/star scene */}
      <div
        style={{
          position: 'absolute',
          inset: '6px',
          backgroundColor: '#3A2F5C',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        {/* Moon / sky blob */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '10px',
            width: '16px',
            height: '16px',
            backgroundColor: 'var(--color-moon-white)',
            borderRadius: '50%',
            opacity: 0.8,
          }}
        />
        {/* Small stars */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '10px',
            width: '3px',
            height: '3px',
            backgroundColor: 'var(--color-star-gold)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '30px',
            width: '2px',
            height: '2px',
            backgroundColor: 'var(--color-star-gold)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '18px',
            width: '2px',
            height: '2px',
            backgroundColor: 'var(--color-moon-white)',
            borderRadius: '50%',
            opacity: 0.6,
          }}
        />
        {/* Landscape — green hills */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '-10%',
            width: '60%',
            height: '35%',
            backgroundColor: 'var(--color-sage)',
            borderRadius: '50% 50% 0 0',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: '-5%',
            width: '65%',
            height: '28%',
            backgroundColor: 'var(--color-sage)',
            borderRadius: '50% 50% 0 0',
            opacity: 0.35,
          }}
        />
      </div>
    </div>
  )
}

export default HangingPainting

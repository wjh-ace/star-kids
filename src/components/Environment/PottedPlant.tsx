/**
 * PottedPlant — small potted plant silhouette
 * Used at bottom-left and bottom-right corners
 *
 * @param side — 'left' or 'right', controls positioning
 */
interface PottedPlantProps {
  side: 'left' | 'right'
}

function PottedPlant({ side }: PottedPlantProps) {
  const isLeft = side === 'left'

  return (
    <div
      style={{
        position: 'fixed',
        [isLeft ? 'left' : 'right']: isLeft ? '2.4%' : '1.8%',
        bottom: isLeft ? '4.7%' : '5.3%',
        width: '70px',
        height: '90px',
        filter: 'blur(5px)',
        opacity: 0.45,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* ===== Leaves (above the pot) ===== */}

      {/* Leaf 1 — main leaf, arches left */}
      <div
        style={{
          position: 'absolute',
          bottom: '38px',
          left: isLeft ? '10px' : '18px',
          width: '30px',
          height: '38px',
          backgroundColor: 'var(--color-sage)',
          borderRadius: '50% 50% 10% 10%',
          transform: isLeft ? 'rotate(-20deg)' : 'rotate(20deg)',
          opacity: 0.8,
        }}
      />

      {/* Leaf 2 — arches right */}
      <div
        style={{
          position: 'absolute',
          bottom: '38px',
          right: isLeft ? '10px' : '18px',
          width: '28px',
          height: '34px',
          backgroundColor: 'var(--color-sage)',
          borderRadius: '50% 50% 10% 10%',
          transform: isLeft ? 'rotate(15deg)' : 'rotate(-15deg)',
          opacity: 0.7,
        }}
      />

      {/* Leaf 3 — center, taller */}
      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '22px',
          height: '44px',
          backgroundColor: '#8BA078',
          borderRadius: '50% 50% 8% 8%',
          opacity: 0.85,
        }}
      />

      {/* Leaf 4 — small drooping leaf */}
      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          left: isLeft ? '28px' : '8px',
          width: '16px',
          height: '28px',
          backgroundColor: 'var(--color-sage)',
          borderRadius: '50% 50% 10% 10%',
          transform: isLeft ? 'rotate(35deg)' : 'rotate(-35deg)',
          opacity: 0.6,
        }}
      />

      {/* Small accent leaf with different shade */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: isLeft ? '8px' : '28px',
          width: '14px',
          height: '24px',
          backgroundColor: '#A8B898',
          borderRadius: '50% 50% 8% 8%',
          transform: isLeft ? 'rotate(-30deg)' : 'rotate(30deg)',
          opacity: 0.55,
        }}
      />

      {/* ===== Pot (trapezoid approximating a flower pot) ===== */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '44px',
          height: '38px',
          backgroundColor: 'var(--color-wood-mid)',
          borderRadius: '6px 6px 10px 10px',
          borderBottom: '4px solid var(--color-wood-dark)',
          borderTop: '2px solid var(--color-wood-light)',
        }}
      />

      {/* Pot rim — wider top strip */}
      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '52px',
          height: '8px',
          backgroundColor: 'var(--color-wood-light)',
          borderRadius: '4px 4px 2px 2px',
        }}
      />
    </div>
  )
}

export default PottedPlant

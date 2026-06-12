/* ============================================================
   P5-T4: SurroundingStars — Floating Stars Around Character
   REQ-001 Phase 5 | 小星 Star Kids

   Renders 5 small floating/twinkling stars around the
   character using CSS animation (floatingStar, twinkle).

   Each star has a unique animation delay for organic
   asynchronous movement.
   ============================================================ */

import { type FC } from 'react'

/** Inline SVG star path reused across all surrounding stars. */
const STAR_SVG = (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5 0L6.12 3.45L9.51 3.45L6.8 5.55L7.83 9L5 6.9L2.17 9L3.2 5.55L0.49 3.45L3.88 3.45L5 0Z"
      fill="currentColor"
    />
  </svg>
)

/**
 * Individual floating star positioned around the character.
 * Each star is absolutely positioned at different coordinates
 * with independent animation delays.
 */
function FloatingStar({
  top,
  left,
  right,
  bottom,
  size,
  animClass,
  delay,
}: {
  top?: string
  left?: string
  right?: string
  bottom?: string
  size: number
  animClass: string
  delay: string
}) {
  return (
    <div
      className={animClass}
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        color: 'var(--color-star-gold)',
        animationDelay: delay,
        opacity: 0,
      }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <path
          d="M5 0L6.12 3.45L9.51 3.45L6.8 5.55L7.83 9L5 6.9L2.17 9L3.2 5.55L0.49 3.45L3.88 3.45L5 0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

const STAR_CONFIGS = [
  {
    top: '8%',
    left: '-6%',
    size: 9,
    animation: 'surrounding-star--1',
  },
  {
    top: '2%',
    right: '-4%',
    size: 11,
    animation: 'surrounding-star--2',
  },
  {
    bottom: '18%',
    left: '-4%',
    size: 8,
    animation: 'surrounding-star--3',
  },
  {
    bottom: '10%',
    right: '-2%',
    size: 10,
    animation: 'surrounding-star--4',
  },
  {
    top: '42%',
    right: '-6%',
    size: 7,
    animation: 'surrounding-star--5',
  },
]

const SurroundingStars: FC = () => {
  return (
    <div className="star-surrounding" aria-hidden="true">
      {STAR_CONFIGS.map((cfg, i) => (
        <FloatingStar
          key={i}
          top={cfg.top}
          left={'left' in cfg ? cfg.left : undefined}
          right={'right' in cfg ? cfg.right : undefined}
          bottom={'bottom' in cfg ? cfg.bottom : undefined}
          size={cfg.size}
          animClass={cfg.animation}
          delay={`${i * 0.6}s`}
        />
      ))}
    </div>
  )
}

export default SurroundingStars

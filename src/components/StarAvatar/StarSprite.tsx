/* ============================================================
   P5-T2: StarSprite — Sprite Sheet Rendering Track (UX-R6)
   REQ-001 Phase 5 | 小星 Star Kids

   Renders the character from a sprite sheet PNG using
   CSS background-image + background-position + steps() animation.

   When no sprite sheet is available (spriteUrl is undefined),
   renders a simplified CSS placeholder that preserves the
   character silhouette and glow integration.
   ============================================================ */

import { type FC } from 'react'
import type { AnimationName } from '../../types/star'

interface StarSpriteProps {
  animation: AnimationName
  /** URL of the sprite sheet PNG. Falls back to CSS placeholder when absent. */
  spriteUrl?: string
}

const StarSprite: FC<StarSpriteProps> = ({ animation, spriteUrl }) => {
  // When sprite sheet is available, use background-image approach
  if (spriteUrl) {
    return (
      <div
        className={`star-sprite star-sprite--${animation}`}
        style={{
          backgroundImage: `url(${spriteUrl})`,
          backgroundSize: '600px 180px',
        }}
        aria-label="小星角色 (精灵图)"
      />
    )
  }

  // CSS placeholder fallback — simplified chibi silhouette
  return (
    <div
      className={`star-sprite--placeholder${animation === 'nod' ? ' star-head--nod' : ''}${animation === 'curious' ? ' star-head--curious' : ''}`}
      aria-label="小星角色 (占位)"
    >
      {/* Simple dot eyes on the placeholder */}
      <span
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '14px',
        }}
        aria-hidden="true"
      >
        <span
          style={{
            width: '8px',
            height: '9px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 50% 35%, #C4956A 0%, #4A2A5E 100%)',
            display: 'block',
          }}
        />
        <span
          style={{
            width: '8px',
            height: '9px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 50% 35%, #C4956A 0%, #4A2A5E 100%)',
            display: 'block',
          }}
        />
      </span>
    </div>
  )
}

export default StarSprite

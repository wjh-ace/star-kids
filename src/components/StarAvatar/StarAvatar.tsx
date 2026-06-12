/* ============================================================
   P5-T1: StarAvatar — Character Container Component
   REQ-001 Phase 5 | 小星 Star Kids

   Top-level character component that dispatches to the
   appropriate rendering track based on animationType:

   - 'css'    → StarHead + StarBody (pure CSS div-constructed)
   - 'sprite' → StarSprite (PNG sprite sheet, UX-R6)
   - 'lottie' → placeholder (designer-provided Lottie JSON later)

   All tracks share StarGlow (luminous outline) and
   SurroundingStars (floating companion stars).
   ============================================================ */

import { type FC } from 'react'
import type { StarAvatarProps } from '../../types/star'
import StarHead from './StarHead'
import StarBody from './StarBody'
import StarGlow from './StarGlow'
import StarSprite from './StarSprite'
import SurroundingStars from './SurroundingStars'
import './StarAvatar.css'

const StarAvatar: FC<StarAvatarProps> = ({
  animationType,
  currentAnimation,
  size = 'normal',
}) => {
  const containerClass = [
    'star-avatar',
    `star-avatar--${size}`,
    `star-avatar--${currentAnimation}`,
  ].join(' ')

  return (
    <div className={containerClass} aria-label="小星角色" role="img">
      {/* ── Luminous outline (shared across tracks) ── */}
      <StarGlow />

      {/* ── Surrounding floating stars (shared) ── */}
      <SurroundingStars />

      {/* ── CSS track: div-constructed character ── */}
      {animationType === 'css' && (
        <div className="star-avatar__css">
          <StarHead animation={currentAnimation} />
          <StarBody animation={currentAnimation} />
        </div>
      )}

      {/* ── Sprite sheet track (UX-R6) ── */}
      {animationType === 'sprite' && (
        <StarSprite animation={currentAnimation} />
      )}

      {/* ── Lottie track (placeholder for designer delivery) ── */}
      {animationType === 'lottie' && (
        <div className="star-avatar__lottie-placeholder" aria-label="小星 Lottie 动画占位">
          ⭐
        </div>
      )}
    </div>
  )
}

export default StarAvatar

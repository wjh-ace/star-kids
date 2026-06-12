/* ============================================================
   P5-T1: StarBody — Character Body & Cape Component
   REQ-001 Phase 5 | 小星 Star Kids

   Renders the Q-style character body:
   - Star-moon cape (deep blue → purple gradient, trapezoid clip-path)
   - Cream white / sage green inner clothing
   - Cape star decorations
   - Arms (left static, right can wave)
   ============================================================ */

import { type FC } from 'react'
import type { AnimationName } from '../../types/star'

interface StarBodyProps {
  animation: AnimationName
}

const StarBody: FC<StarBodyProps> = ({ animation }) => {
  const isWaving = animation === 'wave'

  return (
    <div className="star-body">
      {/* ── Inner clothing (visible above cape) ── */}
      <div className="star-body__inner" />

      {/* ── Cape (star-moon cloak) ── */}
      <div className="star-body__cape" />

      {/* ── Cape star decorations ── */}
      <div className="star-body__cape-stars" aria-hidden="true">
        <span className="cape-star">&#9733;</span>
        <span className="cape-star">&#9733;</span>
        <span className="cape-star">&#9734;</span>
        <span className="cape-star">&#9734;</span>
        <span className="cape-star">&#10022;</span>
      </div>

      {/* ── Left arm (static) ── */}
      <div className="star-arm star-arm--left" />

      {/* ── Right arm (can wave on user message) ── */}
      <div
        className={`star-arm star-arm--right${isWaving ? ' star-arm--waving' : ''}`}
      />
    </div>
  )
}

export default StarBody

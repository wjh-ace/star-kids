/* ============================================================
   P5-T1: StarHead — Character Head Component
   REQ-001 Phase 5 | 小星 Star Kids

   Renders the Q-style character head:
   - Round face (cream white)
   - Soft short silver/cream hair
   - Star hair clip (right side)
   - Large round amber→galaxy gradient eyes with highlights
   - Eyelid overlay divs for blink (UX-R7: NOT scaleY!)
   - Small mouth
   - Subtle blush cheeks
   ============================================================ */

import { type FC } from 'react'
import type { AnimationName } from '../../types/star'

interface StarHeadProps {
  animation: AnimationName
}

const StarHead: FC<StarHeadProps> = ({ animation }) => {
  const isBlinking = animation === 'blink'
  const isCurious = animation === 'curious'
  const isNodding = animation === 'nod'

  return (
    <div
      className={`star-head${isNodding ? ' star-head--nod' : ''}${isCurious ? ' star-head--curious' : ''}`}
    >
      {/* ── Hair layers (behind + on top of face) ── */}
      <div className="star-hair__top" />
      <div className="star-hair__side-left" />
      <div className="star-hair__side-right" />
      <div className="star-hair__bangs" />

      {/* ── Face circle ── */}
      <div className="star-face">
        {/* Left eye */}
        <div
          className={`star-eye star-eye--left${isCurious ? ' star-eye--curious' : ''}`}
        >
          <div className="star-eye__ball" />
          <div className="star-eye__pupil" />
          <div className="star-eye__highlight" />
          <div className="star-eye__highlight2" />
          {/* Eyelid overlays (UX-R7: cover from top/bottom, NOT scaleY) */}
          <div
            className={`star-eye__lid-top${isBlinking ? ' star-eye__lid-top--closed' : ''}`}
          />
          <div
            className={`star-eye__lid-bottom${isBlinking ? ' star-eye__lid-bottom--closed' : ''}`}
          />
        </div>

        {/* Right eye */}
        <div
          className={`star-eye star-eye--right${isCurious ? ' star-eye--curious' : ''}`}
        >
          <div className="star-eye__ball" />
          <div className="star-eye__pupil" />
          <div className="star-eye__highlight" />
          <div className="star-eye__highlight2" />
          <div
            className={`star-eye__lid-top${isBlinking ? ' star-eye__lid-top--closed' : ''}`}
          />
          <div
            className={`star-eye__lid-bottom${isBlinking ? ' star-eye__lid-bottom--closed' : ''}`}
          />
        </div>

        {/* Mouth */}
        <div className="star-mouth" />
      </div>

      {/* ── Star hair clip (right side) ── */}
      <div className="star-hair-clip" aria-hidden="true">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0L9.8 5.5L16 5.5L10.8 9L12.8 14.5L8 11L3.2 14.5L5.2 9L0 5.5L6.2 5.5L8 0Z"
            fill="var(--color-honey, #E8C56D)"
            filter="url(#starClipGlow)"
          />
        </svg>
      </div>
    </div>
  )
}

export default StarHead

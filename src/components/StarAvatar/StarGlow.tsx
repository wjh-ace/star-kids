/* ============================================================
   P5-T1: StarGlow — Two-Layer Glow Outline Component
   REQ-001 Phase 5 | 小星 Star Kids

   Renders the character's soft luminous outline:
   - Inner layer: 4px spread, opacity 0.6, honey gold
   - Outer layer: 12px spread, opacity 0.25, honey gold
   Uses CSS box-shadow on positioned layers.
   ============================================================ */

import { type FC } from 'react'

const StarGlow: FC = () => {
  return (
    <div className="star-glow" aria-hidden="true">
      <div className="star-glow__inner" />
      <div className="star-glow__outer" />
    </div>
  )
}

export default StarGlow

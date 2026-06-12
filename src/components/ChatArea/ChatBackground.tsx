/* ============================================================
   P4-T2: ChatBackground — Parchment Texture Background
   REQ-001 Phase 4 | 小星 Star Kids

   3-layer background-image:
     1. Gradient base (#FAF3E3 → #F5E6CC)
     2. SVG noise pattern (subtle paper grain)
     3. Radial-gradient edge aging (darker at edges)

   Wrapped in WoodFrame for rounded wood-border enclosure.
   ============================================================ */

import type { ReactNode } from 'react'
import WoodFrame from '../CameraView/WoodFrame'

interface ChatBackgroundProps {
  children: ReactNode
}

function ChatBackground({ children }: ChatBackgroundProps) {
  return (
    <WoodFrame thickness={8} borderRadius={22} hasGlow={false} woodSeed={7}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          width: '100%',
          // 3-layer parchment background
          background: [
            // Layer 1: warm gradient base
            'linear-gradient(180deg, #FAF3E3 0%, #F5E6CC 100%)',
            // Layer 2: SVG noise pattern (subtle paper grain)
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            // Layer 3: radial-gradient edge aging (darker vignette inward)
            'radial-gradient(ellipse at center, transparent 55%, rgba(139, 90, 43, 0.10) 100%)',
          ].join(', '),
          backgroundBlendMode: 'normal, multiply, multiply',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </WoodFrame>
  )
}

export default ChatBackground

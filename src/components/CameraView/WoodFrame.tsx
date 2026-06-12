/* ============================================================
   P3-T2: WoodFrame — SVG Filter Wood-Texture Border
   REQ-001 Phase 3 | 小星 Star Kids

   Implements a hand-drawn wooden-frame aesthetic via SVG
   feTurbulence + feDisplacementMap (not box-shadow rings).

   Filter parameters mirror those in assets/textures/wood-texture.svg
   but are rendered inline as React JSX so that filter IDs are
   guaranteed to be in the same document and referenceable via
   CSS filter: url(#...).

   Key design decisions (from tech-design 1.2):
   - baseFrequency="0.04 0.2" — X low-freq (vertical grain),
     Y high-freq (fine horizontal texture)
   - feDisplacementMap scale="6" — 6px edge irregularity
   - overflow:hidden + border-radius on outer container so
     SVG filter respects rounded corners
   - box-shadow used only for ambient depth, NOT for texture
   ============================================================ */

import type { ReactNode } from 'react'

export interface WoodFrameProps {
  /** Border thickness in px (default 8). Controls content margin. */
  thickness?: number

  /** Outer border-radius in px (default 22). */
  borderRadius?: number

  /** Whether to render a warm ambient glow via box-shadow. */
  hasGlow?: boolean

  /**
   * Seed for the feTurbulence noise generator.
   * Different values produce different wood-grain patterns,
   * preventing visible repetition across frame instances.
   * Values are also used to derive unique SVG filter IDs,
   * so two WoodFrames with the same seed will share the same
   * filter definition.
   */
  woodSeed?: number

  /** Content to render inside the frame. */
  children: ReactNode
}

function WoodFrame({
  thickness = 8,
  borderRadius = 22,
  hasGlow = true,
  woodSeed = 0,
  children,
}: WoodFrameProps) {
  // Unique filter IDs per seed value avoid DOM id collisions
  const grainId = `wood-grain-${woodSeed}`
  const edgeId = `wood-edge-${woodSeed}`

  const glowShadow = hasGlow
    ? ', 1px 2px 20px rgba(232, 197, 109, 0.2)'
    : ''

  return (
    <>
      {/* ====================================================
          Hidden SVG — filter definitions (one per seed value)
          Rendered inline so filter IDs are in the same
          document and referenceable via CSS url().
          ==================================================== */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
      >
        <defs>
          {/* ── wood-grain filter ── */}
          <filter
            id={grainId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            {/* 1. Generate base noise */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.2"
              numOctaves={3}
              seed={woodSeed}
              result="noise"
            />

            {/* 2. Map noise to wood color spectrums */}
            <feColorMatrix
              type="matrix"
              values="
                0.2  0    0     0  0.55
                0    0.1  0     0  0.35
                0    0    0.05  0  0.15
                0    0    0     1  0"
              in="noise"
              result="woodColor"
            />

            {/* 3. Edge displacement — breaks perfect geometric lines */}
            <feDisplacementMap
              in="woodColor"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="texturedWood"
            />

            {/* 4. Composite with source graphic (the gradient bg) */}
            <feComposite
              in="texturedWood"
              in2="SourceGraphic"
              operator="in"
              result="finalWood"
            />
          </filter>

          {/* ── wood-edge roughening filter ── */}
          <filter
            id={edgeId}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08"
              numOctaves={3}
              seed={woodSeed + 1}
              result="edgeNoise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="edgeNoise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ====================================================
          Outer container — rounded-corner clipping + shadows
          ==================================================== */}
      <div
        style={{
          position: 'relative',
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          backgroundColor: '#D4A574',
          boxShadow: [
            'inset 2px 3px 30px rgba(107, 66, 38, 0.25)',
            '2px 3px 12px rgba(107, 66, 38, 0.35)',
            glowShadow,
          ]
            .filter(Boolean)
            .join(', '),
          width: '100%',
          height: '100%',
        }}
      >
        {/* =================================================
            Texture layer (replaces ::before pseudo-element)
            Applies the wood-grain SVG filter over a warm
            wood-tone gradient base.
            ================================================= */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: `${borderRadius}px`,
            background: [
              'linear-gradient(',
              '135deg,',
              '#C4956A 0%,',
              '#D4A574 20%,',
              '#B8845A 50%,',
              '#D4A574 80%,',
              '#C4956A 100%',
              ')',
            ].join(''),
            // The SVG filter that creates the wood-grain texture
            filter: `url(#${grainId})`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* =================================================
            Inner border layer (replaces ::after pseudo-element)
            Subtle border with edge-roughening filter to
            break perfectly straight digital lines.
            ================================================= */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: `${thickness * 0.5}px`,
            border: '3px solid rgba(139, 90, 43, 0.5)',
            borderRadius: `${borderRadius - 4}px`,
            filter: `url(#${edgeId})`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* =================================================
            Content area
            Margin creates the visual border thickness.
            ================================================= */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            margin: `${thickness}px`,
            borderRadius: `${borderRadius - 6}px`,
            overflow: 'hidden',
            height: `calc(100% - ${thickness * 2}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default WoodFrame

/* ============================================================
   P3-T3a: FloatingStars — Single-Canvas Star Particles (UX-R10)
   REQ-001 Phase 3 | 小星 Star Kids

   Renders 12 floating/twinkling stars in the camera window
   corners using a single <canvas> + requestAnimationFrame.

   UX-R10 compliant: 1 DOM node instead of 12+, all stars drawn
   in a single render pass for minimal layout/paint overhead.

   Stars:
   - Size: 2–5 px radius
   - Color: #F5D76E (星光金 — star gold)
   - Random position + random phase + opacity fluctuation
   - Slight positional float over time (sinusoidal)
   ============================================================ */

import { useRef, useEffect } from 'react'

/* ==========================================================
   Star model
   ========================================================== */
interface Star {
  /** Base x position (normalised 0–1 for resize independence). */
  nx: number
  /** Base y position (normalised 0–1). */
  ny: number
  /** Radius in CSS pixels (before dpr). */
  radius: number
  /** Base opacity (0.3–0.8). */
  baseOpacity: number
  /** Oscillation speed multiplier (0.3–1.0). */
  speed: number
  /** Random phase offset for independent twinkle timing. */
  phase: number
  /** Float amplitude in CSS pixels. */
  floatAmp: number
  /** Float speed multiplier. */
  floatSpeed: number
}

interface FloatingStarsProps {
  /** Number of stars (default 12). */
  count?: number
}

function FloatingStars({ count = 12 }: FloatingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── ResizeObserver: keep canvas crisp at any window size ──
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Regenerate star positions whenever the canvas resizes
      initStars(rect.width, rect.height)
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas.parentElement!)
    resize() // initial sizing

    // ── Generate star data ──
    const initStars = (w: number, h: number) => {
      const stars: Star[] = []
      for (let i = 0; i < count; i++) {
        stars.push({
          nx: Math.random(),
          ny: Math.random(),
          radius: 2 + Math.random() * 3, // 2–5 px
          baseOpacity: 0.3 + Math.random() * 0.5, // 0.3–0.8
          speed: 0.3 + Math.random() * 0.7, // 0.3–1.0
          phase: Math.random() * Math.PI * 2,
          floatAmp: 2 + Math.random() * 4, // 2–6 px float
          floatSpeed: 0.2 + Math.random() * 0.4, // 0.2–0.6
        })
      }
      starsRef.current = stars
    }

    // ── Animation loop ──
    const animate = (time: number) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.clearRect(0, 0, w, h)

      for (const star of starsRef.current) {
        // Opacity: sinusoidal twinkle
        const alpha =
          star.baseOpacity *
          (0.4 + 0.6 * Math.sin(time * 0.001 * star.speed + star.phase))

        // Position: slight sin/cos float around base
        const x =
          star.nx * w +
          Math.sin(time * 0.0005 * star.floatSpeed + star.phase) *
            star.floatAmp
        const y =
          star.ny * h +
          Math.cos(time * 0.0007 * star.floatSpeed + star.phase + 1) *
            star.floatAmp

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
        ctx.fillStyle = '#F5D76E'

        // Draw a 4-point star shape (simple diamond for pixel/fairy feel)
        ctx.beginPath()
        const r = star.radius
        // Outer points
        ctx.moveTo(x, y - r) // top
        ctx.lineTo(x + r * 0.35, y - r * 0.35) // top-right inner
        ctx.lineTo(x + r, y) // right
        ctx.lineTo(x + r * 0.35, y + r * 0.35) // bottom-right inner
        ctx.lineTo(x, y + r) // bottom
        ctx.lineTo(x - r * 0.35, y + r * 0.35) // bottom-left inner
        ctx.lineTo(x - r, y) // left
        ctx.lineTo(x - r * 0.35, y - r * 0.35) // top-left inner
        ctx.closePath()
        ctx.fill()

        // Soft glow halo
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.3))
        ctx.beginPath()
        ctx.arc(x, y, r * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      animIdRef.current = requestAnimationFrame(animate)
    }

    animIdRef.current = requestAnimationFrame(animate)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(animIdRef.current)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  )
}

export default FloatingStars

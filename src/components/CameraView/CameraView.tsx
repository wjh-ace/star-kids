/* ============================================================
   P3-T3c: CameraView — Phase 3 Main Camera Component
   REQ-001 Phase 3 | 小星 Star Kids

   Composes the full camera area:
   - WoodFrame (SVG wood-texture border)
   - <video> element (live camera feed)
   - FloatingStars (single-canvas floating star particles)
   - VignetteOverlay (soft dark corners + warm light)

   Replaces Phase 2 placeholder in App.tsx Layer 1 (55%).
   ============================================================ */

import { useEffect } from 'react'
import WoodFrame from './WoodFrame'
import FloatingStars from './FloatingStars'
import VignetteOverlay from './VignetteOverlay'
import { useCamera } from '@/hooks/useCamera'

/* ==========================================================
   Error state — friendly message (never blank screen)
   ========================================================== */
function CameraError({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 'var(--space-lg)',
        textAlign: 'center',
      }}
    >
      {/* Friendly icon */}
      <span
        role="img"
        aria-hidden="true"
        style={{
          fontSize: '36px',
          marginBottom: 'var(--space-md)',
          opacity: 0.6,
        }}
      >
        📷
      </span>

      {/* Message */}
      <p
        style={{
          fontFamily: 'var(--font-pixel-zh)',
          fontSize: 'var(--font-size-md)',
          color: 'var(--color-wood-dark)',
          lineHeight: 1.6,
          maxWidth: '320px',
          opacity: 0.8,
          margin: 0,
        }}
      >
        {message}
      </p>

      {/* Gentle hint */}
      <p
        style={{
          fontFamily: 'var(--font-system)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-wood-mid)',
          marginTop: 'var(--space-md)',
          opacity: 0.6,
        }}
      >
        你可以在工具栏中重新开启摄像头
      </p>
    </div>
  )
}

/* ==========================================================
   Loading state
   ========================================================== */
function CameraLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-pixel-zh)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-wood-mid)',
          opacity: 0.7,
        }}
      >
        正在请求摄像头权限…
      </span>
    </div>
  )
}

/* ==========================================================
   CameraView
   ========================================================== */
function CameraView() {
  const { videoRef, isActive, isLoading, error, start, stop } = useCamera()

  // Auto-start camera on mount, stop on unmount
  useEffect(() => {
    start()
    return () => {
      stop()
    }
    // Only run on mount/unmount — eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="camera-view"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Background behind the frame (dark warm neutral)
        backgroundColor: '#3E2E1F',
      }}
    >
      {/* ===== Wood Frame ===== */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: '960px',
          maxHeight: '100%',
          padding: 'var(--space-md)',
          boxSizing: 'border-box',
        }}
      >
        <WoodFrame thickness={8} borderRadius={22} hasGlow woodSeed={0}>
          {/* Inner content wrapper — relative for overlay positioning */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: '#3E2A1F', // warm dark fallback before video loads
              overflow: 'hidden',
            }}
          >
            {/* ===== Video Element ===== */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                display: isActive ? 'block' : 'none',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* ===== Error / Loading states ===== */}
            {error && <CameraError message={error} />}
            {isLoading && !isActive && !error && <CameraLoading />}
            {!isActive && !isLoading && !error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontFamily: 'var(--font-pixel-zh)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-wood-light)',
                  opacity: 0.5,
                }}
              >
                摄像头未开启
              </div>
            )}

            {/* ===== Vignette Overlay ===== */}
            <VignetteOverlay />
          </div>
        </WoodFrame>
      </div>

      {/* ===== Floating Stars (above frame) ===== */}
      <FloatingStars count={12} />
    </div>
  )
}

export default CameraView

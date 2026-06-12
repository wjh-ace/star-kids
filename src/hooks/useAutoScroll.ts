/* ============================================================
   P4-T3: useAutoScroll — Auto-Scroll to Bottom Hook
   REQ-001 Phase 4 | 小星 Star Kids

   - Automatically scrolls to bottom when new messages arrive
   - Pauses auto-scroll when user manually scrolls up
   - Shows ScrollHint when paused and there are new messages
   ============================================================ */

import { useEffect, useRef, useCallback, useState } from 'react'

interface UseAutoScrollOptions {
  /** Ref to the scrollable container element */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Dependency that triggers auto-scroll (e.g. message count) */
  trigger: number
}

interface UseAutoScrollResult {
  /** Whether the user has scrolled away from bottom */
  isPaused: boolean
  /** Manually scroll to bottom */
  scrollToBottom: () => void
  /** Resume auto-scroll behavior */
  resumeAutoScroll: () => void
}

export function useAutoScroll({
  containerRef,
  trigger,
}: UseAutoScrollOptions): UseAutoScrollResult {
  const [isPaused, setIsPaused] = useState(false)
  const autoScrollEnabled = useRef(true)

  const isNearBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return true
    const threshold = 60
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }, [containerRef])

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
    autoScrollEnabled.current = true
    setIsPaused(false)
  }, [containerRef])

  const resumeAutoScroll = useCallback(() => {
    autoScrollEnabled.current = true
    setIsPaused(false)
    // Immediately scroll to bottom on resume
    scrollToBottom()
  }, [scrollToBottom])

  // Auto-scroll to bottom when trigger changes
  useEffect(() => {
    if (autoScrollEnabled.current) {
      const el = containerRef.current
      if (!el) return

      // Use requestAnimationFrame to ensure the DOM has updated
      requestAnimationFrame(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth',
        })
      })
    }
  }, [trigger, containerRef])

  // Listen for user scroll to pause auto-scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const nearBottom = isNearBottom()

      if (nearBottom) {
        // User scrolled back to bottom — re-enable auto-scroll
        if (isPaused) {
          autoScrollEnabled.current = true
          setIsPaused(false)
        }
      } else {
        // User scrolled away — pause auto-scroll
        if (!isPaused) {
          autoScrollEnabled.current = false
          setIsPaused(true)
        }
      }
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [isPaused, isNearBottom, containerRef])

  return { isPaused, scrollToBottom, resumeAutoScroll }
}

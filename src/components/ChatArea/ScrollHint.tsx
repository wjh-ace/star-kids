/* ============================================================
   P4-T3: ScrollHint — New Messages Indicator
   REQ-001 Phase 4 | 小星 Star Kids

   Shows "⭐ 有新消息" at the bottom when there are unread
   messages above the viewport. Click scrolls back to bottom.
   ============================================================ */

import { useEffect, useState } from 'react'

interface ScrollHintProps {
  /** Ref to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** The number of messages — a change signals potential new content */
  messageCount: number
  /** Callback to scroll to bottom */
  onScrollToBottom: () => void
}

function ScrollHint({
  containerRef,
  messageCount,
  onScrollToBottom,
}: ScrollHintProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const check = () => {
      // Consider user "away from bottom" if scrollTop is more than
      // 60px above the bottom of the scrollable area
      const threshold = 60
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight
      setVisible(distanceFromBottom > threshold)
    }

    // Check immediately when messageCount changes
    check()

    // Also check on scroll
    el.addEventListener('scroll', check, { passive: true })
    return () => el.removeEventListener('scroll', check)
  }, [messageCount, containerRef])

  if (!visible) return null

  return (
    <button
      onClick={onScrollToBottom}
      style={{
        position: 'sticky',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        marginTop: '-40px',
        marginBottom: '8px',
        padding: '6px 16px',
        borderRadius: '20px',
        border: '1px solid var(--color-honey)',
        backgroundColor: 'rgba(255, 248, 238, 0.95)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-pixel-zh)',
        fontSize: 'var(--font-size-sm)',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(107, 66, 38, 0.15)',
        transition: 'opacity 0.3s ease',
        whiteSpace: 'nowrap',
      }}
    >
      ⭐ 有新消息
    </button>
  )
}

export default ScrollHint

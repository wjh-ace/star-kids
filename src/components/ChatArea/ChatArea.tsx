/* ============================================================
   P4-T2: ChatArea — Chat Region Container
   REQ-001 Phase 4 | 小星 Star Kids

   Layout (within ChatBackground):
     left:  StarAvatar placeholder column (fixed, ~120px)
     right: Messages column (scrollable)
            ├── MessageList (scrollable area)
            └── ScrollHint (overlay at bottom)

   Integrates useMockChat (mock data), useAutoScroll, and
   typing indicator display.
   ============================================================ */

import { useRef } from 'react'
import { useChatStore } from '../../stores/chatStore'
import { useUIStore } from '../../stores/uiStore'
import { useMockChat } from '../../hooks/useMockChat'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useStarAnimation } from '../../hooks/useStarAnimation'
import StarAvatar from '../StarAvatar/StarAvatar'
import ChatBackground from './ChatBackground'
import MessageList from './MessageList'
import ScrollHint from './ScrollHint'

function ChatArea() {
  const messages = useChatStore((s) => s.messages)
  const isTyping = useChatStore((s) => s.isTyping)
  const starAnimationType = useUIStore((s) => s.starAnimationType)

  // Activate mock chat (injects preset conversation + auto-replies)
  useMockChat()

  // Star avatar animation state machine (blink / nod / wave / curious)
  const { currentAnimation } = useStarAnimation()

  // Auto-scroll
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const { scrollToBottom } = useAutoScroll({
    containerRef: scrollContainerRef,
    trigger: messages.length,
  })

  return (
    <ChatBackground>
      {/* ── Left column: StarAvatar placeholder ── */}
      <div
        style={{
          width: '120px',
          minWidth: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 'var(--space-md) var(--space-sm)',
          position: 'relative',
        }}
      >
        {/* Star avatar — P5 with real character */}
        <div
          style={{
            position: 'sticky',
            bottom: 'var(--space-md)',
          }}
        >
          <StarAvatar
            animationType={starAnimationType}
            currentAnimation={currentAnimation}
            size="normal"
          />
        </div>
      </div>

      {/* ── Right column: messages + scroll hint ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Scrollable message area */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MessageList messages={messages} />

          {/* Typing indicator */}
          {isTyping && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: '4px var(--space-md) 8px',
                fontFamily: 'var(--font-pixel-zh)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span>⭐ 小星正在输入</span>
              <span
                style={{
                  display: 'inline-flex',
                  gap: '2px',
                }}
              >
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-honey)',
                    animation: 'softPulse 1.2s ease-in-out infinite',
                  }}
                />
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-honey)',
                    animation: 'softPulse 1.2s ease-in-out 0.2s infinite',
                  }}
                />
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-honey)',
                    animation: 'softPulse 1.2s ease-in-out 0.4s infinite',
                  }}
                />
              </span>
            </div>
          )}
        </div>

        {/* Scroll hint — appears when scrolled away from bottom */}
        <ScrollHint
          containerRef={scrollContainerRef}
          messageCount={messages.length}
          onScrollToBottom={scrollToBottom}
        />
      </div>
    </ChatBackground>
  )
}

export default ChatArea

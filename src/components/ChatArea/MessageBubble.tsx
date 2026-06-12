/* ============================================================
   P4-T2: MessageBubble — Star and User Message Styles
   REQ-001 Phase 4 | 小星 Star Kids

   Star bubble:
     - Warm cream white bg (#FFF8EE)
     - 1px honey gold border (#E8C56D)
     - ⭐ decoration at top-left corner
     - Subtle glow box-shadow (opacity 0.3)
     - Left-bottom slightly square (border-radius asymmetric)

   User bubble:
     - Light wood brown bg (#E8D5B7)
     - No border
     - Right-bottom slightly square
     - Natural and clean

   Font: pixel font (var(--font-pixel-zh))
     - Star messages: 16-18px
     - User messages: 14-16px
   ============================================================ */

import type { Message } from '../../types/chat'

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isStar = message.role === 'star'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 'var(--space-xs)',
    maxWidth: '80%',
    alignSelf: isStar ? 'flex-start' : 'flex-end',
  }

  const bubbleStyle: React.CSSProperties = isStar
    ? {
        position: 'relative',
        backgroundColor: '#FFF8EE',
        border: '1px solid #E8C56D',
        borderRadius: '16px 16px 16px 4px',
        padding: 'var(--space-sm) var(--space-md)',
        fontFamily: 'var(--font-pixel-zh)',
        fontSize: 'var(--font-size-lg)',
        lineHeight: '1.6',
        color: 'var(--color-text-primary)',
        boxShadow: '1px 2px 8px rgba(232, 197, 109, 0.3)',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }
    : {
        position: 'relative',
        backgroundColor: '#E8D5B7',
        borderRadius: '16px 16px 4px 16px',
        padding: 'var(--space-sm) var(--space-md)',
        fontFamily: 'var(--font-pixel-zh)',
        fontSize: 'var(--font-size-sm)',
        lineHeight: '1.6',
        color: 'var(--color-text-primary)',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }

  return (
    <div style={containerStyle}>
      {/* Star messages are on the left, user messages on the right */}
      {!isStar && <div style={{ flex: 1 }} />}

      <div style={bubbleStyle}>
        {/* ⭐ decoration on top-left for star bubbles */}
        {isStar && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -10,
              left: -2,
              fontSize: '12px',
              filter: 'drop-shadow(1px 1px 2px rgba(232, 197, 109, 0.6))',
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            ⭐
          </span>
        )}

        {message.text}
      </div>

      {isStar && <div style={{ flex: 1 }} />}
    </div>
  )
}

export default MessageBubble

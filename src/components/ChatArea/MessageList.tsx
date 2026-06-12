/* ============================================================
   P4-T2: MessageList — Message List with Framer Motion
   REQ-001 Phase 4 | 小星 Star Kids

   Maps over chatStore.messages and renders MessageBubble for
   each one. Each bubble enters with a slight upward fade-in
   animation via Framer Motion.
   ============================================================ */

import { AnimatePresence, motion } from 'framer-motion'
import type { Message } from '../../types/chat'
import MessageBubble from './MessageBubble'

interface MessageListProps {
  messages: Message[]
}

function MessageList({ messages }: MessageListProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        flex: 1,
      }}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
            }}
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <MessageBubble message={msg} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Small bottom spacer so last message isn't flush against the edge */}
      <div style={{ height: 'var(--space-xs)', flexShrink: 0 }} />
    </div>
  )
}

export default MessageList

/* ============================================================
   P4-T1: useMockChat — Mock Conversation Hook
   REQ-001 Phase 4 | 小星 Star Kids

   On mount: injects MOCK_CONVERSATION preset dialogues into
   the chat store if it's empty.

   On new user messages: waits 1-2 seconds then auto-replies
   with a random star response from MOCK_STAR_REPLIES.
   ============================================================ */

import { useEffect, useRef } from 'react'
import { useChatStore } from '../stores/chatStore'
import { MOCK_CONVERSATION, MOCK_STAR_REPLIES } from '../mock/chatData'

export function useMockChat() {
  const messages = useChatStore((s) => s.messages)
  const setIsTyping = useChatStore((s) => s.setIsTyping)
  const addStarResponse = useChatStore((s) => s.addStarResponse)
  const initialized = useRef(false)
  const prevLengthRef = useRef(messages.length)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Inject preset conversation on first mount if store is empty
  useEffect(() => {
    if (!initialized.current && messages.length === 0) {
      initialized.current = true
      // Set the preset messages directly via the store's setState
      useChatStore.setState({ messages: [...MOCK_CONVERSATION] })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Watch for new user messages and auto-reply
  useEffect(() => {
    const prevLen = prevLengthRef.current
    prevLengthRef.current = messages.length

    // Only react when messages grew (new message appended)
    if (messages.length <= prevLen) return
    if (messages.length === 0) return

    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role !== 'user') return

    // User just sent a message — simulate star typing + reply
    setIsTyping(true)

    const delay = 1000 + Math.random() * 1000 // 1-2 seconds

    timeoutRef.current = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_STAR_REPLIES.length)
      addStarResponse(MOCK_STAR_REPLIES[randomIndex])
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [messages, setIsTyping, addStarResponse])
}

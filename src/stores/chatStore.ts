/* ============================================================
   P4-T1: chatStore — Zustand Chat Store
   REQ-001 Phase 4 | 小星 Star Kids

   Manages chat messages, typing state, and message actions.
   ============================================================ */

import { create } from 'zustand'
import type { Message } from '../types/chat'

interface ChatStore {
  messages: Message[]
  isTyping: boolean

  /** Add a new user message to the list */
  sendMessage: (text: string) => void

  /** Add a star response message and clear typing state */
  addStarResponse: (text: string) => void

  /** Clear all messages */
  clearMessages: () => void

  /** Manually set typing indicator state */
  setIsTyping: (typing: boolean) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,

  sendMessage: (text: string) => {
    const msg: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    }
    set({ messages: [...get().messages, msg] })
  },

  addStarResponse: (text: string) => {
    const msg: Message = {
      id: `star-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: 'star',
      text,
      timestamp: Date.now(),
    }
    set({ messages: [...get().messages, msg], isTyping: false })
  },

  clearMessages: () => set({ messages: [], isTyping: false }),

  setIsTyping: (typing: boolean) => set({ isTyping: typing }),
}))

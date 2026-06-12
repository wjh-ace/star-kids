/* ============================================================
   P5-T3: useStarAnimation — Character Animation State Machine
   REQ-001 Phase 5 | 小星 Star Kids

   Manages the animation queue and automatic animation cycles
   for the StarAvatar character:

   ┌──────┐   blink (3-6s)   ┌───────┐
   │      │ ───────────────→ │ blink │──┐
   │      │   nod (8-15s)    ├───────┤  │
   │ idle │ ───────────────→ │  nod  │──┤→ back to idle
   │      │  curious (15-25s)├───────┤  │
   │      │ ───────────────→ │curious│──┘
   └──────┘                  └───────┘
      ↑                         │
      │    wave (user msg)      │
      └─────────────────────────┘

   UX-R7: Blink uses eyelid overlay (implemented in CSS/StarHead),
          NOT scaleY — see StarAvatar.css .star-eye__lid-*
   ============================================================ */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useChatStore } from '../stores/chatStore'
import type { AnimationName } from '../types/star'

/** Duration each animation stays active before returning to idle. */
const ANIMATION_DURATIONS: Record<AnimationName, number> = {
  idle: 0,
  blink: 180,   // ~180ms total: 80ms close + 100ms open
  nod: 300,
  wave: 600,
  curious: 2500, // hold curious pose for ~2.5s
}

/** Priority: higher number = can interrupt lower. */
const ANIMATION_PRIORITY: Record<AnimationName, number> = {
  idle: 0,
  curious: 1,
  blink: 2,
  nod: 3,
  wave: 10, // wave has highest priority (user interaction)
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function useStarAnimation() {
  const [current, setCurrent] = useState<AnimationName>('idle')
  const [isPlaying, setIsPlaying] = useState(false)
  const pausedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Track message count to detect new user messages
  const messages = useChatStore((s) => s.messages)
  const prevMsgCountRef = useRef(messages.length)

  /** Clear all pending timers. */
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  /** Transition to a new animation, then back to idle. */
  const playAnimation = useCallback(
    (name: AnimationName) => {
      if (pausedRef.current) return
      if (name === 'idle') {
        setCurrent('idle')
        setIsPlaying(false)
        return
      }

      // Only interrupt if priority is higher
      if (isPlaying) {
        const currentPriority = ANIMATION_PRIORITY[current] ?? 0
        const newPriority = ANIMATION_PRIORITY[name] ?? 0
        if (newPriority <= currentPriority) return
      }

      setIsPlaying(true)
      setCurrent(name)

      const duration = ANIMATION_DURATIONS[name] ?? 500
      const timer = setTimeout(() => {
        setCurrent('idle')
        setIsPlaying(false)
      }, duration)
      timersRef.current.push(timer)
    },
    [current, isPlaying],
  )

  /** Manually trigger an animation from outside. */
  const trigger = useCallback(
    (name: AnimationName) => {
      playAnimation(name)
    },
    [playAnimation],
  )

  const pause = useCallback(() => {
    pausedRef.current = true
    clearTimers()
  }, [clearTimers])

  const resume = useCallback(() => {
    pausedRef.current = false
  }, [])

  // ── Auto-animation cycles ──
  useEffect(() => {
    if (pausedRef.current) return

    /** Schedule the next blink at a random interval. */
    let blinkTimer: ReturnType<typeof setTimeout>
    let nodTimer: ReturnType<typeof setTimeout>
    let curiousTimer: ReturnType<typeof setTimeout>

    function scheduleBlink() {
      const delay = randomBetween(3000, 6000)
      blinkTimer = setTimeout(() => {
        playAnimation('blink')
        scheduleBlink()
      }, delay)
    }

    function scheduleNod() {
      const delay = randomBetween(8000, 15000)
      nodTimer = setTimeout(() => {
        playAnimation('nod')
        scheduleNod()
      }, delay)
    }

    function scheduleCurious() {
      const delay = randomBetween(15000, 25000)
      curiousTimer = setTimeout(() => {
        playAnimation('curious')
        scheduleCurious()
      }, delay)
    }

    scheduleBlink()
    scheduleNod()
    scheduleCurious()

    return () => {
      clearTimeout(blinkTimer)
      clearTimeout(nodTimer)
      clearTimeout(curiousTimer)
    }
  }, [playAnimation])

  // ── Watch for user messages → trigger wave ──
  useEffect(() => {
    const prevCount = prevMsgCountRef.current
    prevMsgCountRef.current = messages.length

    // Detect new message appended
    if (messages.length > prevCount && messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.role === 'user') {
        // Small delay so the bubble appears before the wave
        const waveTimer = setTimeout(() => {
          playAnimation('wave')
        }, 400)
        return () => clearTimeout(waveTimer)
      }
    }
  }, [messages, playAnimation])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  return {
    currentAnimation: current,
    isPlaying,
    trigger,
    pause,
    resume,
  }
}

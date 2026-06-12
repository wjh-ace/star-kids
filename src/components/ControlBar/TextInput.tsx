/* ============================================================
   P6-T2: TextInput — Chat text input with IME support
   REQ-001 Phase 6 | 小星 Star Kids

   - Placeholder uses system font (var(--font-system)), NOT pixel font (UX-R13)
   - User input text uses pixel font (var(--font-pixel-zh))
   - Chinese IME compatibility: compositionstart / compositionend
     prevents sending messages during IME composition
   - Enter to send, Shift+Enter for newline
   - Calls onSend(text) when message is submitted
   ============================================================ */

import { useState, useRef, useCallback, type KeyboardEvent, type CompositionEvent } from 'react'

export interface TextInputProps {
  /** Placeholder text displayed when empty */
  placeholder: string
  /** Whether the input is disabled */
  disabled: boolean
  /** Called when user submits a message (Enter without Shift) */
  onSend: (text: string) => void
}

/**
 * Reference-based IME composition state.
 *
 * We use refs (not useState) for `isComposing` and `justComposed`
 * because the timing between `compositionend` and the subsequent
 * `keydown` Enter event varies across browsers and IMEs.  Refs
 * give us synchronous reads inside the keydown handler so we never
 * read a stale React batch.
 */
function TextInput({ placeholder, disabled, onSend }: TextInputProps) {
  const [value, setValue] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── IME composition flags (refs for synchronous access) ──
  const isComposingRef = useRef(false)
  const justComposedRef = useRef(false)

  // ── Composition handlers ──

  const handleCompositionStart = useCallback((_e: CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = true
  }, [])

  const handleCompositionUpdate = useCallback((_e: CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = true
  }, [])

  const handleCompositionEnd = useCallback((_e: CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false
    // Some IMEs fire compositionend immediately before the Enter keydown.
    // Set a flag that lasts until the end of the current event-loop tick
    // so that keydown knows this Enter belongs to the IME, not to us.
    justComposedRef.current = true
    requestAnimationFrame(() => {
      justComposedRef.current = false
    })
  }, [])

  // ── Key handler ──

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter without Shift → send message
      if (e.key === 'Enter' && !e.shiftKey) {
        // During IME composition or immediately after it ended,
        // let the browser handle the Enter (IME confirmation).
        if (isComposingRef.current || justComposedRef.current) {
          return
        }

        e.preventDefault()

        const trimmed = value.trim()
        if (trimmed.length > 0) {
          onSend(trimmed)
          setValue('')
        }
      }
      // Shift+Enter: let the default newline behaviour through
    },
    [value, onSend],
  )

  return (
    <>
      {/* ── CSS for placeholder font (pseudo-elements can't be styled inline) ── */}
      <style>{`
        .text-input-textarea::placeholder {
          font-family: var(--font-system);
          color: var(--color-wood-mid);
          opacity: 0.7;
          font-size: var(--font-size-sm);
        }
      `}</style>

      <textarea
        ref={textareaRef}
        className="text-input-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionUpdate={handleCompositionUpdate}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        style={{
          flex: 1,
          minWidth: 0,
          resize: 'none',
          border: 'none',
          outline: 'none',
          borderRadius: 12,
          padding: '10px 14px',
          backgroundColor: 'var(--color-parchment)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-pixel-zh)',
          fontSize: 'var(--font-size-sm)',
          lineHeight: 1.5,
          boxShadow: 'inset 1px 1px 4px rgba(107, 66, 38, 0.1)',
          alignSelf: 'center',
        }}
      />
    </>
  )
}

export default TextInput

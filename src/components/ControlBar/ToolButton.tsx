/* ============================================================
   P6-T3: ToolButton — Generic toolbar button
   REQ-001 Phase 6 | 小星 Star Kids

   - 48×48px minimum touch target (UX-R12)
   - Hover: scale 1.1 + warm glow box-shadow
   - Click: scale 0.95
   - Wraps a hand-drawn SVG icon
   ============================================================ */

import type { ReactNode } from 'react'

export interface ToolButtonProps {
  /** Hand-drawn SVG icon component */
  icon: ReactNode
  /** Accessible label for screen readers */
  label: string
  /** Click handler */
  onClick?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Optional badge (count or indicator) */
  badge?: string | number
  /** Button size in px (default 48 per UX-R12) */
  size?: number
}

const BASE_STYLE: React.CSSProperties = {
  width: 48,
  height: 48,
  minWidth: 48,
  minHeight: 48,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '2px solid transparent',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  padding: 0,
  outline: 'none',
  position: 'relative',
  transition: 'transform var(--anim-fast) ease, box-shadow var(--anim-fast) ease',
  flexShrink: 0,
}

const DISABLED_STYLE: React.CSSProperties = {
  opacity: 0.35,
  cursor: 'not-allowed',
}

function ToolButton({
  icon,
  label,
  onClick,
  disabled = false,
  badge,
  size = 48,
}: ToolButtonProps) {
  const style: React.CSSProperties = {
    ...BASE_STYLE,
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    ...(disabled ? DISABLED_STYLE : {}),
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={style}
      onMouseEnter={(e) => {
        if (disabled) return
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.boxShadow = 'var(--shadow-warm)'
      }}
      onMouseLeave={(e) => {
        if (disabled) return
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onMouseDown={(e) => {
        if (disabled) return
        e.currentTarget.style.transform = 'scale(0.95)'
      }}
      onMouseUp={(e) => {
        if (disabled) return
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
    >
      {icon}
      {badge != null && (
        <span
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 8,
            backgroundColor: 'var(--color-honey)',
            color: 'var(--color-wood-dark)',
            fontFamily: 'var(--font-system)',
            fontSize: 10,
            fontWeight: 600,
            lineHeight: '16px',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

export default ToolButton

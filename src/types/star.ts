/* ============================================================
   P5-T1: Star Animation Types
   REQ-001 Phase 5 | 小星 Star Kids

   Defines animation types, names, and props for the
   StarAvatar component system.
   ============================================================ */

/** The rendering track used for the character. */
export type AnimationType = 'css' | 'sprite' | 'lottie'

/** Named animations the character can perform. */
export type AnimationName = 'idle' | 'blink' | 'nod' | 'wave' | 'curious'

/** Props accepted by the top-level StarAvatar component. */
export interface StarAvatarProps {
  /** Rendering track: CSS div-built, sprite sheet PNG, or Lottie JSON. */
  animationType: AnimationType
  /** Currently active animation. */
  currentAnimation: AnimationName
  /** Character size variant. Defaults to 'normal' (~120x180px). */
  size?: 'small' | 'normal'
}

/** Runtime animation state managed by useStarAnimation. */
export interface StarAnimationState {
  current: AnimationName
  queue: AnimationName[]
  isPlaying: boolean
}

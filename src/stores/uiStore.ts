/* ============================================================
   P5-T4: uiStore — UI State Store
   REQ-001 Phase 5 | 小星 Star Kids

   Manages UI-level state:
   - Star avatar animation type (css / sprite / lottie)
   - Settings panel visibility
   - Active panel selection
   ============================================================ */

import { create } from 'zustand'
import type { AnimationType } from '../types/star'

interface UIStore {
  /** Star avatar rendering track. */
  starAnimationType: AnimationType

  /** Whether the settings panel is open. */
  isSettingsOpen: boolean

  /** Currently active panel. */
  activePanel: 'chat' | 'settings'

  /** Toggle settings panel open/closed. */
  toggleSettings: () => void

  /** Set the star animation type. */
  setStarAnimationType: (type: AnimationType) => void
}

export const useUIStore = create<UIStore>((set) => ({
  starAnimationType: 'css',
  isSettingsOpen: false,
  activePanel: 'chat',

  toggleSettings: () =>
    set((s) => ({
      isSettingsOpen: !s.isSettingsOpen,
      activePanel: s.isSettingsOpen ? 'chat' : 'settings',
    })),

  setStarAnimationType: (type) => set({ starAnimationType: type }),
}))

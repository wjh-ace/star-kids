/* ============================================================
   P3-T1b: Camera Zustand Store
   REQ-001 Phase 3 | 小星 Star Kids

   Centralised camera state management.
   Used by useCamera hook and CameraView component.
   ============================================================ */

import { create } from 'zustand'
import type { CameraStore } from '@/types/camera'

const initialState = {
  isActive: false,
  isLoading: false,
  errorMessage: null,
  stream: null,
} as const

export const useCameraStore = create<CameraStore>((set) => ({
  /* ----- initial state ----- */
  ...initialState,

  /* ----- actions ----- */
  setActive: (active: boolean) => set({ isActive: active }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (message: string) =>
    set({
      errorMessage: message,
      isLoading: false,
      isActive: false,
    }),

  clearError: () => set({ errorMessage: null }),

  setStream: (stream: MediaStream | null) => set({ stream }),

  reset: () =>
    set({
      isActive: false,
      isLoading: false,
      errorMessage: null,
      stream: null,
    }),
}))

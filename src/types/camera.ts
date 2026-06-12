/* ============================================================
   P3-T1a: Camera Type Definitions
   REQ-001 Phase 3 | 小星 Star Kids

   Defines CameraState, CameraActions, and the combined
   CameraStore type used by cameraStore.ts and useCamera.ts.
   ============================================================ */

/** Represents the camera's current operational state. */
export interface CameraState {
  /** Whether the camera stream is currently active and streaming to a <video>. */
  isActive: boolean

  /** Whether a permission request or getUserMedia call is in progress. */
  isLoading: boolean

  /** Human-readable error message (Chinese), or null when no error. */
  errorMessage: string | null

  /** The active MediaStream, or null when not streaming. */
  stream: MediaStream | null
}

/** Mutations available on the camera Zustand store. */
export interface CameraActions {
  setActive: (active: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (message: string) => void
  clearError: () => void
  setStream: (stream: MediaStream | null) => void
  reset: () => void
}

/** Combined store interface: state + actions. */
export type CameraStore = CameraState & CameraActions

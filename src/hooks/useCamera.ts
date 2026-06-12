/* ============================================================
   P3-T1c: useCamera Hook
   REQ-001 Phase 3 | 小星 Star Kids

   Manages the full camera lifecycle:
   1. Requests permission via Electron IPC
   2. Obtains video stream via getUserMedia
   3. Binds the stream to a <video> ref
   4. Exposes start / stop / toggle controls

   All persistent state lives in cameraStore (Zustand).
   ============================================================ */

import { useRef, useCallback } from 'react'
import { useCameraStore } from '@/stores/cameraStore'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const isActive = useCameraStore((s) => s.isActive)
  const isLoading = useCameraStore((s) => s.isLoading)
  const errorMessage = useCameraStore((s) => s.errorMessage)
  const setActive = useCameraStore((s) => s.setActive)
  const setLoading = useCameraStore((s) => s.setLoading)
  const setError = useCameraStore((s) => s.setError)
  const clearError = useCameraStore((s) => s.clearError)
  const setStream = useCameraStore((s) => s.setStream)
  const reset = useCameraStore((s) => s.reset)

  // ── start ──────────────────────────────────────────────────
  const start = useCallback(async () => {
    clearError()
    setLoading(true)

    try {
      // 1. Request camera permission via Electron main process
      const permitted = await window.electronAPI.getCameraPermission()
      if (!permitted) {
        setError('摄像头权限被拒绝。请在系统设置中允许访问摄像头。')
        return
      }

      // 2. Obtain video-only stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      })

      // 3. Bind stream to <video> element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setStream(stream)
      setActive(true)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '未知错误'

      if (
        message.includes('NotAllowedError') ||
        message.includes('Permission denied')
      ) {
        setError(
          '无法访问摄像头。请检查系统摄像头权限设置后重试。'
        )
      } else if (
        message.includes('NotFoundError') ||
        message.includes('DevicesNotFound')
      ) {
        setError(
          '未检测到摄像头设备。请连接摄像头后重试。'
        )
      } else {
        setError(`摄像头启动失败：${message}`)
      }
    } finally {
      setLoading(false)
    }
  }, [clearError, setLoading, setError, setStream, setActive])

  // ── stop ───────────────────────────────────────────────────
  const stop = useCallback(() => {
    // getState bypasses React subscription — fine for cleanup
    const { stream } = useCameraStore.getState()
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    reset()
  }, [reset])

  // ── toggle ─────────────────────────────────────────────────
  const toggle = useCallback(async () => {
    if (isActive) {
      stop()
    } else {
      await start()
    }
  }, [isActive, start, stop])

  return {
    videoRef,
    isActive,
    isLoading,
    error: errorMessage,
    start,
    stop,
    toggle,
  }
}

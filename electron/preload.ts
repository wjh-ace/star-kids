import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Request camera permission from the main process.
   * Returns true if permission is granted.
   */
  getCameraPermission: (): Promise<boolean> => {
    return ipcRenderer.invoke('request-camera')
  },

  /**
   * Get the current application version string.
   */
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version')
  },
})

/// <reference types="vite/client" />

interface ElectronAPI {
  getCameraPermission: () => Promise<boolean>
  getAppVersion: () => Promise<string>
}

interface Window {
  electronAPI: ElectronAPI
}

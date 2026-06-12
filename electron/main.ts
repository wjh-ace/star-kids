import { app, BrowserWindow, session, ipcMain } from 'electron'
import { join } from 'path'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    resizable: true,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  // Register IPC handlers
  ipcMain.handle('request-camera', async () => {
    // Permission is managed by setPermissionRequestHandler below
    return true
  })

  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  // Handle camera/microphone permission requests
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === 'media') {
        // Grant media permissions (camera, microphone)
        callback(true)
      } else {
        callback(false)
      }
    }
  )

  // Set Content-Security-Policy to allow localhost media (getUserMedia, etc.)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "media-src 'self' http://localhost:* https://localhost:*; " +
          "connect-src 'self' http://localhost:* ws://localhost:*; " +
          "img-src 'self' data:; " +
          "font-src 'self' data:;"
        ],
      },
    })
  })

  // Dev mode: load Vite dev server URL (set by vite-plugin-electron)
  // Prod mode: load built index.html
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    app.exit(0)
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

import { app, BrowserWindow, nativeTheme } from 'electron'
import { unlinkSync } from 'fs'
import { join } from 'path'

try {
  if (
    process.platform === 'win32' &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    unlinkSync(join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */

if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow: null | BrowserWindow = null

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: !!process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: !!process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  if (process.env.APP_URL) {
    try {
      await mainWindow.loadURL(process.env.APP_URL)
    } catch (error) {
      throw new Error(`Failed loading main window: ${error as string}`)
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  void (async () => {
    await createWindow()
  })()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  void (async () => {
    if (mainWindow === null) {
      await createWindow()
    }
  })()
})

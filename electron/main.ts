import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Set userData before app is ready to avoid cache permission errors on Windows
// TMC_INSTANCE env var allows running multiple instances simultaneously (e.g. for testing)
const instanceSuffix = process.env.TMC_INSTANCE ? `-${process.env.TMC_INSTANCE}` : ''
app.setPath('userData', path.join(app.getPath('appData'), `tmc-messenger${instanceSuffix}`))

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 820,
    height: 560,
    minWidth: 620,
    minHeight: 420,
    frame: false,
    roundedCorners: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#ffffff',
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('window:minimize', () => win?.minimize())
ipcMain.on('window:maximize', () => {
  if (win?.isMaximized()) win.unmaximize()
  else win?.maximize()
})
ipcMain.on('window:close', () => win?.close())

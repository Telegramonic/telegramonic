const {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage,
  screen,
  dialog,
  shell,
} = require('electron');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

function createWindow() {
  const iconPath = path.join(__dirname, 'public/icon.png');
  const isMac = process.platform === 'darwin';

  // Get screen dimensions and calculate 80% size
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } =
    primaryDisplay.workAreaSize;
  const windowWidth = Math.round(screenWidth * 0.9);
  const windowHeight = Math.round(screenHeight * 0.9);

  const mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    maximizable: true,
    backgroundColor: '#15111e',
    icon: iconPath,
    frame: isMac,
    titleBarStyle: isMac ? 'hidden' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  if (process.platform === 'darwin') {
    try {
      const image = nativeImage.createFromPath(iconPath);
      // Resize to 512x512 for macOS dock icon specifications
      const macIcon = image.resize({
        width: 512,
        height: 512,
        quality: 'best',
      });
      app.dock.setIcon(macIcon);
    } catch (err) {
      console.error('Failed to resize or set macOS dock icon:', err);
    }
  }

  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, 'build/index.html')}`;
  mainWindow.loadURL(startUrl);

  // Uncomment to open Chrome DevTools:
  // mainWindow.webContents.openDevTools();
}

// Register IPC handlers for window management
ipcMain.on('window-minimize', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) win.minimize();
});

ipcMain.on('window-close', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) win.close();
});

ipcMain.on('set-dock-icon', (event, dataUrl) => {
  if (process.platform === 'darwin') {
    try {
      const image = nativeImage.createFromDataURL(dataUrl);
      app.dock.setIcon(image);
    } catch (err) {
      console.error('Failed to set dock icon from data URL:', err);
    }
  }
});

ipcMain.on('open-external', (event, url) => {
  try {
    shell.openExternal(url);
  } catch (err) {
    console.error('Failed to open external URL:', err);
  }
});

ipcMain.handle('download-file-directly', async (event, { url, filename }) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (!win) return { success: false, error: 'No window found' };

  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    defaultPath: filename,
    title: 'Save File',
  });

  if (canceled || !filePath) {
    return { success: false, error: 'Canceled' };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    const fileStream = fs.createWriteStream(filePath);
    await finished(Readable.fromWeb(response.body).pipe(fileStream));
    return { success: true };
  } catch (err) {
    console.error('Failed to download file directly:', err);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore error deleting incomplete file
      }
    }
    return { success: false, error: err.message };
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err) => {
    console.error('Failed to initialize Electron application:', err);
  });

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

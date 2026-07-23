const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false, // Menghilangkan frame bawaan OS agar custom tombol close/minimize berfungsi
    webPreferences: {
      nodeIntegration: true,    // Mengaktifkan fitur Node.js di renderer
      contextIsolation: false,  // Mengizinkan renderer.js menggunakan require('electron')
      sandbox: false            // Menonaktifkan sandbox agar nodeIntegration berjalan penuh
    }
  });

  // Perbaikan path agar file HTML terbaca dengan benar di semua OS
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Mengaktifkan DevTools otomatis untuk mempermudah deteksi error jika layar masih putih
  //mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handler untuk tombol custom window manajemen di renderer.js
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  app.quit();
});
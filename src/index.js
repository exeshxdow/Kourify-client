const path = require('node:path');
const { app, BrowserWindow, globalShortcut, dialog, clipboard, ipcMain } = require('electron');




// Remember to handle window creation and other app logic


// Remember to handle window creation and other app logic

function blockAds() {
  const blockedUrls = [
      "ad.delivery.net",
      "ad.doubleclick.net",
      "api.adinplay.com"
  ];
  const open = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function(method, url) {
      open.apply(this, arguments)
      const send = this.send
      this.send = function() {
          if(!blockedUrls.includes(String(url))) {
              return send.apply(this, arguments)
          }
          console.log(`${String(url)} blocked`)
      }
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
    autoHideMenuBar: true // Set autoHideMenuBar to true
  });
  globalShortcut.register('F5', () => {
    mainWindow.reload()

  // Load the website URL
  mainWindow.loadURL('https://www.kour.io');
  

  // Make the window fullscreen
  mainWindow.setFullScreen(true);

   // Set a custom window title after the website has finished loading
   mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Kourify');
  });
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
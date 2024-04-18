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
    mainWindow.reload();
  });

  // Load the website URL
  mainWindow.loadURL('https://www.kour.io');
  

  // Make the window fullscreen
  mainWindow.setFullScreen(true);

   // Set a custom window title after the website has finished loading
   mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Kourify');
  });
};

const MAX_HISTORY_LENGTH = 15;
let imageHistory = [];

function getRandomImageUrl() {
    const imageUrls = [
        'https://i.imgur.com/KIq389u.gif',
        'https://i.imgur.com/21Vvlbd.gif',
        'https://i.imgur.com/ZPFeR4x.png',
        'https://i.imgur.com/HJWzaP5.png',
        'https://i.imgur.com/JfQ6A0M.png',
        'https://i.imgur.com/M2MpElR.png',
        'https://i.imgur.com/F4ChKPF.png',
        'https://i.imgur.com/BmmaDdY.png',
        'https://i.imgur.com/tZRtrzw.png',
        'https://64.media.tumblr.com/3862509863edc27f50c3d69e0ccd0da2/e913a89c98e2cce2-cf/s540x810/cfc6071743c7c8c9b511e29aa7156bfc260565f7.gif',
        'https://wallpapers.com/images/hd/faze-rug-q99q3iiuunspy2u6.jpg',
        'https://images3.alphacoders.com/124/124987.jpg',
        'https://i.imgur.com/H5q6R8A.gif',
        'https://i.imgur.com/ikteVGO.gif',
        'https://i.imgur.com/nE4ZFYY.jpeg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Blue_Screen_of_Death.png/800px-Blue_Screen_of_Death.png',
        'https://i.imgur.com/cmVNSNN.jpeg',
        'https://i.pinimg.com/600x315/24/47/e2/2447e2760fbe56dc160830aa008511b7.jpg',
        'https://wallpapercave.com/wp/wp5271794.jpg',
        'https://i.imgur.com/yMuB3fl.jpeg',
        'https://i.pinimg.com/564x/da/5d/a2/da5da23677ed14e331ccba375e519eff.jpg',
        'https://i.imgur.com/XyMp9PT.png',
        'https://logodix.com/logo/29740.png',
        'https://wallpapers.com/images/featured/cinnamoroll-laptop-4bjmy64xlmau32vy.webp',
        'https://e0.pxfuel.com/wallpapers/107/989/desktop-wallpaper-laptop-background-ideas-my-melody-sanrio-hello-kitty-cute-hello-kitty-laptop.jpg',
        'https://images3.alphacoders.com/133/1339216.png',
        'https://wallpapers.com/images/featured/kuromi-background-uourpdo4iz8zhtgp.jpg',
        'https://i.imgur.com/Q6feoxy.png',
        'https://64.media.tumblr.com/7367f4dd5eea259c2ca9fd967084a3ea/07bc9edb2ffd54d3-26/s1280x1920/b24ed94143bc58db5d31950dd0d9012876757bca.jpg',
        'https://i.imgur.com/pzaNCK9.png',
        'https://m.ncontentmobile.com/wordpress/wp-content/uploads/2017/08/Monkichi-1068x661.jpg',
        'https://static.wikia.nocookie.net/callofduty/images/4/49/Highrise-promo.jpg',
        'https://static.wikia.nocookie.net/callofduty/images/2/29/Favela_Map_MW2.jpg',
        'https://static.wikia.nocookie.net/callofduty/images/8/88/Carrier_loadscreen_BOII.png',
        'https://i.imgur.com/eYJ0V8B.jpeg',
        'https://i.pinimg.com/originals/53/73/91/537391efba4fef0628870aeb9e30dc62.jpg',
        'https://static1.thegamerimages.com/wordpress/wp-content/uploads/2021/03/pjimage-2021-03-04T165630.934.jpg',
        'https://i.ytimg.com/vi/PIKYirQ1ZGc/maxresdefault.jpg',
        'https://static.wikia.nocookie.net/callofduty/images/1/1e/Studio_loadscreen_BOII.png',
        'https://callofdutymaps.com/wp-content/uploads/nuketown2.jpg',
        'https://www.giantbomb.com/a/uploads/original/0/8272/1776958-scrapyard.jpg',
        'https://static.wikia.nocookie.net/callofduty/images/0/04/Detour_loadscreen_BOII.png',
        'https://static.wikia.nocookie.net/callofduty/images/8/8a/Loadscreen_mp_quarry.jpg',
        'https://static.wikia.nocookie.net/callofduty/images/3/3a/Rundown-prev.jpg',
        'https://static.wikia.nocookie.net/callofduty/images/8/83/Afghan_loading_screen_MW2.png',
        'https://static.wikia.nocookie.net/callofduty/images/9/9f/Karachi-prev.jpg',
        'https://www.csgowallpapers.com/assets/images/original/csgowallpaper_13460935092_1621945725_765508642300.jpg',
        'https://i.imgur.com/I79PHqD.png',
    ];
    const availableImages = imageUrls.filter(url => !imageHistory.includes(url));

    if (availableImages.length === 0) {
        imageHistory = [];
        return getRandomImageUrl(); 
    }

    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImageUrl = availableImages[randomIndex];

    imageHistory.push(selectedImageUrl);

    if (imageHistory.length > MAX_HISTORY_LENGTH) {
        imageHistory.shift(); 
    }
    return selectedImageUrl;
}



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

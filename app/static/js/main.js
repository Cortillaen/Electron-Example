const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  /*
  Author: Trenton Nale
  Description: Creates a window and loads the initial page of our app
  Input: N/A
  Output: N/A
  Notes: N/A
  */
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(url.format({
    pathname: path.join(path.join(path.dirname(__dirname), 'html'), 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {/*
  Author: Unknown
  Description: This function is called once all windows of the app have been closed.
  Input: N/A
  Output: N/A
  Notes: The contents ensure that the app exits properly in all OSes
  */
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  /*
  Author: Trenton Nale
  Description: When the app is started, create the window
  Input: N/A
  Output: N/A
  Notes: N/A
  */
  if (mainWindow === null) {
    createWindow();
  }
})

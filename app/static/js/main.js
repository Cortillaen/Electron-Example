const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow


const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
  pathname: path.join(path.join(path.dirname(__dirname), 'html'), 'index.html'),
  protocol: 'file:',
  slashes: true,

}))

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.maximize();
  mainWindow.setResizable(false);
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

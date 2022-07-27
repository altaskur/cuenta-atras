const { app, BrowserWindow } = require('electron')
const path = require('path')

const { createConfigFile } = require("./integridad");
const { controladorBd } = require("./db/bd")

createConfigFile;
controladorBd;


const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 300,
    height: 465,
    icon: path.join(__dirname, './assets/ico.ico'),
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.removeMenu();
  mainWindow.setResizable(false);

  //Open the DevTools.
  //mainWindow.webContents.openDevTools();
}



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

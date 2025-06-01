const { app, BrowserWindow } = require('electron');
const path = require('path');
const { inicializarIPC } = require('./ipcHandlers');
require('./integridad');

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 490,
    icon: path.join(__dirname, './assets/ico.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true, 
    resizable: false
  });
  mainWindow.loadFile('src/index.html');
  
  // Inicializar los handlers de IPC después de crear la ventana
  inicializarIPC(mainWindow);
};

app.whenReady().then(createWindow);

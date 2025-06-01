const { ipcMain } = require('electron');

let timer = null;
let tiempoRestante = 0;

function sendTick() {
  if (global.mainWindow) {
    global.mainWindow.webContents.send('tick', tiempoRestante);
  }
}

ipcMain.on('start-timer', (event, segundos) => {
  clearInterval(timer);
  tiempoRestante = segundos;
  sendTick();
  timer = setInterval(() => {
    tiempoRestante--;
    sendTick();
    if (tiempoRestante <= 0) clearInterval(timer);
  }, 1000);
});

ipcMain.on('stop-timer', () => {
  clearInterval(timer);
});

ipcMain.on('anadir-minutos', (event, segundosExtra) => {
  tiempoRestante += segundosExtra;
  sendTick();
});

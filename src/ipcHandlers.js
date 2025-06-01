const { ipcMain } = require('electron');
const { guardarTextoClock, guardarTituloDescripcion, leerTituloDescripcion } = require('./db/bd');
const { leerConfiguracion, guardarConfiguracion } = require('./integridad');

let timer = null;
let tiempoRestante = 0;
let mainWindow = null;
let textoInicial = "";
let textoFinal = "";
let configuracion = null;

function formatearTiempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function sendTick() {
  if (mainWindow) {
    mainWindow.webContents.send('tick', tiempoRestante);
    
    // Actualizar el archivo de reloj con el tiempo actual y los textos
    let textoReloj = "";
    if (tiempoRestante > 0) {
      textoReloj = textoInicial + " " + formatearTiempo(tiempoRestante);
    } else {
      textoReloj = textoFinal;
    }
    
    try {
      guardarTextoClock(textoReloj);
    } catch (error) {
      console.error("Error al guardar el texto del reloj:", error);
    }
  }
}

function inicializarIPC(win) {
  mainWindow = win;
  
  // Cargar configuración al iniciar
  configuracion = leerConfiguracion();
  if (configuracion) {
    textoInicial = configuracion.textoInicial || "";
    textoFinal = configuracion.textoFinal || "";
  }

  // Enviar configuración inicial al frontend
  if (mainWindow) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('configuracion-cargada', configuracion);
    });
  }

  // Handlers para el timer
  ipcMain.on('start-timer', (event, segundos) => {
    clearInterval(timer);
    tiempoRestante = segundos;
    
    // Guardar la configuración cuando se inicia el timer
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    guardarConfiguracion({
      min,
      seg,
      textoInicial,
      textoFinal
    });
    
    sendTick();
    timer = setInterval(() => {
      tiempoRestante--;
      sendTick();
      if (tiempoRestante <= 0) {
        clearInterval(timer);
        tiempoRestante = 0; // Asegura que no sea negativo
        sendTick();
      }
    }, 1000);
  });

  ipcMain.on('stop-timer', () => {
    clearInterval(timer);
  });

  ipcMain.on('anadir-minutos', (event, segundosExtra) => {
    tiempoRestante += segundosExtra;
    
    // Asegurar que el tiempo no sea negativo
    if (tiempoRestante < 0) {
      tiempoRestante = 0;
    }
    
    // Guardar minutos extra en la configuración
    guardarConfiguracion({
      extra: Math.floor(Math.abs(segundosExtra) / 60) * (segundosExtra < 0 ? -1 : 1)
    });
    
    sendTick();
  });
  
  // Actualizar textos del timer
  ipcMain.on('actualizar-textos', (event, { textoInicial: inicial, textoFinal: final }) => {
    textoInicial = inicial || "";
    textoFinal = final || "";
    
    // Guardar textos en configuración
    guardarConfiguracion({
      textoInicial,
      textoFinal
    });
    
    sendTick();
  });

  // Handlers para título y descripción
  ipcMain.on('guardarTituloDescripcion', (event, { titulo, descripcion }) => {
    try {
      guardarTituloDescripcion(titulo, descripcion);
      event.reply('guardarTituloDescripcionRespuesta', { ok: true });
    } catch (error) {
      event.reply('guardarTituloDescripcionRespuesta', { ok: false, error: error.message });
    }
  });

  ipcMain.handle('leerTituloDescripcion', async () => {
    try {
      return leerTituloDescripcion();
    } catch (error) {
      console.error("Error al leer título y descripción:", error);
      return { titulo: "", descripcion: "" };
    }
  });
  
  // Nuevo handler para leer configuración
  ipcMain.handle('leerConfiguracion', async () => {
    try {
      return leerConfiguracion();
    } catch (error) {
      console.error("Error al leer configuración:", error);
      return null;
    }
  });
}

module.exports = { inicializarIPC };

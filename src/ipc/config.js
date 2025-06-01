const { ipcMain } = require('electron');
const fs = require('fs');
const { configFilePath } = require('../integridad');

// Funciones auxiliares para leer y escribir configuración
function leerConfig() {
  try {
    return JSON.parse(fs.readFileSync(configFilePath, "utf8"));
  } catch (err) {
    console.error("Error leyendo configuración:", err);
    return {};
  }
}

function guardarConfig(config) {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error guardando configuración:", err);
    return false;
  }
}

// Handler tradicional para compatibilidad
ipcMain.on("requestOptions", (event) => {
  const config = leerConfig();
  event.reply("getOptions", config);
});

// Handler tipo invoke/promesa para mayor compatibilidad
ipcMain.handle("getOptions", async () => {
  return leerConfig();
});

ipcMain.on("actualizarOpciones", (event, arg) => {
  guardarConfig(arg);
});

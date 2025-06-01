const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { appPath } = require('../integridad');

const tituloFilePath = path.join(appPath, "titulo.txt");
const descripcionFilePath = path.join(appPath, "descripcion.txt");

ipcMain.on("guardarTituloDescripcion", (event, { titulo, descripcion }) => {
  try {
    fs.writeFileSync(tituloFilePath, titulo || "", "utf8");
    fs.writeFileSync(descripcionFilePath, descripcion || "", "utf8");
    event.reply("guardarTituloDescripcionRespuesta", { ok: true });
  } catch (err) {
    event.reply("guardarTituloDescripcionRespuesta", { ok: false, error: err.message });
  }
});

ipcMain.handle("leerTituloDescripcion", async () => {
  try {
    const titulo = fs.existsSync(tituloFilePath) ? fs.readFileSync(tituloFilePath, "utf8") : "";
    const descripcion = fs.existsSync(descripcionFilePath) ? fs.readFileSync(descripcionFilePath, "utf8") : "";
    return { titulo, descripcion };
  } catch (err) {
    return { titulo: "", descripcion: "" };
  }
});

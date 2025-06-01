const fs = require("fs");
const path = require("path");
const { appPath, configFilePath } = require("../integridad");

const tituloFilePath = path.join(appPath, "titulo.txt");
const descripcionFilePath = path.join(appPath, "descripcion.txt");
const clockFilePath = path.join(appPath, "clock.txt"); 

function guardarTextoClock(texto) {
  fs.writeFileSync(clockFilePath, texto, "utf8");
}

function guardarTituloDescripcion(titulo, descripcion) {
  fs.writeFileSync(tituloFilePath, titulo || "", "utf8");
  fs.writeFileSync(descripcionFilePath, descripcion || "", "utf8");
}

function leerTituloDescripcion() {
  const titulo = fs.existsSync(tituloFilePath) ? fs.readFileSync(tituloFilePath, "utf8") : "";
  const descripcion = fs.existsSync(descripcionFilePath) ? fs.readFileSync(descripcionFilePath, "utf8") : "";
  return { titulo, descripcion };
}

module.exports = {
  guardarTextoClock,
  guardarTituloDescripcion,
  leerTituloDescripcion,
  configFilePath
};

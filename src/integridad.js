const fs = require("fs");
const path = require("path");
const os = require("os");

const _OS_PLATFORM = os.platform();
const _USER_HOME = os.homedir();

const options = {
  "min": 0,
  "seg": 0,
  "extra": 0,
  "textoInicial": "",
  "textoFinal": ""
};

function setPath() {
  return _OS_PLATFORM === "linux"
    ? path.join(_USER_HOME, "cuenta_atras")
    : path.join("C:", "cuenta_atras");
}

const appPath = setPath();
const configFilePath = path.join(appPath, "cuenta_atras.conf");

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureConfigFileExists(filePath, options) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(options, null, 2), "utf8");
  }
}

// Nueva función para leer la configuración
function leerConfiguracion() {
  try {
    if (fs.existsSync(configFilePath)) {
      const datos = fs.readFileSync(configFilePath, "utf-8");
      return JSON.parse(datos);
    } else {
      return options; // Devuelve opciones por defecto si no existe
    }
  } catch (error) {
    console.error("Error al leer la configuración:", error);
    return options; // Devuelve opciones por defecto en caso de error
  }
}

// Nueva función para guardar la configuración
function guardarConfiguracion(nuevaConfig) {
  try {
    const configActual = leerConfiguracion();
    const configActualizada = { ...configActual, ...nuevaConfig };
    fs.writeFileSync(configFilePath, JSON.stringify(configActualizada, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error al guardar la configuración:", error);
    return false;
  }
}

// Ejecutar al cargar el módulo
ensureDirectoryExists(appPath);
ensureConfigFileExists(configFilePath, options);

module.exports = {
  appPath,
  configFilePath,
  options,
  leerConfiguracion,
  guardarConfiguracion
};

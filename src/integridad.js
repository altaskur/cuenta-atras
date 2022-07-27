const fs = require("fs");
const path = require("path");
const os = require("os");

// Constantes de plataforma
const _OS_PLATFORM = os.platform();
const _USER_HOME = os.homedir();

// configuración predeterminada
options = {
  "min": 0,
  "seg": 0,
  "extra": 0,
  "textoInicial": "",
  "textoFinal": ""
}

function setPath() {
  rootPath = _OS_PLATFORM == "linux" ? path.join(_USER_HOME, "cuenta_atras") : path.join("C:", "cuenta_atras");
  return rootPath;
}

appPath = setPath();
configFilePath = path.join(appPath, "cuenta_atras.conf");
 
function createConfigFile(configFilePath) {

  function _createDirectory(path) {
    try {
      fs.statSync(path);
    } catch (e) {
      fs.mkdirSync(path);
    }
  }

  function _createConfigFile(path, options) {
    try {
      fs.statSync(path);
    } catch (e) {
      options = JSON.stringify(options, null, 2);
      fs.writeFileSync(path, options, "utf-8");
    }
  }

  _createDirectory(appPath);
  _createConfigFile(configFilePath, options);

}

exports.createConfigFile = createConfigFile(configFilePath);
exports.appPath = appPath;
exports.configFilePath = configFilePath;

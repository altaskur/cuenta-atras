const fs = require("fs");
const path = require("path");

const { ipcMain } = require("electron");
const { appPath, configFilePath } = require("../integridad");

clockFilePath = path.join(appPath,"reloj.txt")

function bdController() {

    // Recibir las opciones del archivo local
    ipcMain.on("requestOptions", (event, arg) => {
        
        let config =  JSON.parse(fs.readFileSync(configFilePath));
        event.reply("getOptions", config);

    });

    // Escribir en el texto que va a capturar OBS
    ipcMain.on("actualizarTexto", (event, arg) => {

        fs.writeFileSync(clockFilePath, arg);

    });

    // Escribir en las opciones del archivo local
    ipcMain.on("actualizarOpciones", (event, arg) => {

        fs.writeFileSync(configFilePath, JSON.stringify(arg));

    });
   
}

exports.controladorBd = bdController();
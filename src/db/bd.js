const fs = require("fs");
const path = require("path");
const os = require("os");
const { ipcMain } = require("electron");

// Comprobar el sistema operativo
// Buscar en C: o en /home/user en el caso de ser linux
// la carpeta del programa, en el caso de no encontrarla la creará


// Pertenece a S.O Windows de forma predeterminada
var rutaPrincipal = path.join("C:", "cuenta_atras");

// Constantes de plataforma
const sistemaOperativo = os.platform();
const homeUsuario = os.homedir();

// Cambio de ruta si es un sistema Linux
if (sistemaOperativo == "linux") {
    rutaPrincipal = homeUsuario + "/cuenta_atras";
}

var rutaArchivoConfig = path.join(rutaPrincipal, "cuenta_atras.conf");
var rutaArchivoReloj = path.join(rutaPrincipal,"reloj.txt")

function controladorBd() {

    // Recibir las opciones del archivo local
    ipcMain.on("recibir-opciones", (event, arg) => {
        
        let config = fs.readFileSync(rutaArchivoConfig);
        config = JSON.parse(config);

        event.reply("recibir-opciones", config);

    });

    // Escribir en el texto que va a capturar OBS
    ipcMain.on("actualizarTexto", (event, arg) => {

        fs.writeFileSync(rutaArchivoReloj, arg);

    });

    // Escribir en las opciones del archivo local
    ipcMain.on("actualizarOpciones", (event, arg) => {

        arg = JSON.stringify(arg);
        fs.writeFileSync(rutaArchivoConfig, arg);

    });
       
        
   
}

exports.controladorBd = controladorBd();
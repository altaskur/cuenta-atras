const fs = require("fs");
const path = require("path");
const os = require("os");

// Comprobar el sistema operativo
// Buscar en C: o en /home/user en el caso de ser linux
// la carpeta del programa, en el caso de no encontrarla la creará


// Pertenece a S.O Windows de forma predeterminada
var rutaPrincipal = path.join("C:", "cuenta_atras");

// Constantes de plataforma
const sistemaOperativo = os.platform();
const homeUsuario = os.homedir();

// configuración predeterminada
var opciones = {
  "min": 0,
  "seg": 0,
  "extra": 0,
  "textoInicial": "",
  "textoFinal": ""
}


function inicioDirectorios() {

  // Cambio de ruta si es un sistema Linux
  if (sistemaOperativo == "linux") {
    rutaPrincipal = homeUsuario + "/cuenta_atras";
  }

  var rutaArchivoConfig = path.join(rutaPrincipal, "cuenta_atras.conf");

  // Comprobamos que el directorio existe
  // en el caso contrario lo creamos


    console.log("Comprobando ruta principal")
    console.log(rutaPrincipal)

    let existeRuta = fs.existsSync(rutaPrincipal)
    if ( existeRuta === false){
      fs.mkdirSync(rutaPrincipal, function (err, result) {
        if (err) console.log(result);
        return false;
      });
    }
 

  // Comprobamos si el archivo de configuración existe
  // en el caso contrario lo creamos


    console.log("Comprobando ruta del archivo de configuración")
    console.log(rutaArchivoConfig);

    let existeArchivo = fs.existsSync(rutaArchivoConfig);

    if ( existeArchivo === false ){
      opciones = JSON.stringify(opciones, null, 2);
      fs.writeFileSync(rutaArchivoConfig, opciones, "utf-8");

    }


}

exports.integridadDirectorios = inicioDirectorios();
const {
    ipcRenderer
} = require("electron");

const shell = require('electron').shell

var opciones;
var estaParado = true;
var tiempo = 0;
var cicloInicial = true;
var datoMostrar;

async function cargarOpciones() {

    // Enviamos al proceso principal de ElectronJs la petición de los datos en el 
    // archivo local y quedamos a la espera de la respuesta.
    ipcRenderer.send("recibir-opciones", "");
    await new Promise((resolve, reject) => { // espera hasta que la promesa se resuelva (*)
        ipcRenderer.once("recibir-opciones", (event, arg) => {
            opciones = arg;
            resolve(arg);
            console.log("datos:")
            console.log(arg)
        });
    });


    // Capturamos los botones
    let botones = document.querySelectorAll("input[type=button]");

    let botonExtra = botones[0];
    let botonEmpezarPausa = botones[1];
    let botonFinalizar = botones[2];


    // Capturamos el display
    let contenedorReloj = document.querySelector(".reloj");

    // Capturamos los campos y rellenamos con los datos del .json local
    let campoMinutos = document.getElementById("minutos");
    opciones.min != 0 ? campoMinutos.value = parseInt(opciones.min, 10) : " ";

    let campoSegundos = document.getElementById("segundos");
    opciones.min != 0 ? campoSegundos.value = Math.round(parseInt(opciones.seg, 10)) : " ";

    let campoExtra = document.getElementById("extra");
    opciones.extra != 0 ? campoExtra.value = opciones.extra : campoExtra.value = 0;

    let textoInicio = document.getElementById("textoInicio");
    opciones.textoInicio == undefined ? textoInicio.value = " " : textoInicio.value = opciones.textoInicio;

    let textoFinal = document.getElementById("textoFinal");
    opciones.textoFinal == undefined ? textoFinal.value = " " : textoFinal.value = opciones.textoFinal;


    // Pasamos a la variable dato a mostrar el texto inicial
    datoMostrar = textoInicio.value
    console.log(datoMostrar)

    textoInicio.addEventListener("keyup", () => {
        console.log("¿Esta parado? " + estaParado)
        console.log("¿Esta en el ciclo inicial? " + cicloInicial)
        if (estaParado && cicloInicial) {
            datoMostrar = textoInicio.value;

            ipcRenderer.send("actualizarTexto", textoInicio.value);
        }
        console.log(datoMostrar)
    });

    // Añadimos las escuchas de evento para los botones
    botonExtra.addEventListener("click", () => {
        console.log("has pulsado extra");
        let valorExtra = parseInt(campoExtra.value, 10)
        if (isNaN(valorExtra)) {
            valorExtra = 0;
        }

        tiempo += (valorExtra * 60);
        console.log(tiempo)
    });

    botonEmpezarPausa.addEventListener("click", () => {
        console.log("has pulado en start stop");
        console.log("¿Es la primera vez que me inicio? " + cicloInicial)

        if (estaParado == true) {
            // Si esta parado lo ponemos en marcha
            estaParado = false;

            if (cicloInicial) {

                cicloInicial = false;
                let min;
                let seg;

                if (isNaN(parseInt(campoMinutos.value, 10))) {
                    min = 0;
                    campoMinutos.value = 0;
                } else {
                    min = parseInt(campoMinutos.value, 10)
                }
                min = (min * 60);


                if (isNaN(parseInt(campoSegundos.value, 10))) {
                    seg = 0;
                    campoSegundos.value = 0;

                } else {
                    seg = parseInt(campoSegundos.value, 10)
                }

                tiempo = min + seg;

                console.log("Minutos: " + min)
                console.log("Segundos: " + seg)
                console.log("tiempo total: " + tiempo);

                let opcionesGuardar = {
                    "min": Math.round(parseInt(min, 10) / 60),
                    "seg": seg,
                    "extra": campoExtra.value,
                    "textoFinal": textoFinal.value,
                    "textoInicio": textoInicio.value
                }

                console.log(opcionesGuardar)
                ipcRenderer.send("actualizarOpciones", opcionesGuardar);
            }
            botonEmpezarPausa.value = "Parar";

        } else {
            estaParado = true;

            if (cicloInicial) {
                botonEmpezarPausa.value = "Empezar";
            } else {
                botonEmpezarPausa.value = "Continuar"
            }
        }


    });

    botonFinalizar.addEventListener("click", () => {
        let opcionesGuardar = {
            "min": campoMinutos.value,
            "seg": campoSegundos.value,
            "extra": campoExtra.value,
            "textoFinal": textoFinal.value,
            "textoInicio": textoInicio.value
        }

        ipcRenderer.send("actualizarOpciones", opcionesGuardar);

        ipcRenderer.send("actualizarTexto", datoMostrar);
        console.log("has pulsado finalizar");
        tiempo = 0;
        botonEmpezarPausa.value = "Empezar";
        cicloInicial = true;
    });


    // Ciclo principal del contador cada 1sec
    var t = window.setInterval(() => {

        let min = Math.round((tiempo / 60));
        min < 60 ? min = 0 : "";
        min < 10 ? min = "0" + min : "";

        let sec = Math.round((tiempo % 60));
        sec < 10 ? sec = "0" + sec : "";

        contenedorReloj.textContent = min + ":" + sec;

        cicloInicial == true ? datoMostrar = textoInicio.value : "";
        console.log(tiempo)
        if (!estaParado) {
            if (tiempo <= 0) {
                estaParado = true;
                cicloInicial = true;
                contenedorReloj.textContent = 0 + ":" + 0;
                datoMostrar = textoFinal.value;
                tiempo = 0;
                botonEmpezarPausa.value = "Empezar";

            } else {
                tiempo--;
                datoMostrar = min + ":" + sec;
                console.log(datoMostrar)
            }
            ipcRenderer.send("actualizarTexto", datoMostrar);
        }



        console.log(datoMostrar);

    }, 1000);

    // Hacemos que se abran los links en el navegador
    // predeterminado del equipo cliente.

    let enlaces = document.querySelectorAll('a[href]');

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", (event) =>{
            event.preventDefault();
            shell.openExternal(enlace.href)
        });
    });

}


cargarOpciones();
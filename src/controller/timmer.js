const { ipcRenderer } = require("electron");

const shell = require('electron').shell

configOptions = {};
clockStopped = true;
time = 0;
initialCycle = true;
initialText = "";

async function cargarOpciones() {


    ipcRenderer.send("requestOptions", "");
    await new Promise((resolve, reject) => { // espera hasta que la promesa se resuelva (*)
        ipcRenderer.once("getOptions", (event, arg) => {
            configOptions = arg;
            resolve(arg);
        });
    });


    // Capturamos los botones
    let inputButtons = document.querySelectorAll("input[type=button]");

    let inputButtonTimeExtra = inputButtons[0];
    let inputButtonStartStop = inputButtons[1];
    let inputButtonEnd = inputButtons[2];


    // Capturamos el display
    let containerClock = document.querySelector(".reloj");

    // Capturamos los campos y rellenamos con los datos del .json local
    let containerMinutes = document.querySelector("#minutos");
    configOptions.min != 0 ? containerMinutes.value = parseInt(configOptions.min, 10) : null;

    let containerSeconds = document.querySelector("#segundos");
    configOptions.min != 0 ? containerSeconds.value = Math.round(parseInt(configOptions.seg, 10)) : null;

    let containerTimeExtra = document.querySelector("#extra");
    configOptions.extra != 0 ? containerTimeExtra.value = configOptions.extra : containerTimeExtra.value = 0;

    let containerInitialText = document.querySelector("#textoInicial");
    
    configOptions.InitialText == undefined ? containerInitialText.value = "" : containerInitialText.value = configOptions.InitialText;

    let containerFinalText = document.querySelector("#textoFinal");
    configOptions.finalText == undefined ? containerFinalText.value = " " : containerFinalText.value = configOptions.finalText;


    // Pasamos a la variable dato a mostrar el texto inicial
    containerInitialText.addEventListener("keyup", () => {
        initialText = containerInitialText.value
        if (clockStopped && initialCycle) {
            ipcRenderer.send("actualizarTexto", initialText);
        }
    });

    // Añadimos las escuchas de evento para los botones
    inputButtonTimeExtra.addEventListener("click", () => {
        let extraTime = parseInt(containerTimeExtra.value, 10);

        if (isNaN(extraTime)) {
            extraTime = 0;
        }
        time += (extraTime * 60);
    });

    initialCycle == true && clockStopped == true ? ipcRenderer.send("actualizarTexto", configOptions.InitialText) : null;

    // Ciclo principal del contador cada 1sec
    function mainLoop() {
        clock = window.setInterval(() => {

            let min = Math.floor(time / 60);
            time < 60 ? min = 0 : "";
            min = min < 10 ? "0" + min : "";

            let sec = Math.round((time % 60));
            sec < 10 ? sec = "0" + sec : "";

            containerClock.textContent = min + ":" + sec;
            initialCycle == true ? initialText = containerInitialText.value : "";

            if (!clockStopped) {
                if (time <= 0 ) {
                    clockStopped = true;
                    initialCycle = true;
                    containerClock.textContent = 0 + ":" + 0;
                    initialText = containerFinalText.value;
                    time = 0;
                    inputButtonStartStop.value = "Empezar";
                } else {
                    time--;
                    initialText = min + ":" + sec;
                }
                ipcRenderer.send("actualizarTexto", initialText);
            }

        }, 1000);
    }

    inputButtonStartStop.addEventListener("click", () => {
        // stop set interval

        if (clockStopped == true) {
            // Si esta parado lo ponemos en marcha
            clockStopped = false;
            mainLoop();
             if (initialCycle) {

                 initialCycle = false;
                let min;
                let seg;

                if (isNaN(parseInt(containerMinutes.value, 10))) {
                    min = 0;
                    containerMinutes.value = 0;
                } else {
                    min = parseInt(containerMinutes.value, 10)
                }
                min = (min * 60);


                if (isNaN(parseInt(containerSeconds.value, 10))) {
                    seg = 0;
                    containerSeconds.value = 0;
                } else {
                    seg = parseInt(containerSeconds.value, 10)
                }
                time = min + seg;

                let opcionesGuardar = {
                    "min": Math.round(parseInt(min, 10) / 60),
                    "seg": seg,
                    "extra": containerTimeExtra.value,
                    "finalText": containerFinalText.value,
                    "InitialText": containerInitialText.value
                }
                ipcRenderer.send("actualizarOpciones", opcionesGuardar);
             }
            inputButtonStartStop.value = "Parar";

        } else {
            clockStopped = true;
            clearInterval(clock);
            initialCycle ? inputButtonStartStop.value = "Empezar" : inputButtonStartStop.value = "Continuar";
        }


    });

    inputButtonEnd.addEventListener("click", () => {
        clearInterval(clock);
        let opcionesGuardar = {
            "min": containerMinutes.value,
            "seg": containerSeconds.value,
            "extra": containerTimeExtra.value,
            "finalText": containerFinalText.value,
            "InitialText": containerInitialText.value
        }

        ipcRenderer.send("actualizarOpciones", opcionesGuardar);
        ipcRenderer.send("actualizarTexto", containerFinalText.value);

        time = 0;
        inputButtonStartStop.value = "Empezar";
        initialCycle = true;
    });


    // Hacemos que se abran los links en el navegador
    // predeterminado del equipo cliente.

    let enlaces = document.querySelectorAll('a[href]');

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", (event) => {
            event.preventDefault();
            shell.openExternal(enlace.href)
        });
    });

}


cargarOpciones();

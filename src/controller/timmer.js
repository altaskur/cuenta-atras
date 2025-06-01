const { ipcRenderer } = require("electron");
const shell = require('electron').shell;

document.addEventListener("DOMContentLoaded", () => {

  // Elementos del DOM
  const btnEmpezar = document.getElementById('btnEmpezar');
  const btnFinalizar = document.getElementById('btnFinalizar');
  const btnAnadir = document.getElementById('btnAnadir');
  const inputExtra = document.getElementById('extra');
  const inputMinutos = document.getElementById('minutos');
  const inputSegundos = document.getElementById('segundos');
  const reloj = document.getElementById('reloj');
  const textoInicialInput = document.getElementById('textoInicial');
  const textoFinalInput = document.getElementById('textoFinal');

  // Cargar configuración inicial
  ipcRenderer.invoke('leerConfiguracion').then(config => {
    if (config) {
      inputMinutos.value = config.min || 0;
      inputSegundos.value = config.seg || 0;
      inputExtra.value = config.extra || 0;
      textoInicialInput.value = config.textoInicial || "";
      textoFinalInput.value = config.textoFinal || "";
    }
  });

  // También escuchar por configuración enviada desde el proceso principal
  ipcRenderer.on('configuracion-cargada', (event, config) => {
    if (config) {
      inputMinutos.value = config.min || 0;
      inputSegundos.value = config.seg || 0;
      inputExtra.value = config.extra || 0;
      textoInicialInput.value = config.textoInicial || "";
      textoFinalInput.value = config.textoFinal || "";
    }
  });

  // Función para actualizar los textos en el proceso principal
  function actualizarTextos() {
    ipcRenderer.send('actualizar-textos', {
      textoInicial: textoInicialInput.value.trim(),
      textoFinal: textoFinalInput.value.trim()
    });
  }

  // Toast personalizado
  function showCustomToast(msg, color = "#222") {
    const toast = document.getElementById("custom-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = color;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  btnEmpezar.addEventListener('click', (e) => {
    e.preventDefault();
    const min = parseInt(inputMinutos.value, 10) || 0;
    const seg = parseInt(inputSegundos.value, 10) || 0;
    
    // Actualizar los textos primero
    actualizarTextos();
    
    // Iniciar el timer
    ipcRenderer.send('start-timer', min * 60 + seg);

    showCustomToast("¡Comenzando cuenta atrás!", "#198754");
  });

  btnFinalizar.addEventListener('click', () => {
    ipcRenderer.send('stop-timer');
  });

  btnAnadir.addEventListener('click', () => {
    const extraMin = parseInt(inputExtra.value, 10) || 0;
    // Ahora permitimos valores negativos para restar tiempo
    ipcRenderer.send('anadir-minutos', extraMin * 60);
    // No limpiamos el valor para mantenerlo en la configuración
  });

  // Escuchar cambios en los textos inicial/final
  textoInicialInput.addEventListener('change', actualizarTextos);
  textoFinalInput.addEventListener('change', actualizarTextos);

  ipcRenderer.on('tick', (event, tiempoRestante) => {
    const min = Math.floor(tiempoRestante / 60);
    const seg = tiempoRestante % 60;
    reloj.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  });

  // Validación de título y descripción
  const btnEstablecer = document.getElementById("btnEstablecerTituloDesc");
  const mensajeError = document.getElementById("mensajeErrorTituloDesc");
  if (btnEstablecer) {
    btnEstablecer.addEventListener("click", (e) => {
      e.preventDefault();
      const titulo = document.getElementById("tituloDirecto")?.value.trim() || "";
      const descripcion = document.getElementById("descripcionDirecto")?.value.trim() || "";

      if (!titulo || !descripcion) {
        mensajeError.textContent = "El título y la descripción no pueden estar vacíos.";
        mensajeError.classList.remove("d-none");
        return;
      } else {
        mensajeError.classList.add("d-none");
      }

      ipcRenderer.send("guardarTituloDescripcion", { titulo, descripcion });
    });

    ipcRenderer.on("guardarTituloDescripcionRespuesta", (event, data) => {
      if (data.ok) {
        mensajeError.classList.add("d-none");
        showCustomToast("Título y descripción establecidos", "#0dcaf0");
      } else {
        mensajeError.textContent = "Error al guardar: " + data.error;
        mensajeError.classList.remove("d-none");
      }
    });
  }

  // Cargar título y descripción
  ipcRenderer.invoke("leerTituloDescripcion").then(({ titulo, descripcion }) => {
    const inputTitulo = document.getElementById("tituloDirecto");
    const inputDescripcion = document.getElementById("descripcionDirecto");
    if (inputTitulo) inputTitulo.value = titulo || "";
    if (inputDescripcion) inputDescripcion.value = descripcion || "";
  });

  // Abrir enlaces externos
  document.querySelectorAll('a[href]').forEach(enlace => {
    enlace.addEventListener("click", (event) => {
      event.preventDefault();
      shell.openExternal(enlace.href);
    });
  });
});

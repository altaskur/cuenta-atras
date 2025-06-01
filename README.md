# ⏳ cuenta-atras

[<img src="https://img.shields.io/github/last-commit/altaskur/cuenta-atras?style=for-the-badge"></img>](https://github.com/altaskur/cuenta-atras/commits/main)
[<img src="https://img.shields.io/github/license/altaskur/cuenta-atras?style=for-the-badge">](https://github.com/altaskur/cuenta-atras/blob/main/LICENSE)
[<img src="https://img.shields.io/github/languages/top/altaskur/cuenta-atras?style=for-the-badge">](https://github.com/altaskur/cuenta-atras)
[<img src="https://img.shields.io/github/v/tag/altaskur/cuenta-atras?label=Release&style=for-the-badge">](https://github.com/altaskur/cuenta-atras/releases/tag/v1.2.0)

**cuenta-atras** es una aplicación de escritorio hecha en **Electron.js** que genera archivos de texto para facilitar la integración de una cuenta regresiva personalizada en **OBS Studio**.

Ideal para streamers que quieren mostrar un temporizador, título y descripción dinámicamente en sus escenas.

---

## 🚀 Características

- ⏳ Genera una cuenta regresiva personalizada en `reloj.txt`.
- 📝 Permite añadir texto antes y después de la cuenta atrás.
- 🖋️ Guarda el título (`titulo.txt`) y la descripción (`descripcion.txt`) del directo en tiempo real.
- 💾 Guarda la configuración y todos los textos en la carpeta `C:/cuenta-atras` para su reutilización automática.
- 💡 Interfaz simple con campos para minutos, segundos, textos y botones de control.
- 🔔 Incluye notificaciones visuales (toasts) y validaciones para evitar errores.
- 🎯 Totalmente compatible con OBS Studio mediante la opción "leer desde archivo".

---

## 📦 Instalación y uso

1. Clona este repositorio:

   ```bash
   git clone https://github.com/altaskur/cuenta-atras.git
   cd cuenta-atras
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Lanza la app:

   ```bash
   npm start
   ```

---

## 🎥 Integración con OBS

1. Abre OBS.
2. Añade una nueva fuente de texto (`Texto (GDI+)`).
3. Activa "Leer desde archivo".
4. Selecciona `C:/cuenta-atras/reloj.txt`, `titulo.txt` o `descripcion.txt` según el archivo que necesites mostrar.
5. Personaliza el estilo según tu diseño.

---

## 📁 Estructura de salida

Los archivos generados se almacenan en:

```
C:/cuenta-atras/
├── reloj.txt         # Cuenta atrás en tiempo real
├── titulo.txt        # Título del directo
├── descripcion.txt   # Descripción del directo
├── config.json       # Configuración guardada automáticamente
```

---

## 💻 Requisitos

- Node.js 14 o superior
- Sistema operativo Windows (ruta fija en `C:/cuenta-atras`)

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia [MIT](https://github.com/altaskur/cuenta-atras/blob/main/LICENSE).

---

## 🌐 Socials

[<img src="https://img.shields.io/github/followers/altaskur?label=GitHub&color=inactive&logo=Github&style=flat-square"></img>](https://github.com/altaskur)
[<img src="https://img.shields.io/twitter/follow/altaskur?label=Twitter&logo=Twitter&style=flat-square"></img>](https://twitter.com/Altaskur)
[<img src="https://img.shields.io/twitch/status/altaksur?label=Twitch - stream &logo=twitch&style=flat-square"></img>](https://www.twitch.tv/altaskur)

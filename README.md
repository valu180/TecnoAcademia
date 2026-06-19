# Tecnoacademia-Web 🚀

¡Bienvenido al repositorio oficial del sitio web de **Tecnoacademia**! Una plataforma web diseñada para dar a conocer nuestro centro, inspirar a niños y jóvenes a apasionarse por la ciencia y la tecnología, y facilitar su proceso de inscripción.

Este sitio está dirigido a estudiantes de colegios, padres de familia, instructores y a todo el público interesado en conocer el ecosistema de innovación de la Tecnoacademia.

---

## 📝 Descripción

El sitio web de Tecnoacademia es una herramienta interactiva y accesible que permite a la comunidad explorar nuestra oferta educativa. El objetivo principal es motivar a las nuevas generaciones a participar en el mundo tecnológico, mostrando de forma transparente qué hacemos, cómo son nuestras instalaciones y cuáles son los valores que nos guían.

---

## ✨ Características Principales

* 🔬 **Líneas de Formación:** Sección detallada para explorar las diferentes áreas tecnológicas y científicas que se enseñan en la Tecnoacademia.
* 👥 **Grupo de Trabajo:** Espacio dedicado a presentar a los instructores y al equipo de profesionales que acompañan y guían a los niños en su proceso de aprendizaje.
* 🏢 **Nuestras Instalaciones y Valores:** Información visual y descriptiva sobre la infraestructura del centro y los principios institucionales.
* 📋 **Formulario de Inscripción:** Módulo integrado para que los niños interesados puedan registrarse de manera fácil y segura.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto fue desarrollado utilizando un stack netamente enfocado en el **Frontend**, garantizando ligereza, velocidad de carga y compatibilidad:

* 🌐 **HTML5:** Estructuración semántica del contenido global del sitio.
* 🎨 **CSS3:** Diseño visual, estilos personalizados y adaptabilidad (Responsive Design) para todo tipo de pantallas (móviles, tablets y computadoras).
* ⚡ **JavaScript (Vanilla JS):** Lógica interactiva del sitio, validaciones del formulario de inscripción y dinamismo en la navegación.

---

## 🚀 Instalación y Despliegue Local

Para visualizar y probar el proyecto en tu entorno local, sigue estos sencillos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/valu180/TecnoAcademia.git
    ```
2.  **Navegar a la carpeta del proyecto:**
    ```bash
    cd Tecnoacademia
    ```
3.  **Ejecutar el proyecto:**
    Al ser una aplicación 100% Frontend, puedes interactuar con ella de dos maneras:
    * Simplemente busca y abre el archivo `index.html` en tu navegador web de preferencia.
    * O bien, utiliza una extensión como *Live Server* en Visual Studio Code para levantar un servidor local rápido.

### 🌐 Despliegue en Producción (Firebase Hosting)

El sitio se publica con **Firebase Hosting**. La configuración vive en `firebase.json` y `.firebaserc` (proyecto `tecnoacademiarisaralda-site`).

**Requisitos:**

- [Node.js](https://nodejs.org/) (LTS o superior)
- Firebase CLI:

```bash
npm install -g firebase-tools
```

**Iniciar sesión (una sola vez):**

```bash
firebase login
```

**Publicar cambios:**

```bash
firebase deploy --only hosting
```

Tras el despliegue, el sitio queda disponible en:

- https://tecnoacademiarisaralda-site.web.app

> **Nota para Node 19+ (workaround temporal):** con Node 19 o superior, la
> versión actual de `firebase-tools` puede fallar el login/deploy con el mensaje
> `Your credentials are no longer valid` debido a un bug de keep-alive en su
> dependencia interna `node-fetch@2`. Si te ocurre, crea un archivo
> `no-keepalive.cjs` (ignorado por git) con:
>
> ```js
> require('http').globalAgent.keepAlive = false;
> require('https').globalAgent.keepAlive = false;
> ```
>
> Y ejecuta los comandos de Firebase con:
>
> ```bash
> # Windows (cmd)
> set NODE_OPTIONS=--require ./no-keepalive.cjs
>
> # macOS / Linux
> export NODE_OPTIONS="--require ./no-keepalive.cjs"
> ```

---

## 🧪 Pruebas (Testing)

Para garantizar la estabilidad de la interfaz y el correcto funcionamiento de los formularios, el equipo técnico llevó a cabo un riguroso proceso de control de calidad:

* 🔬 **Pruebas Unitarias:** Validación individual de las funciones lógicas y scripts en JavaScript.
* 🔄 **Pruebas de Integración:** Verificación del flujo completo del usuario, asegurando que los componentes interactúen correctamente entre sí (por ejemplo, el comportamiento del formulario al enviar los datos).
* 💻 **Desarrolladores a cargo:** Pruebas ejecutadas y validadas en su totalidad por los dos desarrolladores principales del proyecto.

---

## 📄 Documentación Adicional

Para conocer a fondo la arquitectura del diseño, los wireframes, manuales o bitácoras del desarrollo, te invitamos a revisar nuestra documentación oficial alojada en la pestaña de la sección de conocimiento del repositorio:

🌐 [Visitar la Wiki de GitHub del Proyecto](https://github.com/valu180/TecnoAcademia/wiki)

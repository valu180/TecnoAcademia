document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    if (!form) return;

    const ENDPOINT =
        "https://script.google.com/macros/s/AKfycbxTaGsTd2LOI5LWG1U6y1UVIeli5JBJFll56g1QHqhVEqGWNm7O05lQnNBUAShzdhpc/exec";

    const submitBtn = document.getElementById("form-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const mensaje = document.getElementById("form-mensaje");

    const hoy = new Date().toISOString().split("T")[0];
    const hace100Anios = new Date();
    hace100Anios.setFullYear(hace100Anios.getFullYear() - 100);
    const minNacimiento = hace100Anios.toISOString().split("T")[0];

    const fechaNacimiento = document.getElementById("fecha-nacimiento");
    const fechaExpedicion = document.getElementById("fecha-expedicion");
    const tipoDocumento = document.getElementById("tipo-documento");
    const numeroDocumento = document.getElementById("numero-documento");

    fechaNacimiento.max = hoy;
    fechaNacimiento.min = minNacimiento;
    fechaExpedicion.max = hoy;

    const RE = {
        soloLetras: /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
        soloLetrasNombre: /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g,
        soloDigitos: /\D/g,
        docAlfanumerico: /[^a-zA-Z0-9]/g,
        direccion: /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s#.\-]/g,
        correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        celularCo: /^3\d{9}$/,
        nombreValido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+([\s'-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/,
    };

    const docSoloNumerico = new Set([
        "Tarjeta de identidad",
        "Cédula de ciudadanía",
    ]);

    function esDocAlfanumerico() {
        const tipo = tipoDocumento.value;
        return tipo === "Pasaporte" || tipo === "Cédula de extranjería";
    }

    function actualizarModoDocumento() {
        if (esDocAlfanumerico()) {
            numeroDocumento.maxLength = 12;
            numeroDocumento.inputMode = "text";
            numeroDocumento.value = numeroDocumento.value.replace(RE.docAlfanumerico, "").toUpperCase();
        } else {
            numeroDocumento.maxLength = 10;
            numeroDocumento.inputMode = "numeric";
            numeroDocumento.value = numeroDocumento.value.replace(RE.soloDigitos, "");
        }
    }

    tipoDocumento.addEventListener("change", () => {
        actualizarModoDocumento();
        limpiarErrorCampo("numero-documento");
    });

    function sanitizar(id, fn) {
        const campo = document.getElementById(id);
        if (!campo) return;
        campo.addEventListener("input", () => {
            const inicio = campo.selectionStart;
            const fin = campo.selectionEnd;
            const antes = campo.value;
            campo.value = fn(antes);
            if (campo.value !== antes) {
                campo.setSelectionRange(inicio - 1, fin - 1);
            }
            limpiarErrorCampo(id);
        });
        campo.addEventListener("blur", () => {
            campo.value = campo.value.trim().replace(/\s{2,}/g, " ");
        });
    }

    sanitizar("numero-documento", (v) =>
        esDocAlfanumerico() ? v.replace(RE.docAlfanumerico, "").toUpperCase() : v.replace(RE.soloDigitos, "")
    );
    ["nombres", "primer-apellido", "segundo-apellido", "nombre-familiar"].forEach((id) =>
        sanitizar(id, (v) => v.replace(RE.soloLetrasNombre, ""))
    );
    ["lugar-expedicion", "lugar-nacimiento", "ciudad-residencia"].forEach((id) =>
        sanitizar(id, (v) => v.replace(RE.soloLetras, ""))
    );
    sanitizar("direccion-residencia", (v) => v.replace(RE.direccion, ""));
    ["celular", "celular-familiar"].forEach((id) =>
        sanitizar(id, (v) => v.replace(RE.soloDigitos, "").slice(0, 10))
    );

    sanitizar("correo", (v) => v.replace(/\s/g, "").toLowerCase());

    fechaNacimiento.addEventListener("change", () => {
        if (fechaNacimiento.value) {
            fechaExpedicion.min = fechaNacimiento.value;
            if (fechaExpedicion.value && fechaExpedicion.value < fechaNacimiento.value) {
                fechaExpedicion.value = "";
            }
        }
        limpiarErrorCampo("fecha-nacimiento");
    });

    fechaExpedicion.addEventListener("change", () => limpiarErrorCampo("fecha-expedicion"));

    const camposSelect = ["tipo-documento", "genero", "estrato"];
    camposSelect.forEach((id) => {
        document.getElementById(id).addEventListener("change", () => limpiarErrorCampo(id));
    });

    function mostrarErrorCampo(id, texto) {
        const campo = document.getElementById(id);
        const grupo = campo?.closest(".form-group");
        const error = document.querySelector(`[data-error-for="${id}"]`);
        if (grupo) grupo.classList.add("has-error");
        if (error) error.textContent = texto;
    }

    function limpiarErrorCampo(id) {
        const campo = document.getElementById(id);
        const grupo = campo?.closest(".form-group");
        const error = document.querySelector(`[data-error-for="${id}"]`);
        if (grupo) grupo.classList.remove("has-error");
        if (error) error.textContent = "";
    }

    function validarNombre(id, etiqueta, obligatorio = true) {
        const valor = document.getElementById(id).value.trim();
        if (!obligatorio && !valor) return true;
        if (!valor) {
            mostrarErrorCampo(id, `Ingresa ${etiqueta}.`);
            return false;
        }
        if (valor.length < 2) {
            mostrarErrorCampo(id, `${etiqueta} debe tener al menos 2 caracteres.`);
            return false;
        }
        if (!RE.nombreValido.test(valor)) {
            mostrarErrorCampo(id, `${etiqueta} solo puede contener letras.`);
            return false;
        }
        return true;
    }

    function validarDocumento() {
        const tipo = tipoDocumento.value;
        const valor = numeroDocumento.value.trim();
        if (!tipo) {
            mostrarErrorCampo("tipo-documento", "Selecciona el tipo de documento.");
            return false;
        }
        if (!valor) {
            mostrarErrorCampo("numero-documento", "Ingresa el número de documento.");
            return false;
        }
        if (esDocAlfanumerico()) {
            if (valor.length < 5 || valor.length > 12) {
                mostrarErrorCampo("numero-documento", "El documento debe tener entre 5 y 12 caracteres.");
                return false;
            }
        } else if (valor.length < 6 || valor.length > 10) {
            mostrarErrorCampo("numero-documento", "El documento debe tener entre 6 y 10 dígitos.");
            return false;
        }
        return true;
    }

    function validarFecha(id, etiqueta, { min, max, compararCon } = {}) {
        const campo = document.getElementById(id);
        const valor = campo.value;
        if (!valor) {
            mostrarErrorCampo(id, `Ingresa ${etiqueta}.`);
            return false;
        }
        if (valor > hoy) {
            mostrarErrorCampo(id, `${etiqueta} no puede ser una fecha futura.`);
            return false;
        }
        if (min && valor < min) {
            mostrarErrorCampo(id, `${etiqueta} no es válida.`);
            return false;
        }
        if (max && valor > max) {
            mostrarErrorCampo(id, `${etiqueta} no es válida.`);
            return false;
        }
        if (compararCon) {
            const otra = document.getElementById(compararCon.id).value;
            if (compararCon.despuesDe && otra && valor < otra) {
                mostrarErrorCampo(id, compararCon.mensaje);
                return false;
            }
        }
        return true;
    }

    function validarCelular(id) {
        const valor = document.getElementById(id).value.trim();
        if (!valor) {
            mostrarErrorCampo(id, "Ingresa el número de celular.");
            return false;
        }
        if (!RE.celularCo.test(valor)) {
            mostrarErrorCampo(id, "Ingresa un celular colombiano válido (10 dígitos, inicia en 3).");
            return false;
        }
        return true;
    }

    function validar() {
        let valido = true;
        let primerError = null;

        const marcar = (ok, id) => {
            if (!ok) {
                valido = false;
                if (!primerError && id) primerError = document.getElementById(id);
            }
        };

        marcar(validarDocumento(), tipoDocumento.value ? "numero-documento" : "tipo-documento");
        marcar(validarNombre("lugar-expedicion", "el lugar de expedición"), "lugar-expedicion");
        marcar(
            validarFecha("fecha-expedicion", "la fecha de expedición", {
                compararCon: {
                    id: "fecha-nacimiento",
                    despuesDe: true,
                    mensaje: "La expedición no puede ser anterior al nacimiento.",
                },
            }),
            "fecha-expedicion"
        );
        marcar(validarNombre("nombres", "el nombre"), "nombres");
        marcar(validarNombre("primer-apellido", "el primer apellido"), "primer-apellido");
        marcar(validarNombre("segundo-apellido", "el segundo apellido", false), "segundo-apellido");
        marcar(validarFecha("fecha-nacimiento", "la fecha de nacimiento", { min: minNacimiento }), "fecha-nacimiento");
        marcar(validarNombre("lugar-nacimiento", "el lugar de nacimiento"), "lugar-nacimiento");

        const genero = document.getElementById("genero").value;
        if (!genero) {
            mostrarErrorCampo("genero", "Selecciona el género.");
            marcar(false, "genero");
        }

        const estrato = document.getElementById("estrato").value;
        if (!estrato) {
            mostrarErrorCampo("estrato", "Selecciona el estrato socioeconómico.");
            marcar(false, "estrato");
        }

        marcar(validarNombre("ciudad-residencia", "la ciudad de residencia"), "ciudad-residencia");

        const direccion = document.getElementById("direccion-residencia").value.trim();
        if (direccion && direccion.length < 5) {
            mostrarErrorCampo("direccion-residencia", "La dirección debe tener al menos 5 caracteres.");
            marcar(false, "direccion-residencia");
        }

        const correo = document.getElementById("correo").value.trim();
        if (!correo) {
            mostrarErrorCampo("correo", "Ingresa el correo electrónico.");
            marcar(false, "correo");
        } else if (!RE.correo.test(correo)) {
            mostrarErrorCampo("correo", "Ingresa un correo electrónico válido.");
            marcar(false, "correo");
        }

        marcar(validarCelular("celular"), "celular");
        marcar(validarNombre("nombre-familiar", "el nombre del familiar"), "nombre-familiar");
        marcar(validarCelular("celular-familiar"), "celular-familiar");

        const celularPropio = document.getElementById("celular").value.trim();
        const celularFam = document.getElementById("celular-familiar").value.trim();
        if (celularPropio && celularFam && celularPropio === celularFam) {
            mostrarErrorCampo("celular-familiar", "El celular del familiar debe ser diferente al tuyo.");
            marcar(false, "celular-familiar");
        }

        if (!primerError && !valido) {
            primerError = form.querySelector(".form-group.has-error input, .form-group.has-error select");
        }
        if (primerError) primerError.focus();
        return valido;
    }

    function mostrarMensaje(tipo, texto) {
        mensaje.textContent = texto;
        mensaje.className = `form-mensaje ${tipo}`;
        mensaje.hidden = false;
        mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function setCargando(cargando) {
        submitBtn.disabled = cargando;
        btnText.textContent = cargando ? "Enviando..." : "Enviar inscripción";
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensaje.hidden = true;

        form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel']").forEach((el) => {
            el.value = el.value.trim().replace(/\s{2,}/g, " ");
        });

        if (!validar()) {
            mostrarMensaje("error", "Revisa los campos marcados antes de enviar.");
            return;
        }

        setCargando(true);

        try {
            await fetch(ENDPOINT, {
                method: "POST",
                body: new FormData(form),
                mode: "no-cors",
            });

            mostrarMensaje(
                "exito",
                "¡Inscripción enviada con éxito! Pronto nos pondremos en contacto contigo."
            );
            form.reset();
            fechaExpedicion.removeAttribute("min");
            actualizarModoDocumento();
        } catch (error) {
            console.error("Error al enviar la inscripción:", error);
            mostrarMensaje(
                "error",
                "Ocurrió un problema al enviar el formulario. Verifica tu conexión e inténtalo de nuevo."
            );
        } finally {
            setCargando(false);
        }
    });

    actualizarModoDocumento();
});

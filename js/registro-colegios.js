document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    if (!form) return;

    const ENDPOINT =
        "https://script.google.com/macros/s/AKfycbxTaGsTd2LOI5LWG1U6y1UVIeli5JBJFll56g1QHqhVEqGWNm7O05lQnNBUAShzdhpc/exec";

    const submitBtn = document.getElementById("form-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const mensaje = document.getElementById("form-mensaje");

    const camposRequeridos = [
        { id: "estudiante-nombre", label: "Ingresa el nombre completo del estudiante." },
        { id: "estudiante-documento", label: "Ingresa el documento de identidad." },
        { id: "estudiante-residencia", label: "Ingresa la residencia." },
        { id: "institucion", label: "Selecciona una institución." },
        { id: "acudiente-nombre", label: "Ingresa el nombre del acudiente." },
        { id: "acudiente-correo", label: "Ingresa el correo electrónico." },
        { id: "acudiente-telefono", label: "Ingresa el teléfono." },
    ];

    const correoValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    function mostrarErrorCampo(id, texto) {
        const campo = document.getElementById(id);
        const grupo = campo.closest(".form-group");
        const error = document.querySelector(`[data-error-for="${id}"]`);
        if (grupo) grupo.classList.add("has-error");
        if (error) error.textContent = texto;
    }

    function limpiarErrorCampo(id) {
        const campo = document.getElementById(id);
        const grupo = campo.closest(".form-group");
        const error = document.querySelector(`[data-error-for="${id}"]`);
        if (grupo) grupo.classList.remove("has-error");
        if (error) error.textContent = "";
    }

    camposRequeridos.forEach(({ id }) => {
        const campo = document.getElementById(id);
        campo.addEventListener("input", () => limpiarErrorCampo(id));
        campo.addEventListener("change", () => limpiarErrorCampo(id));
    });

    function validar() {
        let valido = true;
        let primerError = null;

        camposRequeridos.forEach(({ id, label }) => {
            const campo = document.getElementById(id);
            const valor = (campo.value || "").trim();
            limpiarErrorCampo(id);

            if (!valor) {
                mostrarErrorCampo(id, label);
                if (!primerError) primerError = campo;
                valido = false;
            } else if (id === "acudiente-correo" && !correoValido(valor)) {
                mostrarErrorCampo(id, "Ingresa un correo electrónico válido.");
                if (!primerError) primerError = campo;
                valido = false;
            }
        });

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
        btnText.textContent = cargando ? "Enviando..." : "Enviar registro";
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensaje.hidden = true;

        if (!validar()) {
            mostrarMensaje("error", "Revisa los campos marcados antes de enviar.");
            return;
        }

        setCargando(true);

        try {
            const formData = new FormData(form);

            // Nota: los Web App de Google Apps Script (/exec) no devuelven
            // cabeceras CORS legibles desde el navegador. Enviamos FormData
            // (petición simple, sin preflight) y tratamos la promesa resuelta
            // como éxito. Si tu Apps Script responde JSON con CORS habilitado,
            // puedes cambiar a leer la respuesta con response.json().
            await fetch(ENDPOINT, {
                method: "POST",
                body: formData,
                mode: "no-cors",
            });

            mostrarMensaje(
                "exito",
                "¡Registro enviado con éxito! Gracias por inscribir a tu institución. Pronto nos pondremos en contacto."
            );
            form.reset();
        } catch (error) {
            console.error("Error al enviar el registro:", error);
            mostrarMensaje(
                "error",
                "Ocurrió un problema al enviar el registro. Verifica tu conexión e inténtalo de nuevo."
            );
        } finally {
            setCargando(false);
        }
    });
});

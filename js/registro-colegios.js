document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    if (!form) return;

    const ENDPOINT =
        "https://script.google.com/macros/s/AKfycbxTaGsTd2LOI5LWG1U6y1UVIeli5JBJFll56g1QHqhVEqGWNm7O05lQnNBUAShzdhpc/exec";
    const STORAGE_KEY = "tecnoacademia-registro-form-v1";
    const TOTAL_STEPS = 4;
    const MAX_DIGITOS = 15;
    const MAX_INACTIVIDAD_MS = 20 * 60 * 60 * 1000;

    let currentStep = 1;
    let guardarTimer = null;
    let dpNacimiento = null;
    let dpExpedicion = null;

    const btnAnterior = document.getElementById("btn-anterior");
    const btnAnteriorFinal = document.getElementById("btn-anterior-final");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const navGlobal = document.querySelector(".form-nav-actions-global");
    const navFinal = document.querySelector(".form-nav-actions-final");
    const submitBtn = document.getElementById("form-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const mensaje = document.getElementById("form-mensaje");
    const stepperBarFill = document.getElementById("stepper-bar-fill");
    const steps = [...form.querySelectorAll(".form-step")];
    const stepperItems = [...form.querySelectorAll(".form-stepper-item")];

    const hoy = new Date().toISOString().split("T")[0];
    const hace100Anios = new Date();
    hace100Anios.setFullYear(hace100Anios.getFullYear() - 100);
    const minNacimiento = hace100Anios.toISOString().split("T")[0];

    const fechaNacimiento = document.getElementById("fecha-nacimiento");
    const fechaExpedicion = document.getElementById("fecha-expedicion");
    const tipoDocumento = document.getElementById("tipo-documento");
    const numeroDocumento = document.getElementById("numero-documento");

    const RE = {
        soloLetras: /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
        soloLetrasNombre: /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g,
        soloLetrasNumNombre: /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s'-]/g,
        soloDigitos: /\D/g,
        docAlfanumerico: /[^a-zA-Z0-9]/g,
        direccion: /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s#.\-]/g,
        correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        digitos: /^\d+$/,
        nombreValido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+([\s'-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/,
        nombreNumValido: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+([\s'-][a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+)*$/,
    };

    const radioNames = [
        "genero-radio",
        "rh-grupo",
        "rh-factor",
        "discapacidad-radio",
        "grado-radio",
        "curso-anterior-radio",
        "jornada-radio",
    ];

    function esDocAlfanumerico() {
        const tipo = tipoDocumento.value;
        return tipo === "Cédula de Extranjería" || tipo === "PPT" || tipo === "Otros";
    }

    function getRadioValue(name) {
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : "";
    }

    function getGeneroValor() {
        const genero = getRadioValue("genero-radio");
        if (genero === "Otros") {
            return document.getElementById("genero-otros-texto").value.trim();
        }
        return genero;
    }

    function getTipoDocumentoValor() {
        const tipo = tipoDocumento.value;
        if (tipo === "Otros") {
            return document.getElementById("tipo-documento-otros-texto").value.trim();
        }
        return tipo;
    }

    function getDiscapacidadValor() {
        const valor = getRadioValue("discapacidad-radio");
        if (valor === "Sí") {
            const detalle = document.getElementById("discapacidad-detalle").value.trim();
            return `Sí: ${detalle}`;
        }
        return "No";
    }

    function getInstitucionValor() {
        const valor = document.getElementById("institucion-educativa").value;
        if (valor === "Otros") {
            return document.getElementById("institucion-otros-texto").value.trim();
        }
        return valor;
    }

    function getGradoValor() {
        const grado = getRadioValue("grado-radio");
        if (grado === "Otros") {
            return document.getElementById("grado-otros-texto").value.trim();
        }
        return grado;
    }

    function getRhValor() {
        const grupo = getRadioValue("rh-grupo");
        const factor = getRadioValue("rh-factor");
        if (!grupo || !factor) return "";
        return `${grupo}${factor}`;
    }

    function actualizarModoDocumento() {
        numeroDocumento.maxLength = MAX_DIGITOS;
        if (esDocAlfanumerico()) {
            numeroDocumento.inputMode = "text";
            numeroDocumento.value = numeroDocumento.value.replace(RE.docAlfanumerico, "").toUpperCase().slice(0, MAX_DIGITOS);
        } else {
            numeroDocumento.inputMode = "numeric";
            numeroDocumento.value = numeroDocumento.value.replace(RE.soloDigitos, "").slice(0, MAX_DIGITOS);
        }
    }

    function toggleConditional(wrapId, show) {
        const wrap = document.getElementById(wrapId);
        if (wrap) wrap.hidden = !show;
    }

    function syncCondicionales() {
        toggleConditional("genero-otros-wrap", getRadioValue("genero-radio") === "Otros");
        toggleConditional("tipo-documento-otros-wrap", tipoDocumento.value === "Otros");
        toggleConditional("discapacidad-detalle-wrap", getRadioValue("discapacidad-radio") === "Sí");
        toggleConditional("institucion-otros-wrap", document.getElementById("institucion-educativa").value === "Otros");
        toggleConditional("grado-otros-wrap", getRadioValue("grado-radio") === "Otros");
    }

    function closeAllCustomSelects() {
        form.querySelectorAll(".form-custom-select.is-open").forEach((wrap) => {
            wrap.classList.remove("is-open");
            const menu = wrap.querySelector(".form-custom-select-menu");
            const trigger = wrap.querySelector(".form-custom-select-trigger");
            if (menu) menu.hidden = true;
            if (trigger) trigger.setAttribute("aria-expanded", "false");
        });
    }

    function syncCustomSelect(select) {
        const wrap = select.closest(".form-custom-select");
        if (!wrap) return;
        const label = wrap.querySelector(".form-custom-select-value");
        const selected = select.options[select.selectedIndex];
        if (label) {
            label.textContent = selected && selected.value ? selected.textContent : "Seleccione...";
            label.classList.toggle("is-placeholder", !select.value);
        }
        wrap.querySelectorAll(".form-custom-select-option").forEach((item) => {
            item.classList.toggle("is-selected", item.dataset.value === select.value);
        });
    }

    function initCustomSelects() {
        form.querySelectorAll("select").forEach((select) => {
            const wrapper = select.closest(".input-wrap-select");
            if (!wrapper || wrapper.dataset.enhanced === "true") return;
            wrapper.dataset.enhanced = "true";
            wrapper.classList.remove("input-wrap-select");
            wrapper.classList.add("form-custom-select");

            const trigger = document.createElement("button");
            trigger.type = "button";
            trigger.className = "form-custom-select-trigger";
            trigger.setAttribute("aria-expanded", "false");
            trigger.innerHTML =
                '<span class="form-custom-select-value is-placeholder">Seleccione...</span><i class="fas fa-chevron-down" aria-hidden="true"></i>';

            const menu = document.createElement("ul");
            menu.className = "form-custom-select-menu";
            menu.hidden = true;
            menu.setAttribute("role", "listbox");

            Array.from(select.options).forEach((option) => {
                if (!option.value && option.disabled) return;
                const item = document.createElement("li");
                item.className = "form-custom-select-option";
                item.setAttribute("role", "option");
                item.dataset.value = option.value;
                item.textContent = option.textContent;
                menu.appendChild(item);
            });

            select.classList.add("form-native-select");
            select.tabIndex = -1;
            select.setAttribute("aria-hidden", "true");
            wrapper.insertBefore(trigger, select);
            wrapper.appendChild(menu);

            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                const willOpen = menu.hidden;
                closeAllCustomSelects();
                if (willOpen) {
                    menu.hidden = false;
                    wrapper.classList.add("is-open");
                    trigger.setAttribute("aria-expanded", "true");
                }
            });

            menu.addEventListener("click", (event) => {
                const item = event.target.closest(".form-custom-select-option");
                if (!item) return;
                select.value = item.dataset.value;
                select.dispatchEvent(new Event("change", { bubbles: true }));
                syncCustomSelect(select);
                closeAllCustomSelects();
                programarGuardado();
            });

            select.addEventListener("change", () => syncCustomSelect(select));
            syncCustomSelect(select);
        });

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".form-custom-select")) closeAllCustomSelects();
        });
    }

    const MESES = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];
    const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
    const esMobile = () => window.matchMedia("(max-width: 600px)").matches;

    let datepickerBackdrop = null;
    const datepickers = [];

    function getBackdrop() {
        if (!datepickerBackdrop) {
            datepickerBackdrop = document.createElement("div");
            datepickerBackdrop.className = "datepicker-backdrop";
            datepickerBackdrop.hidden = true;
            document.body.appendChild(datepickerBackdrop);
            datepickerBackdrop.addEventListener("click", cerrarDatepickers);
        }
        return datepickerBackdrop;
    }

    function cerrarDatepickers() {
        datepickers.forEach((dp) => dp.close());
    }

    function pad2(n) {
        return String(n).padStart(2, "0");
    }

    function toISO(date) {
        return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    }

    function parseISO(value) {
        if (!value) return null;
        const [y, m, d] = value.split("-").map(Number);
        if (!y || !m || !d) return null;
        return new Date(y, m - 1, d);
    }

    function formatoLargo(value) {
        const date = parseISO(value);
        if (!date) return "";
        return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
    }

    function crearDatepicker(input, { minISO, maxISO, onSelect }) {
        const group = input.closest(".form-group");
        const wrapper = document.createElement("div");
        wrapper.className = "datepicker";
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        input.classList.add("datepicker-native");
        input.tabIndex = -1;

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "datepicker-trigger";
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML =
            '<span class="datepicker-value is-placeholder">Seleccione una fecha</span><i class="far fa-calendar-alt" aria-hidden="true"></i>';

        const panel = document.createElement("div");
        panel.className = "datepicker-panel";
        panel.setAttribute("role", "dialog");
        panel.hidden = true;

        wrapper.appendChild(trigger);
        wrapper.appendChild(panel);

        const valueLabel = trigger.querySelector(".datepicker-value");

        let min = minISO || null;
        const max = maxISO || null;
        const hoyDate = new Date();
        let viewYear;
        let viewMonth;

        function clampView() {
            const base = parseISO(input.value) || (max ? parseISO(max) : hoyDate);
            viewYear = base.getFullYear();
            viewMonth = base.getMonth();
        }

        function renderHead() {
            const minYear = min ? parseISO(min).getFullYear() : viewYear - 100;
            const maxYear = max ? parseISO(max).getFullYear() : viewYear;
            let years = "";
            for (let y = maxYear; y >= minYear; y -= 1) {
                years += `<option value="${y}" ${y === viewYear ? "selected" : ""}>${y}</option>`;
            }
            return `
                <div class="datepicker-head">
                    <button type="button" class="datepicker-nav" data-nav="prev" aria-label="Mes anterior"><i class="fas fa-chevron-left"></i></button>
                    <span class="datepicker-month-label">${MESES[viewMonth]}</span>
                    <select class="datepicker-year" aria-label="Año">${years}</select>
                    <button type="button" class="datepicker-nav" data-nav="next" aria-label="Mes siguiente"><i class="fas fa-chevron-right"></i></button>
                </div>`;
        }

        function renderDays() {
            const primero = new Date(viewYear, viewMonth, 1);
            const offset = (primero.getDay() + 6) % 7;
            const diasMes = new Date(viewYear, viewMonth + 1, 0).getDate();
            const seleccionado = input.value;
            const hoyISO = toISO(hoyDate);

            let celdas = "";
            for (let i = 0; i < offset; i += 1) {
                celdas += '<span class="datepicker-day is-empty"></span>';
            }
            for (let d = 1; d <= diasMes; d += 1) {
                const iso = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(d)}`;
                const disabled = (min && iso < min) || (max && iso > max);
                const clases = ["datepicker-day"];
                if (iso === hoyISO) clases.push("is-today");
                if (iso === seleccionado) clases.push("is-selected");
                celdas += `<button type="button" class="${clases.join(" ")}" data-iso="${iso}" ${disabled ? "disabled" : ""}>${d}</button>`;
            }

            const semana = DIAS_SEMANA.map((d) => `<span class="datepicker-weekday">${d}</span>`).join("");
            return `<div class="datepicker-weekdays">${semana}</div><div class="datepicker-days">${celdas}</div>`;
        }

        function render() {
            panel.innerHTML = renderHead() + renderDays();
        }

        function open() {
            cerrarDatepickers();
            clampView();
            render();
            panel.hidden = false;
            wrapper.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            if (esMobile()) {
                const backdrop = getBackdrop();
                backdrop.hidden = false;
                requestAnimationFrame(() => {
                    backdrop.classList.add("is-visible");
                    panel.classList.add("is-open");
                });
            }
        }

        function close() {
            if (panel.hidden) return;
            panel.hidden = true;
            panel.classList.remove("is-open");
            wrapper.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
            if (datepickerBackdrop) {
                datepickerBackdrop.classList.remove("is-visible");
                datepickerBackdrop.hidden = true;
            }
        }

        function refreshDisplay() {
            if (input.value) {
                valueLabel.textContent = formatoLargo(input.value);
                valueLabel.classList.remove("is-placeholder");
            } else {
                valueLabel.textContent = "Seleccione una fecha";
                valueLabel.classList.add("is-placeholder");
            }
        }

        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            if (panel.hidden) open();
            else close();
        });

        panel.addEventListener("click", (event) => {
            event.stopPropagation();
            const navBtn = event.target.closest("[data-nav]");
            if (navBtn) {
                const dir = navBtn.dataset.nav === "next" ? 1 : -1;
                viewMonth += dir;
                if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
                if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
                render();
                return;
            }
            const dayBtn = event.target.closest(".datepicker-day[data-iso]");
            if (dayBtn && !dayBtn.disabled) {
                input.value = dayBtn.dataset.iso;
                input.dispatchEvent(new Event("change", { bubbles: true }));
                refreshDisplay();
                close();
                if (typeof onSelect === "function") onSelect(input.value);
            }
        });

        panel.addEventListener("change", (event) => {
            if (event.target.classList.contains("datepicker-year")) {
                viewYear = Number(event.target.value);
                render();
            }
        });

        refreshDisplay();

        const controller = {
            setMin(value) {
                min = value || null;
                if (input.value && min && input.value < min) {
                    input.value = "";
                    refreshDisplay();
                }
            },
            refresh: refreshDisplay,
            clear() {
                input.value = "";
                refreshDisplay();
            },
            close,
            hasError(state) {
                if (group) group.classList.toggle("has-error", Boolean(state));
            },
        };

        datepickers.push(controller);
        return controller;
    }

    function actualizarMinExpedicion() {
        if (!dpExpedicion) return;
        dpExpedicion.setMin(fechaNacimiento.value || minNacimiento);
    }

    function initDatePickers() {
        dpNacimiento = crearDatepicker(fechaNacimiento, {
            minISO: minNacimiento,
            maxISO: hoy,
            onSelect: () => {
                actualizarMinExpedicion();
                limpiarErrorCampo("fecha-nacimiento");
                programarGuardado();
            },
        });

        dpExpedicion = crearDatepicker(fechaExpedicion, {
            minISO: minNacimiento,
            maxISO: hoy,
            onSelect: () => {
                limpiarErrorCampo("fecha-expedicion");
                programarGuardado();
            },
        });

        actualizarMinExpedicion();

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".datepicker")) cerrarDatepickers();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") cerrarDatepickers();
        });
    }

    function programarGuardado() {
        clearTimeout(guardarTimer);
        guardarTimer = setTimeout(guardarProgreso, 250);
    }

    function guardarProgreso() {
        const data = { step: currentStep, fields: {}, radios: {}, updatedAt: Date.now() };

        form.querySelectorAll("input, select, textarea").forEach((el) => {
            if (!el.id && el.type !== "radio") return;
            if (el.type === "radio") return;
            if (el.id) data.fields[el.id] = el.value;
        });

        radioNames.forEach((name) => {
            data.radios[name] = getRadioValue(name);
        });

        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn("No se pudo guardar el progreso del formulario.", error);
        }
    }

    function restaurarProgreso() {
        let data;
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            data = JSON.parse(raw);
        } catch {
            return false;
        }

        if (data.updatedAt && Date.now() - data.updatedAt > MAX_INACTIVIDAD_MS) {
            limpiarProgreso();
            return false;
        }

        if (data.fields) {
            Object.entries(data.fields).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el && typeof value === "string") el.value = value;
            });
        }

        if (data.radios) {
            Object.entries(data.radios).forEach(([name, value]) => {
                if (!value) return;
                const radio = form.querySelector(`input[name="${name}"][value="${CSS.escape(value)}"]`);
                if (radio) radio.checked = true;
            });
        }

        actualizarModoDocumento();
        syncCondicionales();
        form.querySelectorAll("select").forEach((select) => syncCustomSelect(select));

        dpNacimiento?.refresh();
        dpExpedicion?.refresh();
        actualizarMinExpedicion();

        if (data.step && data.step >= 1 && data.step <= TOTAL_STEPS) {
            irAPaso(data.step, { scroll: false, persist: false });
        }

        return true;
    }

    function limpiarProgreso() {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            /* noop */
        }
    }

    function setupCondicionales() {
        form.querySelectorAll('input[name="genero-radio"]').forEach((radio) => {
            radio.addEventListener("change", () => {
                toggleConditional("genero-otros-wrap", radio.value === "Otros" && radio.checked);
                limpiarErrorCampo("genero-group");
                programarGuardado();
            });
        });

        tipoDocumento.addEventListener("change", () => {
            toggleConditional("tipo-documento-otros-wrap", tipoDocumento.value === "Otros");
            actualizarModoDocumento();
            limpiarErrorCampo("tipo-documento");
            limpiarErrorCampo("numero-documento");
            programarGuardado();
        });

        form.querySelectorAll('input[name="discapacidad-radio"]').forEach((radio) => {
            radio.addEventListener("change", () => {
                toggleConditional("discapacidad-detalle-wrap", radio.checked && radio.value === "Sí");
                limpiarErrorCampo("discapacidad-group");
                programarGuardado();
            });
        });

        document.getElementById("institucion-educativa").addEventListener("change", () => {
            toggleConditional("institucion-otros-wrap", document.getElementById("institucion-educativa").value === "Otros");
            limpiarErrorCampo("institucion-educativa");
            programarGuardado();
        });

        form.querySelectorAll('input[name="grado-radio"]').forEach((radio) => {
            radio.addEventListener("change", () => {
                toggleConditional("grado-otros-wrap", radio.value === "Otros" && radio.checked);
                limpiarErrorCampo("grado-group");
                programarGuardado();
            });
        });

        [
            "genero-group",
            "rh-grupo-group",
            "rh-factor-group",
            "discapacidad-group",
            "grado-group",
            "curso-anterior-group",
            "jornada-group",
        ].forEach((id) => {
            const group = document.getElementById(id);
            if (!group) return;
            group.querySelectorAll('input[type="radio"]').forEach((radio) => {
                radio.addEventListener("change", () => {
                    limpiarErrorCampo(id);
                    programarGuardado();
                });
            });
        });
    }

    function setupPersistencia() {
        form.addEventListener("input", programarGuardado);
        form.addEventListener("change", programarGuardado);
        window.addEventListener("beforeunload", guardarProgreso);
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") guardarProgreso();
        });
    }

    function sanitizar(id, fn) {
        const campo = document.getElementById(id);
        if (!campo) return;
        campo.addEventListener("input", () => {
            const inicio = campo.selectionStart;
            const fin = campo.selectionEnd;
            const antes = campo.value;
            campo.value = fn(antes);
            if (campo.value !== antes && typeof inicio === "number") {
                campo.setSelectionRange(Math.max(0, inicio - 1), Math.max(0, fin - 1));
            }
            limpiarErrorCampo(id);
        });
        campo.addEventListener("blur", () => {
            campo.value = campo.value.trim().replace(/\s{2,}/g, " ");
        });
    }

    sanitizar("numero-documento", (v) =>
        esDocAlfanumerico()
            ? v.replace(RE.docAlfanumerico, "").toUpperCase().slice(0, MAX_DIGITOS)
            : v.replace(RE.soloDigitos, "").slice(0, MAX_DIGITOS)
    );

    sanitizar("nombres", (v) => v.replace(RE.soloLetrasNumNombre, ""));

    [
        "primer-apellido",
        "segundo-apellido",
        "nombre-familiar",
        "genero-otros-texto",
        "tipo-documento-otros-texto",
        "discapacidad-detalle",
        "institucion-otros-texto",
        "grado-otros-texto",
    ].forEach((id) => sanitizar(id, (v) => v.replace(RE.soloLetrasNombre, "")));

    [
        "pais-nacimiento",
        "depto-nacimiento",
        "municipio-nacimiento",
        "pais-expedicion",
        "depto-expedicion",
        "municipio-expedicion",
        "depto-residencia",
        "municipio-residencia",
    ].forEach((id) => sanitizar(id, (v) => v.replace(RE.soloLetras, "")));

    sanitizar("direccion-residencia", (v) => v.replace(RE.direccion, ""));
    sanitizar("eps", (v) => v.replace(RE.soloLetras, ""));
    ["celular", "celular-familiar"].forEach((id) =>
        sanitizar(id, (v) => v.replace(RE.soloDigitos, "").slice(0, MAX_DIGITOS))
    );
    sanitizar("correo", (v) => v.replace(/\s/g, "").toLowerCase());

    document.getElementById("estrato").addEventListener("change", () => limpiarErrorCampo("estrato"));

    function getPanelPaso(step) {
        return steps.find((s) => Number(s.dataset.step) === step);
    }

    function pasoTieneErrores(step) {
        const panel = getPanelPaso(step);
        return Boolean(panel?.querySelector(".form-group.has-error, .rh-block.has-error"));
    }

    function ocultarMensajeGlobal() {
        mensaje.hidden = true;
        mensaje.textContent = "";
        mensaje.className = "form-mensaje";
    }

    function mostrarMensajeGlobal(texto) {
        mensaje.textContent = texto;
        mensaje.className = "form-mensaje error";
        mensaje.hidden = false;
    }

    function evaluarMensajeGlobal() {
        if (!pasoTieneErrores(currentStep)) {
            ocultarMensajeGlobal();
        }
    }

    function mostrarErrorCampo(id, texto) {
        const error = document.querySelector(`[data-error-for="${id}"]`);
        const grupo =
            document.getElementById(id)?.closest(".form-group") ||
            document.getElementById(id)?.closest(".rh-block") ||
            error?.closest(".form-group") ||
            error?.closest(".rh-block");
        if (grupo) grupo.classList.add("has-error");
        if (error) error.textContent = texto;
    }

    function limpiarErrorCampo(id) {
        const errorEl = document.querySelector(`[data-error-for="${id}"]`);
        const grupo =
            document.getElementById(id)?.closest(".form-group") ||
            document.getElementById(id)?.closest(".rh-block") ||
            errorEl?.closest(".form-group") ||
            errorEl?.closest(".rh-block");
        if (grupo) grupo.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
        evaluarMensajeGlobal();
    }

    function limpiarErroresPaso(step) {
        const panel = getPanelPaso(step);
        if (!panel) return;
        panel.querySelectorAll(".form-group.has-error, .rh-block.has-error").forEach((el) => {
            el.classList.remove("has-error");
        });
        panel.querySelectorAll(".form-error").forEach((el) => {
            el.textContent = "";
        });
    }

    function validarNombre(id, etiqueta, obligatorio = true, { permitirNumeros = false } = {}) {
        const valor = document.getElementById(id).value.trim();
        if (!obligatorio && !valor) return true;
        if (!valor) {
            mostrarErrorCampo(id, `Ingresa ${etiqueta}.`);
            return false;
        }
        if (valor.length < 2 && valor !== ".") {
            mostrarErrorCampo(id, `${etiqueta} debe tener al menos 2 caracteres.`);
            return false;
        }
        const patron = permitirNumeros ? RE.nombreNumValido : RE.nombreValido;
        if (valor !== "." && !patron.test(valor)) {
            mostrarErrorCampo(
                id,
                permitirNumeros
                    ? `${etiqueta} contiene caracteres no válidos.`
                    : `${etiqueta} solo puede contener letras.`
            );
            return false;
        }
        return true;
    }

    function validarTexto(id, etiqueta, { min = 2, allowDot = false, obligatorio = true } = {}) {
        const valor = document.getElementById(id).value.trim();
        if (!obligatorio && !valor) return true;
        if (!valor) {
            mostrarErrorCampo(id, `Ingresa ${etiqueta}.`);
            return false;
        }
        if (allowDot && valor === ".") return true;
        if (valor.length < min) {
            mostrarErrorCampo(id, `${etiqueta} debe tener al menos ${min} caracteres.`);
            return false;
        }
        return true;
    }

    function esValorNumericoValido(valor) {
        return RE.digitos.test(valor) && valor.length >= 7 && valor.length <= MAX_DIGITOS;
    }

    function esDocumentoValido(valor) {
        if (!valor) return false;
        if (esDocAlfanumerico()) {
            return /^[A-Z0-9]+$/.test(valor) && valor.length >= 1 && valor.length <= MAX_DIGITOS;
        }
        return esValorNumericoValido(valor);
    }

    function validarDocumento() {
        const tipo = getTipoDocumentoValor();
        const valor = numeroDocumento.value.trim();
        if (!tipoDocumento.value) {
            mostrarErrorCampo("tipo-documento", "Selecciona el tipo de documento.");
            return false;
        }
        if (tipoDocumento.value === "Otros" && !tipo) {
            mostrarErrorCampo("tipo-documento", "Especifica el tipo de documento.");
            return false;
        }
        if (!valor) {
            mostrarErrorCampo("numero-documento", "Ingresa el número de documento.");
            return false;
        }
        if (!esDocumentoValido(valor)) {
            mostrarErrorCampo("numero-documento", "Ingresa un número de documento válido.");
            return false;
        }
        return true;
    }

    function validarFecha(id, etiqueta, { min, compararCon } = {}) {
        const valor = document.getElementById(id).value;
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
        if (!esValorNumericoValido(valor)) {
            mostrarErrorCampo(id, "Ingresa un número de celular válido.");
            return false;
        }
        return true;
    }

    function validarRadioGroup(groupId, mensaje) {
        const group = document.getElementById(groupId);
        const name = group?.querySelector('input[type="radio"]')?.name;
        if (!name || !getRadioValue(name)) {
            mostrarErrorCampo(groupId, mensaje);
            return false;
        }
        return true;
    }

    function validarPaso(step) {
        let valido = true;
        let primerError = null;

        const marcar = (ok, id) => {
            if (!ok) {
                valido = false;
                if (!primerError && id) {
                    primerError =
                        document.getElementById(id) ||
                        document.querySelector(`[data-error-for="${id}"]`)?.closest(".form-group") ||
                        document.querySelector(`[data-error-for="${id}"]`)?.closest(".rh-block");
                }
            }
        };

        if (step === 1) {
            marcar(validarNombre("nombres", "el nombre", true, { permitirNumeros: true }), "nombres");
            marcar(validarNombre("primer-apellido", "el primer apellido"), "primer-apellido");
            marcar(validarNombre("segundo-apellido", "el segundo apellido", false), "segundo-apellido");
            marcar(validarFecha("fecha-nacimiento", "la fecha de nacimiento", { min: minNacimiento }), "fecha-nacimiento");

            const generoRadio = getRadioValue("genero-radio");
            if (!generoRadio) {
                mostrarErrorCampo("genero-group", "Selecciona el género.");
                marcar(false, "genero-group");
            } else if (generoRadio === "Otros") {
                marcar(validarTexto("genero-otros-texto", "tu género"), "genero-otros-texto");
            }

            marcar(validarTexto("pais-nacimiento", "el país de nacimiento"), "pais-nacimiento");
            marcar(validarTexto("depto-nacimiento", "el departamento de nacimiento"), "depto-nacimiento");
            marcar(validarTexto("municipio-nacimiento", "el municipio de nacimiento"), "municipio-nacimiento");

            const estrato = document.getElementById("estrato").value;
            if (!estrato) {
                mostrarErrorCampo("estrato", "Selecciona el estrato socioeconómico.");
                marcar(false, "estrato");
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
        }

        if (step === 2) {
            marcar(validarDocumento(), tipoDocumento.value ? "numero-documento" : "tipo-documento");
            marcar(
                validarFecha("fecha-expedicion", "la fecha de expedición", {
                    min: minNacimiento,
                    compararCon: {
                        id: "fecha-nacimiento",
                        despuesDe: true,
                        mensaje: "La expedición no puede ser anterior al nacimiento.",
                    },
                }),
                "fecha-expedicion"
            );
            marcar(validarTexto("pais-expedicion", "el país de expedición"), "pais-expedicion");
            marcar(validarTexto("depto-expedicion", "el departamento de expedición"), "depto-expedicion");
            marcar(validarTexto("municipio-expedicion", "el municipio de expedición"), "municipio-expedicion");
            marcar(validarRadioGroup("rh-grupo-group", "Selecciona el grupo sanguíneo."), "rh-grupo-group");
            marcar(validarRadioGroup("rh-factor-group", "Selecciona el factor RH."), "rh-factor-group");
            marcar(validarTexto("eps", "la EPS"), "eps");

            const discapacidad = getRadioValue("discapacidad-radio");
            if (!discapacidad) {
                mostrarErrorCampo("discapacidad-group", "Indica si cuentas con alguna discapacidad o condición especial.");
                marcar(false, "discapacidad-group");
            } else if (discapacidad === "Sí") {
                marcar(validarTexto("discapacidad-detalle", "el detalle de la condición"), "discapacidad-detalle");
            }
        }

        if (step === 3) {
            marcar(validarTexto("depto-residencia", "el departamento de residencia"), "depto-residencia");
            marcar(validarTexto("municipio-residencia", "el municipio de residencia"), "municipio-residencia");
            marcar(validarTexto("direccion-residencia", "la dirección de residencia", { min: 5, obligatorio: false }), "direccion-residencia");
            marcar(validarNombre("nombre-familiar", "el nombre del familiar"), "nombre-familiar");
            marcar(validarCelular("celular-familiar"), "celular-familiar");

            const celularPropio = document.getElementById("celular").value.trim();
            const celularFam = document.getElementById("celular-familiar").value.trim();
            if (celularPropio && celularFam && celularPropio === celularFam) {
                mostrarErrorCampo("celular-familiar", "El celular del familiar debe ser diferente al tuyo.");
                marcar(false, "celular-familiar");
            }

            const institucionSelect = document.getElementById("institucion-educativa").value;
            if (!institucionSelect) {
                mostrarErrorCampo("institucion-educativa", "Selecciona la institución educativa.");
                marcar(false, "institucion-educativa");
            } else if (institucionSelect === "Otros") {
                const otro = document.getElementById("institucion-otros-texto").value.trim();
                if (!otro) {
                    mostrarErrorCampo("institucion-educativa", "Especifica la institución educativa.");
                    marcar(false, "institucion-educativa");
                }
            }

            const gradoRadio = getRadioValue("grado-radio");
            if (!gradoRadio) {
                mostrarErrorCampo("grado-group", "Selecciona el grado.");
                marcar(false, "grado-group");
            } else if (gradoRadio === "Otros") {
                marcar(validarTexto("grado-otros-texto", "el grado"), "grado-otros-texto");
            }
        }

        if (step === 4) {
            marcar(validarRadioGroup("curso-anterior-group", "Indica si estuviste antes en TecnoAcademia."), "curso-anterior-group");
            marcar(validarRadioGroup("jornada-group", "Selecciona la jornada de asistencia."), "jornada-group");
        }

        if (!primerError) {
            primerError = getPanelPaso(step)?.querySelector(
                ".form-group.has-error .datepicker-trigger, .form-group.has-error .form-custom-select-trigger, .form-group.has-error .form-option-list, .rh-block.has-error .form-option-list, .form-group.has-error input:not(.datepicker-native), .form-group.has-error textarea"
            );
        }

        if (primerError) {
            const focusTarget =
                primerError.matches("input, select, textarea, button")
                    ? primerError
                    : primerError.querySelector("input, select, textarea, button");
            focusTarget?.focus({ preventScroll: true });
            (primerError.closest(".form-group") || primerError.closest(".rh-block") || primerError).scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }

        return valido;
    }

    function actualizarStepper() {
        stepperItems.forEach((item) => {
            const step = Number(item.dataset.stepper);
            item.classList.toggle("is-active", step === currentStep);
            item.classList.toggle("is-completed", step < currentStep);
        });
        stepperBarFill.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;
    }

    function actualizarNavegacion() {
        const esUltimo = currentStep === TOTAL_STEPS;
        navGlobal.hidden = esUltimo;
        navFinal.hidden = !esUltimo;
        navGlobal.classList.toggle("is-first-step", currentStep === 1);
        navGlobal.classList.toggle("has-back", currentStep > 1 && currentStep < TOTAL_STEPS);
    }

    function irAPaso(step, { scroll = true, persist = true } = {}) {
        currentStep = step;
        steps.forEach((panel) => {
            const esActivo = Number(panel.dataset.step) === step;
            panel.hidden = !esActivo;
            panel.classList.toggle("is-active", esActivo);
        });
        actualizarStepper();
        actualizarNavegacion();
        ocultarMensajeGlobal();
        if (persist) programarGuardado();
        if (scroll) {
            document.querySelector(".registro-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function trimFormulario() {
        form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel']").forEach((el) => {
            el.value = el.value.trim().replace(/\s{2,}/g, " ");
        });
    }

    function construirFormData() {
        const data = new FormData();
        data.append("nombres", document.getElementById("nombres").value.trim());
        data.append("primerApellido", document.getElementById("primer-apellido").value.trim());
        data.append("segundoApellido", document.getElementById("segundo-apellido").value.trim());
        data.append("fechaNacimiento", fechaNacimiento.value);
        data.append("genero", getGeneroValor());
        data.append("paisNacimiento", document.getElementById("pais-nacimiento").value.trim());
        data.append("deptoNacimiento", document.getElementById("depto-nacimiento").value.trim());
        data.append("municipioNacimiento", document.getElementById("municipio-nacimiento").value.trim());
        data.append("estrato", document.getElementById("estrato").value);
        data.append("correo", document.getElementById("correo").value.trim());
        data.append("celular", document.getElementById("celular").value.trim());
        data.append("tipoDocumento", getTipoDocumentoValor());
        data.append("numeroDocumento", numeroDocumento.value.trim());
        data.append("fechaExpedicion", fechaExpedicion.value);
        data.append("paisExpedicion", document.getElementById("pais-expedicion").value.trim());
        data.append("deptoExpedicion", document.getElementById("depto-expedicion").value.trim());
        data.append("municipioExpedicion", document.getElementById("municipio-expedicion").value.trim());
        data.append("rh", getRhValor());
        data.append("eps", document.getElementById("eps").value.trim());
        data.append("discapacidad", getDiscapacidadValor());
        data.append("deptoResidencia", document.getElementById("depto-residencia").value.trim());
        data.append("municipioResidencia", document.getElementById("municipio-residencia").value.trim());
        data.append("direccionResidencia", document.getElementById("direccion-residencia").value.trim());
        data.append("nombreFamiliar", document.getElementById("nombre-familiar").value.trim());
        data.append("celularFamiliar", document.getElementById("celular-familiar").value.trim());
        data.append("institucionEducativa", getInstitucionValor());
        data.append("grado", getGradoValor());
        data.append("cursoAnteriorTecno", getRadioValue("curso-anterior-radio"));
        data.append("jornadaTecno", getRadioValue("jornada-radio"));
        return data;
    }

    function mostrarMensaje(tipo, texto) {
        mensaje.textContent = texto;
        mensaje.className = `form-mensaje ${tipo}`;
        mensaje.hidden = false;
        mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function setCargando(cargando) {
        submitBtn.disabled = cargando;
        btnSiguiente.disabled = cargando;
        btnAnterior.disabled = cargando;
        btnAnteriorFinal.disabled = cargando;
        btnText.textContent = cargando ? "Enviando..." : "Enviar formulario";
    }

    function resetFormulario() {
        form.reset();
        limpiarProgreso();
        dpNacimiento?.clear();
        dpExpedicion?.clear();
        toggleConditional("genero-otros-wrap", false);
        toggleConditional("tipo-documento-otros-wrap", false);
        toggleConditional("discapacidad-detalle-wrap", false);
        toggleConditional("institucion-otros-wrap", false);
        toggleConditional("grado-otros-wrap", false);
        form.querySelectorAll(".form-group.has-error, .rh-block.has-error").forEach((el) => el.classList.remove("has-error"));
        form.querySelectorAll(".form-error").forEach((el) => { el.textContent = ""; });
        form.querySelectorAll("select").forEach((select) => syncCustomSelect(select));
        actualizarModoDocumento();
        actualizarMinExpedicion();
        ocultarMensajeGlobal();
        irAPaso(1, { scroll: false, persist: false });
    }

    function retrocederPaso() {
        ocultarMensajeGlobal();
        limpiarErroresPaso(currentStep);
        if (currentStep > 1) irAPaso(currentStep - 1);
    }

    btnSiguiente.addEventListener("click", () => {
        trimFormulario();
        if (!validarPaso(currentStep)) {
            mostrarMensajeGlobal("Revisa los campos marcados antes de continuar.");
            return;
        }
        ocultarMensajeGlobal();
        if (currentStep < TOTAL_STEPS) irAPaso(currentStep + 1);
    });

    btnAnterior.addEventListener("click", retrocederPaso);
    btnAnteriorFinal.addEventListener("click", retrocederPaso);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        trimFormulario();

        if (!validarPaso(4)) {
            mostrarMensajeGlobal("Revisa los campos marcados antes de enviar.");
            return;
        }

        setCargando(true);

        try {
            await fetch(ENDPOINT, {
                method: "POST",
                body: construirFormData(),
                mode: "no-cors",
            });

            mostrarMensaje(
                "exito",
                "¡Inscripción enviada con éxito! Pronto nos pondremos en contacto contigo."
            );
            resetFormulario();
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

    setupCondicionales();
    initCustomSelects();
    initDatePickers();
    setupPersistencia();
    restaurarProgreso();
    actualizarModoDocumento();
    syncCondicionales();
    actualizarStepper();
    actualizarNavegacion();
});

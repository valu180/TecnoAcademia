// Detectar scroll hacia abajo y redirigir
let scrollPermitido = true;

window.addEventListener('wheel', function(e) {
    if (e.deltaY > 60 && scrollPermitido) {
        scrollPermitido = false; // evita múltiples redirecciones
        irAPagina();
    }
});

function irAPagina() {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 500);
}

// verificar las respuestas de la trivia
function verificarRespuestas() {
    const respuestas = document.querySelectorAll('.respuesta');

    respuestas.forEach(input => {
        const respuestaUsuario = input.value.trim().toLowerCase();
        const respuestaCorrecta = input.dataset.correcta.trim().toLowerCase();

        if (respuestaUsuario === respuestaCorrecta) {
            input.classList.remove('incorrecto');
            input.classList.add('correcto');
        } else {
            input.classList.remove('correcto');
            input.classList.add('incorrecto');
        }
    });
}

//transicion
window.addEventListener('load', function () {
    document.body.classList.add('visible');
});
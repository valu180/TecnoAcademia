document.addEventListener("DOMContentLoaded", function () {

    // 1. 🔹 CONFIGURACIÓN DE RUTAS DINÁMICAS
    const path = window.location.pathname;
    let pathPrefix = "";

    if (path.includes("/pages/lineas/")) {
        pathPrefix = "../../"; 
    } else if (path.includes("/pages/")) {
        pathPrefix = "../"; 
    } else {
        pathPrefix = ""; 
    }

    // 2. 🔹 CARGAR HEADER GLOBAL
    const headerContainer = document.getElementById("header");
    if (headerContainer) {
        fetch(pathPrefix + "components/header.html")
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar el header");
                return response.text();
            })
            .then(data => {
                headerContainer.innerHTML = data;
                actualizarRutas(headerContainer, pathPrefix);
                inicializarDropdown();
                inicializarMenuMovil(); 
            })
            .catch(error => console.error("Error cargando header:", error));
    }

    // 3. 🔹 CARGAR FOOTER GLOBAL
    const footerContainer = document.getElementById("footer");
    if (footerContainer) {
        fetch(pathPrefix + "components/footer.html")
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar el footer");
                return response.text();
            })
            .then(data => {
                footerContainer.innerHTML = data;
                actualizarRutas(footerContainer, pathPrefix);
                cargarContadorVisitas();
            })
            .catch(error => console.error("Error cargando footer:", error));
    }

    // 4. 🔹 INICIALIZAR FUNCIONALIDADES ESPECÍFICAS
    inicializarFiltrosProyectos();
    inicializarVerMas();
    inicializarAnimaciones();
    inicializarSlider();
});

// --- 🛠️ FUNCIONES DE UTILIDAD Y CORE ---

function actualizarRutas(contenedor, prefix) {
    contenedor.querySelectorAll("img, a").forEach(el => {
        const attr = el.tagName === "IMG" ? "src" : "href";
        const val = el.getAttribute(attr);
        if (val && !val.startsWith("http") && !val.startsWith("#") && !val.startsWith("/")) {
            el[attr] = prefix + val;
        }
    });
}

function inicializarVerMas() {
    // Unificada la lógica para evitar alertas y duplicidad
    const botonesVerMas = document.querySelectorAll('.btn-ver-mas');
    botonesVerMas.forEach(boton => {
        boton.addEventListener('click', function() {
            const infoExtra = this.parentElement.querySelector('.info-extra');
            if (!infoExtra) return;

            const esVisible = infoExtra.style.display === 'block';
            infoExtra.style.display = esVisible ? 'none' : 'block';
            this.textContent = esVisible ? 'Ver más' : 'Ver menos';
            this.classList.toggle('active', !esVisible);
        });
    });
}

function inicializarFiltrosProyectos() {
    const botonesFiltro = document.querySelectorAll(".filtro-btn");
    const tarjetas = document.querySelectorAll(".proyecto-card");
    const contadorTexto = document.querySelector(".proyectos-info p");

    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach(btn => btn.classList.remove("active"));
            boton.classList.add("active");

            const filtro = boton.getAttribute("data-filter");
            let visibles = 0;

            tarjetas.forEach(tarjeta => {
                const categoria = tarjeta.getAttribute("data-category");
                if (filtro === "todos" || categoria === filtro) {
                    tarjeta.style.display = "flex";
                    visibles++;
                } else {
                    tarjeta.style.display = "none";
                }
            });

            if (contadorTexto) contadorTexto.textContent = `${visibles} proyectos encontrados`;
        });
    });
}

function inicializarDropdown() {
    const dropdown = document.getElementById("materiasDropdown");
    if (!dropdown) return;
    const dropbtn = dropdown.querySelector(".dropbtn");
    if (!dropbtn) return;

    dropbtn.addEventListener("click", function (e) {
        if (window.innerWidth < 1024) {
            e.preventDefault();
            dropdown.classList.toggle("show");
        }
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) dropdown.classList.remove("show");
    });
}

function inicializarMenuMovil() {
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    if (menuToggle && navList) {
        menuToggle.onclick = () => {
            navList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        };
    }
}

function inicializarAnimaciones() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".stat-card").forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
    });
}

function inicializarSlider() {
    const slides = document.querySelectorAll(".slide");
    if (slides.length <= 1) return;
    
    let slideIndex = 0;
    slides[0].style.opacity = "1";

    setInterval(() => {
        slides[slideIndex].style.opacity = "0";
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].style.opacity = "1";
    }, 3500);
}

function cargarContadorVisitas() {
    const contador = document.getElementById("visit-count");
    if (!contador) return;

    fetch("https://api.countapi.xyz/hit/tecnoacademia-risaralda-web2026/visitas")
        .then(res => res.json())
        .then(data => {
            if (data && data.value) contador.textContent = data.value;
        })
        .catch(() => { contador.textContent = "---"; });
}
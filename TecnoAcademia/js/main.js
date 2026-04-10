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
                
                headerContainer.querySelectorAll("img").forEach(img => {
                    const src = img.getAttribute("src");
                    if (src && !src.startsWith("http") && !src.startsWith("/")) {
                        img.src = pathPrefix + src;
                    }
                });

                headerContainer.querySelectorAll("a").forEach(link => {
                    const href = link.getAttribute("href");
                    if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("/")) {
                        link.href = pathPrefix + href;
                    }
                });

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
                
                footerContainer.querySelectorAll("img").forEach(img => {
                    const src = img.getAttribute("src");
                    if (src && !src.startsWith("http") && !src.startsWith("/")) {
                        img.src = pathPrefix + src;
                    }
                });

                footerContainer.querySelectorAll("a").forEach(link => {
                    const href = link.getAttribute("href");
                    if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("/")) {
                        link.href = pathPrefix + href;
                    }
                });

                cargarContadorVisitas();
            })
            .catch(error => console.error("Error cargando footer:", error));
    }

    // --- NUEVO: INICIALIZAR FILTROS ---
    inicializarFiltrosProyectos();

    // 4. 🔹 ANIMACIÓN DE TARJETAS
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".stat-card").forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
    });

    // 5. 🔹 SLIDER
    const slides = document.querySelectorAll(".slide");
    let slideIndex = 0;

    if (slides.length > 0) {
        slides[0].style.opacity = "1";
        function cambiarSlide() {
            if (slides[slideIndex]) slides[slideIndex].style.opacity = "0";
            slideIndex = (slideIndex + 1) % slides.length;
            if (slides[slideIndex]) slides[slideIndex].style.opacity = "1";
        }
        setInterval(cambiarSlide, 3500);
    }
});

// 6. 🔹 FUNCIONES DE INTERACCIÓN

function inicializarFiltrosProyectos() {
    const botonesFiltro = document.querySelectorAll(".filtro-btn");
    const tarjetas = document.querySelectorAll(".proyecto-card");
    const contadorTexto = document.querySelector(".proyectos-info p");

    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            // Manejar estado activo de botones
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

            if (contadorTexto) {
                contadorTexto.textContent = `${visibles} proyectos encontrados`;
            }
        });
    });

    // Lógica para los botones "Ver más"
    document.querySelectorAll(".btn-ver-mas").forEach(btn => {
        btn.addEventListener("click", function() {
            const titulo = this.parentElement.querySelector("h3").textContent;
            alert("Próximamente más información sobre: " + titulo);
        });
    });
}

function inicializarDropdown() {
    const dropdown = document.getElementById("materiasDropdown");
    if (!dropdown) return;

    const dropbtn = dropdown.querySelector(".dropbtn");
    if (!dropbtn) return;

    const newDropbtn = dropbtn.cloneNode(true);
    dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);

    newDropbtn.addEventListener("click", function (e) {
        if (window.innerWidth < 1024) {
            e.preventDefault();
            dropdown.classList.toggle("show");
        }
    });

    document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
}

function inicializarMenuMovil() {
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    if (menuToggle && navList) {
        menuToggle.onclick = null;
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

function cargarContadorVisitas() {
    const contador = document.getElementById("visit-count");
    if (!contador) return;

    fetch("https://api.countapi.xyz/hit/tecnoacademia-risaralda-web2026/visitas")
        .then(res => res.json())
        .then(data => {
            if (data && data.value) {
                contador.textContent = data.value;
            }
        })
        .catch(() => {
            contador.textContent = "---";
        });
}
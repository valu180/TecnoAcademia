document.addEventListener("DOMContentLoaded", function () {

    // 🔹 Cargar Header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;

            // ⚠️ IMPORTANTE:
            // Inicializar dropdown DESPUÉS de cargar el header
            inicializarDropdown();
        });

    // 🔹 Cargar Footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });

    // 🔹 Animación de tarjetas
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

});


// 🔹 Función separada para el dropdown
function inicializarDropdown() {

    const dropdown = document.getElementById("materiasDropdown");

    if (!dropdown) return; // Seguridad

    const dropbtn = dropdown.querySelector(".dropbtn");

    dropbtn.addEventListener("click", function (e) {
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
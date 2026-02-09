/* =================== SLIDERS INICIO =================== */
function iniciarSlider(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const ul = container.querySelector('ul');
  const slides = ul ? ul.querySelectorAll('li') : [];
  if (!ul || !slides.length) return;

  let index = 0;

  function showSlide(i) {
    index = (i + slides.length) % slides.length;
    ul.style.transform = `translateX(-${index * 100}%)`;
  }

  function moveSlide(step) {
    showSlide(index + step);
    resetAutoplay();
  }

  const prevBtn = container.querySelector('.prev');
  const nextBtn = container.querySelector('.next');

  if (prevBtn) prevBtn.addEventListener('click', () => moveSlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => moveSlide(1));

  let autoplay = setInterval(() => moveSlide(1), 5000);
  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => moveSlide(1), 5000);
  }

  showSlide(index);
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarSlider('.slider_tecno');
  iniciarSlider('.slider_1');
});



/* =================== REVEAL =================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


/* =================== SCROLL / TRIVIA =================== */
let ultimaPosicion = window.scrollY;
let redirigirPermitido = false;

window.addEventListener('scroll', function () {
  let nuevaPosicion = window.scrollY;
  if (redirigirPermitido && nuevaPosicion < 60 && nuevaPosicion < ultimaPosicion - 10) {
    redirigirPermitido = false;
    document.body.classList.add('fade-out');
    setTimeout(() => { window.location.href = "trivia/trivia.html"; }, 400);
  }
  ultimaPosicion = nuevaPosicion;
});


// === Carrusel auto-deslizable de logos de COLEGIOS ===
document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.container_colegios');
  if (!track) return;

  // 1) Duplicamos el contenido una sola vez para crear bucle “infinito”
  //    (al llegar al final, reiniciamos sin salto)
  if (!track.dataset.cloned) {
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = '1';
  }

  let pos = 0;                 // posición actual del scroll
  let speed = 0.6;             // velocidad de desplazamiento (px por frame aprox)
  let rafId = null;

  const halfWidth = () => track.scrollWidth / 2; // ancho del contenido original

  function step() {
    pos += speed;
    // Cuando hemos recorrido el ancho del primer bloque, reiniciamos
    if (pos >= halfWidth()) pos = 0;
    track.scrollLeft = pos;
    rafId = requestAnimationFrame(step);
  }

  // Iniciar
  rafId = requestAnimationFrame(step);

  // Pausa al pasar el mouse (mejor UX)
  track.addEventListener('mouseenter', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  });
  track.addEventListener('mouseleave', () => {
    if (!rafId) rafId = requestAnimationFrame(step);
  });

  // Ajuste al cambiar tamaño (por si cambian anchos)
  window.addEventListener('resize', () => {
    // Mantén la misma “proporción” del recorrido tras un resize
    pos = track.scrollLeft % halfWidth();
  });
});


/* =================== MENÚ MÓVIL =================== */
    // Función única para abrir/cerrar la sidebar en móvil
    function toggleSidebar(force) {
      const sidebar  = document.querySelector('#mobile-sidebar');
      const btn      = document.querySelector('.menu_toggle');
      const backdrop = document.querySelector('.drawer_backdrop');
      if (!sidebar || !btn || !backdrop) return;

      // Solo actuar en móvil
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) return;

      const willOpen = (typeof force === 'boolean') ? force : !sidebar.classList.contains('open');

      sidebar.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      sidebar.setAttribute('aria-hidden', willOpen ? 'false' : 'true');

      if (willOpen) {
        backdrop.removeAttribute('hidden');       // mostrar backdrop
        document.body.style.overflow = 'hidden';  // bloquear scroll
        const first = sidebar.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        if (first) setTimeout(() => first.focus(), 80);
      } else {
        backdrop.setAttribute('hidden', '');      // ocultar backdrop
        document.body.style.overflow = '';
        setTimeout(() => btn.focus(), 80);
      }
    }

    (function () {
      const sidebar   = document.querySelector('#mobile-sidebar');
      const backdrop  = document.querySelector('.drawer_backdrop');
      const btn       = document.querySelector('.menu_toggle');
      const closeBtn  = document.querySelector('#mobile-sidebar .drawer_close');

      // 🔧 Anula handlers inline del HTML para evitar doble toggle
      if (btn)      btn.onclick = null;
      if (closeBtn) closeBtn.onclick = null;

      // Abrir/cerrar con el botón hamburguesa (siempre con estado explícito)
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = sidebar && sidebar.classList.contains('open');
          toggleSidebar(!isOpen);
        });
      }

      // Cerrar tocando el botón ✕ (delegación por si cambias el HTML)
      document.addEventListener('click', (e) => {
        if (e.target.closest('.drawer_close')) {
          toggleSidebar(false);
        }
      });

      // Cerrar tocando el backdrop
      if (backdrop) backdrop.addEventListener('click', () => toggleSidebar(false));

      // Cerrar con ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
          toggleSidebar(false);
        }
      });

      // Al pasar a escritorio: reset completo
      window.addEventListener('resize', () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile && sidebar) {
          sidebar.classList.remove('open');
          sidebar.setAttribute('aria-hidden', 'true');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          if (backdrop) backdrop.setAttribute('hidden', '');
        }
      });
    })();

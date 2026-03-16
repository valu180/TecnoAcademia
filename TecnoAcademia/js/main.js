/* =====================================================================
   MAIN.JS - Funcionalidad global (menú móvil, reveal, redirección trivia)
   ===================================================================== */

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

/* =================== MENÚ MÓVIL =================== */
function toggleSidebar(force) {
  const sidebar  = document.querySelector('#mobile-sidebar');
  const btn      = document.querySelector('.menu_toggle');
  const backdrop = document.querySelector('.drawer_backdrop');
  if (!sidebar || !btn || !backdrop) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) return;

  const willOpen = (typeof force === 'boolean') ? force : !sidebar.classList.contains('open');

  sidebar.classList.toggle('open', willOpen);
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  sidebar.setAttribute('aria-hidden', willOpen ? 'false' : 'true');

  if (willOpen) {
    backdrop.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    const first = sidebar.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (first) setTimeout(() => first.focus(), 80);
  } else {
    backdrop.setAttribute('hidden', '');
    document.body.style.overflow = '';
    setTimeout(() => btn.focus(), 80);
  }
}

(function () {
  const sidebar   = document.querySelector('#mobile-sidebar');
  const backdrop  = document.querySelector('.drawer_backdrop');
  const btn       = document.querySelector('.menu_toggle');
  const closeBtn  = document.querySelector('#mobile-sidebar .drawer_close');

  if (btn)      btn.onclick = null;
  if (closeBtn) closeBtn.onclick = null;

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = sidebar && sidebar.classList.contains('open');
      toggleSidebar(!isOpen);
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.drawer_close')) {
      toggleSidebar(false);
    }
  });

  if (backdrop) backdrop.addEventListener('click', () => toggleSidebar(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      toggleSidebar(false);
    }
  });

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
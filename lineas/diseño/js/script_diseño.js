function revelarElementos() {
    const elementos = document.querySelectorAll('.reveal');

    elementos.forEach(el => {
        const posicion = el.getBoundingClientRect().top;
        const alturaPantalla = window.innerHeight;

        if (posicion < alturaPantalla - 250) {
        el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revelarElementos);
window.addEventListener('load', revelarElementos);



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
function revelarElementos() {
  const elementos = document.querySelectorAll('.reveal');
  const alturaPantalla = window.innerHeight;
  const umbral = alturaPantalla * 0.97; // visible cuando entra al 97% del viewport


  elementos.forEach(el => {
    const posicion = el.getBoundingClientRect().top;
    if (posicion < umbral) el.classList.add('visible');
  });
}

window.addEventListener('scroll', revelarElementos, { passive: true });
window.addEventListener('load', revelarElementos);






// funcion para el Slide de las fotos de robotica
document.addEventListener('DOMContentLoaded', () => {
  const mql = window.matchMedia('(max-width: 768px)');
  const wrappers = Array.from(document.querySelectorAll('.carrusel'));
  if (!wrappers.length) return;

  const DURATION = 3000; // ms por foto

  wrappers.forEach((wrap) => {
    // ⬇️ Acepta horizontal o vertical
    const cont   = wrap.querySelector('.container_fotos_horizontal, .container_fotos_vertical');
    const prevBt = wrap.querySelector('.carrusel_btn.prev');
    const nextBt = wrap.querySelector('.carrusel_btn.next');
    if (!cont || !prevBt || !nextBt) return;

    const slides = Array.from(cont.querySelectorAll('img'));
    if (slides.length <= 1) return;

    let idx = 0, timer = null, scrollTO = null, io = null, active = false;
    const padL = () => parseInt(getComputedStyle(cont).paddingLeft) || 0;

    // Detecta si los ítems usan snap centrado (p.ej. tu .container_fotos_vertical)
    const snapAlign = (() => {
      const style = slides.length ? getComputedStyle(slides[0]).scrollSnapAlign : '';
      return (style || 'start').split(' ')[0]; // 'start' | 'center' | 'end'
    })();

    function targetLeftFor(i) {
      const s = slides[i];
      let left = s.offsetLeft - padL();
      if (snapAlign === 'center') {
        left = s.offsetLeft - padL() - (cont.clientWidth - s.offsetWidth) / 2;
      }
      return Math.max(0, left);
    }

    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      cont.scrollTo({ left: targetLeftFor(idx), behavior: 'smooth' });
    }
    const goNext = () => goTo(idx + 1);
    const goPrev = () => goTo(idx - 1);

    function play(){ if (!timer) timer = setInterval(goNext, DURATION); }
    function pause(){ clearInterval(timer); timer = null; }

    function syncIdx() {
      // Si es 'center', medimos vs el centro del ítem; si no, vs su borde
      const ref = cont.scrollLeft + padL() + (snapAlign === 'center' ? cont.clientWidth/2 : 0);
      let best = Infinity, bestI = 0;
      for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        const sRef = s.offsetLeft + (snapAlign === 'center' ? s.offsetWidth/2 : 0);
        const d = Math.abs(sRef - ref);
        if (d < best) { best = d; bestI = i; }
      }
      idx = bestI;
    }

    const onNext   = () => { pause(); goNext(); setTimeout(play, 800); };
    const onPrev   = () => { pause(); goPrev(); setTimeout(play, 800); };
    const onScroll = () => { pause(); syncIdx(); clearTimeout(scrollTO); scrollTO = setTimeout(play, 800); };
    const onVis    = () => { document.hidden ? pause() : play(); };
    const onTouchEnd = () => setTimeout(play, 200);

    function setup() {
      if (active || !mql.matches) return;
      nextBt.addEventListener('click', onNext);
      prevBt.addEventListener('click', onPrev);
      cont.addEventListener('touchstart', pause, { passive: true });
      cont.addEventListener('touchend', onTouchEnd);
      cont.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVis);

      io = new IntersectionObserver(([e]) => { e.isIntersecting ? play() : pause(); }, { threshold: 0.25 });
      io.observe(cont);
      active = true;
    }

    function teardown() {
      if (!active) return;
      pause();
      nextBt.removeEventListener('click', onNext);
      prevBt.removeEventListener('click', onPrev);
      cont.removeEventListener('touchstart', pause);
      cont.removeEventListener('touchend', onTouchEnd);
      cont.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      if (io) { io.disconnect(); io = null; }
      active = false;
    }

    setup();
    mql.addEventListener('change', e => e.matches ? setup() : teardown());
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
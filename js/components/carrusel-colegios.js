/* =====================================================================
   CARRUSEL-COLEGIO.JS - Carrusel infinito de logos de colegios
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.container_colegios');
  if (!track) return;

  if (!track.dataset.cloned) {
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = '1';
  }

  let pos = 0;
  let speed = 0.6;
  let rafId = null;

  const halfWidth = () => track.scrollWidth / 2;

  function step() {
    pos += speed;
    if (pos >= halfWidth()) pos = 0;
    track.scrollLeft = pos;
    rafId = requestAnimationFrame(step);
  }

  rafId = requestAnimationFrame(step);

  track.addEventListener('mouseenter', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  });

  track.addEventListener('mouseleave', () => {
    if (!rafId) rafId = requestAnimationFrame(step);
  });

  window.addEventListener('resize', () => {
    pos = track.scrollLeft % halfWidth();
  });
});
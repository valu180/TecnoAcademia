/* =====================================================================
   SLIDER.JS - Función reutilizable para sliders
   ===================================================================== */

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

/* Inicializar sliders en el home al cargar */
document.addEventListener('DOMContentLoaded', () => {
  iniciarSlider('.slider_tecno');
  iniciarSlider('.slider_1');
});
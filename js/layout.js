function initHeader() {
  const materiasDropdown = document.getElementById('materiasDropdown');
  const dropdownTrigger = materiasDropdown?.querySelector('.dropdown-trigger');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      materiasDropdown.classList.toggle('open');
    });
  }

  document.addEventListener('click', (event) => {
    if (materiasDropdown && !materiasDropdown.contains(event.target)) {
      materiasDropdown.classList.remove('open');
    }
  });

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMateriasBtn = document.getElementById('mobileMateriasBtn');
  const mobileSubmenu = document.getElementById('mobileSubmenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[href]');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  mobileMateriasBtn?.addEventListener('click', () => {
    mobileSubmenu?.classList.toggle('open');
    mobileMateriasBtn?.classList.toggle('active');
  });

  // Estado activo según la URL actual
  const path = window.location.pathname;
  const isHome = path === '/' || path.endsWith('/index.html');
  const isMaterias = path.includes('/pages/materias.html');

  navLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (isHome && href.endsWith('/index.html')) {
      link.classList.add('active');
    }
  });

  if (isMaterias && dropdownTrigger) {
    dropdownTrigger.classList.add('active');
  }

  mobileNavLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (isHome && href.endsWith('/index.html')) {
      link.classList.add('active');
    }
  });

  if (isMaterias && mobileMateriasBtn) {
    mobileMateriasBtn.classList.add('active');
  }
}

// Determinar ruta base según si estamos en /pages/ o en la raíz
const isInPages = window.location.pathname.includes('/pages/');
const basePath = isInPages ? '..' : '.';

fetch(`${basePath}/header.html`)
  .then((response) => response.text())
  .then((html) => {
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
      headerContainer.innerHTML = html;
      initHeader();
    }
  })
  .catch((error) => {
    console.error('Error al cargar header.html:', error);
  });

fetch(`${basePath}/footer.html`)
  .then((response) => response.text())
  .then((html) => {
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
      footerContainer.innerHTML = html;
    }
  })
  .catch((error) => {
    console.error('Error al cargar footer.html:', error);
  });


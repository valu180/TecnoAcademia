(function initLayout() {
  const path = window.location.pathname;
  const isInPages = path.includes('/pages/');
  const basePath = isInPages ? '..' : '.';

  function setExpandedState(element, expanded) {
    if (!element) return;
    element.setAttribute('aria-expanded', String(expanded));
  }

  function setCurrentPageState(element, isCurrent) {
    if (!element) return;
    if (isCurrent) {
      element.setAttribute('aria-current', 'page');
    } else {
      element.removeAttribute('aria-current');
    }
  }

  function markActiveNavigation() {
    const isHome = path === '/' || path.endsWith('/index.html');
    const isLineasPage = path.includes('/pages/lineas.html');

    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[href]');
    const dropdownTrigger = document.querySelector('#lineasDropdown .dropdown-trigger');
    const mobileLineasBtn = document.getElementById('mobileLineasBtn');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isActive = isHome && href.endsWith('/index.html');
      link.classList.toggle('active', isActive);
      setCurrentPageState(link, isActive);
    });

    mobileNavLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isActive = isHome && href.endsWith('/index.html');
      link.classList.toggle('active', isActive);
      setCurrentPageState(link, isActive);
    });

    if (dropdownTrigger) {
      dropdownTrigger.classList.toggle('active', isLineasPage);
      setCurrentPageState(dropdownTrigger, isLineasPage);
    }

    if (mobileLineasBtn) {
      mobileLineasBtn.classList.toggle('active', isLineasPage);
      setCurrentPageState(mobileLineasBtn, isLineasPage);
    }
  }

  function initHeaderInteractions() {
    const lineasDropdown = document.getElementById('lineasDropdown');
    const dropdownTrigger = lineasDropdown?.querySelector('.dropdown-trigger');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLineasBtn = document.getElementById('mobileLineasBtn');
    const mobileSubmenu = document.getElementById('mobileSubmenu');

    const dropdownItems = lineasDropdown?.querySelectorAll('.dropdown-item') || [];

    function closeDropdown() {
      if (!lineasDropdown) return;
      lineasDropdown.classList.remove('open');
      setExpandedState(dropdownTrigger, false);
    }

    dropdownTrigger?.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = lineasDropdown.classList.toggle('open');
      setExpandedState(dropdownTrigger, isOpen);
    });

    document.addEventListener('click', (event) => {
      if (!lineasDropdown || lineasDropdown.contains(event.target)) return;
      closeDropdown();
    });

    dropdownTrigger?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!lineasDropdown?.classList.contains('open')) {
          lineasDropdown?.classList.add('open');
          setExpandedState(dropdownTrigger, true);
        }
        dropdownItems[0]?.focus();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeDropdown();
      }
    });

    dropdownItems.forEach((item) => {
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeDropdown();
          dropdownTrigger?.focus();
        }
      });
    });

    mobileMenuBtn?.addEventListener('click', () => {
      const isOpen = mobileMenu?.classList.toggle('open');
      setExpandedState(mobileMenuBtn, Boolean(isOpen));
    });

    mobileLineasBtn?.addEventListener('click', () => {
      const isOpen = mobileSubmenu?.classList.toggle('open');
      mobileLineasBtn.classList.toggle('active', Boolean(isOpen));
      setExpandedState(mobileLineasBtn, Boolean(isOpen));
    });

    markActiveNavigation();
  }

  async function loadPartial(selector, endpoint) {
    const container = document.querySelector(selector);
    if (!container) return;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${endpoint} (${response.status})`);
    }
    container.innerHTML = await response.text();
  }

  Promise.all([
    loadPartial('#site-header', `${basePath}/header.html`),
    loadPartial('#site-footer', `${basePath}/footer.html`),
  ])
    .then(() => {
      initHeaderInteractions();
    })
    .catch((error) => {
      console.error('Error al cargar layout compartido:', error);
    });
})();


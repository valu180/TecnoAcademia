// Datos de contenido por línea
const LINEAS_CONTENT = {
  'tics-ia': {
    id: 'tics-ia',
    nombre: 'Tics e inteligencia artificial',
    inicial: 'T',
    heroImage: '../img/tics-1.jpg',
    mainImage: '../img/tics-2.jpg',
    heroTitulo: 'Tics e inteligencia artificial',
    heroDescripcion:
      'Integrar robótica y sistemas inteligentes para impulsar la innovación.',
    descripcion: [
      'En la línea de TICS e Inteligencia Artificial de la Tecnoacademia, la robótica y la IA se articulan para dar vida a dispositivos y sistemas automatizados que responden a necesidades reales.',
      'Mediante el uso de sensores, actuadores, microcontroladores y circuitos, los aprendices adquieren habilidades para diseñar, ensamblar y programar prototipos funcionales, integrando conocimientos de mecánica, programación y control.',
      'Esta área impulsa la creatividad y la capacidad de resolver problemas, preparando a los participantes para un entorno tecnológico en constante evolución.',
    ],
    docente: 'Jose Sanchez',
    intensidad: '6 horas/semana',
    estudiantes: '180 estudiantes',
    objetivos: [
      'Desarrollar sistemas capaces de aprender, predecir y tomar decisiones inteligentes.',
      'Diseñar y construir dispositivos automatizados que integran control, sensores y actuadores.',
      'Crear soluciones tecnológicas mediante el ensamblaje de componentes electrónicos y estructuras mecánicas sencillas.',
      'Programar y poner en funcionamiento dispositivos que realicen tareas de forma automática para resolver situaciones del entorno.',
    ],
    temas: [
      'Electrónica básica y circuitos',
      'Sensores, actuadores y sistemas de control',
      'Robótica y automatización',
      'Inteligencia artificial y aprendizaje automático',
      'Fundamentos de programación',
      'Desarrollo de proyectos tecnológicos',
    ],
  },
  'orientacion-vocacional': {
    id: 'orientacion-vocacional',
    nombre: 'Orientación Vocacional',
    inicial: 'O',
    heroImage: '../img/orientacion-1.jpg',
    mainImage: '../img/orientacion-2.jpg',
    heroTitulo: 'Orientación Vocacional',
    heroDescripcion:
      'Descubrir intereses, fortalecer habilidades y proyectar decisiones para el futuro académico y profesional.',
    descripcion: [
      'En la línea de Orientación Vocacional de la Tecnoacademia, los aprendices participan en actividades diseñadas para reconocer sus intereses, habilidades y fortalezas, facilitando la construcción de un proyecto de vida acorde con sus metas personales y profesionales.',
      'A través de talleres, pruebas de orientación, espacios de reflexión y experiencias de exploración académica y ocupacional, los participantes adquieren herramientas para tomar decisiones informadas sobre su futuro educativo y laboral.',
      'Esta línea promueve el desarrollo de habilidades para la vida, la autonomía, el autoconocimiento y la capacidad de adaptación a los cambios del entorno, fortaleciendo la confianza en la toma de decisiones.',
    ],
    docente: 'Lorena Parra',
    intensidad: '5 horas/semana',
    estudiantes: '165 estudiantes',
    objetivos: [
      'Aplicar pruebas de orientación vocacional y evaluación de competencias para ofrecer un diagnóstico sobre las aptitudes y preferencias profesionales de los aprendices.',
      'Diseñar e implementar talleres y charlas sobre exploración ocupacional, toma de decisiones, Habilidades para la vida y planificación de proyectos de vida.',
      'Fomentar la participación en eventos académicos y ferias profesionales que permitan a los aprendices conocer opciones de estudio y oportunidades en el sector productivo.',
      'Realizar seguimiento y acompañamiento a los aprendices para evaluar el impacto de la orientación vocacional en su trayectoria educativa y ocupacional.',
    ],
    temas: [
      'Autoconocimiento y reconocimiento de fortalezas',
      'Intereses vocacionales y proyecto de vida',
      'Toma de decisiones y planificación del futuro',
      'Habilidades para la vida y autonomía',
      'Exploración académica y ocupacional',
      'Adaptación al cambio y desarrollo personal',
    ],
  },
  'materiales-biotecnologia': {
    id: 'materiales-biotecnologia',
    nombre: 'Materiales y biotecnología',
    inicial: 'M',
    heroImage: '../img/biotecnologia-1.jpg',
    mainImage: '../img/biotecnologia-2.jpg',
    heroTitulo: 'Materiales y biotecnología',
    heroDescripcion:
      'Comprender los procesos biológicos y su aplicación en el desarrollo de soluciones sostenibles.',
    descripcion: [
      'En la Tecnoacademia, la biología se aborda cómo la ciencia que estudia la vida en todas sus formas y niveles de organización.',
      'Los aprendices exploran la diversidad de los seres vivos, sus funciones vitales y las interacciones que mantienen con su entorno, comprendiendo así la importancia de los procesos biológicos para el equilibrio de los ecosistemas y el bienestar humano.',
      'Este aprendizaje se enriquece con actividades de observación, análisis y experimentación, que permiten aplicar los conocimientos adquiridos a contextos reales.',
      'De esta manera, se fomenta la conciencia ambiental, la curiosidad científica y la capacidad de integrar saberes biológicos en soluciones sostenibles y responsables.',
    ],
    docente: 'Luis Olaya',
    intensidad: '6 horas/semana',
    estudiantes: '170 estudiantes',
    objetivos: [
      'Explorar los seres vivos y sus procesos para comprender su interacción con el entorno.',
      'Observar e interpretar las características, funciones y relaciones de los organismos en diferentes ecosistemas.',
      'Aplicar técnicas básicas de observación y experimentación para estudiar fenómenos biológicos.',
      'Reconocer el potencial de los procesos biológicos para desarrollar soluciones responsables que contribuyan al bienestar humano y ambiental.',
    ],
    temas: [
      'Diversidad de los seres vivos',
      'Niveles de organización biológica',
      'Funciones vitales de los organismos',
      'Ecosistemas e interacción con el entorno',
      'Observación y experimentación biológica',
      'Sostenibilidad y conciencia ambiental',
    ],
  },
  'economia-popular-campesina': {
    id: 'economia-popular-campesina',
    nombre: 'Economía Popular y Campesina',
    inicial: 'E',
    heroImage: '../img/economia-popular-1.jpg',
    mainImage: '../img/economia-popular-2.jpg',
    heroTitulo: 'Economía Popular y Campesina',
    heroDescripcion:
      'Comprender la materia y sus transformaciones a través de la experimentación científica.',
    descripcion: [
      'En la Tecnoacademia, la química se estudia como una herramienta fundamental para comprender la composición, estructura y propiedades de las sustancias que nos rodean.',
      'A través del trabajo en laboratorio, los aprendices desarrollan habilidades para observar, medir y analizar diferentes materiales, comprendiendo las transformaciones que experimentan en diversas condiciones.',
      'Este enfoque fomenta el pensamiento crítico, la precisión y la curiosidad científica, permitiendo identificar aplicaciones de la química en ámbitos como la salud, la industria y el medio ambiente.',
      'Mediante actividades prácticas, se impulsa la capacidad de relacionar la teoría con la experiencia, fortaleciendo una base sólida para afrontar retos científicos.',
    ],
    docente: 'Levi Bonilla',
    intensidad: '4 horas/semana',
    estudiantes: '140 estudiantes',
    objetivos: [
      'Estudiar la composición y propiedades de las sustancias para entender sus transformaciones.',
      'Aplicar procedimientos básicos de laboratorio para observar, medir y analizar materiales de manera segura.',
      'Identificar y explicar los cambios físicos y químicos presentes en situaciones cotidianas y experimentales.',
      'Relacionar los conceptos químicos con problemáticas y soluciones en áreas como la salud, la industria y el medio ambiente.',
    ],
    temas: [
      'Composición y estructura de la materia',
      'Propiedades físicas y químicas de las sustancias',
      'Transformaciones químicas',
      'Técnicas de laboratorio y medición',
      'Análisis de materiales y sustancias',
      'Aplicaciones de la química en la salud, la industia y el medio ambiente',
    ],
  },
  'diseno-productos': {
    id: 'diseno-productos',
    nombre: 'Diseño de Productos',
    inicial: 'D',
    heroImage: '../img/diseno-1.jpg',
    mainImage: '../img/diseno-2.jpg',
    heroTitulo: 'Diseño de Productos',
    heroDescripcion:
      'Diseñar, modelar y fabricar prototipos mediante herramientas digitales y tecnologías de fabricación.',
    descripcion: [
      'En la línea de Diseño de Productos de la Tecnoacademia, los aprendices exploran el proceso de creación de productos desde la conceptualización de una idea hasta su representación y fabricación digital.',
      'A través del uso de software de modelado 3D y herramientas de diseño asistido por computador, los participantes desarrollan habilidades para diseñar piezas, estructuras y prototipos digitales, fortaleciendo su creatividad y pensamiento espacial.',
      'Además, conocen el funcionamiento de tecnologías de fabricación digital, como las impresoras 3D y otros equipos especializados, comprendiendo cómo transformar modelos virtuales en objetos físicos.',
    ],
    docente: 'Andres Diaz',
    intensidad: '5 horas/semana',
    estudiantes: '155 estudiantes',
    objetivos: [
      'Diseñar y representar objetos digitales utilizando herramientas de modelado tridimensional.',
      'Comprender el funcionamiento y la aplicación de tecnologías como la impresión 3D y otras máquinas de fabricación.',
      'Utilizar programas de diseño y modelado para crear, modificar y optimizar prototipos digitales.',
      'Aplicar conceptos básicos de representación técnica para diseñar piezas y productos con dimensiones precisas.',
    ],
    temas: [
      'Conceptualización de ideas y diseño de productos',
      'Modelado 3D',
      'Diseño asistido por computador (CAD)',
      'Pensamiento espacial y representación digital',
      'Fabricación digital',
      'Impresión 3D y tecnologías de prototipado',
    ],
  },
};

const DEFAULT_LINE_ID = 'tics-ia';

/** Iconos Font Awesome (mismos que el menú del header). */
const LINE_ICONS = {
  'tics-ia': 'fa-robot',
  'orientacion-vocacional': 'fa-compass',
  'materiales-biotecnologia': 'fa-dna',
  'economia-popular-campesina': 'fa-seedling',
  'diseno-productos': 'fa-pencil-ruler',
};

/** Claves antiguas en URLs guardadas o enlaces externos. */
const LEGACY_LINE_IDS = {
  matematicas: 'tics-ia',
  lenguaje: 'orientacion-vocacional',
  'ciencias-naturales': 'materiales-biotecnologia',
  historia: 'economia-popular-campesina',
  tecnologia: 'diseno-productos',
};

function resolveLineId(rawId) {
  if (!rawId) return DEFAULT_LINE_ID;
  if (LINEAS_CONTENT[rawId]) return rawId;
  if (LEGACY_LINE_IDS[rawId]) return LEGACY_LINE_IDS[rawId];
  return DEFAULT_LINE_ID;
}

function getCurrentLineId() {
  const params = new URLSearchParams(window.location.search);
  const line = params.get('line') ?? params.get('subject');
  return resolveLineId(line);
}

/** Etiqueta visible del submenú superior (fuente de verdad para títulos en página). */
function getLineLabel(lineId) {
  const data = LINEAS_CONTENT[lineId];
  return data ? data.nombre : '';
}

function createObjectiveItem(text) {
  const li = document.createElement('li');
  li.className = 'subject-objective-item';

  const icon = document.createElement('i');
  icon.className = 'fas fa-check-circle subject-objective-icon';
  icon.setAttribute('aria-hidden', 'true');

  const span = document.createElement('span');
  span.className = 'subject-objective-text';
  span.textContent = text;

  li.append(icon, span);
  return li;
}

function createTopicItem(text, index) {
  const item = document.createElement('div');
  item.className = 'subject-topic-item';

  const itemIndex = document.createElement('span');
  itemIndex.className = 'subject-topic-index';
  itemIndex.textContent = String(index + 1);

  const topicText = document.createElement('span');
  topicText.className = 'subject-topic-text';
  topicText.textContent = text;

  item.append(itemIndex, topicText);
  return item;
}

function renderLineContent() {
  const lineId = getCurrentLineId();
  const data = LINEAS_CONTENT[lineId];
  const lineLabel = getLineLabel(lineId);

  // Títulos y descripciones
  const heroTitleEl = document.querySelector('[data-line-hero-title]');
  const heroSubtitleEl = document.querySelector('[data-line-hero-subtitle]');
  const titleEl = document.querySelector('[data-line-title]');
  const descEl = document.querySelector('[data-line-description]');
  const initialEl = document.querySelector('[data-line-initial]');
  const teacherEl = document.querySelector('[data-line-teacher]');
  const hoursEl = document.querySelector('[data-line-hours]');
  const studentsEl = document.querySelector('[data-line-students]');
  const heroEl = document.querySelector('.subject-hero');
  const mainImageEl = document.querySelector('.subject-main-image img');

  const iconEl = document.querySelector('[data-line-icon]');
  if (iconEl) {
    iconEl.className = `fas ${LINE_ICONS[lineId] || 'fa-layer-group'} subject-main-icon-fa`;
  }

  if (heroTitleEl) heroTitleEl.textContent = lineLabel;
  if (heroSubtitleEl) heroSubtitleEl.textContent = data.heroDescripcion;
  if (titleEl) titleEl.textContent = lineLabel;
  if (heroEl && data.heroImage) {
    heroEl.style.setProperty('--line-hero-image', `url('${data.heroImage}')`);
    heroEl.style.setProperty(
      '--line-hero-position',
      lineId === 'orientacion-vocacional' ? 'center center' : 'center 38%'
    );
  }
  if (mainImageEl) {
    if (data.mainImage) mainImageEl.src = data.mainImage;
    mainImageEl.alt = `Estudiantes en la línea de ${lineLabel}`;
  }
  document.title = `TecnoAcademia Risaralda - ${lineLabel}`;
  if (descEl) {
    if (Array.isArray(data.descripcion)) {
      descEl.innerHTML = data.descripcion.map((parrafo) => `<p>${parrafo}</p>`).join('');
    } else {
      descEl.innerHTML = `<p>${data.descripcion}</p>`;
    }
  }
  if (initialEl) initialEl.textContent = data.inicial;
  if (teacherEl) teacherEl.textContent = data.docente;
  if (hoursEl) hoursEl.textContent = data.intensidad;
  if (studentsEl) studentsEl.textContent = data.estudiantes;

  // Objetivos
  const objectivesList = document.querySelector('[data-line-objectives]');
  if (objectivesList) {
    objectivesList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    data.objetivos.forEach((objetivo) => {
      fragment.appendChild(createObjectiveItem(objetivo));
    });
    objectivesList.appendChild(fragment);
  }

  // Temas
  const topicsContainer = document.querySelector('[data-line-topics]');
  if (topicsContainer) {
    topicsContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    data.temas.forEach((tema, index) => {
      fragment.appendChild(createTopicItem(tema, index));
    });
    topicsContainer.appendChild(fragment);
  }

  // Activar pestaña superior actual
  document
    .querySelectorAll('[data-line-tab]')
    .forEach((tab) => {
      const isActive = tab.getAttribute('data-line-tab') === lineId;
      tab.classList.toggle('active', isActive);
      if (isActive) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }
    });

  // Resaltar línea actual en "Otras líneas"
  document
    .querySelectorAll('[data-line-other]')
    .forEach((link) => {
      const isActive = link.getAttribute('data-line-other') === lineId;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
}

function updateSubjectTabsFade() {
  const nav = document.querySelector('.subject-tabs-nav');
  if (!nav) return;

  const isDesktop = window.matchMedia('(min-width: 60rem)').matches;
  if (isDesktop) {
    nav.classList.remove('is-scroll-end');
    return;
  }

  const atEnd = nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 2;
  nav.classList.toggle('is-scroll-end', atEnd);
}

function setHeaderHeightVar() {
  const header = document.querySelector('.header-main');
  if (header) {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }
}

function initSubjectTabsScroll() {
  const nav = document.querySelector('.subject-tabs-nav');
  if (!nav) return;

  updateSubjectTabsFade();
  nav.addEventListener('scroll', updateSubjectTabsFade, { passive: true });

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => updateSubjectTabsFade());
    observer.observe(nav);
    if (nav.parentElement) observer.observe(nav.parentElement);
  } else {
    window.addEventListener('resize', updateSubjectTabsFade);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.subject-page')) {
    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);
    renderLineContent();
    initSubjectTabsScroll();
  }
});

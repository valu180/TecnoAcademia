// Datos de contenido por materia
const SUBJECTS_CONTENT = {
  'matematicas': {
    id: 'matematicas',
    nombre: 'Tics e inteligencia artificial',
    inicial: 'T',
    heroTitulo: 'Tics e inteligencia artificial',
    heroDescripcion:
      'Desarrollamos el pensamiento lógico-matemático, la capacidad de análisis y resolución de problemas complejos a través de metodologías activas y aplicaciones prácticas en el mundo real.',
    descripcion:
      'Desarrollamos el pensamiento lógico-matemático, la capacidad de análisis y resolución de problemas complejos a través de metodologías activas y aplicaciones prácticas en el mundo real.',
    docente: 'Prof. Andrés Caicedo',
    intensidad: '6 horas/semana',
    estudiantes: '180 estudiantes',
    objetivos: [
      'Resolver problemas complejos aplicando razonamiento lógico y matemático.',
      'Utilizar herramientas tecnológicas para el modelado y análisis de datos.',
      'Comprender los fundamentos del cálculo y sus aplicaciones en ciencias.',
      'Desarrollar competencias en estadística para la toma de decisiones.',
    ],
    temas: [
      'Álgebra y funciones',
      'Geometría analítica',
      'Cálculo diferencial e integral',
      'Estadística y probabilidad',
      'Lógica matemática',
      'Trigonometría aplicada',
    ],
  },
  'lenguaje': {
    id: 'lenguaje',
    nombre: 'Orientación vocacional',
    inicial: 'O',
    heroTitulo: 'Orientación vocacional',
    heroDescripcion:
      'Fortalecemos las competencias comunicativas para expresar ideas con claridad, argumentar con rigor y disfrutar de la lectura crítica.',
    descripcion:
      'Promovemos la lectura, la escritura y la expresión oral como herramientas fundamentales para el pensamiento crítico y la construcción de ciudadanía.',
    docente: 'Prof. Laura Gómez',
    intensidad: '5 horas/semana',
    estudiantes: '165 estudiantes',
    objetivos: [
      'Desarrollar habilidades de comprensión lectora en diversos tipos de textos.',
      'Fomentar la producción escrita con coherencia, cohesión y corrección gramatical.',
      'Promover la argumentación oral y escrita en contextos académicos.',
      'Valorar la literatura como expresión cultural y artística.',
    ],
    temas: [
      'Comprensión y producción de textos',
      'Gramática y ortografía',
      'Redacción académica',
      'Literatura clásica y contemporánea',
      'Argumentación y debate',
      'Lectura crítica de medios',
    ],
  },
  'ciencias-naturales': {
    id: 'ciencias-naturales',
    nombre: 'Materiales y biotecnología',
    inicial: 'M',
    heroTitulo: 'Materiales y biotecnología',
    heroDescripcion:
      'Exploramos los fenómenos del mundo natural a través de la observación, la experimentación y el pensamiento científico.',
    descripcion:
      'Integrando biología, física y química, fomentamos la curiosidad científica y la comprensión del impacto de la ciencia en la vida diaria.',
    docente: 'Prof. Daniela Ruiz',
    intensidad: '6 horas/semana',
    estudiantes: '170 estudiantes',
    objetivos: [
      'Comprender los principios básicos que rigen los fenómenos naturales.',
      'Aplicar el método científico en la resolución de problemas.',
      'Reconocer la importancia de la ciencia en el cuidado del medio ambiente.',
      'Desarrollar habilidades prácticas en laboratorio de forma segura.',
    ],
    temas: [
      'Estructura y función de los seres vivos',
      'Materia y energía',
      'Fuerzas y movimiento',
      'Ecosistemas y sostenibilidad',
      'Transformaciones químicas',
      'Ciencia y tecnología en la sociedad',
    ],
  },
  'historia': {
    id: 'historia',
    nombre: 'Economía popular y campesina',
    inicial: 'E',
    heroTitulo: 'Economía popular y campesina',
    heroDescripcion:
      'Analizamos los procesos históricos para comprender el presente y participar de manera crítica en la construcción del futuro.',
    descripcion:
      'Estudiamos las transformaciones sociales, políticas, económicas y culturales que han marcado a la humanidad y a nuestro país.',
    docente: 'Prof. Santiago Pérez',
    intensidad: '4 horas/semana',
    estudiantes: '140 estudiantes',
    objetivos: [
      'Comprender los principales procesos históricos a nivel mundial y nacional.',
      'Analizar causas y consecuencias de los hechos históricos.',
      'Promover el respeto por la diversidad cultural y la memoria histórica.',
      'Desarrollar pensamiento crítico frente a las fuentes históricas.',
    ],
    temas: [
      'Civilizaciones antiguas',
      'Historia de Colombia',
      'Revoluciones y cambios sociales',
      'Conflictos y construcción de paz',
      'Globalización y mundo contemporáneo',
      'Ciudadanía y derechos humanos',
    ],
  },
  'tecnologia': {
    id: 'tecnologia',
    nombre: 'Diseño de productos',
    inicial: 'D',
    heroTitulo: 'Diseño de productos',
    heroDescripcion:
      'Potenciamos el uso responsable y creativo de la tecnología para resolver problemas reales e innovar.',
    descripcion:
      'A través del diseño de proyectos, la programación y la robótica, desarrollamos competencias digitales para el siglo XXI.',
    docente: 'Prof. Natalia Herrera',
    intensidad: '5 horas/semana',
    estudiantes: '155 estudiantes',
    objetivos: [
      'Comprender el impacto de la tecnología en la sociedad.',
      'Desarrollar soluciones tecnológicas a problemas del entorno.',
      'Fortalecer competencias en programación y pensamiento computacional.',
      'Promover el uso ético y seguro de las herramientas digitales.',
    ],
    temas: [
      'Pensamiento computacional',
      'Fundamentos de programación',
      'Diseño y prototipado de proyectos',
      'Robótica educativa',
      'Tecnologías web y multimedia',
      'Innovación y emprendimiento digital',
    ],
  },
};

function getCurrentSubjectId() {
  const params = new URLSearchParams(window.location.search);
  const subject = params.get('subject') || 'matematicas';
  return SUBJECTS_CONTENT[subject] ? subject : 'matematicas';
}

/** Etiqueta visible del submenú superior (fuente de verdad para títulos en página). */
function getLineLabel(subjectId) {
  const tabLabel = document.querySelector(
    `[data-subject-tab="${subjectId}"] span`
  );
  if (tabLabel) return tabLabel.textContent.trim();
  const data = SUBJECTS_CONTENT[subjectId];
  return data ? data.nombre : '';
}

function createSvgIcon(className, pathData) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('xmlns', svgNS);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add(className);

  pathData.forEach(({ type, attrs }) => {
    const node = document.createElementNS(svgNS, type);
    Object.entries(attrs).forEach(([attr, value]) => {
      node.setAttribute(attr, value);
    });
    svg.appendChild(node);
  });

  return svg;
}

function createObjectiveItem(text) {
  const li = document.createElement('li');
  li.className = 'subject-objective-item';

  const icon = createSvgIcon('subject-objective-icon', [
    { type: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
    { type: 'path', attrs: { d: 'm9 12 2 2 4-4' } },
  ]);

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

function renderSubjectContent() {
  const subjectId = getCurrentSubjectId();
  const data = SUBJECTS_CONTENT[subjectId];
  const lineLabel = getLineLabel(subjectId);

  // Títulos y descripciones
  const heroTitleEl = document.querySelector('[data-subject-hero-title]');
  const heroSubtitleEl = document.querySelector('[data-subject-hero-subtitle]');
  const titleEl = document.querySelector('[data-subject-title]');
  const descEl = document.querySelector('[data-subject-description]');
  const initialEl = document.querySelector('[data-subject-initial]');
  const teacherEl = document.querySelector('[data-subject-teacher]');
  const hoursEl = document.querySelector('[data-subject-hours]');
  const studentsEl = document.querySelector('[data-subject-students]');
  const mainImageEl = document.querySelector('.subject-main-image img');

  if (heroTitleEl) heroTitleEl.textContent = lineLabel;
  if (heroSubtitleEl) heroSubtitleEl.textContent = data.heroDescripcion;
  if (titleEl) titleEl.textContent = lineLabel;
  if (mainImageEl) {
    mainImageEl.alt = `Estudiantes en la línea de ${lineLabel}`;
  }
  document.title = `Verde Saber - ${lineLabel}`;
  if (descEl) descEl.textContent = data.descripcion;
  if (initialEl) initialEl.textContent = data.inicial;
  if (teacherEl) teacherEl.textContent = data.docente;
  if (hoursEl) hoursEl.textContent = data.intensidad;
  if (studentsEl) studentsEl.textContent = data.estudiantes;

  // Objetivos
  const objectivesList = document.querySelector('[data-subject-objectives]');
  if (objectivesList) {
    objectivesList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    data.objetivos.forEach((objetivo) => {
      fragment.appendChild(createObjectiveItem(objetivo));
    });
    objectivesList.appendChild(fragment);
  }

  // Temas
  const topicsContainer = document.querySelector('[data-subject-topics]');
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
    .querySelectorAll('[data-subject-tab]')
    .forEach((tab) => {
      const isActive = tab.getAttribute('data-subject-tab') === subjectId;
      tab.classList.toggle('active', isActive);
      if (isActive) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }
    });

  // Resaltar materia actual en "Otras materias"
  document
    .querySelectorAll('[data-subject-other]')
    .forEach((link) => {
      const isActive = link.getAttribute('data-subject-other') === subjectId;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // Solo ejecutar en la página de materia
  if (document.querySelector('.subject-page')) {
    renderSubjectContent();
  }
});


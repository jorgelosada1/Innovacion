// ===== DATA MANAGER (localStorage) =====
// Handles all CRUD operations for noticias, slider, and cursos

const KEYS = {
  NOTICIAS: 'innovacion_noticias',
  SLIDER: 'innovacion_slider',
  CURSOS: 'innovacion_cursos',
  AUTH: 'innovacion_auth',
};

// ===== AUTH =====
const CREDENTIALS = { user: 'innovacion', pass: '0228' };

export const login = (user, pass) => {
  if (user === CREDENTIALS.user && pass === CREDENTIALS.pass) {
    localStorage.setItem(KEYS.AUTH, 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(KEYS.AUTH);
};

export const isAuthenticated = () => {
  return localStorage.getItem(KEYS.AUTH) === 'true';
};

// ===== GENERIC HELPERS =====
const getData = (key, defaults) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaults;
  } catch {
    return defaults;
  }
};

const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ===== NOTICIAS =====
const defaultNoticias = [
  {
    id: 'n1',
    titulo: 'Inscripciones Abiertas 2025-2',
    resumen: 'Inicia tu camino universitario con nuestras alianzas académicas. Programas presenciales y virtuales disponibles.',
    contenido: 'Las inscripciones para el segundo semestre de 2025 ya están abiertas. Contamos con una amplia oferta de programas académicos en modalidad presencial y virtual, en alianza con la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana. No pierdas la oportunidad de transformar tu futuro.',
    fecha: '2025-07-01',
    imagen: '',
  },
  {
    id: 'n2',
    titulo: 'Educación Virtual de Calidad',
    resumen: 'Accede a programas acreditados desde cualquier lugar. Plataformas modernas y acompañamiento permanente.',
    contenido: 'Nuestra oferta de educación virtual te permite estudiar desde cualquier rincón de Colombia. Con plataformas modernas y un equipo de soporte dedicado, garantizamos una experiencia educativa de primer nivel.',
    fecha: '2025-06-15',
    imagen: '',
  },
];

export const getNoticias = () => getData(KEYS.NOTICIAS, defaultNoticias);

export const getNoticiaById = (id) => {
  const noticias = getNoticias();
  return noticias.find(n => n.id === id) || null;
};

export const addNoticia = (noticia) => {
  const noticias = getNoticias();
  const nueva = { ...noticia, id: generateId(), fecha: new Date().toISOString().split('T')[0] };
  noticias.unshift(nueva);
  setData(KEYS.NOTICIAS, noticias);
  return nueva;
};

export const updateNoticia = (id, updates) => {
  const noticias = getNoticias();
  const idx = noticias.findIndex(n => n.id === id);
  if (idx !== -1) {
    noticias[idx] = { ...noticias[idx], ...updates };
    setData(KEYS.NOTICIAS, noticias);
  }
  return noticias[idx];
};

export const deleteNoticia = (id) => {
  const noticias = getNoticias().filter(n => n.id !== id);
  setData(KEYS.NOTICIAS, noticias);
};

// ===== SLIDER =====
const defaultSlider = [
  { id: 's1', imagen: '/src/assets/images/1.png', noticiaId: 'n1' },
  { id: 's2', imagen: '/src/assets/images/2.png', noticiaId: 'n2' },
];

export const getSlider = () => getData(KEYS.SLIDER, defaultSlider);

export const addSlide = (slide) => {
  const slider = getSlider();
  const nuevo = { ...slide, id: generateId() };
  slider.push(nuevo);
  setData(KEYS.SLIDER, slider);
  return nuevo;
};

export const updateSlide = (id, updates) => {
  const slider = getSlider();
  const idx = slider.findIndex(s => s.id === id);
  if (idx !== -1) {
    slider[idx] = { ...slider[idx], ...updates };
    setData(KEYS.SLIDER, slider);
  }
};

export const deleteSlide = (id) => {
  const slider = getSlider().filter(s => s.id !== id);
  setData(KEYS.SLIDER, slider);
};

// ===== CURSOS =====
const defaultCursos = [
  {
    id: 'c1',
    titulo: 'Liderazgo Efectivo',
    descripcion: 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento y tomar decisiones estratégicas.',
    videoId: 'jS3c8ZoxAgE',
    duracion: '4 semanas',
    nivel: 'Intermedio',
    temas: ['Comunicación asertiva', 'Toma de decisiones', 'Gestión de conflictos', 'Motivación de equipos'],
    evaluacion: true,
  },
];

export const getCursos = () => getData(KEYS.CURSOS, defaultCursos);

export const addCurso = (curso) => {
  const cursos = getCursos();
  const nuevo = { ...curso, id: generateId() };
  cursos.push(nuevo);
  setData(KEYS.CURSOS, cursos);
  return nuevo;
};

export const updateCurso = (id, updates) => {
  const cursos = getCursos();
  const idx = cursos.findIndex(c => c.id === id);
  if (idx !== -1) {
    cursos[idx] = { ...cursos[idx], ...updates };
    setData(KEYS.CURSOS, cursos);
  }
};

export const deleteCurso = (id) => {
  const cursos = getCursos().filter(c => c.id !== id);
  setData(KEYS.CURSOS, cursos);
};

// ===== DATA MANAGER =====
// Toda la información editable (noticias, banners, cursos, preguntas frecuentes y
// buzón de ideas) vive en la base de datos y se consulta por la API (backend/api).
//
// Si la API no está disponible (p. ej. vista previa en Vercel, sin servidor PHP),
// las secciones públicas muestran el contenido por defecto de este archivo para que
// la web nunca quede vacía. El panel administrativo sí requiere la API.

import { api, ApiError, ApiUnavailableError } from './api';

export { ApiError, ApiUnavailableError };

// ===== CONTENIDO POR DEFECTO (igual al de backend/api/database/seed.sql) =====
export const DEFAULT_NOTICIAS = [
  {
    id: '1',
    titulo: 'Inscripciones Abiertas 2025-2',
    resumen: 'Inicia tu camino universitario con nuestras alianzas académicas. Programas presenciales y virtuales disponibles.',
    contenido: 'Las inscripciones para el segundo semestre de 2025 ya están abiertas. Contamos con una amplia oferta de programas académicos en modalidad presencial y virtual, en alianza con la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana. No pierdas la oportunidad de transformar tu futuro.',
    fecha: '2025-07-01',
    imagen: '',
    publicado: true,
  },
  {
    id: '2',
    titulo: 'Educación Virtual de Calidad',
    resumen: 'Accede a programas acreditados desde cualquier lugar. Plataformas modernas y acompañamiento permanente.',
    contenido: 'Nuestra oferta de educación virtual te permite estudiar desde cualquier rincón de Colombia. Con plataformas modernas y un equipo de soporte dedicado, garantizamos una experiencia educativa de primer nivel.',
    fecha: '2025-06-15',
    imagen: '',
    publicado: true,
  },
];

export const DEFAULT_SLIDER = [
  { id: '1', imagen: 'asset:aniversario-8', title: 'Celebrando juntos 8 años: conectando sueños con oportunidades', link: '/noticias/blog/educacion-que-conecta', noticiaId: null },
  { id: '2', imagen: 'asset:boton-whatsapp', title: 'Descarga tu botón de WhatsApp', link: '/noticias/blog/encuentro-nacional-inne-2026', noticiaId: null },
  { id: '3', imagen: 'asset:historia', title: 'Esta es la historia de Innovación E-learning', link: '', noticiaId: '2' },
  { id: '4', imagen: 'asset:andina', title: 'Fundación Universitaria del Área Andina', link: '/universidades/areandina', noticiaId: null },
  { id: '5', imagen: 'asset:ibero', title: 'Corporación Universitaria Iberoamericana', link: '/universidades/iberoamericana', noticiaId: null },
];

export const DEFAULT_CURSOS = [
  {
    id: '1',
    titulo: 'Liderazgo Efectivo',
    descripcion: 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento y tomar decisiones estratégicas.',
    videoId: 'jS3c8ZoxAgE',
    duracion: '4 semanas',
    nivel: 'Intermedio',
    temas: ['Comunicación asertiva', 'Toma de decisiones', 'Gestión de conflictos', 'Motivación de equipos'],
    evaluacion: true,
  },
];

export const DEFAULT_FAQS = [
  {
    id: '1',
    question: '¿Los títulos emitidos por las universidades son oficiales y acreditados?',
    answer: 'Sí, 100% oficiales. Emitidos directamente por la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana con su respectivo registro SNIES.',
  },
  {
    id: '2',
    question: '¿Cómo funciona el acompañamiento de Innovación E-Learning?',
    answer: 'Te asignamos un asesor personal que te orienta en el proceso de inscripción, recolección de documentos, opciones de financiación y primer ingreso a las plataformas virtuales.',
  },
  {
    id: '3',
    question: '¿Tienen costo las asesorías de Innovación E-Learning?',
    answer: 'No, nuestras asesorías y acompañamiento son 100% gratuitos para el estudiante, ya que somos aliados oficiales autorizados.',
  },
  {
    id: '4',
    question: '¿Cuáles son los requisitos para inscribirme?',
    answer: 'Para pregrado requieres acta y diploma de bachiller, resultado de pruebas ICFES/Saber 11 y documento de identidad. Para posgrado, título profesional.',
  },
  {
    id: '5',
    question: '¿Puedo financiar el valor de la matrícula?',
    answer: 'Sí, contamos con alianzas con entidades financieras, Icetex y opciones de crédito directo con las universidades.',
  },
];

// ===== LECTURAS PÚBLICAS (con respaldo al contenido por defecto) =====
const withFallback = async (path, fallback) => {
  try {
    return await api(path);
  } catch (err) {
    if (!(err instanceof ApiUnavailableError)) console.warn(`[datos] ${path}:`, err.message);
    return fallback;
  }
};

export const fetchNoticias = () => withFallback('/noticias', DEFAULT_NOTICIAS);
export const fetchSlider = () => withFallback('/slider', DEFAULT_SLIDER);
export const fetchCursos = () => withFallback('/cursos', DEFAULT_CURSOS);
export const fetchFaqs = () => withFallback('/faqs', DEFAULT_FAQS);

/** Una noticia por id. Devuelve null si no existe. */
export const fetchNoticia = async (id) => {
  try {
    return await api(`/noticias/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    return DEFAULT_NOTICIAS.find((n) => n.id === String(id)) || null;
  }
};

// ===== BUZÓN DE IDEAS =====
const IDEAS_LOCAL_KEY = 'innovacion_ideas';

/**
 * Envía una idea al buzón. Si el servidor no está disponible (vista previa sin
 * backend) se guarda en el navegador para no perderla.
 */
export const sendIdea = async (idea) => {
  try {
    return await api('/ideas', { method: 'POST', body: idea });
  } catch (err) {
    if (!(err instanceof ApiUnavailableError)) throw err;
    const ideas = JSON.parse(localStorage.getItem(IDEAS_LOCAL_KEY) || '[]');
    ideas.unshift({ ...idea, fecha: new Date().toISOString() });
    localStorage.setItem(IDEAS_LOCAL_KEY, JSON.stringify(ideas));
    return { ok: true, local: true };
  }
};

// ===== SESIÓN DEL PANEL ADMINISTRATIVO =====
export const login = (usuario, password) => api('/auth/login', { method: 'POST', body: { usuario, password } });
export const logout = () => api('/auth/logout', { method: 'POST' });
export const changePassword = (actual, nueva) => api('/auth/password', { method: 'POST', body: { actual, nueva } });

/** Administrador con sesión activa, o null si no hay sesión. */
export const getSession = async () => {
  const { admin } = await api('/auth/me');
  return admin || null;
};

// ===== OPERACIONES DEL PANEL (requieren sesión) =====
const crud = (resource, listQuery = '') => ({
  list: () => api(`/${resource}${listQuery}`),
  create: (data) => api(`/${resource}`, { method: 'POST', body: data }),
  update: (id, data) => api(`/${resource}/${id}`, { method: 'PUT', body: data }),
  remove: (id) => api(`/${resource}/${id}`, { method: 'DELETE' }),
});

export const adminApi = {
  noticias: crud('noticias', '?todas=1'),
  slider: {
    ...crud('slider', '?todos=1'),
    reorder: (ids) => api('/slider/orden', { method: 'PUT', body: { ids } }),
  },
  cursos: crud('cursos', '?todos=1'),
  faqs: crud('faqs'),
  ideas: {
    list: (estado = '') => api(`/ideas${estado ? `?estado=${encodeURIComponent(estado)}` : ''}`),
    update: (id, data) => api(`/ideas/${id}`, { method: 'PATCH', body: data }),
    remove: (id) => api(`/ideas/${id}`, { method: 'DELETE' }),
  },
  uploadImage: (file) => {
    const form = new FormData();
    form.append('archivo', file);
    return api('/uploads', { method: 'POST', form });
  },
};

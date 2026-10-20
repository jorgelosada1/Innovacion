// ===== BLOG INNE =====
// Artículos del mini blog que se muestra en la sección de Noticias.
// Cada artículo se compone de bloques: lead, p, h2, highlight, figure y bridge (ilustración animada).

import portada from '../assets/images/blog-conecta-portada.jpg';
import virtual from '../assets/images/blog-conecta-virtual.jpg';
import grado from '../assets/images/blog-conecta-grado.jpg';
import tarjeta from '../assets/images/blog-conecta-tarjeta.jpg';

export const blogPosts = [
  {
    slug: 'educacion-que-conecta',
    title: 'Educación que conecta: el propósito detrás de INNE',
    excerpt:
      'Hay decisiones que comienzan con una pregunta sencilla: “¿Y si estudio?”. Detrás de ella hay sueños, familias y nuevas oportunidades. Así entendemos nuestro trabajo.',
    category: 'Nuestro propósito',
    date: '2026-10-20',
    author: 'Equipo Innovación E-learning',
    cover: portada,
    thumb: tarjeta,
    closingImage: grado,
    tags: ['Educación virtual', 'Propósito', '8 años'],
    blocks: [
      {
        type: 'lead',
        text: 'Hay decisiones que comienzan con una pregunta sencilla: “¿Y si estudio?”',
      },
      {
        type: 'p',
        text: 'Detrás de esa pregunta puede haber una persona que quiere cumplir un sueño, alguien que busca nuevas oportunidades laborales, una familia que quiere construir un futuro diferente o simplemente alguien que decidió que es momento de empezar algo nuevo.',
      },
      {
        type: 'p',
        text: 'En Innovación E-learning (INNE) creemos que la educación puede ser ese punto de partida, por eso nuestro trabajo no se trata únicamente de acercar una oferta educativa, se trata de conectar personas con oportunidades y de construir puentes entre instituciones, territorios y sueños.',
      },
      { type: 'h2', id: 'mas-lejos', text: 'Educación que llega más lejos' },
      {
        type: 'p',
        text: 'Colombia está llena de personas con ganas de aprender y crecer, pero no todas tienen las mismas posibilidades para hacerlo, y la virtualidad ha cambiado esa realidad. Hoy, estudiar puede ser posible desde muchos lugares y bajo diferentes circunstancias: una persona puede avanzar en su formación sin tener que dejar su territorio, su trabajo o su familia, y la pandemia nos ayudó a entender esto. Allí encontramos una de las grandes posibilidades de nuestro trabajo: ayudar a que la educación llegue más lejos.',
      },
      {
        type: 'figure',
        src: virtual,
        alt: 'Clase virtual con estudiantes conectados desde diferentes lugares',
        caption: 'La virtualidad permite estudiar sin dejar el territorio, el trabajo o la familia.',
      },
      { type: 'h2', id: 'alianzas', text: 'Alianzas con propósito' },
      {
        type: 'p',
        text: 'Por esto creemos en las alianzas que tienen un propósito. Trabajar junto a instituciones educativas significa compartir una responsabilidad: acercar oportunidades de manera responsable, generar confianza y entender que detrás de cada proceso hay una persona tomando una decisión importante para su vida.',
      },
      {
        type: 'highlight',
        text: 'Por eso, para nosotros, cada contacto importa, cada conversación importa, cada estudiante importa.',
      },
      { type: 'h2', id: 'despues', text: 'Lo que sucede después' },
      {
        type: 'p',
        text: 'En INNE somos apasionados por la educación, pero también por todo lo que puede suceder después de ella: un nuevo conocimiento puede convertirse en una oportunidad, una oportunidad puede convertirse en un proyecto, y un proyecto puede transformar una vida.',
      },
      { type: 'h2', id: 'puente', text: 'Nuestra palabra favorita: puente' },
      {
        type: 'p',
        text: 'Quizás por eso nuestra palabra favorita sea puente, porque eso queremos ser: un puente que conecte a las personas con nuevas posibilidades y que ayude a que la educación encuentre caminos para llegar cada vez más lejos.',
      },
      { type: 'bridge' },
      { type: 'h2', id: 'comienza', text: 'Esto apenas comienza' },
      {
        type: 'p',
        text: 'Y esto apenas comienza. INNE sigue creciendo, aprendiendo e innovando, porque sabemos que la educación también cambia y que cada generación trae nuevas preguntas, nuevos sueños y nuevas formas de aprender, y nosotros queremos seguir haciendo parte de ese camino.',
      },
      {
        type: 'closing',
        text: 'Porque cuando acercamos educación, acercamos posibilidades, y detrás de cada posibilidad, hay una historia esperando comenzar.',
      },
    ],
  },
];

export const getBlogPost = (slug) => blogPosts.find((post) => post.slug === slug) || null;

// Tiempo de lectura estimado (≈ 200 palabras por minuto)
export const readingTime = (post) => {
  const words = post.blocks
    .map((b) => b.text || '')
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

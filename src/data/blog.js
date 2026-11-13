// ===== BLOG INNE =====
// Artículos del mini blog que se muestra en la sección de Noticias.
// Cada artículo se compone de bloques: lead, p, h2, highlight, figure y bridge (ilustración animada).

import portada from '../assets/images/blog-conecta-portada.jpg';
import virtual from '../assets/images/blog-conecta-virtual.jpg';
import grado from '../assets/images/blog-conecta-grado.jpg';
import tarjeta from '../assets/images/blog-conecta-tarjeta.jpg';
import encuentroBanner from '../assets/images/encuentro-2026.jpg';

// Fotos de la galería del Encuentro Nacional: basta con poner los archivos .jpg en
// src/assets/galeria-encuentro-2026/ (se muestran en orden por nombre de archivo).
const fotosEncuentro = Object.entries(
  import.meta.glob('../assets/galeria-encuentro-2026/*.jpg', { eager: true, import: 'default' })
)
  .sort(([a], [b]) => a.localeCompare(b, 'es', { numeric: true }))
  .map(([, src], i) => ({ src, alt: `Encuentro Nacional INNE 2026 en Bogotá, foto ${i + 1}` }));

export const IMAGEN_CORPORATIVA_URL = 'https://drive.google.com/drive/folders/18OySj_0zF_qk0F5S-ShduAeIVPOm6NXj?usp=drive_link';

export const blogPosts = [
  {
    slug: 'encuentro-nacional-inne-2026',
    title: 'De diferentes ciudades, una misma historia: así vivimos nuestro Encuentro Nacional INNE 2026',
    excerpt:
      'Hay encuentros que nos recuerdan que detrás de cada mensaje, cada llamada y cada meta alcanzada hay personas que hacen posible nuestra historia. Esta vez nos encontramos en Bogotá.',
    category: 'Nuestra gente',
    date: '2026-11-13',
    author: 'Equipo Innovación E-learning',
    cover: fotosEncuentro[0]?.src || encuentroBanner,
    thumb: fotosEncuentro[0]?.src || encuentroBanner,
    closingImage: grado,
    tags: ['Encuentro Nacional', 'Equipo INNE', '8 años'],
    blocks: [
      {
        type: 'lead',
        text: 'Hay encuentros que nos recuerdan que detrás de cada mensaje, cada llamada y cada meta alcanzada hay personas que hacen posible nuestra historia.',
      },
      { type: 'notice', target: 'descarga', text: '¿Vienes por tu botón de WhatsApp?', link: 'Descárgalo aquí' },
      {
        type: 'p',
        text: 'Durante el año compartimos reuniones, mensajes, retos y muchas horas de trabajo. Nos acompañamos desde diferentes ciudades, resolvemos situaciones a la distancia y celebramos los logros de nuestros compañeros, aunque muchas veces sea a través de una pantalla.',
      },
      { type: 'highlight', text: 'Pero esta vez fue diferente. Nos encontramos en Bogotá.' },
      {
        type: 'p',
        text: 'El Encuentro Nacional INNE 2026 nos permitió cambiar las pantallas por conversaciones cara a cara, las reuniones virtuales por espacios compartidos y la rutina por momentos que nos ayudaron a conocernos un poco más.',
      },
      { type: 'h2', id: 'escucharnos', text: 'Un espacio para escucharnos y reconocer lo que hemos construido' },
      {
        type: 'p',
        text: 'Cada sede tiene sus propias historias, desafíos y maneras de hacer las cosas. Por eso, uno de los momentos más valiosos del encuentro fue escuchar las experiencias de nuestros compañeros y conocer de cerca el trabajo que se desarrolla en cada lugar donde INNE hace presencia.',
      },
      {
        type: 'p',
        text: 'Durante las jornadas compartimos los avances alcanzados en 2026, hablamos de los retos que enfrentamos y reconocimos los aprendizajes que nos dejó el año.',
      },
      {
        type: 'p',
        text: 'También hubo espacio para las risas, las conversaciones espontáneas y las actividades de integración. Esos momentos que, aunque no siempre aparecen en los informes, también hacen parte de lo que significa trabajar en equipo.',
      },
      {
        type: 'p',
        text: 'Porque conocernos mejor nos permite comprender el trabajo de los demás, valorar sus esfuerzos y encontrar nuevas formas de apoyarnos.',
      },
      { type: 'h2', id: 'lo-que-viene', text: 'Pensar juntos en lo que viene' },
      { type: 'p', text: 'El encuentro también nos invitó a mirar hacia adelante.' },
      {
        type: 'p',
        text: 'A través de los espacios de planeación, cada área tuvo la oportunidad de compartir sus ideas, identificar oportunidades de mejora y proponer acciones para seguir fortaleciendo nuestro trabajo durante 2027.',
      },
      {
        type: 'p',
        text: 'No se trataba únicamente de presentar resultados o establecer nuevas metas. También queríamos escucharnos, cuestionar lo que podemos hacer mejor y reconocer que las buenas ideas pueden surgir desde cualquier área o sede de nuestra organización.',
      },
      {
        type: 'p',
        text: 'De estas conversaciones surgieron propuestas y compromisos que nos permitirán seguir avanzando durante el próximo año.',
      },
      { type: 'h2', id: 'ocho-anos', text: 'Ocho años de historia, muchas personas que la hacen posible' },
      {
        type: 'p',
        text: 'Este encuentro tuvo un significado especial: en 2026 celebramos ocho años de Innovación E-Learning.',
      },
      {
        type: 'p',
        text: 'Ocho años en los que hemos crecido, aprendido, enfrentado dificultades y compartido grandes satisfacciones.',
      },
      {
        type: 'p',
        text: 'Y aunque nuestra historia se refleja en los proyectos, las alianzas y los resultados alcanzados, también se encuentra en cada persona que ha aportado su tiempo, sus conocimientos y su esfuerzo para llegar hasta aquí.',
      },
      {
        type: 'p',
        text: 'El Encuentro Nacional fue una oportunidad para reconocer ese camino y recordar que nuestro crecimiento no depende únicamente de las metas que alcanzamos, sino también de cómo las construimos juntos.',
      },
      { type: 'h2', id: 'fotografia', text: 'Nos llevamos mucho más que una fotografía de equipo' },
      {
        type: 'p',
        text: 'Regresamos a nuestras ciudades con nuevas ideas, compromisos y aprendizajes. Pero también con algo que no se puede medir en indicadores: la alegría de haber compartido, de ponerles rostro a tantas conversaciones y de sentirnos más cerca de quienes hacen parte de nuestro día a día.',
      },
      {
        type: 'p',
        text: 'Nos esperan nuevos retos en 2027 y seguramente tendremos mucho por aprender y mejorar.',
      },
      {
        type: 'p',
        text: 'Pero si algo nos dejó este encuentro es la certeza de que vale la pena seguir creando espacios para escucharnos, reconocernos y trabajar juntos.',
      },
      {
        type: 'closing',
        text: 'Porque al final, lo más valioso de INNE no es solamente lo que hemos construido durante estos ocho años, sino las personas con quienes hemos tenido la oportunidad de hacerlo.',
      },
      { type: 'signature', text: 'Encuentro Nacional INNE 2026 · Bogotá, Colombia.' },
      ...(fotosEncuentro.length ? [{ type: 'h2', id: 'galeria', text: 'Así lo vivimos' }, { type: 'gallery', images: fotosEncuentro }] : []),
      {
        type: 'download',
        id: 'descarga',
        eyebrow: 'Imagen corporativa',
        title: 'Descarga tu imagen corporativa aquí',
        text: 'Encuentra tu botón de WhatsApp y las piezas de marca de INNE para usarlas en tus canales.',
        cta: 'Descargar en Google Drive',
        url: IMAGEN_CORPORATIVA_URL,
      },
    ],
  },
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

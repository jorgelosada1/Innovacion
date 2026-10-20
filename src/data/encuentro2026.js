// ===== ENCUENTRO NACIONAL INNE 2026 =====
// Contenido tomado del documento "Agenda Encuentro Nacional INNE 2026".

import banner from '../assets/images/encuentro-2026.jpg';

export const encuentro = {
  slug: 'encuentro-nacional-2026',
  title: 'Encuentro Nacional INNE 2026',
  subtitle: 'Agenda, recomendaciones y normas de comportamiento',
  banner,
  dates: '26 al 30 de octubre de 2026',
  places: 'Bogotá · Chinauta',
  // Hora de Colombia (UTC−5)
  start: '2026-10-26T08:00:00-05:00',
  end: '2026-10-30T23:59:00-05:00',
  objective:
    'Propiciar un espacio de integración, escucha, colaboración y construcción colectiva, para revisar los resultados de 2026, consolidar propuestas y definir compromisos de cara a 2027.',
  closing: '¡Vivamos este encuentro con entusiasmo, respeto, colaboración y compromiso!',
};

export const agenda = [
  {
    id: 'dia-1',
    label: 'Día 1',
    day: 'Lunes 26',
    theme: 'Integración y construcción colectiva',
    items: [
      { time: '8:00–8:30 a. m.', title: 'Bienvenida – Fernán' },
      { time: '8:30–9:00 a. m.', title: 'Actividad rompe hielo' },
      { time: '9:00–10:00 a. m.', title: 'Trabajo en grupos' },
      { time: '10:00–10:30 a. m.', title: 'Mesa de consolidación – Actividad comercial' },
      { time: '10:30–11:45 a. m.', title: 'Socialización y construcción colectiva' },
      { time: '11:45 a. m.–12:00 m.', title: 'Cierre' },
      { time: '12:00–12:30 p. m.', title: 'Puente al 2027' },
      { time: '12:30–2:00 p. m.', title: 'Almuerzo' },
      { time: '2:00–2:15 p. m.', title: 'Actividad Energizer' },
      { time: '2:30–4:30 p. m.', title: 'Carpetas: escuchar, comprender, identificar, empatizar, comunicar y colaborar' },
      { time: 'Cierre de jornada', title: 'Cierre y reflexiones' },
    ],
  },
  {
    id: 'dia-2',
    label: 'Día 2',
    day: 'Martes 27',
    theme: 'Balance y trabajo por áreas',
    items: [
      { time: '8:00–9:00 a. m.', title: 'Trabajo normal' },
      { time: '9:00–9:10 a. m.', title: 'Actividad rompe hielo' },
      { time: '9:10–9:20 a. m.', title: 'Bienvenida por parte de Gerencia General' },
      { time: '9:20–9:30 a. m.', title: 'Reglas y expectativas' },
      { time: '9:30–10:00 a. m.', title: 'Actividad de apertura: kit de siembra' },
      { time: '10:00–10:30 a. m.', title: 'Cierre y reflexión' },
      { time: '10:30–11:00 a. m.', title: 'Presentación del cierre 2026 – Gerencia' },
      { time: '11:00 a. m.–12:30 p. m.', title: 'Presentación de cada área' },
      { time: '12:30–1:45 p. m.', title: 'Almuerzo' },
      { time: '1:45–2:00 p. m.', title: 'Actividad Energizer 2: reto de la hoja' },
      { time: '2:00–4:15 p. m.', title: 'Laboratorio' },
      { time: '4:15 p. m.', title: 'Cierre' },
    ],
  },
  {
    id: 'dia-3',
    label: 'Día 3',
    day: 'Miércoles 28',
    theme: 'Propuestas, compromisos y cierre',
    items: [
      { time: '8:00–9:00 a. m.', title: 'Trabajo' },
      { time: '9:00–9:15 a. m.', title: 'Energizer' },
      { time: '9:15–10:15 a. m.', title: 'Consolidación de propuestas' },
      { time: '10:15–10:30 a. m.', title: 'Preparación de presentación de máximo 10 minutos' },
      { time: '10:30 a. m.–12:30 p. m.', title: 'Presentaciones – Shark Tank' },
      { time: '12:30–2:00 p. m.', title: 'Almuerzo' },
      { time: '2:00–3:00 p. m.', title: 'Decisiones del Comité Directivo y compromisos' },
      { time: '3:00–3:30 p. m.', title: 'Reconozco a mi equipo' },
      { time: '3:30–4:00 p. m.', title: 'Cierre' },
    ],
  },
  {
    id: 'chinauta',
    label: 'Días 4 y 5',
    day: 'Jueves 29 – Viernes 30',
    theme: 'Traslado y encuentro en Chinauta',
    trip: [
      {
        day: 'Jueves 29 de octubre',
        text: 'Salida desde Innovación hacia el hotel en Chinauta, de acuerdo con las indicaciones logísticas que comparta la organización.',
        note: 'Entrega de regalos de amigo secreto durante el evento en el hotel.',
      },
      {
        day: 'Viernes 30 de octubre',
        text: 'Continuidad de las actividades del encuentro en el hotel, conforme al cronograma.',
      },
    ],
  },
];

export const amigoSecreto = {
  when: 'Jueves 29 de octubre, durante el evento en el hotel de Chinauta',
  rules: [
    'Llevar el regalo previamente comprado, empacado y marcado con el nombre de la persona destinataria.',
    'Respetar el valor acordado y las condiciones definidas para la actividad.',
    'Entregar el regalo en el momento que indique la persona encargada; evitar adelantar la entrega o revelar la identidad del amigo secreto antes de tiempo.',
    'Participar con buena disposición, respeto y sentido de integración.',
    'Evitar bromas o comentarios que puedan incomodar a otra persona.',
  ],
};

export const normas = [
  { icon: 'clock', title: 'Puntualidad y participación', text: 'Respetar los horarios, regresar a tiempo de los descansos y participar activamente en las actividades.' },
  { icon: 'ear', title: 'Respeto', text: 'Escuchar sin interrumpir, respetar las opiniones diferentes y mantener un trato cordial con todas las personas.' },
  { icon: 'team', title: 'Trabajo en equipo', text: 'Aportar ideas de manera constructiva, cumplir los roles asignados y apoyar los acuerdos colectivos.' },
  { icon: 'phone', title: 'Uso del celular', text: 'Mantenerlo en silencio durante las sesiones y utilizarlo solo cuando sea necesario o durante los descansos.' },
  { icon: 'glass', title: 'Consumo responsable', text: 'Actuar con prudencia y mantener una conducta adecuada durante toda la actividad; no conducir bajo los efectos del alcohol.' },
  { icon: 'home', title: 'Cuidado de las instalaciones', text: 'Hacer uso responsable de habitaciones, zonas comunes, mobiliario y recursos del hotel; reportar de inmediato cualquier daño o novedad.' },
  { icon: 'moon', title: 'Convivencia y descanso', text: 'Respetar los horarios de descanso, controlar el volumen de la música y evitar ruidos que afecten a otras personas o huéspedes.' },
  { icon: 'shield', title: 'Seguridad', text: 'Seguir las instrucciones del hotel y de los organizadores, informar cualquier emergencia y no alejarse del grupo sin avisar a la persona coordinadora.' },
  { icon: 'star', title: 'Imagen y representación', text: 'Recordar que cada participante representa a INNE; mantener una actitud profesional, amable y coherente con los valores de la organización.' },
  { icon: 'camera', title: 'Fotografías y redes sociales', text: 'Pedir autorización antes de publicar imágenes de compañeros y respetar a quienes no deseen aparecer en fotografías o videos.' },
];

export const recomendaciones = [
  'Llevar documento de identidad, celular cargado, cargador y los elementos personales necesarios para los días de estadía.',
  'Empacar ropa cómoda para las actividades grupales, una muda adicional y artículos de aseo personal.',
  'Llevar el regalo de amigo secreto desde la salida para evitar olvidos o compras de última hora.',
  'Informar con anticipación a Talento Humano o a la persona coordinadora cualquier requerimiento especial o novedad logística.',
  'Verificar antes de salir que no queden pendientes laborales urgentes y coordinar con el líder la continuidad de las actividades que correspondan.',
  'Mantener sus pertenencias identificadas y cuidar objetos de valor.',
];

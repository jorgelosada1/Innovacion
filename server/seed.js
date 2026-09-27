import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Noticia from './models/Noticia.js';
import Slide from './models/Slide.js';
import Curso from './models/Curso.js';
import Faq from './models/Faq.js';
import Comment from './models/Comment.js';
import Setting from './models/Setting.js';

dotenv.config();

export const seedData = async () => {
  console.log('🔄 Iniciando sincronización idempotente de datos en MongoDB...');

  // 1. Limpiar documentos antiguos con ObjectIds de 24 caracteres hexadecimales para evitar duplicados
  const hex24Regex = /^[0-9a-fA-F]{24}$/;
  await Comment.deleteMany({ _id: { $regex: hex24Regex } });
  await Noticia.deleteMany({ _id: { $regex: hex24Regex } });
  await Slide.deleteMany({ _id: { $regex: hex24Regex } });
  await Curso.deleteMany({ _id: { $regex: hex24Regex } });
  await Faq.deleteMany({ _id: { $regex: hex24Regex } });

  // 2. Admin User (innovacion / 0228)
  const existingUser = await User.findOne({ username: 'innovacion' });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('0228', 10);
    await User.create({ username: 'innovacion', password: hashedPassword, role: 'admin' });
    console.log('✅ Usuario admin innovacion creado');
  }

  // 3. Noticias (n1, n2)
  const noticias = [
    {
      _id: 'n1',
      titulo: 'Inscripciones Abiertas 2025-2',
      resumen: 'Inicia tu camino universitario con nuestras alianzas académicas. Programas presenciales y virtuales disponibles.',
      contenido: '<p>Las inscripciones para el segundo semestre de 2025 ya están abiertas. Contamos con una amplia oferta de programas académicos en modalidad presencial y virtual, en alianza con la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana. No pierdas la oportunidad de transformar tu futuro.</p>',
      fecha: '2025-07-01',
      imagen: ''
    },
    {
      _id: 'n2',
      titulo: 'Educación Virtual de Calidad',
      resumen: 'Accede a programas acreditados desde cualquier lugar. Plataformas modernas y acompañamiento permanente.',
      contenido: '<p>Nuestra oferta de educación virtual te permite estudiar desde cualquier rincón de Colombia. Con plataformas modernas y un equipo de soporte dedicado, garantizamos una experiencia educativa de primer nivel.</p>',
      fecha: '2025-06-15',
      imagen: ''
    }
  ];
  for (const n of noticias) {
    await Noticia.findOneAndUpdate({ _id: n._id }, { $set: n }, { upsert: true, runValidators: true });
  }
  console.log('✅ Noticias sincronizadas (n1, n2)');

  // 4. Slides (s1..s4)
  const slides = [
    { _id: 's1', imagen: '/src/assets/images/1.png', noticiaId: 'n1', orden: 0, title: 'Inscripciones Abiertas' },
    { _id: 's2', imagen: '/src/assets/images/2.png', noticiaId: 'n2', orden: 1, title: 'Educación Virtual' },
    { _id: 's3', imagen: '/src/assets/images/andina.png', link: '/universidades/areandina', title: 'Fundación Universitaria del Área Andina', orden: 2 },
    { _id: 's4', imagen: '/src/assets/images/ibero.png', link: '/universidades/iberoamericana', title: 'Corporación Universitaria Iberoamericana', orden: 3 }
  ];
  for (const s of slides) {
    await Slide.findOneAndUpdate({ _id: s._id }, { $set: s }, { upsert: true, runValidators: true });
  }
  console.log('✅ Slides sincronizados (s1..s4)');

  // 5. Cursos (c1)
  const cursos = [
    {
      _id: 'c1',
      titulo: 'Liderazgo Efectivo',
      descripcion: 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento y tomar decisiones estratégicas.',
      videoId: 'jS3c8ZoxAgE',
      duracion: '4 semanas',
      nivel: 'Intermedio',
      temas: ['Comunicación asertiva', 'Toma de decisiones', 'Gestión de conflictos', 'Motivación de equipos'],
      evaluacion: true
    }
  ];
  for (const c of cursos) {
    await Curso.findOneAndUpdate({ _id: c._id }, { $set: c }, { upsert: true, runValidators: true });
  }
  console.log('✅ Cursos sincronizados (c1)');

  // 6. FAQs (f1..f5)
  const faqs = [
    { _id: 'f1', question: '¿Los títulos son oficiales?', answer: 'Sí, todas nuestras universidades aliadas están avaladas por el Ministerio de Educación Nacional de Colombia. Los títulos tienen la misma validez que los presenciales.', orden: 0 },
    { _id: 'f2', question: '¿Cómo es el proceso de acompañamiento?', answer: 'Te asignamos un asesor personal que te guía desde la inscripción hasta la graduación. Tendrás soporte académico y administrativo durante toda tu carrera.', orden: 1 },
    { _id: 'f3', question: '¿Tiene algún costo la asesoría?', answer: 'No, nuestra asesoría es completamente gratuita. Te ayudamos a encontrar el programa perfecto para ti sin ningún compromiso.', orden: 2 },
    { _id: 'f4', question: '¿Qué necesito para inscribirme?', answer: 'Solo necesitas tu documento de identidad, diploma de bachiller (o acta de grado) y resultados del ICFES. Nosotros te guiamos en todo el proceso.', orden: 3 },
    { _id: 'f5', question: '¿Hay opciones de financiación?', answer: 'Sí, contamos con convenios con Icetex y las universidades ofrecen planes de pago flexibles. También hay becas y descuentos especiales.', orden: 4 },
  ];
  for (const f of faqs) {
    await Faq.findOneAndUpdate({ _id: f._id }, { $set: f }, { upsert: true, runValidators: true });
  }
  console.log('✅ FAQs sincronizadas (f1..f5)');

  // 7. Comments (cm1..cm6) - Fuente única de verdad consistente
  const comments = [
    { _id: 'cm1', text: 'Trabajar en Innovación e-Learning me ha permitido crecer profesionalmente en un ambiente de constante aprendizaje y colaboración.', name: 'Johan', role: 'Equipo Comercial', type: 'colaborador', photoUrl: '' },
    { _id: 'cm2', text: 'Me encanta la cultura de equipo que tenemos. Cada día es una oportunidad para innovar y aportar al cambio educativo en Colombia.', name: 'Paula', role: 'Área de Gestión', type: 'colaborador', photoUrl: '' },
    { _id: 'cm3', text: 'Aquí valoran nuestras ideas y nos dan las herramientas para hacer la diferencia en la educación superior del país.', name: 'Erika', role: 'Liderazgo Comercial', type: 'colaborador', photoUrl: '' },
    { _id: 'cm4', text: 'La atención y el acompañamiento fueron excepcionales durante todo mi proceso.', name: 'María Rodríguez', role: 'Estudiante de Administración', type: 'testimonio', university: 'Areandina', rating: 5, color: '#2E86C1' },
    { _id: 'cm5', text: 'Gracias a Innovación e-Learning pude acceder a educación virtual de calidad.', name: 'Carlos Mendoza', role: 'Estudiante de Ingeniería', type: 'testimonio', university: 'Iberoamericana', rating: 5, color: '#E74C3C' },
    { _id: 'cm6', text: 'El proceso fue muy sencillo y siempre tuve apoyo constante de mi asesor.', name: 'Ana López', role: 'Estudiante de Psicología', type: 'testimonio', university: 'Areandina', rating: 5, color: '#F39C12' }
  ];
  for (const cm of comments) {
    await Comment.findOneAndUpdate({ _id: cm._id }, { $set: cm }, { upsert: true, runValidators: true });
  }
  console.log('✅ Comentarios sincronizados (cm1..cm6)');

  // 8. Settings (pin)
  await Setting.findOneAndUpdate({ key: 'pin' }, { $set: { key: 'pin', value: '0228' } }, { upsert: true, runValidators: true });
  console.log('✅ Configuración PIN sincronizada (pin: 0228)');

  console.log('🎉 Sincronización completada exitosamente sin duplicados.');
};

// Si se ejecuta directamente desde línea de comandos (node seed.js)
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://csugalan_db_user:rfnJJmRfRuRBk6xx@cluster0.85hfqb3.mongodb.net/Innovacion?retryWrites=true&w=majority';
  mongoose.connect(mongoUri)
    .then(async () => {
      await seedData();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error ejecutando seed:', err);
      process.exit(1);
    });
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Noticia from './models/Noticia.js';
import Slide from './models/Slide.js';
import Curso from './models/Curso.js';
import Faq from './models/Faq.js';
import Comment from './models/Comment.js';
import Setting from './models/Setting.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://csugalan_db_user:rfnJJmRfRuRBk6xx@cluster0.85hfqb3.mongodb.net/Innovacion?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB');

    // Clean up
    await User.deleteMany();
    await Noticia.deleteMany();
    await Slide.deleteMany();
    await Curso.deleteMany();
    await Faq.deleteMany();
    await Comment.deleteMany();
    await Setting.deleteMany();

    // 1. User
    const user = new User({ username: 'innovacion', password: '0228', role: 'admin' });
    await user.save();

    // 2. Noticias
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
    await Noticia.insertMany(noticias);

    // 3. Slides
    const slides = [
      { _id: 's1', imagen: '/src/assets/images/1.png', noticiaId: 'n1', orden: 0, title: 'Inscripciones Abiertas' },
      { _id: 's2', imagen: '/src/assets/images/2.png', noticiaId: 'n2', orden: 1, title: 'Educación Virtual' },
      { _id: 's3', imagen: '/src/assets/images/andina.png', link: '/universidades/areandina', title: 'Fundación Universitaria del Área Andina', orden: 2 },
      { _id: 's4', imagen: '/src/assets/images/ibero.png', link: '/universidades/iberoamericana', title: 'Corporación Universitaria Iberoamericana', orden: 3 }
    ];
    await Slide.insertMany(slides);

    // 4. Cursos
    const curso = new Curso({
      _id: 'c1',
      titulo: 'Liderazgo Efectivo',
      descripcion: 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento y tomar decisiones estratégicas.',
      videoId: 'jS3c8ZoxAgE',
      duracion: '4 semanas',
      nivel: 'Intermedio',
      temas: ['Comunicación asertiva', 'Toma de decisiones', 'Gestión de conflictos', 'Motivación de equipos'],
      evaluacion: true
    });
    await curso.save();

    // 5. FAQs
    const faqs = [
      { _id: 'f1', question: '¿Los títulos son oficiales?', answer: 'Sí, todas nuestras universidades aliadas están avaladas por el Ministerio de Educación Nacional de Colombia. Los títulos tienen la misma validez que los presenciales.', orden: 0 },
      { _id: 'f2', question: '¿Cómo es el proceso de acompañamiento?', answer: 'Te asignamos un asesor personal que te guía desde la inscripción hasta la graduación. Tendrás soporte académico y administrativo durante toda tu carrera.', orden: 1 },
      { _id: 'f3', question: '¿Tiene algún costo la asesoría?', answer: 'No, nuestra asesoría es completamente gratuita. Te ayudamos a encontrar el programa perfecto para ti sin ningún compromiso.', orden: 2 },
      { _id: 'f4', question: '¿Qué necesito para inscribirme?', answer: 'Solo necesitas tu documento de identidad, diploma de bachiller (o acta de grado) y resultados del ICFES. Nosotros te guiamos en todo el proceso.', orden: 3 },
      { _id: 'f5', question: '¿Hay opciones de financiación?', answer: 'Sí, contamos con convenios con Icetex y las universidades ofrecen planes de pago flexibles. También hay becas y descuentos especiales.', orden: 4 },
    ];
    await Faq.insertMany(faqs);

    // 6. Comments
    const comments = [
      { _id: 'cm1', text: 'Trabajar en Innovación e-Learning me ha permitido crecer profesionalmente en un ambiente de constante aprendizaje y colaboración.', name: 'Johan', role: 'Equipo Comercial', type: 'colaborador', photoUrl: '' },
      { _id: 'cm2', text: 'Me encanta la cultura de equipo que tenemos. Cada día es una oportunidad para innovar y aportar al cambio educativo en Colombia.', name: 'Paula', role: 'Área de Gestión', type: 'colaborador', photoUrl: '' },
      { _id: 'cm3', text: 'Aquí valoran nuestras ideas y nos dan las herramientas para hacer la diferencia en la educación superior del país.', name: 'Erika', role: 'Liderazgo Comercial', type: 'colaborador', photoUrl: '' },
      { _id: 'cm4', text: 'La atención y el acompañamiento fueron excepcionales durante todo mi proceso.', name: 'María Rodríguez', role: 'Estudiante de Administración', type: 'testimonio', university: 'Areandina', rating: 5, color: '#2E86C1' },
      { _id: 'cm5', text: 'Gracias a Innovación e-Learning pude acceder a educación virtual de calidad.', name: 'Carlos Mendoza', role: 'Estudiante de Ingeniería', type: 'testimonio', university: 'Iberoamericana', rating: 5, color: '#E74C3C' },
      { _id: 'cm6', text: 'El proceso fue muy sencillo y siempre tuve apoyo constante de mi asesor.', name: 'Ana López', role: 'Estudiante de Psicología', type: 'testimonio', university: 'Areandina', rating: 5, color: '#F39C12' }
    ];
    await Comment.insertMany(comments);

    // 7. Settings
    const setting = new Setting({ key: 'pin', value: '0228' });
    await setting.save();

    console.log('Seed exitoso con IDs personalizados string!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seed();

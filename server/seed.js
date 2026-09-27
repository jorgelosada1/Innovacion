import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import User from './models/User.js';
import Noticia from './models/Noticia.js';
import Slide from './models/Slide.js';
import Curso from './models/Curso.js';
import Faq from './models/Faq.js';
import Comment from './models/Comment.js';
import Setting from './models/Setting.js';

try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch {}

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Innovacion');
    console.log('Conectado a MongoDB');

    // Clean up
    await User.deleteMany();
    await Noticia.deleteMany();
    await Slide.deleteMany();
    await Curso.deleteMany();
    await Faq.deleteMany();
    await Comment.deleteMany();
    await Setting.deleteMany();

    // 3. User
    const user = new User({ username: 'innovacion', password: '0228', role: 'admin' });
    await user.save();

    // 4. Noticias
    const noticia1 = new Noticia({
      titulo: 'Inscripciones Abiertas 2025-2',
      resumen: 'Conoce las nuevas opciones...',
      contenido: '<p>Las inscripciones para...</p>',
      fecha: '2025-07-01'
    });
    const noticia2 = new Noticia({
      titulo: 'Educación Virtual de Calidad',
      resumen: 'Descubre por qué somos líderes...',
      contenido: '<p>En Innovación e-Learning...</p>',
      fecha: '2025-06-15'
    });
    await noticia1.save();
    await noticia2.save();

    // 5. Slides
    const slides = [
      { imagen: '/src/assets/images/1.png', noticiaId: noticia1._id, orden: 0 },
      { imagen: '/src/assets/images/2.png', noticiaId: noticia2._id, orden: 1 },
      { imagen: '/src/assets/images/andina.png', link: '/universidades/areandina', title: 'Fundación Universitaria del Área Andina', orden: 2 },
      { imagen: '/src/assets/images/ibero.png', link: '/universidades/iberoamericana', title: 'Corporación Universitaria Iberoamericana', orden: 3 }
    ];
    await Slide.insertMany(slides);

    // 6. Cursos
    const curso = new Curso({ titulo: 'Liderazgo Efectivo', nivel: 'Básico' });
    await curso.save();

    // 7. FAQs
    const faqs = [
      { question: '¿Los títulos son oficiales?', answer: 'Sí, todas nuestras universidades aliadas están avaladas por el Ministerio de Educación Nacional de Colombia. Los títulos tienen la misma validez que los presenciales.', orden: 0 },
      { question: '¿Cómo es el proceso de acompañamiento?', answer: 'Te asignamos un asesor personal que te guía desde la inscripción hasta la graduación. Tendrás soporte académico y administrativo durante toda tu carrera.', orden: 1 },
      { question: '¿Tiene algún costo la asesoría?', answer: 'No, nuestra asesoría es completamente gratuita. Te ayudamos a encontrar el programa perfecto para ti sin ningún compromiso.', orden: 2 },
      { question: '¿Qué necesito para inscribirme?', answer: 'Solo necesitas tu documento de identidad, diploma de bachiller (o acta de grado) y resultados del ICFES. Nosotros te guiamos en todo el proceso.', orden: 3 },
      { question: '¿Hay opciones de financiación?', answer: 'Sí, contamos con convenios con Icetex y las universidades ofrecen planes de pago flexibles. También hay becas y descuentos especiales.', orden: 4 },
    ];
    await Faq.insertMany(faqs);

    // 8 & 9. Comments
    const comments = [
      { text: 'Trabajar en Innovación e-Learning me ha permitido crecer profesionalmente...', name: 'Johan', role: 'Equipo Comercial', type: 'colaborador', photoUrl: '' },
      { text: 'Me encanta la cultura de equipo que tenemos...', name: 'Paula', role: 'Área de Gestión', type: 'colaborador', photoUrl: '' },
      { text: 'Aquí valoran nuestras ideas y nos dan las herramientas...', name: 'Erika', role: 'Liderazgo Comercial', type: 'colaborador', photoUrl: '' },
      { text: 'La atención y el acompañamiento fueron excepcionales...', name: 'María Rodríguez', role: 'Estudiante de Administración', type: 'testimonio', university: 'Areandina', rating: 5, color: '#2E86C1' },
      { text: 'Gracias a Innovación e-Learning pude acceder a educación...', name: 'Carlos Mendoza', role: 'Estudiante de Ingeniería', type: 'testimonio', university: 'Iberoamericana', rating: 5, color: '#E74C3C' },
      { text: 'El proceso fue muy sencillo y siempre tuve apoyo...', name: 'Ana López', role: 'Estudiante de Psicología', type: 'testimonio', university: 'Areandina', rating: 5, color: '#F39C12' }
    ];
    await Comment.insertMany(comments);

    // 10. Settings
    const setting = new Setting({ key: 'pin', value: '0228' });
    await setting.save();

    console.log('Seed exitoso!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seed();

-- =====================================================================
--  Contenido inicial (el mismo que muestra hoy la web).
--  Las imágenes "asset:..." son las que vienen incluidas en la web.
-- =====================================================================

INSERT INTO noticias (id, titulo, resumen, contenido, imagen, fecha, publicado) VALUES
(1, 'Inscripciones Abiertas 2025-2',
    'Inicia tu camino universitario con nuestras alianzas académicas. Programas presenciales y virtuales disponibles.',
    'Las inscripciones para el segundo semestre de 2025 ya están abiertas. Contamos con una amplia oferta de programas académicos en modalidad presencial y virtual, en alianza con la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana. No pierdas la oportunidad de transformar tu futuro.',
    '', '2025-07-01', 1),
(2, 'Educación Virtual de Calidad',
    'Accede a programas acreditados desde cualquier lugar. Plataformas modernas y acompañamiento permanente.',
    'Nuestra oferta de educación virtual te permite estudiar desde cualquier rincón de Colombia. Con plataformas modernas y un equipo de soporte dedicado, garantizamos una experiencia educativa de primer nivel.',
    '', '2025-06-15', 1);

INSERT INTO slider (imagen, titulo, enlace, noticia_id, orden, activo) VALUES
('asset:aniversario-8', 'Celebrando juntos 8 años: conectando sueños con oportunidades', '/noticias/blog/educacion-que-conecta', NULL, 1, 1),
('asset:encuentro-2026', 'Encuentro Nacional 2026', '/noticias/encuentro-nacional-2026', NULL, 2, 1),
('asset:historia', 'Esta es la historia de Innovación E-learning', '', 2, 3, 1),
('asset:andina', 'Fundación Universitaria del Área Andina', '/universidades/areandina', NULL, 4, 1),
('asset:ibero', 'Corporación Universitaria Iberoamericana', '/universidades/iberoamericana', NULL, 5, 1);

INSERT INTO cursos (titulo, descripcion, video_id, duracion, nivel, temas, evaluacion, orden, activo) VALUES
('Liderazgo Efectivo',
 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento y tomar decisiones estratégicas.',
 'jS3c8ZoxAgE', '4 semanas', 'Intermedio',
 '["Comunicación asertiva","Toma de decisiones","Gestión de conflictos","Motivación de equipos"]', 1, 1, 1);

INSERT INTO faqs (pregunta, respuesta, orden) VALUES
('¿Los títulos emitidos por las universidades son oficiales y acreditados?', 'Sí, 100% oficiales. Emitidos directamente por la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana con su respectivo registro SNIES.', 1),
('¿Cómo funciona el acompañamiento de Innovación E-Learning?', 'Te asignamos un asesor personal que te orienta en el proceso de inscripción, recolección de documentos, opciones de financiación y primer ingreso a las plataformas virtuales.', 2),
('¿Tienen costo las asesorías de Innovación E-Learning?', 'No, nuestras asesorías y acompañamiento son 100% gratuitos para el estudiante, ya que somos aliados oficiales autorizados.', 3),
('¿Cuáles son los requisitos para inscribirme?', 'Para pregrado requieres acta y diploma de bachiller, resultado de pruebas ICFES/Saber 11 y documento de identidad. Para posgrado, título profesional.', 4),
('¿Puedo financiar el valor de la matrícula?', 'Sí, contamos con alianzas con entidades financieras, Icetex y opciones de crédito directo con las universidades.', 5);

import React, { useState } from 'react';
import './ProgramFinder.css';

const programsData = [
  {
    id: 1,
    title: 'Administración de Empresas',
    university: 'Areandina',
    level: 'Pregrado',
    duration: '9 Semestres',
    modality: '100% Virtual',
    brandColor: '#ffd100'
  },
  {
    id: 2,
    title: 'Psicología',
    university: 'Iberoamericana',
    level: 'Pregrado',
    duration: '10 Semestres',
    modality: 'Virtual / Presencial',
    brandColor: '#002f6c'
  },
  {
    id: 3,
    title: 'Especialización en Gestión de Proyectos',
    university: 'Areandina',
    level: 'Posgrado',
    duration: '2 Semestres',
    modality: '100% Virtual',
    brandColor: '#ffd100'
  },
  {
    id: 4,
    title: 'Licenciatura en Pedagogía Infantil',
    university: 'Iberoamericana',
    level: 'Pregrado',
    duration: '8 Semestres',
    modality: '100% Virtual',
    brandColor: '#002f6c'
  },
  {
    id: 5,
    title: 'Ingeniería Industrial',
    university: 'Areandina',
    level: 'Pregrado',
    duration: '10 Semestres',
    modality: '100% Virtual',
    brandColor: '#ffd100'
  },
  {
    id: 6,
    title: 'Especialización en Gerencia de Salud',
    university: 'Iberoamericana',
    level: 'Posgrado',
    duration: '2 Semestres',
    modality: '100% Virtual',
    brandColor: '#002f6c'
  }
];

const ProgramFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [universityFilter, setUniversityFilter] = useState('Todas');
  const [levelFilter, setLevelFilter] = useState('Todos');

  const filteredPrograms = programsData.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniversity = universityFilter === 'Todas' || program.university === universityFilter;
    
    let levelMatch = false;
    if (levelFilter === 'Todos') {
      levelMatch = true;
    } else if (levelFilter === 'Especialización') {
      levelMatch = program.title.includes('Especialización');
    } else {
      levelMatch = program.level === levelFilter && !program.title.includes('Especialización');
    }

    return matchesSearch && matchesUniversity && levelMatch;
  });

  const handleWhatsAppClick = (program) => {
    const message = `Hola, estoy interesado en el programa de ${program.title} de la ${program.university}. Me gustaría recibir más información.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.link/rgw8yn?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="program-finder-section">
      <div className="program-finder-container">
        <div className="section-header">
          <span className="section-badge">Buscador Académico</span>
          <h2>Encuentra tu <em className="accent">Programa Ideal</em></h2>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Buscar programa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <div className="filter-group">
            <div className="university-pills">
              {['Todas', 'Areandina', 'Iberoamericana'].map((uni) => (
                <button
                  key={uni}
                  className={`pill ${universityFilter === uni ? 'active' : ''}`}
                  onClick={() => setUniversityFilter(uni)}
                >
                  {uni}
                </button>
              ))}
            </div>

            <select
              className="level-select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="Todos">Todos los niveles</option>
              <option value="Pregrado">Pregrado</option>
              <option value="Posgrado">Posgrado</option>
              <option value="Especialización">Especialización</option>
            </select>
          </div>
        </div>

        <div className="programs-grid">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <div 
                key={program.id} 
                className="program-card"
                style={{ '--brand-color': program.brandColor }}
              >
                <div className="card-header">
                  <span className={`uni-badge ${program.university.toLowerCase()}`}>
                    {program.university}
                  </span>
                  <span className="level-badge">{program.level}</span>
                </div>
                <h3 className="program-title">{program.title}</h3>
                
                <div className="program-details">
                  <div className="detail-item">
                    <span className="icon">⏱️</span>
                    <span>{program.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">💻</span>
                    <span>{program.modality}</span>
                  </div>
                </div>

                <button 
                  className="whatsapp-btn"
                  onClick={() => handleWhatsAppClick(program)}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="wa-icon">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Solicitar Asesoría por WhatsApp
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">No se encontraron programas con esos filtros.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramFinder;

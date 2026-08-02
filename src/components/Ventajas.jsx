import React from 'react';
import './Ventajas.css';

const Ventajas = () => {
  return (
    <section className="ventajas-section">
      <div className="ventajas-container">
        <h2 className="ventajas-title">Por qué elegir Innovación E-Learning</h2>
        <p className="ventajas-subtitle">Transformamos tu futuro con educación virtual de alta calidad.</p>
        
        <div className="ventajas-grid">
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>Acompañamiento 1 a 1</h3>
            <p>Te guiamos desde la primera asesoría hasta la graduación.</p>
          </div>
          
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </div>
            <h3>100% Modalidad Virtual</h3>
            <p>Estudia a tu propio ritmo con plataformas modernas de clase mundial.</p>
          </div>
          
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.688a.5.5 0 0 1-.81-.47l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
            </div>
            <h3>Universidades Acreditadas</h3>
            <p>Alianzas exclusivas con Fundación Universitaria del Área Andina e Iberoamericana.</p>
          </div>
          
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <h3>Facilidades de Financiación</h3>
            <p>Múltiples opciones de pago, becas y homologación directa.</p>
          </div>
        </div>

        <div className="ventajas-stats">
          <div className="stat-item">
            <h4>+1,000</h4>
            <p>Estudiantes Asesorados</p>
          </div>
          <div className="stat-item">
            <h4>2</h4>
            <p>Universidades de Élite</p>
          </div>
          <div className="stat-item">
            <h4>98%</h4>
            <p>Satisfacción Alumnos</p>
          </div>
          <div className="stat-item">
            <h4>7</h4>
            <p>Años de Experiencia</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ventajas;

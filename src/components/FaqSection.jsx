import React, { useState } from 'react';
import './FaqSection.css';

const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      question: '¿Los títulos emitidos por las universidades son oficiales y acreditados?',
      answer: 'Sí, 100% oficiales. Emitidos directamente por la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana con su respectivo registro SNIES.'
    },
    {
      question: '¿Cómo funciona el acompañamiento de Innovación E-Learning?',
      answer: 'Te asignamos un asesor personal que te orienta en el proceso de inscripción, recolección de documentos, opciones de financiación y primer ingreso a las plataformas virtuales.'
    },
    {
      question: '¿Tienen costo las asesorías de Innovación E-Learning?',
      answer: 'No, nuestras asesorías y acompañamiento son 100% gratuitos para el estudiante, ya que somos aliados oficiales autorizados.'
    },
    {
      question: '¿Cuáles son los requisitos para inscribirme?',
      answer: 'Para pregrado requieres acta y diploma de bachiller, resultado de pruebas ICFES/Saber 11 y documento de identidad. Para posgrado, título profesional.'
    },
    {
      question: '¿Puedo financiar el valor de la matrícula?',
      answer: 'Sí, contamos con alianzas con entidades financieras, Icetex y opciones de crédito directo con las universidades.'
    }
  ];

  const toggleOpen = (index) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <h2 className="faq-title">Preguntas Frecuentes</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIdx === index ? 'active' : ''}`}
              onClick={() => toggleOpen(index)}
            >
              <div className="faq-header">
                <h3>{faq.question}</h3>
                <span className="faq-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              <div className="faq-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

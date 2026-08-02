import { useState } from 'react';
import { getFaqs } from '../utils/dataManager';
import './FaqSection.css';

const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = getFaqs();

  const toggleOpen = (index) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <span className="faq-badge">Resolvemos tus dudas</span>
        <h2 className="faq-title">Preguntas Frecuentes</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={faq.id || index} 
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

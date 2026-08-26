import React, { useState } from 'react';
import './AsesoriaModal.css';

const AsesoriaModal = ({ isOpen, onClose, whatsappPhone }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    interes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneNum = (whatsappPhone || '573144377691').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hola, mi nombre es ${formData.nombre}. Estoy interesado/a en: ${formData.interes}. Mi teléfono es: ${formData.telefono}. Quisiera recibir asesoría.`);
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-container">
            <span className="modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </span>
            <h2>Solicitar Asesoría</h2>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={formData.nombre}
              onChange={handleChange}
              required 
              placeholder="Tu nombre"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefono">Teléfono / WhatsApp</label>
            <input 
              type="tel" 
              id="telefono" 
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required 
              placeholder="Tu número"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="interes">Programa o Universidad de interés</label>
            <input 
              type="text" 
              id="interes" 
              name="interes"
              value={formData.interes}
              onChange={handleChange}
              required 
              placeholder="Ej. Psicología - Areandina"
            />
          </div>
          
          <button type="submit" className="modal-submit">Enviar y Continuar a WhatsApp</button>
        </form>
      </div>
    </div>
  );
};

export default AsesoriaModal;

import { useState } from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: integrate with backend
    alert('Mensaje enviado correctamente. Nos comunicaremos contigo pronto.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <section id="contacto-form" className="contact">
      <div className="contact__container">
        {/* Left info panel */}
        <div className="contact__info">
          <span className="contact__badge">Contáctanos</span>
          <h2 className="contact__heading">
            ¿Tienes preguntas? <br/>Estamos aquí para ayudarte
          </h2>
          <p className="contact__subtext">
            Déjanos tu información y un asesor se comunicará contigo a la brevedad posible.
          </p>

          <div className="contact__details">
            <div className="contact__detail-item">
              <div className="contact__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className="contact__detail-label">Dirección</p>
                <p className="contact__detail-value">Cl 5ta #63 - 35, Oficina 407</p>
              </div>
            </div>

            <div className="contact__detail-item">
              <div className="contact__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <p className="contact__detail-label">Correo</p>
                <p className="contact__detail-value">info@innovacionelearning.org</p>
              </div>
            </div>

            <div className="contact__detail-item">
              <div className="contact__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="contact__detail-label">Teléfono</p>
                <p className="contact__detail-value">(+57) 300 000 0000</p>
              </div>
            </div>

            <div className="contact__detail-item">
              <div className="contact__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="contact__detail-label">Horario</p>
                <p className="contact__detail-value">Lun - Vie: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="contact-name" className="contact__label">Nombre completo</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="contact__input"
                required
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-email" className="contact__label">Correo electrónico</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="contact__input"
                required
              />
            </div>
          </div>

          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="contact-phone" className="contact__label">Teléfono</label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+57 300 000 0000"
                className="contact__input"
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-subject" className="contact__label">Asunto</label>
              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="contact__input contact__select"
                required
              >
                <option value="" disabled>Selecciona un asunto</option>
                <option value="inscripcion">Inscripción</option>
                <option value="informacion">Información de programas</option>
                <option value="soporte">Soporte técnico</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="contact__field">
            <label htmlFor="contact-message" className="contact__label">Mensaje</label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe tu mensaje aquí..."
              className="contact__input contact__textarea"
              rows="4"
              required
            />
          </div>

          <button type="submit" className="contact__submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;

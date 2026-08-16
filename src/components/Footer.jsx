import './Footer.css';
import logoSolo from '../assets/images/LogoSolo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const googleMapsUrl = 'https://www.google.com/maps/place/Innovaci%C3%B3n+Elearning/@4.6265022,-74.1212668,1017m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8e3f996a06acf7b3:0x2bf9f9c73c7d195b!8m2!3d4.6264969!4d-74.1186919!16s%2Fg%2F11zdcsb_kg';
  const googleMapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8123985796245!2d-74.1186919!3d4.6264969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f996a06acf7b3%3A0x2bf9f9c73c7d195b!2sInnovaci%C3%B3n%20Elearning!5e0!3m2!1ses!2sco!4v1722618000000!5m2!1ses!2sco';

  const csuAreandina = [
    'Galán',
    'Aguachica',
    'Buenaventura',
    'Leticia',
    'Sangil',
  ];

  const ceiIberoamericana = [
    'Boyacá',
    'Bogotá',
  ];

  const enlacesLegales = [
    { name: 'Política de privacidad', href: '#' },
    { name: 'Términos y condiciones', href: '#' },
    { name: 'Cookies', href: '#' },
  ];

  return (
    <footer id="contacto" className="footer">
      {/* Top section - Map & Address */}
      <div className="footer__top">
        <div className="footer__top-container">
          <div className="footer__map-area">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__map-link"
            >
              <div className="footer__map-embed">
                <iframe
                  src={googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Innovación e-Learning"
                ></iframe>
                <div className="footer__map-overlay">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Abrir en Google Maps
                </div>
              </div>
            </a>
          </div>

          <div className="footer__address-card">
            <div className="footer__address-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="footer__address-text">
              <span className="footer__address-line">Innovación Elearning</span>
              <span className="footer__address-line">Bogotá, Colombia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer__main">
        {/* Logo overlapping section */}
        <div className="footer__logo-overlap">
          <div className="footer__logo-circle">
            <img src={logoSolo} alt="Innovación e-Learning S.A.S" className="footer__logo-img" />
          </div>
          <div className="footer__logo-info">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="footer__contact-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Innovación Elearning, Bogotá
            </a>
            <a href="mailto:talentohumano@csu.com.co" className="footer__contact-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
              </svg>
              talentohumano@csu.com.co
            </a>
            <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="footer__contact-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Asesoría por WhatsApp
            </a>
          </div>
        </div>

        <div className="footer__main-container">
          {/* CSU Areandina */}
          <div className="footer__column">
            <h3 className="footer__column-title">CSU Areandina</h3>
            <ul className="footer__column-list">
              {csuAreandina.map((city) => (
                <li key={city}>
                  <a href="#" className="footer__column-link">
                    <span className="footer__link-bullet"></span>
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CEI Iberoamericana */}
          <div className="footer__column">
            <h3 className="footer__column-title">CEI Iberoamericana</h3>
            <ul className="footer__column-list">
              {ceiIberoamericana.map((city) => (
                <li key={city}>
                  <a href="#" className="footer__column-link">
                    <span className="footer__link-bullet"></span>
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces Legales */}
          <div className="footer__column">
            <h3 className="footer__column-title">Enlaces Legales</h3>
            <ul className="footer__column-list">
              {enlacesLegales.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="footer__column-link">
                    <span className="footer__link-bullet"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-container">
          <p className="footer__copyright">
            &copy; {currentYear} Todos los derechos reservados. Innovaci&oacute;n e-Learning S.A.S
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

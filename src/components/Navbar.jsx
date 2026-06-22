import { useState, useEffect } from 'react';
import './Navbar.css';
import logoImg from '../assets/images/Logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Colaboradores', href: '#colaboradores' },
    { name: 'Cursos', href: '#cursos' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <a href="#inicio" className="navbar__logo">
          <img src={logoImg} alt="Innovación e-Learning S.A.S" className="navbar__logo-img" />
        </a>

        {/* Desktop Navigation Links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.name} className="navbar__link-item">
              <a href={link.href} className="navbar__link">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a href="#ingresar" className="navbar__cta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Ingresar
        </a>

        {/* Mobile Menu Button */}
        <button
          className={`navbar__hamburger ${isMobileMenuOpen ? 'navbar__hamburger--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul className="navbar__mobile-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="navbar__mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <a href="#ingresar" className="navbar__mobile-cta" onClick={() => setIsMobileMenuOpen(false)}>
          Ingresar
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

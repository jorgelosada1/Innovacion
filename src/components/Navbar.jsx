import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logoImg from '../assets/images/Logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', href: '/', type: 'route' },
    { name: 'Nosotros', href: '/#nosotros', type: 'hash' },
    { name: 'Colaboradores', href: '/colaboradores', type: 'route' },
    { name: 'Cursos', href: '/cursos', type: 'route' },
    { name: 'Contacto', href: '/#contacto-form', type: 'hash' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (link) => {
    setIsMobileMenuOpen(false);
    if (link.type === 'hash') {
      const [path, hash] = link.href.split('#');
      if (location.pathname === path || (path === '/' && location.pathname === '/')) {
        // Same page — scroll to element
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // If different page, the Link will navigate and the hash will be handled
    }
  };

  const isActive = (link) => {
    if (link.type === 'route') {
      return location.pathname === link.href;
    }
    return false;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src={logoImg} alt="Innovación e-Learning S.A.S" className="navbar__logo-img" />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.name} className="navbar__link-item">
              {link.type === 'route' ? (
                <Link
                  to={link.href}
                  className={`navbar__link ${isActive(link) ? 'navbar__link--active' : ''}`}
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  to={link.href}
                  className="navbar__link"
                  onClick={() => handleNavClick(link)}
                >
                  {link.name}
                </Link>
              )}
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
              {link.type === 'route' ? (
                <Link
                  to={link.href}
                  className={`navbar__mobile-link ${isActive(link) ? 'navbar__mobile-link--active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  to={link.href}
                  className="navbar__mobile-link"
                  onClick={() => handleNavClick(link)}
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <Link to="/" className="navbar__mobile-cta" onClick={() => setIsMobileMenuOpen(false)}>
          Ingresar
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

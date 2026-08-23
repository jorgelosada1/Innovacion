import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logoImg from '../assets/images/Logo.png';
import PasswordModal from './PasswordModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
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
    { name: 'Noticias', href: '/noticias', type: 'route' },
    { name: 'Colaboradores', href: '/colaboradores', type: 'route' },
    { name: 'Aprende Aquí', href: '/cursos', type: 'route' },
    { name: 'Brújula Vocacional', href: 'https://test-vocacional-eight.vercel.app/', type: 'password-protected' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePasswordLink = (href) => {
    setIsMobileMenuOpen(false);
    setPendingUrl(href);
    setShowPwModal(true);
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
              {link.type === 'external' ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar__link"
                >
                  {link.name}
                </a>
              ) : link.type === 'password-protected' ? (
                <button
                  className="navbar__link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                  onClick={() => handlePasswordLink(link.href)}
                >
                  {link.name}
                </button>
              ) : link.type === 'route' ? (
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
        <Link to="/login" className="navbar__cta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Ingresar
        </Link>

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
              {link.type === 'external' ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar__mobile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : link.type === 'password-protected' ? (
                <button
                  className="navbar__mobile-link"
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                  onClick={() => handlePasswordLink(link.href)}
                >
                  {link.name}
                </button>
              ) : link.type === 'route' ? (
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
        <Link to="/login" className="navbar__mobile-cta" onClick={() => setIsMobileMenuOpen(false)}>
          Ingresar
        </Link>
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPwModal}
        onClose={() => setShowPwModal(false)}
        onSuccess={() => {
          setShowPwModal(false);
          window.open(pendingUrl, '_blank');
        }}
        title="Brújula Vocacional"
        message="Ingresa la contraseña para acceder"
      />
    </nav>
  );
};

export default Navbar;

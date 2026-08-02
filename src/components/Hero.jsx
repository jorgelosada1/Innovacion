import './Hero.css';
import heroImage from '../assets/images/hero-student.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        {/* Left Content */}
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            ALIADO COMERCIAL UNIVERSITARIO
          </div>

          <h1 className="hero__title">
            Encuentra la universidad y el programa{' '}
            <span className="hero__title-highlight">ideal para tu futuro</span>
          </h1>

          <p className="hero__description">
            Somos aliados comerciales autorizados de la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana. Te asesoramos de manera personalizada y te acompañamos durante todo el proceso de inscripción y matrícula para que estudiar sea una decisión más fácil.
          </p>

          <div className="hero__buttons">
            <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="hero__btn hero__btn--areandina">
              <span className="hero__btn-dot hero__btn-dot--yellow"></span>
              Solicitar Asesoría
            </a>
            <a href="https://test-vocacional-eight.vercel.app/" target="_blank" rel="noopener noreferrer" className="hero__btn hero__btn--ibero">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
              Test Vocacional
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="hero__image-wrapper">
          <div className="hero__image-container">
            <img
              src={heroImage}
              alt="Estudiante universitaria aprendiendo en línea"
              className="hero__image"
            />
          </div>
          {/* Floating Card */}
          <div className="hero__floating-card">
            <span className="hero__floating-card-title">+1,000</span>
            <span className="hero__floating-card-text">Estudiantes Asesorados</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

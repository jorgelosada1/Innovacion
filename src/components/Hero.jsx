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
            Tu puerta de entrada a la{' '}
            <span className="hero__title-highlight">educación universitaria</span>{' '}
            de calidad
          </h1>

          <p className="hero__description">
            Somos aliados comerciales directos de la{' '}
            <strong>Fundación Universitaria del Área Andina</strong> y la{' '}
            <strong>Corporación Universitaria Iberoamericana</strong>. Te asesoramos y
            acompañamos en todo el proceso de inscripción y matrícula.
          </p>

          <div className="hero__buttons">
            <a href="#colaboradores" className="hero__btn hero__btn--areandina">
              <span className="hero__btn-dot hero__btn-dot--yellow"></span>
              Areandina
            </a>
            <a href="#colaboradores" className="hero__btn hero__btn--ibero">
              <span className="hero__btn-dot hero__btn-dot--yellow"></span>
              Iberoamericana
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
            <span className="hero__floating-card-title">Aliados</span>
            <span className="hero__floating-card-text">Areandina &amp; Iberoamericana</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

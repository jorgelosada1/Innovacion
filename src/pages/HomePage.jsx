import IntroSplash from '../components/IntroSplash';
import NewsSlider from '../components/NewsSlider';
import HeroBanner from '../components/HeroBanner';
import Hero from '../components/Hero';
import Ventajas from '../components/Ventajas';
import ProgramFinder from '../components/ProgramFinder';
import MisionVision from '../components/MisionVision';
import Testimonios from '../components/Testimonios';
import FaqSection from '../components/FaqSection';

const HomePage = () => {
  return (
    <>
      <IntroSplash />
      <NewsSlider />
      <HeroBanner />
      <Hero />
      <Ventajas />
      <ProgramFinder />
      <MisionVision />
      <Testimonios />
      <FaqSection />
    </>
  );
};

export default HomePage;

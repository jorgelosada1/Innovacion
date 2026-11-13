import IntroSplash from '../components/IntroSplash';
import NewsSlider from '../components/NewsSlider';
import HeroBanner from '../components/HeroBanner';
import Hero from '../components/Hero';
import VideoInstitucional from '../components/VideoInstitucional';
import Ventajas from '../components/Ventajas';
import MisionVision from '../components/MisionVision';
import Testimonios from '../components/Testimonios';
import FaqSection from '../components/FaqSection';
import Seo from '../components/Seo';

const HomePage = () => {
  return (
    <>
      <Seo path="/" />
      <IntroSplash />
      <NewsSlider />
      <HeroBanner />
      <Hero />
      <VideoInstitucional />
      <Ventajas />
      <MisionVision />
      <Testimonios />
      <FaqSection />
    </>
  );
};

export default HomePage;

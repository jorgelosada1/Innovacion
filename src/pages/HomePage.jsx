import { useState } from 'react';
import IntroSplash from '../components/IntroSplash';
import NewsSlider from '../components/NewsSlider';
import AmigoSecretoBanner from '../components/AmigoSecretoBanner';
import AmigoSecretoModal from '../components/AmigoSecretoModal';
import HeroBanner from '../components/HeroBanner';
import Hero from '../components/Hero';
import Ventajas from '../components/Ventajas';
import MisionVision from '../components/MisionVision';
import Testimonios from '../components/Testimonios';
import FaqSection from '../components/FaqSection';

const HomePage = () => {
  const [showAmigoModal, setShowAmigoModal] = useState(false);

  return (
    <>
      <IntroSplash />
      <NewsSlider />
      <div style={{ maxWidth: '1100px', margin: '40px auto 0 auto', padding: '0 20px' }}>
        <AmigoSecretoBanner onOpenSorteo={() => setShowAmigoModal(true)} />
      </div>
      <HeroBanner />
      <Hero />
      <Ventajas />
      <MisionVision />
      <Testimonios />
      <FaqSection />

      <AmigoSecretoModal
        isOpen={showAmigoModal}
        onClose={() => setShowAmigoModal(false)}
      />
    </>
  );
};

export default HomePage;

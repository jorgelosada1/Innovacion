import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Hero from './components/Hero';
import Footer from './components/Footer';
import FloatingSocial from './components/FloatingSocial';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroBanner />
        <Hero />
      </main>
      <Footer />
      <FloatingSocial />
    </div>
  );
}

export default App;

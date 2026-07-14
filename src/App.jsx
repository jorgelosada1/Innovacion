import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingSocial from './components/FloatingSocial';
import HomePage from './pages/HomePage';
import ColaboradoresPage from './pages/ColaboradoresPage';
import CursosPage from './pages/CursosPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/colaboradores" element={<ColaboradoresPage />} />
            <Route path="/cursos" element={<CursosPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingSocial />
      </div>
    </Router>
  );
}

export default App;

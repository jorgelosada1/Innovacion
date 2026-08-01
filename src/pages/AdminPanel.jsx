import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isAuthenticated, logout, 
  getNoticias, addNoticia, updateNoticia, deleteNoticia,
  getSlider, addSlide, deleteSlide,
  getCursos, addCurso, deleteCurso 
} from '../utils/dataManager';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Noticias');

  // Data States
  const [noticias, setNoticias] = useState([]);
  const [slider, setSlider] = useState([]);
  const [cursos, setCursos] = useState([]);

  // Form States
  const [noticiaForm, setNoticiaForm] = useState({ id: null, titulo: '', resumen: '', contenido: '', imagen: '' });
  const [sliderForm, setSliderForm] = useState({ imagen: '', noticiaId: '' });
  const [cursoForm, setCursoForm] = useState({ titulo: '', descripcion: '', videoId: '', duracion: '', nivel: 'Básico', temas: '', evaluacion: false });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      loadData();
    }
  }, [navigate]);

  const loadData = () => {
    setNoticias(getNoticias());
    setSlider(getSlider());
    setCursos(getCursos());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // NOTICIAS HANDLERS
  const handleNoticiaSubmit = (e) => {
    e.preventDefault();
    if (noticiaForm.id) {
      updateNoticia(noticiaForm.id, noticiaForm);
    } else {
      addNoticia(noticiaForm);
    }
    setNoticiaForm({ id: null, titulo: '', resumen: '', contenido: '', imagen: '' });
    loadData();
  };

  const handleEditNoticia = (noticia) => {
    setNoticiaForm(noticia);
  };

  const handleDeleteNoticia = (id) => {
    deleteNoticia(id);
    loadData();
  };

  // SLIDER HANDLERS
  const handleSliderSubmit = (e) => {
    e.preventDefault();
    addSlide(sliderForm);
    setSliderForm({ imagen: '', noticiaId: '' });
    loadData();
  };

  const handleDeleteSlide = (id) => {
    deleteSlide(id);
    loadData();
  };

  // CURSOS HANDLERS
  const handleCursoSubmit = (e) => {
    e.preventDefault();
    const cursoData = {
      ...cursoForm,
      temas: cursoForm.temas.split(',').map(t => t.trim()).filter(t => t)
    };
    addCurso(cursoData);
    setCursoForm({ titulo: '', descripcion: '', videoId: '', duracion: '', nivel: 'Básico', temas: '', evaluacion: false });
    loadData();
  };

  const handleDeleteCurso = (id) => {
    deleteCurso(id);
    loadData();
  };

  // SVG Icons
  const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    </svg>
  );

  const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <div className="admin-tabs">
        {['Noticias', 'Slider', 'Cursos'].map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'Noticias' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>{noticiaForm.id ? 'Editar Noticia' : 'Añadir Noticia'}</h2>
              <form onSubmit={handleNoticiaSubmit}>
                <input type="text" placeholder="Título" value={noticiaForm.titulo} onChange={e => setNoticiaForm({...noticiaForm, titulo: e.target.value})} required />
                <textarea placeholder="Resumen" value={noticiaForm.resumen} onChange={e => setNoticiaForm({...noticiaForm, resumen: e.target.value})} required rows="2" />
                <textarea placeholder="Contenido" value={noticiaForm.contenido} onChange={e => setNoticiaForm({...noticiaForm, contenido: e.target.value})} required rows="5" />
                <input type="url" placeholder="URL de la Imagen" value={noticiaForm.imagen} onChange={e => setNoticiaForm({...noticiaForm, imagen: e.target.value})} />
                <button type="submit" className="btn-submit"><PlusIcon /> {noticiaForm.id ? 'Actualizar' : 'Guardar'} Noticia</button>
                {noticiaForm.id && <button type="button" className="btn-cancel" onClick={() => setNoticiaForm({ id: null, titulo: '', resumen: '', contenido: '', imagen: '' })}>Cancelar</button>}
              </form>
            </div>
            
            <div className="list-container">
              {noticias.map(n => (
                <div key={n.id} className="list-item">
                  <div className="item-info">
                    <h3>{n.titulo}</h3>
                    <p>{n.resumen.substring(0, 50)}...</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => handleEditNoticia(n)} title="Editar"><EditIcon /></button>
                    <button className="btn-delete" onClick={() => handleDeleteNoticia(n.id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Slider' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>Añadir Slide</h2>
              <form onSubmit={handleSliderSubmit}>
                <input type="url" placeholder="URL de la Imagen" value={sliderForm.imagen} onChange={e => setSliderForm({...sliderForm, imagen: e.target.value})} required />
                <select value={sliderForm.noticiaId} onChange={e => setSliderForm({...sliderForm, noticiaId: e.target.value})}>
                  <option value="">Seleccionar Noticia Vinculada (opcional)</option>
                  {noticias.map(n => (
                    <option key={n.id} value={n.id}>{n.titulo}</option>
                  ))}
                </select>
                <button type="submit" className="btn-submit"><PlusIcon /> Añadir Slide</button>
              </form>
            </div>

            <div className="list-container slider-list">
              {slider.map(s => (
                <div key={s.id} className="list-item">
                  <img src={s.imagen} alt="Slide Preview" className="slide-preview" />
                  <div className="item-info">
                    <p>Vinculado a: {s.noticiaId ? (noticias.find(n => n.id === s.noticiaId)?.titulo || 'Noticia no encontrada') : 'Ninguna'}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-delete" onClick={() => handleDeleteSlide(s.id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Cursos' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>Añadir Curso</h2>
              <form onSubmit={handleCursoSubmit}>
                <input type="text" placeholder="Título" value={cursoForm.titulo} onChange={e => setCursoForm({...cursoForm, titulo: e.target.value})} required />
                <textarea placeholder="Descripción" value={cursoForm.descripcion} onChange={e => setCursoForm({...cursoForm, descripcion: e.target.value})} required rows="3" />
                <div className="form-row">
                  <input type="text" placeholder="ID de YouTube (Ej: jS3c8ZoxAgE)" value={cursoForm.videoId} onChange={e => setCursoForm({...cursoForm, videoId: e.target.value})} required />
                  <input type="text" placeholder="Duración (Ej: 4 semanas)" value={cursoForm.duracion} onChange={e => setCursoForm({...cursoForm, duracion: e.target.value})} required />
                </div>
                <div className="form-row">
                  <select value={cursoForm.nivel} onChange={e => setCursoForm({...cursoForm, nivel: e.target.value})} required>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={cursoForm.evaluacion} onChange={e => setCursoForm({...cursoForm, evaluacion: e.target.checked})} />
                    Incluye Evaluación
                  </label>
                </div>
                <input type="text" placeholder="Temas (separados por coma)" value={cursoForm.temas} onChange={e => setCursoForm({...cursoForm, temas: e.target.value})} required />
                <button type="submit" className="btn-submit"><PlusIcon /> Añadir Curso</button>
              </form>
            </div>

            <div className="list-container">
              {cursos.map(c => (
                <div key={c.id} className="list-item">
                  <div className="item-info">
                    <h3>{c.titulo}</h3>
                    <p>{c.nivel} - {c.duracion}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-delete" onClick={() => handleDeleteCurso(c.id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

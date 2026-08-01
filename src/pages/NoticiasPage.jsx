import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNoticias, getNoticiaById } from '../utils/dataManager';
import './NoticiasPage.css';

const NoticiasPage = () => {
  const { id } = useParams();

  if (id) {
    const noticia = getNoticiaById(id);
    if (!noticia) {
      return (
        <div className="noticias-page">
          <div className="noticias-hero">
            <span className="noticias-badge">Error</span>
            <h1>Noticia no encontrada</h1>
          </div>
          <div className="noticias-container detail-view">
            <Link to="/noticias" className="btn-back">
              <span>&larr;</span> Volver a noticias
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="noticias-page">
        <div className="noticias-hero detail-hero">
          <span className="noticias-badge">Noticia</span>
          <h1>{noticia.titulo}</h1>
          <p className="noticia-fecha">{noticia.fecha}</p>
        </div>
        
        <div className="noticias-container detail-view">
          <div className="noticia-content">
            <p>{noticia.contenido}</p>
          </div>
          
          <Link to="/noticias" className="btn-back">
            <span>&larr;</span> Volver a noticias
          </Link>
        </div>
      </div>
    );
  }

  const noticias = getNoticias();

  return (
    <div className="noticias-page">
      <div className="noticias-hero">
        <span className="noticias-badge">Últimas Novedades</span>
        <h1>Nuestras <span className="accent">Noticias</span></h1>
      </div>
      
      <div className="noticias-container list-view">
        <div className="noticias-grid">
          {noticias.map((noticia) => (
            <div key={noticia.id} className="noticia-card">
              <div className="noticia-card-body">
                <span className="noticia-card-fecha">{noticia.fecha}</span>
                <h3 className="noticia-card-titulo">{noticia.titulo}</h3>
                <p className="noticia-card-resumen">{noticia.resumen}</p>
                <Link to={`/noticias/${noticia.id}`} className="noticia-card-link">
                  Leer más <span className="arrow">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticiasPage;

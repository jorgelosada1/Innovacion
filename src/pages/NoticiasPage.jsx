import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNoticias, getNoticiaById } from '../utils/dataManager';
import './NoticiasPage.css';

const NoticiasPage = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (id) {
        const data = await getNoticiaById(id);
        setNoticia(data);
      } else {
        const data = await getNoticias();
        setNoticias(data);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <div className="noticias-page">Cargando...</div>;
  }

  if (id) {
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
            <div dangerouslySetInnerHTML={{ __html: noticia.contenido }} />
          </div>
          
          <Link to="/noticias" className="btn-back">
            <span>&larr;</span> Volver a noticias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="noticias-page">
      <div className="noticias-hero">
        <span className="noticias-badge">Últimas Novedades</span>
        <h1>Nuestras <span className="accent">Noticias</span></h1>
      </div>
      
      <div className="noticias-container list-view">
        <div className="noticias-grid">
          {noticias.map((noticiaItem) => (
            <div key={noticiaItem._id || noticiaItem.id} className="noticia-card">
              <div className="noticia-card-body">
                <span className="noticia-card-fecha">{noticiaItem.fecha}</span>
                <h3 className="noticia-card-titulo">{noticiaItem.titulo}</h3>
                <p className="noticia-card-resumen">{noticiaItem.resumen}</p>
                <Link to={`/noticias/${noticiaItem._id || noticiaItem.id}`} className="noticia-card-link">
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

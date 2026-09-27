import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isAuthenticated, logout, 
  getNoticias, addNoticia, updateNoticia, deleteNoticia,
  getSlider, addSlide, updateSlide, deleteSlide,
  getCursos, addCurso, deleteCurso,
  getFaqs, addFaq, updateFaq, deleteFaq,
  getComments, addComment, updateComment, deleteComment,
  getSetting, updateSetting, changePassword,
  uploadImage
} from '../utils/dataManager';
import './AdminPanel.css';

// ── Simple Rich Text Editor Component ──
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = () => {
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  };

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar">
        <button type="button" onClick={() => exec('bold')} title="Negrita"><b>B</b></button>
        <button type="button" onClick={() => exec('italic')} title="Cursiva"><i>I</i></button>
        <button type="button" onClick={() => exec('underline')} title="Subrayado"><u>U</u></button>
        <span className="rich-editor__sep">|</span>
        <button type="button" onClick={() => exec('formatBlock', 'h2')} title="Título">H2</button>
        <button type="button" onClick={() => exec('formatBlock', 'h3')} title="Subtítulo">H3</button>
        <button type="button" onClick={() => exec('formatBlock', 'p')} title="Párrafo">P</button>
        <span className="rich-editor__sep">|</span>
        <button type="button" onClick={() => exec('insertUnorderedList')} title="Lista">• Lista</button>
        <button type="button" onClick={() => exec('insertOrderedList')} title="Lista numerada">1. Lista</button>
        <span className="rich-editor__sep">|</span>
        <button type="button" onClick={() => {
          const url = prompt('URL del enlace:');
          if (url) exec('createLink', url);
        }} title="Enlace">🔗</button>
        <button type="button" onClick={() => exec('removeFormat')} title="Limpiar formato">✕</button>
      </div>
      <div
        ref={editorRef}
        className="rich-editor__content"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder || 'Escribe aquí...'}
        suppressContentEditableWarning
      />
    </div>
  );
};

// ── Image Upload Component ──
const ImageUpload = ({ value, onChange, label }) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      alert('Error subiendo imagen: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="image-upload">
      <label className="image-upload__label">{label || 'Imagen'}</label>
      <div className="image-upload__row">
        <input
          type="text"
          placeholder="URL de la imagen"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="image-upload__url"
        />
        <button type="button" className="image-upload__btn" onClick={() => fileRef.current.click()} disabled={uploading}>
          {uploading ? '⏳' : '📁 Subir'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {value && <img src={value} alt="Preview" className="image-upload__preview" />}
    </div>
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Noticias');
  const [loading, setLoading] = useState(true);

  // Data States
  const [noticias, setNoticias] = useState([]);
  const [slider, setSlider] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [comments, setComments] = useState([]);

  // Form States
  const [noticiaForm, setNoticiaForm] = useState({ _id: null, titulo: '', resumen: '', contenido: '', imagen: '' });
  const [sliderForm, setSliderForm] = useState({ imagen: '', noticiaId: '', link: '', title: '' });
  const [cursoForm, setCursoForm] = useState({ titulo: '', descripcion: '', videoId: '', duracion: '', nivel: 'Básico', temas: '', evaluacion: false });
  const [faqForm, setFaqForm] = useState({ _id: null, question: '', answer: '' });
  const [commentForm, setCommentForm] = useState({ _id: null, text: '', name: '', role: '', photoUrl: '', type: 'colaborador', university: '', rating: 5 });

  // Settings States
  const [pin, setPin] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [settingsMsg, setSettingsMsg] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      loadData();
    }
  }, [navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [n, s, c, f, cm, p] = await Promise.all([
        getNoticias(), getSlider(), getCursos(), getFaqs(), getComments(), getSetting('pin')
      ]);
      setNoticias(n);
      setSlider(s);
      setCursos(c);
      setFaqs(f);
      setComments(cm);
      setPin(p || '0228');
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ── NOTICIAS HANDLERS ──
  const handleNoticiaSubmit = async (e) => {
    e.preventDefault();
    if (noticiaForm._id) {
      await updateNoticia(noticiaForm._id, noticiaForm);
    } else {
      await addNoticia(noticiaForm);
    }
    setNoticiaForm({ _id: null, titulo: '', resumen: '', contenido: '', imagen: '' });
    await loadData();
  };

  const handleEditNoticia = (noticia) => {
    setNoticiaForm({ ...noticia });
  };

  const handleDeleteNoticia = async (id) => {
    if (!confirm('¿Eliminar esta noticia?')) return;
    await deleteNoticia(id);
    await loadData();
  };

  // ── SLIDER HANDLERS ──
  const handleSliderSubmit = async (e) => {
    e.preventDefault();
    await addSlide(sliderForm);
    setSliderForm({ imagen: '', noticiaId: '', link: '', title: '' });
    await loadData();
  };

  const handleDeleteSlide = async (id) => {
    if (!confirm('¿Eliminar este slide?')) return;
    await deleteSlide(id);
    await loadData();
  };

  // ── CURSOS HANDLERS ──
  const handleCursoSubmit = async (e) => {
    e.preventDefault();
    const cursoData = {
      ...cursoForm,
      temas: typeof cursoForm.temas === 'string'
        ? cursoForm.temas.split(',').map(t => t.trim()).filter(t => t)
        : cursoForm.temas
    };
    await addCurso(cursoData);
    setCursoForm({ titulo: '', descripcion: '', videoId: '', duracion: '', nivel: 'Básico', temas: '', evaluacion: false });
    await loadData();
  };

  const handleDeleteCurso = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return;
    await deleteCurso(id);
    await loadData();
  };

  // ── FAQ HANDLERS ──
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    if (faqForm._id) {
      await updateFaq(faqForm._id, faqForm);
    } else {
      await addFaq(faqForm);
    }
    setFaqForm({ _id: null, question: '', answer: '' });
    await loadData();
  };

  const handleEditFaq = (faq) => {
    setFaqForm({ ...faq });
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    await deleteFaq(id);
    await loadData();
  };

  // ── COMMENTS HANDLERS ──
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentForm._id) {
      await updateComment(commentForm._id, commentForm);
    } else {
      await addComment(commentForm);
    }
    setCommentForm({ _id: null, text: '', name: '', role: '', photoUrl: '', type: 'colaborador', university: '', rating: 5 });
    await loadData();
  };

  const handleEditComment = (c) => {
    setCommentForm({ ...c });
  };

  const handleDeleteComment = async (id) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    await deleteComment(id);
    await loadData();
  };

  // ── SETTINGS HANDLERS ──
  const handlePinSave = async () => {
    await updateSetting('pin', pin);
    setSettingsMsg('✅ PIN actualizado');
    setTimeout(() => setSettingsMsg(''), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      setSettingsMsg('❌ Las contraseñas no coinciden');
      return;
    }
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      setSettingsMsg('✅ Contraseña actualizada');
    } catch (err) {
      setSettingsMsg('❌ ' + err.message);
    }
    setTimeout(() => setSettingsMsg(''), 4000);
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

  if (loading) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '1.2rem' }}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  const tabs = ['Noticias', 'Slider', 'Cursos', 'Preguntas', 'Comentarios', 'Configuración'];

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <div className="admin-tabs">
        {tabs.map(tab => (
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
        {/* ════════ NOTICIAS ════════ */}
        {activeTab === 'Noticias' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>{noticiaForm._id ? 'Editar Noticia' : 'Añadir Noticia'}</h2>
              <form onSubmit={handleNoticiaSubmit}>
                <input type="text" placeholder="Título" value={noticiaForm.titulo} onChange={e => setNoticiaForm({...noticiaForm, titulo: e.target.value})} required />
                <textarea placeholder="Resumen" value={noticiaForm.resumen} onChange={e => setNoticiaForm({...noticiaForm, resumen: e.target.value})} required rows="2" />
                <label className="form-label">Contenido del Artículo</label>
                <RichTextEditor
                  value={noticiaForm.contenido}
                  onChange={(html) => setNoticiaForm({...noticiaForm, contenido: html})}
                  placeholder="Escribe el contenido de la noticia..."
                />
                <ImageUpload
                  value={noticiaForm.imagen}
                  onChange={(url) => setNoticiaForm({...noticiaForm, imagen: url})}
                  label="Imagen de la Noticia"
                />
                <button type="submit" className="btn-submit"><PlusIcon /> {noticiaForm._id ? 'Actualizar' : 'Guardar'} Noticia</button>
                {noticiaForm._id && <button type="button" className="btn-cancel" onClick={() => setNoticiaForm({ _id: null, titulo: '', resumen: '', contenido: '', imagen: '' })}>Cancelar</button>}
              </form>
            </div>
            
            <div className="list-container">
              {noticias.map(n => (
                <div key={n._id} className="list-item">
                  <div className="item-info">
                    <h3>{n.titulo}</h3>
                    <p>{n.resumen?.substring(0, 50)}...</p>
                    <small>{n.fecha}</small>
                  </div>
                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => handleEditNoticia(n)} title="Editar"><EditIcon /></button>
                    <button className="btn-delete" onClick={() => handleDeleteNoticia(n._id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ SLIDER ════════ */}
        {activeTab === 'Slider' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>Añadir Slide</h2>
              <form onSubmit={handleSliderSubmit}>
                <ImageUpload
                  value={sliderForm.imagen}
                  onChange={(url) => setSliderForm({...sliderForm, imagen: url})}
                  label="Imagen del Slide"
                />
                <input type="text" placeholder="Título del Slide (opcional)" value={sliderForm.title} onChange={e => setSliderForm({...sliderForm, title: e.target.value})} />
                <input type="text" placeholder="Link interno (ej: /universidades/areandina)" value={sliderForm.link} onChange={e => setSliderForm({...sliderForm, link: e.target.value})} />
                <select value={sliderForm.noticiaId} onChange={e => setSliderForm({...sliderForm, noticiaId: e.target.value})}>
                  <option value="">Vincular a Noticia (opcional)</option>
                  {noticias.map(n => (
                    <option key={n._id} value={n._id}>{n.titulo}</option>
                  ))}
                </select>
                <button type="submit" className="btn-submit"><PlusIcon /> Añadir Slide</button>
              </form>
            </div>

            <div className="list-container slider-list">
              {slider.map(s => (
                <div key={s._id} className="list-item">
                  {s.imagen && <img src={s.imagen} alt="Slide" className="slide-preview" />}
                  <div className="item-info">
                    <h3>{s.title || 'Sin título'}</h3>
                    <p>{s.link ? `Link: ${s.link}` : s.noticiaId ? `Noticia vinculada` : 'Sin vínculo'}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-delete" onClick={() => handleDeleteSlide(s._id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ CURSOS ════════ */}
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
                </div>
                <input type="text" placeholder="Temas (separados por coma)" value={cursoForm.temas} onChange={e => setCursoForm({...cursoForm, temas: e.target.value})} required />
                <button type="submit" className="btn-submit"><PlusIcon /> Añadir Curso</button>
              </form>
            </div>

            <div className="list-container">
              {cursos.map(c => (
                <div key={c._id} className="list-item">
                  <div className="item-info">
                    <h3>{c.titulo}</h3>
                    <p>{c.nivel} - {c.duracion}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-delete" onClick={() => handleDeleteCurso(c._id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ PREGUNTAS FAQ ════════ */}
        {activeTab === 'Preguntas' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>{faqForm._id ? 'Editar Pregunta' : 'Añadir Pregunta Frecuente'}</h2>
              <form onSubmit={handleFaqSubmit}>
                <input type="text" placeholder="Pregunta" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} required />
                <textarea placeholder="Respuesta" value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} required rows="4" />
                <button type="submit" className="btn-submit"><PlusIcon /> {faqForm._id ? 'Actualizar' : 'Guardar'} Pregunta</button>
                {faqForm._id && <button type="button" className="btn-cancel" onClick={() => setFaqForm({ _id: null, question: '', answer: '' })}>Cancelar</button>}
              </form>
            </div>

            <div className="list-container">
              {faqs.map(f => (
                <div key={f._id} className="list-item">
                  <div className="item-info">
                    <h3>{f.question}</h3>
                    <p>{f.answer?.substring(0, 60)}...</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => handleEditFaq(f)} title="Editar"><EditIcon /></button>
                    <button className="btn-delete" onClick={() => handleDeleteFaq(f._id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ COMENTARIOS / TESTIMONIOS ════════ */}
        {activeTab === 'Comentarios' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>{commentForm._id ? 'Editar Comentario' : 'Añadir Comentario / Testimonio'}</h2>
              <form onSubmit={handleCommentSubmit}>
                <div className="form-row">
                  <select value={commentForm.type} onChange={e => setCommentForm({...commentForm, type: e.target.value})} required>
                    <option value="colaborador">Comentario de Colaborador</option>
                    <option value="testimonio">Testimonio de Estudiante</option>
                  </select>
                </div>
                <div className="form-row">
                  <input type="text" placeholder="Nombre" value={commentForm.name} onChange={e => setCommentForm({...commentForm, name: e.target.value})} required />
                  <input type="text" placeholder="Rol / Cargo" value={commentForm.role} onChange={e => setCommentForm({...commentForm, role: e.target.value})} required />
                </div>
                <textarea placeholder="Texto del comentario" value={commentForm.text} onChange={e => setCommentForm({...commentForm, text: e.target.value})} required rows="3" />
                <ImageUpload
                  value={commentForm.photoUrl}
                  onChange={(url) => setCommentForm({...commentForm, photoUrl: url})}
                  label="Foto (opcional)"
                />
                {commentForm.type === 'testimonio' && (
                  <>
                    <div className="form-row">
                      <input type="text" placeholder="Universidad" value={commentForm.university} onChange={e => setCommentForm({...commentForm, university: e.target.value})} />
                      <select value={commentForm.rating} onChange={e => setCommentForm({...commentForm, rating: Number(e.target.value)})}>
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{'⭐'.repeat(r)} ({r})</option>)}
                      </select>
                    </div>
                  </>
                )}
                <button type="submit" className="btn-submit"><PlusIcon /> {commentForm._id ? 'Actualizar' : 'Guardar'}</button>
                {commentForm._id && <button type="button" className="btn-cancel" onClick={() => setCommentForm({ _id: null, text: '', name: '', role: '', photoUrl: '', type: 'colaborador', university: '', rating: 5 })}>Cancelar</button>}
              </form>
            </div>

            <div className="list-container">
              <h3 style={{ padding: '12px 0', color: '#2E86C1' }}>Colaboradores</h3>
              {comments.filter(c => c.type === 'colaborador').map(c => (
                <div key={c._id} className="list-item">
                  {c.photoUrl && <img src={c.photoUrl} alt={c.name} className="slide-preview" style={{ borderRadius: '50%', width: 40, height: 40, objectFit: 'cover' }} />}
                  <div className="item-info">
                    <h3>{c.name} — <small>{c.role}</small></h3>
                    <p>{c.text?.substring(0, 60)}...</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => handleEditComment(c)} title="Editar"><EditIcon /></button>
                    <button className="btn-delete" onClick={() => handleDeleteComment(c._id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}

              <h3 style={{ padding: '12px 0', color: '#F39C12', marginTop: 16 }}>Testimonios de Estudiantes</h3>
              {comments.filter(c => c.type === 'testimonio').map(c => (
                <div key={c._id} className="list-item">
                  {c.photoUrl && <img src={c.photoUrl} alt={c.name} className="slide-preview" style={{ borderRadius: '50%', width: 40, height: 40, objectFit: 'cover' }} />}
                  <div className="item-info">
                    <h3>{c.name} — <small>{c.university}</small></h3>
                    <p>{c.text?.substring(0, 60)}...</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => handleEditComment(c)} title="Editar"><EditIcon /></button>
                    <button className="btn-delete" onClick={() => handleDeleteComment(c._id)} title="Eliminar"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ CONFIGURACIÓN ════════ */}
        {activeTab === 'Configuración' && (
          <div className="tab-section">
            <div className="form-card">
              <h2>PIN de Acceso (PasswordModal)</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 12 }}>Este PIN protege el acceso a Brújula Vocacional, documentos y cursos.</p>
              <div className="form-row">
                <input type="text" placeholder="PIN actual" value={pin} onChange={e => setPin(e.target.value)} />
                <button type="button" className="btn-submit" onClick={handlePinSave} style={{ width: 'auto' }}>Guardar PIN</button>
              </div>
            </div>

            <div className="form-card" style={{ marginTop: 24 }}>
              <h2>Cambiar Contraseña</h2>
              <form onSubmit={handlePasswordChange}>
                <input type="password" placeholder="Contraseña actual" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required />
                <input type="password" placeholder="Nueva contraseña" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required />
                <input type="password" placeholder="Confirmar nueva contraseña" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} required />
                <button type="submit" className="btn-submit">Cambiar Contraseña</button>
              </form>
            </div>

            {settingsMsg && <p style={{ textAlign: 'center', marginTop: 16, fontWeight: 600 }}>{settingsMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

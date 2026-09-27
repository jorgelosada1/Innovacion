// ===== DATA MANAGER (API Backend) =====
// Handles all CRUD operations via REST API calls to Express/MongoDB backend

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ===== HTTP HELPERS =====
const getToken = () => localStorage.getItem('innovacion_token');

const headers = (withAuth = false) => {
  const h = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

const api = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error del servidor' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

// ===== AUTH =====
export const login = async (user, pass) => {
  try {
    const data = await api('/auth/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ username: user, password: pass }),
    });
    localStorage.setItem('innovacion_token', data.token);
    return true;
  } catch {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('innovacion_token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  return api('/auth/password', {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

// ===== NOTICIAS =====
export const getNoticias = async () => {
  try {
    return await api('/noticias');
  } catch {
    return [];
  }
};

export const getNoticiaById = async (id) => {
  try {
    return await api(`/noticias/${id}`);
  } catch {
    return null;
  }
};

export const addNoticia = async (noticia) => {
  return api('/noticias', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(noticia),
  });
};

export const updateNoticia = async (id, updates) => {
  return api(`/noticias/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(updates),
  });
};

export const deleteNoticia = async (id) => {
  return api(`/noticias/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
};

// ===== SLIDER =====
export const getSlider = async () => {
  try {
    return await api('/slider');
  } catch {
    return [];
  }
};

export const addSlide = async (slide) => {
  return api('/slider', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(slide),
  });
};

export const updateSlide = async (id, updates) => {
  return api(`/slider/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(updates),
  });
};

export const deleteSlide = async (id) => {
  return api(`/slider/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
};

// ===== CURSOS =====
export const getCursos = async () => {
  try {
    return await api('/cursos');
  } catch {
    return [];
  }
};

export const addCurso = async (curso) => {
  return api('/cursos', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(curso),
  });
};

export const updateCurso = async (id, updates) => {
  return api(`/cursos/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(updates),
  });
};

export const deleteCurso = async (id) => {
  return api(`/cursos/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
};

// ===== FAQ =====
export const getFaqs = async () => {
  try {
    return await api('/faqs');
  } catch {
    return [];
  }
};

export const addFaq = async (faq) => {
  return api('/faqs', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(faq),
  });
};

export const updateFaq = async (id, updates) => {
  return api(`/faqs/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(updates),
  });
};

export const deleteFaq = async (id) => {
  return api(`/faqs/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
};

// ===== COMMENTS (Colaboradores + Testimonios) =====
export const getComments = async (type) => {
  try {
    const query = type ? `?type=${type}` : '';
    return await api(`/comments${query}`);
  } catch {
    return [];
  }
};

export const addComment = async (comment) => {
  return api('/comments', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(comment),
  });
};

export const updateComment = async (id, updates) => {
  return api(`/comments/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(updates),
  });
};

export const deleteComment = async (id) => {
  return api(`/comments/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
};

// ===== SETTINGS =====
export const getSetting = async (key) => {
  try {
    const data = await api(`/settings/${key}`);
    return data.value;
  } catch {
    return null;
  }
};

export const updateSetting = async (key, value) => {
  return api(`/settings/${key}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ value }),
  });
};

// ===== FILE UPLOAD (Base64 for Vercel + MongoDB persistence) =====
export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      return reject(new Error('La imagen debe ser menor a 5MB'));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

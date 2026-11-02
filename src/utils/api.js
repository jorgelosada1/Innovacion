// ===== CLIENTE DE LA API (backend PHP + MariaDB) =====
// En producción la API vive en el mismo dominio: /api
// En desarrollo, Vite redirige /api al servidor PHP local (ver vite.config.js).
// VITE_API_URL permite apuntar a otra dirección si fuera necesario.

const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

/** Error devuelto por la API (validación, permisos, etc.). */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/** La API no está disponible (sin servidor PHP, p. ej. en Vercel o sin conexión). */
export class ApiUnavailableError extends Error {}

export const api = async (path, { method = 'GET', body, form } = {}) => {
  const headers = { 'X-Requested-With': 'inne-web' };
  let realMethod = method;

  // Algunos hostings compartidos filtran PUT/PATCH/DELETE: se envían como POST
  if (['PUT', 'PATCH', 'DELETE'].includes(method)) {
    headers['X-HTTP-Method-Override'] = method;
    realMethod = 'POST';
  }

  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method: realMethod, headers, body: payload, credentials: 'include' });
  } catch {
    throw new ApiUnavailableError('No hay conexión con el servidor');
  }

  const type = res.headers.get('content-type') || '';
  if (!type.includes('application/json')) {
    throw new ApiUnavailableError('El servidor de datos no está disponible');
  }

  const data = await res.json();
  if (!res.ok) throw new ApiError(data.error || 'Ocurrió un error', res.status, data);
  return data;
};

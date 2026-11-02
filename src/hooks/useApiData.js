import { useEffect, useRef, useState } from 'react';

// Caché en memoria: al volver a una página se muestra al instante lo último
// que se cargó, y en segundo plano se actualiza desde la API.
const cache = new Map();

export const clearApiCache = () => cache.clear();

/**
 * Carga datos con una función asíncrona identificada por `key`.
 * Devuelve { data, loading }.
 */
export const useApiData = (key, loader) => {
  const loaderRef = useRef(loader);
  const [state, setState] = useState(() =>
    cache.has(key) ? { data: cache.get(key), loading: false } : { data: null, loading: true }
  );

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let alive = true;
    loaderRef.current().then((data) => {
      cache.set(key, data);
      if (alive) setState({ data, loading: false });
    });
    return () => {
      alive = false;
    };
  }, [key]);

  return state;
};

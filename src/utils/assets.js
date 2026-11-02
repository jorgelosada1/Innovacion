// Imágenes incluidas en la web que la base de datos referencia como "asset:<nombre>".
// Las imágenes subidas desde el panel llegan como /uploads/... y se usan tal cual.
import aniversario from '../assets/images/aniversario-8.jpg';
import encuentro from '../assets/images/encuentro-2026.jpg';
import historia from '../assets/images/2.png';
import andina from '../assets/images/andina-virtual.jpg';
import ibero from '../assets/images/ibero.png';

const ASSETS = {
  'aniversario-8': aniversario,
  'encuentro-2026': encuentro,
  historia,
  andina,
  ibero,
};

/** Convierte la ruta guardada en la base de datos en una URL que el navegador pueda cargar. */
export const resolveImage = (value) => {
  if (!value) return '';
  if (value.startsWith('asset:')) return ASSETS[value.slice(6)] || '';
  return value;
};

/** Opciones de imágenes incluidas, para elegirlas desde el panel. */
export const BUILT_IN_IMAGES = Object.entries(ASSETS).map(([key, src]) => ({ value: `asset:${key}`, src }));

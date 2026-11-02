// Prepara la carpeta dist/ para el hosting (LiteSpeed + PHP + MariaDB):
//   dist/            → web React (ya generada por "vite build")
//   dist/.htaccess   → rutas de la SPA y cabeceras
//   dist/api/        → API PHP (sin config.php: se crea en el servidor)
//   dist/uploads/    → imágenes subidas desde el panel
import { cpSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const backend = join(root, 'backend');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Primero ejecute "vite build" (o use "npm run build:hosting").');
  process.exit(1);
}

const PRIVATE = new Set(['config.php', 'install.lock']);
cpSync(join(backend, 'api'), join(dist, 'api'), {
  recursive: true,
  filter: (src) => !PRIVATE.has(basename(src)),
});

mkdirSync(join(dist, 'uploads'), { recursive: true });
copyFileSync(join(backend, 'uploads', '.htaccess'), join(dist, 'uploads', '.htaccess'));
copyFileSync(join(backend, 'hosting.htaccess'), join(dist, '.htaccess'));

console.log('\n✔ Carpeta dist/ lista para el hosting:');
console.log('  - Web React, .htaccess, api/ y uploads/');
console.log('  - En el servidor: crear api/config.php a partir de api/config.example.php');
console.log('  - Luego abrir https://SU-DOMINIO/api/install.php una sola vez\n');

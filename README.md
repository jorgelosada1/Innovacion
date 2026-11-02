# Innovación E-learning · Sitio web

Sitio web de **Innovación E-learning S.A.S**, aliado comercial universitario de la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana.

## Tecnologías

- **Frontend:** React 19, Vite 8, React Router y Three.js (animaciones 3D).
- **Backend:** API en PHP 8.2+ con base de datos MariaDB 10.5+ / MySQL (carpeta `backend/`).
- **Hosting:** servidor LiteSpeed/Apache con soporte de `.htaccess`.

## Secciones

| Ruta | Contenido |
|---|---|
| `/` | Inicio: banners, beneficios, misión y visión, testimonios y preguntas frecuentes |
| `/noticias` | Noticias, blog y agenda del Encuentro Nacional |
| `/colaboradores` | Organigrama, voces del equipo, buzón de ideas y documentos internos |
| `/cursos` | Aprende Aquí · Campus Innovación: libro digital y cursos |
| `/universidades/areandina` · `/universidades/iberoamericana` | Páginas de las universidades aliadas |
| `/login` · `/admin` | Panel administrativo |

## Panel administrativo

Desde **Ingresar** se administra el contenido guardado en la base de datos:

- Noticias (publicadas o borradores, con imagen).
- Banners del inicio (subir, ordenar y ocultar).
- Cursos, preguntas frecuentes y buzón de ideas (estados, notas y exportación a CSV).
- Cambio de contraseña.

## Desarrollo

Requiere Node.js 22 y, para el backend, PHP 8.2+ y MariaDB.

```bash
npm ci
npm run dev        # web en http://localhost:5173
npm run dev:api    # API en http://localhost:8000 (ver backend/README.md)
```

Sin el backend, la web pública muestra el contenido por defecto (`src/utils/dataManager.js`).

## Publicación

```bash
npm run build           # solo la web (vista previa en Vercel)
npm run build:hosting   # web + API + .htaccess + uploads, lista para el hosting
```

Los pasos para publicar en el hosting y configurar la base de datos están en [`backend/README.md`](backend/README.md).

## Estructura

```
src/
  components/   secciones y componentes (3D en components/three)
  pages/        páginas del sitio y panel administrativo
  data/         contenido fijo (blog y Encuentro Nacional 2026)
  utils/        cliente de la API, datos por defecto e imágenes
backend/
  api/          API PHP (rutas, base de datos, instalador)
  uploads/      reglas de la carpeta de imágenes subidas
scripts/        preparación de la carpeta para el hosting
```

# Backend · Innovación E-learning

API en **PHP 8.2+** con base de datos **MariaDB 10.5+ / MySQL**, pensada para el hosting Cloud con **LiteSpeed** (sin cPanel, sin VPS). La web React y la API se publican juntas en el mismo dominio:

```
https://dominio.com/          → web (React, archivos estáticos)
https://dominio.com/api/...   → API PHP
https://dominio.com/uploads/  → imágenes subidas desde el panel
```

## Qué guarda la base de datos

| Tabla            | Uso                                                        |
|------------------|------------------------------------------------------------|
| `admins`         | Usuarios del panel "Ingresar" (contraseñas con bcrypt)     |
| `login_intentos` | Bloqueo temporal tras 5 intentos fallidos en 15 minutos    |
| `noticias`       | Noticias (publicadas o borradores)                         |
| `slider`         | Banners del carrusel de inicio, con orden y visibilidad    |
| `cursos`         | Cursos de "Aprende Aquí"                                   |
| `faqs`           | Preguntas frecuentes                                       |
| `ideas`          | Buzón de ideas de los colaboradores (con estado y nota)    |

Esquema: `api/database/schema.sql` · Contenido inicial: `api/database/seed.sql`.

## Publicación en el hosting (paso a paso)

1. **Generar la carpeta para subir** (en un equipo con Node.js 22):
   ```bash
   npm ci
   npm run build:hosting
   ```
   Se crea `dist/` con la web, `.htaccess`, `api/` y `uploads/`.

2. **Crear la base de datos** en el panel del hosting (MariaDB): nombre, usuario y contraseña.

3. **Subir el contenido de `dist/`** por SFTP a la carpeta pública del sitio (incluidos los archivos ocultos `.htaccess`).

4. **Crear `api/config.php`** en el servidor a partir de `api/config.example.php` y completar:
   - datos de la base de datos (`db`),
   - `app_secret`: cadena aleatoria de al menos 32 caracteres,
   - `install_token`: otra cadena aleatoria (se usa una sola vez).

5. **Instalar**: abrir `https://dominio.com/api/install.php`, escribir el token y crear el usuario administrador. Crea las tablas, carga el contenido actual de la web y bloquea el instalador.

6. **Eliminar `api/install.php`** del servidor.

7. **Verificar**:
   - `https://dominio.com/api/health` → `{"ok":true,...}`
   - `https://dominio.com/login` → ingresar con el usuario creado.
   - Recargar `https://dominio.com/noticias` → debe cargar (no 404).

8. **Permisos**: la carpeta `uploads/` debe permitir escritura al usuario de PHP (normalmente 755).

9. **HTTPS**: cuando el certificado SSL esté activo, quitar el `#` de las 3 líneas "Forzar HTTPS" en `/.htaccess`.

### Actualizaciones posteriores

Ejecutar `npm run build:hosting` y subir de nuevo el contenido de `dist/`. **No** se sobrescriben `api/config.php` (no está en `dist/`) ni las imágenes de `uploads/`. No volver a subir `install.php`, o borrarlo después de cada carga.

## Seguridad incluida

- Consultas preparadas (PDO) en todas las operaciones.
- Contraseñas con `password_hash` (bcrypt) y bloqueo por fuerza bruta.
- Sesión con cookie `HttpOnly`, `SameSite=Strict` y `Secure` bajo HTTPS; expira tras 8 horas de inactividad.
- Las peticiones que modifican datos exigen la cabecera `X-Requested-With: inne-web` (protección CSRF).
- Validación de todos los campos en el servidor (longitudes, fechas, enlaces, ID de YouTube).
- Imágenes: tipo verificado por contenido (JPG, PNG, WEBP, GIF), máximo 5 MB, nombre aleatorio y sin ejecución de scripts en `uploads/`.
- `config.php`, el SQL y las carpetas internas (`lib/`, `routes/`, `database/`) bloqueados desde el navegador.
- Buzón de ideas: máximo 5 envíos por hora por visitante y campo trampa contra robots. La IP no se guarda (solo un hash).
- Los métodos PUT/PATCH/DELETE se envían como POST con `X-HTTP-Method-Override` por si el hosting los filtra.

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/health` | público |
| POST | `/api/auth/login` · `/api/auth/logout` | público |
| GET | `/api/auth/me` | público (devuelve `admin: null` sin sesión) |
| POST | `/api/auth/password` | administrador |
| GET | `/api/noticias` · `/api/noticias/{id}` | público (`?todas=1` incluye borradores para el admin) |
| POST · PUT · DELETE | `/api/noticias[/{id}]` | administrador |
| GET | `/api/slider` | público (`?todos=1` incluye ocultos para el admin) |
| POST · PUT · DELETE | `/api/slider[/{id}]` · PUT `/api/slider/orden` | administrador |
| GET | `/api/cursos` | público (`?todos=1` para el admin) |
| POST · PUT · DELETE | `/api/cursos[/{id}]` | administrador |
| GET | `/api/faqs` | público |
| POST · PUT · DELETE | `/api/faqs[/{id}]` | administrador |
| POST | `/api/ideas` | público |
| GET · PATCH · DELETE | `/api/ideas[/{id}]` | administrador |
| POST | `/api/uploads` (campo `archivo`) | administrador |

## Desarrollo local

```bash
# 1. MariaDB local con una base vacía y config.php apuntando a ella
cp backend/api/config.example.php backend/api/config.php

# 2. API en http://localhost:8000
npm run dev:api

# 3. Web en http://localhost:5173 (Vite redirige /api y /uploads a la API)
npm run dev
```

La primera vez, abrir `http://localhost:8000/api/install.php`.

## Sin backend (vista previa en Vercel)

Si la API no responde, la web pública muestra el contenido por defecto definido en `src/utils/dataManager.js` (el mismo de `seed.sql`), y el panel muestra un aviso de que necesita el servidor.

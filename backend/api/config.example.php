<?php
/**
 * Configuración de la API de Innovación E-learning.
 *
 * 1. Copie este archivo como "config.php" en la misma carpeta (api/).
 * 2. Complete los datos de la base de datos MariaDB del hosting.
 * 3. Cambie "app_secret" e "install_token" por cadenas largas y aleatorias.
 *
 * "config.php" NO se sube al repositorio (está en .gitignore) y el servidor
 * bloquea su acceso desde el navegador (ver api/.htaccess).
 *
 * Cualquier valor también puede definirse con variables de entorno
 * (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, APP_SECRET, INSTALL_TOKEN).
 */
return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'NOMBRE_DE_LA_BASE',
        'user' => 'USUARIO_DE_LA_BASE',
        'pass' => 'CONTRASEÑA_DE_LA_BASE',
    ],

    // Clave interna para firmar/anonimizar datos (mínimo 32 caracteres aleatorios)
    'app_secret' => 'CAMBIAR-POR-UNA-CADENA-LARGA-Y-ALEATORIA',

    // Token que pide el instalador (install.php) antes de crear las tablas y el administrador
    'install_token' => 'CAMBIAR-TOKEN-DE-INSTALACION',

    // Carpeta y URL pública donde se guardan las imágenes subidas desde el panel
    'uploads_dir' => __DIR__ . '/../uploads',
    'uploads_url' => '/uploads',
    'max_upload_mb' => 5,

    // Duración de la sesión del panel administrativo (horas)
    'session_hours' => 8,

    // Solo para desarrollo local con el frontend en otro puerto (p. ej. 'http://localhost:5173').
    // En producción déjelo vacío: la web y la API están en el mismo dominio.
    'allowed_origins' => [],

    // true muestra detalles de errores en las respuestas. Siempre false en producción.
    'debug' => false,
];

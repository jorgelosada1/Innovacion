<?php
/**
 * Enrutador para el servidor de desarrollo de PHP (no se usa en producción):
 *   php -S localhost:8000 backend/dev-router.php
 * Imita lo que hacen los .htaccess en el hosting.
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (preg_match('#^/api/install\.php$#', $path)) {
    require __DIR__ . '/api/install.php';
    return true;
}
if (preg_match('#^/api(/|$)#', $path)) {
    $_GET['route'] = preg_replace('#^/api/?#', '', $path);
    require __DIR__ . '/api/index.php';
    return true;
}
if (preg_match('#^/uploads/[A-Za-z0-9/_.-]+\.(jpg|png|webp|gif)$#', $path) && strpos($path, '..') === false) {
    $file = __DIR__ . '/uploads' . substr($path, strlen('/uploads'));
    if (is_file($file)) {
        header('Content-Type: ' . mime_content_type($file));
        readfile($file);
        return true;
    }
}
http_response_code(404);
echo 'No encontrado';
return true;

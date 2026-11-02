<?php
declare(strict_types=1);

/**
 * API de Innovación E-learning
 * Todas las peticiones a /api/* llegan aquí (ver api/.htaccess).
 *
 *   GET  /api/health
 *   POST /api/auth/login · GET /api/auth/me · POST /api/auth/logout · POST /api/auth/password
 *   /api/noticias  /api/slider  /api/cursos  /api/faqs   (GET público · POST/PUT/DELETE administrador)
 *   POST /api/ideas (público) · GET/PATCH/DELETE /api/ideas (administrador)
 *   POST /api/uploads (administrador)
 */

require __DIR__ . '/lib/bootstrap.php';

$router = new Router();

$router->add('GET', 'health', function () {
    db()->query('SELECT 1');
    json_response(['ok' => true, 'php' => PHP_VERSION]);
});

foreach (['auth', 'noticias', 'slider', 'cursos', 'faqs', 'ideas', 'uploads'] as $module) {
    (require __DIR__ . "/routes/$module.php")($router);
}

// Ruta solicitada: /api/<ruta> (por reescritura ?route= o por PATH_INFO)
$route = $_GET['route'] ?? ($_SERVER['PATH_INFO'] ?? '');
if ($route === '') {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $route = preg_replace('#^.*?/api/?#', '', $path);
}

$router->dispatch(request_method(), (string) $route);

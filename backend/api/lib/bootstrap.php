<?php
declare(strict_types=1);

/**
 * Arranque común de la API: configuración, manejo de errores y cabeceras.
 */

require __DIR__ . '/http.php';
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/validate.php';

date_default_timezone_set('America/Bogota');

/** Configuración (config.php + variables de entorno). */
function config(?string $key = null)
{
    static $config = null;
    if ($config === null) {
        $file = __DIR__ . '/../config.php';
        if (!is_file($file)) {
            json_error('La API no está configurada: falta api/config.php', 503);
        }
        $config = require $file;
        $env = [
            'DB_HOST' => ['db', 'host'], 'DB_PORT' => ['db', 'port'], 'DB_NAME' => ['db', 'name'],
            'DB_USER' => ['db', 'user'], 'DB_PASS' => ['db', 'pass'],
            'APP_SECRET' => ['app_secret'], 'INSTALL_TOKEN' => ['install_token'],
        ];
        foreach ($env as $var => $path) {
            $value = getenv($var);
            if ($value === false || $value === '') continue;
            if (count($path) === 2) $config[$path[0]][$path[1]] = $value;
            else $config[$path[0]] = $value;
        }
    }
    return $key === null ? $config : ($config[$key] ?? null);
}

/** Hash anónimo de la IP del visitante (no se guarda la IP real). */
function client_ip_hash(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return hash_hmac('sha256', $ip, (string) config('app_secret'));
}

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'
        || (int) ($_SERVER['SERVER_PORT'] ?? 0) === 443;
}

set_exception_handler(function (Throwable $e) {
    if ($e instanceof HttpError) {
        json_error($e->getMessage(), $e->status, $e->extra);
    }
    error_log('[API INNE] ' . $e->getMessage() . ' en ' . $e->getFile() . ':' . $e->getLine());
    $debug = false;
    try {
        $debug = (bool) config('debug');
    } catch (Throwable $ignored) {
    }
    json_error('Error interno del servidor', 500, $debug ? ['detalle' => $e->getMessage()] : []);
});

// Cabeceras de seguridad comunes a todas las respuestas de la API
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');

send_cors_headers();

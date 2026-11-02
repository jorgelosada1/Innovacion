<?php
declare(strict_types=1);

/** Sesión del panel administrativo con cookie segura (HttpOnly, SameSite=Strict). */
function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $hours = (int) (config('session_hours') ?: 8);
    session_name('inne_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.gc_maxlifetime', (string) ($hours * 3600));
    session_start();

    // Expira por inactividad
    $now = time();
    if (isset($_SESSION['ultimo_uso']) && $now - $_SESSION['ultimo_uso'] > $hours * 3600) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['ultimo_uso'] = $now;
}

function current_admin(): ?array
{
    start_session();
    if (empty($_SESSION['admin_id'])) return null;
    return [
        'id' => (int) $_SESSION['admin_id'],
        'usuario' => (string) $_SESSION['admin_usuario'],
        'nombre' => (string) $_SESSION['admin_nombre'],
    ];
}

/** Exige sesión de administrador. Devuelve el administrador actual. */
function require_admin(): array
{
    $admin = current_admin();
    if (!$admin) throw new HttpError('Debes iniciar sesión', 401);
    return $admin;
}

/** Protección contra fuerza bruta: máximo 5 intentos fallidos en 15 minutos. */
const LOGIN_MAX_INTENTOS = 5;
const LOGIN_VENTANA_MIN = 15;

function login_bloqueado(string $usuario): bool
{
    $row = db_one(
        'SELECT COUNT(*) AS total FROM login_intentos
         WHERE (ip_hash = ? OR usuario = ?) AND creado_en > (NOW() - INTERVAL ' . LOGIN_VENTANA_MIN . ' MINUTE)',
        [client_ip_hash(), $usuario]
    );
    return (int) ($row['total'] ?? 0) >= LOGIN_MAX_INTENTOS;
}

function registrar_intento_fallido(string $usuario): void
{
    db_exec('INSERT INTO login_intentos (ip_hash, usuario) VALUES (?, ?)', [client_ip_hash(), $usuario]);
    // Limpieza de registros antiguos
    db_exec('DELETE FROM login_intentos WHERE creado_en < (NOW() - INTERVAL 1 DAY)');
}

function limpiar_intentos(string $usuario): void
{
    db_exec('DELETE FROM login_intentos WHERE ip_hash = ? OR usuario = ?', [client_ip_hash(), $usuario]);
}

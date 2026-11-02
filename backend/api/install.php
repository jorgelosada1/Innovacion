<?php
declare(strict_types=1);

/**
 * Instalador de un solo uso.
 * Crea las tablas, carga el contenido inicial y el primer administrador.
 * Pide el "install_token" definido en config.php. Al terminar crea "install.lock"
 * y ya no vuelve a ejecutarse. Después de usarlo, elimine este archivo del servidor.
 */

$lock = __DIR__ . '/install.lock';
$configFile = __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function page(string $title, string $body): void
{
    echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>' . htmlspecialchars($title) . '</title><style>'
        . 'body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0d1f33;font-family:system-ui,sans-serif;color:#1f2937}'
        . '.card{width:min(460px,92vw);background:#fff;border-radius:20px;padding:32px;box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}'
        . 'h1{margin:0 0 6px;font-size:1.4rem;color:#1b3a5c}p{color:#475569;line-height:1.5}label{display:block;margin:14px 0 6px;font-weight:600;font-size:.9rem}'
        . 'input{width:100%;box-sizing:border-box;padding:11px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:1rem}'
        . 'button{margin-top:20px;width:100%;padding:13px;border:0;border-radius:999px;background:#f5a623;color:#1b3a5c;font-weight:700;font-size:1rem;cursor:pointer}'
        . '.err{background:#fef2f2;color:#b91c1c;padding:10px 12px;border-radius:10px}.ok{background:#ecfdf5;color:#047857;padding:10px 12px;border-radius:10px}'
        . 'code{background:#f1f5f9;padding:2px 6px;border-radius:6px}</style></head><body><div class="card">'
        . $body . '</div></body></html>';
    exit;
}

if (is_file($lock)) {
    http_response_code(403);
    page('Instalación', '<h1>Instalación ya realizada</h1><p>Por seguridad, elimine <code>api/install.php</code> del servidor.</p>');
}
if (!is_file($configFile)) {
    http_response_code(503);
    page('Instalación', '<h1>Falta la configuración</h1><p>Copie <code>config.example.php</code> como <code>config.php</code> y complete los datos de la base de datos.</p>');
}

$config = require $configFile;
$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $token = (string) ($_POST['token'] ?? '');
    $usuario = trim((string) ($_POST['usuario'] ?? ''));
    $nombre = trim((string) ($_POST['nombre'] ?? ''));
    $pass = (string) ($_POST['password'] ?? '');
    $pass2 = (string) ($_POST['password2'] ?? '');
    $expected = (string) ($config['install_token'] ?? '');

    if ($expected === '' || str_starts_with($expected, 'CAMBIAR') || !hash_equals($expected, $token)) {
        $error = 'El token de instalación no es correcto (y no puede ser el valor de ejemplo).';
    } elseif (!preg_match('/^[A-Za-z0-9._-]{3,60}$/', $usuario)) {
        $error = 'El usuario debe tener entre 3 y 60 caracteres (letras, números, punto, guion).';
    } elseif (mb_strlen($pass) < 10) {
        $error = 'La contraseña debe tener al menos 10 caracteres.';
    } elseif ($pass !== $pass2) {
        $error = 'Las contraseñas no coinciden.';
    } else {
        try {
            $c = $config['db'];
            $pdo = new PDO(
                sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $c['host'], (int) $c['port'], $c['name']),
                $c['user'],
                $c['pass'],
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            $run = function (string $file) use ($pdo) {
                $sql = (string) file_get_contents(__DIR__ . "/database/$file");
                $sql = preg_replace('/^\s*--.*$/m', '', $sql);
                foreach (preg_split('/;\s*(\n|$)/', $sql) as $statement) {
                    if (trim($statement) !== '') $pdo->exec($statement);
                }
            };
            $run('schema.sql');
            // El contenido inicial solo se carga si la base está vacía
            if ((int) $pdo->query('SELECT COUNT(*) FROM noticias')->fetchColumn() === 0) {
                $run('seed.sql');
            }
            $stmt = $pdo->prepare('INSERT INTO admins (usuario, nombre, password_hash) VALUES (?, ?, ?)');
            $stmt->execute([$usuario, $nombre ?: $usuario, password_hash($pass, PASSWORD_DEFAULT)]);

            file_put_contents($lock, date('c'));
            page('Instalación completa', '<h1>¡Listo!</h1><p class="ok">Base de datos creada y administrador <strong>'
                . htmlspecialchars($usuario) . '</strong> registrado.</p>'
                . '<p>Ahora <strong>elimine <code>api/install.php</code></strong> del servidor e ingrese al panel desde <code>/login</code>.</p>');
        } catch (Throwable $e) {
            error_log('[INSTALL INNE] ' . $e->getMessage());
            $error = 'No se pudo completar la instalación: ' . $e->getMessage();
        }
    }
}

page('Instalación · Innovación E-learning',
    '<h1>Instalación de la base de datos</h1><p>Crea las tablas, el contenido inicial y el primer usuario administrador.</p>'
    . ($error ? '<p class="err">' . htmlspecialchars($error) . '</p>' : '')
    . '<form method="post" autocomplete="off">'
    . '<label>Token de instalación (de config.php)</label><input name="token" type="password" required>'
    . '<label>Usuario administrador</label><input name="usuario" required pattern="[A-Za-z0-9._-]{3,60}" value="' . htmlspecialchars($_POST['usuario'] ?? '') . '">'
    . '<label>Nombre</label><input name="nombre" value="' . htmlspecialchars($_POST['nombre'] ?? '') . '">'
    . '<label>Contraseña (mínimo 10 caracteres)</label><input name="password" type="password" minlength="10" required>'
    . '<label>Repetir contraseña</label><input name="password2" type="password" minlength="10" required>'
    . '<button type="submit">Instalar</button></form>');

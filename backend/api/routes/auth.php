<?php
declare(strict_types=1);

/** Autenticación del panel administrativo ("Ingresar"). */
return function (Router $r) {
    $r->add('POST', 'auth/login', function () {
        require_ajax_header();
        $data = read_json_body();
        $usuario = v_text($data, 'usuario', 60, true, 'usuario');
        $password = (string) ($data['password'] ?? '');
        if ($password === '' || strlen($password) > 200) throw new HttpError('Usuario o contraseña incorrectos', 401);

        if (login_bloqueado($usuario)) {
            throw new HttpError('Demasiados intentos. Espera ' . LOGIN_VENTANA_MIN . ' minutos e inténtalo de nuevo.', 429);
        }

        $admin = db_one('SELECT * FROM admins WHERE usuario = ?', [$usuario]);
        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            registrar_intento_fallido($usuario);
            throw new HttpError('Usuario o contraseña incorrectos', 401);
        }

        limpiar_intentos($usuario);
        if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
            db_exec('UPDATE admins SET password_hash = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $admin['id']]);
        }
        db_exec('UPDATE admins SET ultimo_acceso = NOW() WHERE id = ?', [$admin['id']]);

        start_session();
        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int) $admin['id'];
        $_SESSION['admin_usuario'] = $admin['usuario'];
        $_SESSION['admin_nombre'] = $admin['nombre'];

        json_response(['usuario' => $admin['usuario'], 'nombre' => $admin['nombre']]);
    });

    // Sesión actual: { admin: {usuario, nombre} } o { admin: null }
    $r->add('GET', 'auth/me', function () {
        $admin = current_admin();
        json_response(['admin' => $admin ? ['usuario' => $admin['usuario'], 'nombre' => $admin['nombre']] : null]);
    });

    $r->add('POST', 'auth/logout', function () {
        require_ajax_header();
        start_session();
        $_SESSION = [];
        $params = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 3600,
            'path' => $params['path'],
            'secure' => $params['secure'],
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        session_destroy();
        json_response(['ok' => true]);
    });

    $r->add('POST', 'auth/password', function () {
        require_ajax_header();
        $admin = require_admin();
        $data = read_json_body();
        $actual = (string) ($data['actual'] ?? '');
        $nueva = (string) ($data['nueva'] ?? '');

        $row = db_one('SELECT password_hash FROM admins WHERE id = ?', [$admin['id']]);
        if (!$row || !password_verify($actual, $row['password_hash'])) {
            throw new HttpError('La contraseña actual no es correcta', 422);
        }
        if (mb_strlen($nueva) < 10) throw new HttpError('La nueva contraseña debe tener al menos 10 caracteres', 422);
        if (strlen($nueva) > 200) throw new HttpError('La nueva contraseña es demasiado larga', 422);

        db_exec('UPDATE admins SET password_hash = ? WHERE id = ?', [password_hash($nueva, PASSWORD_DEFAULT), $admin['id']]);
        session_regenerate_id(true);
        json_response(['ok' => true]);
    });
};

<?php
declare(strict_types=1);

const TIPOS_IDEA = ['procesos', 'bienestar', 'estudiantes', 'tecnologia', 'ahorro', 'otro'];
const ESTADOS_IDEA = ['nueva', 'en_revision', 'aprobada', 'implementada', 'descartada'];
const IDEAS_POR_HORA = 5;

function idea_json(array $i): array
{
    return [
        'id' => (string) $i['id'],
        'nombre' => $i['nombre'],
        'area' => $i['area'],
        'tipo' => $i['tipo'],
        'titulo' => $i['titulo'],
        'idea' => $i['idea'],
        'beneficio' => $i['beneficio'],
        'estado' => $i['estado'],
        'nota' => $i['nota'],
        'fecha' => $i['creado_en'],
    ];
}

return function (Router $r) {
    // Pública: cualquier colaborador puede enviar una idea
    $r->add('POST', 'ideas', function () {
        require_ajax_header();
        $data = read_json_body();

        // Campo trampa: los humanos no lo ven, los robots lo llenan
        if (!empty($data['website'])) json_response(['ok' => true], 201);

        $ip = client_ip_hash();
        $recientes = db_one(
            'SELECT COUNT(*) AS total FROM ideas WHERE ip_hash = ? AND creado_en > (NOW() - INTERVAL 1 HOUR)',
            [$ip]
        );
        if ((int) $recientes['total'] >= IDEAS_POR_HORA) {
            throw new HttpError('Has enviado varias ideas seguidas. Inténtalo de nuevo en un rato.', 429);
        }

        $id = db_insert(
            'INSERT INTO ideas (nombre, area, tipo, titulo, idea, beneficio, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                v_text($data, 'nombre', 60, false, 'nombre'),
                v_text($data, 'area', 60, false, 'área'),
                v_in($data, 'tipo', TIPOS_IDEA, 'otro'),
                v_text($data, 'titulo', 90, true, 'nombre de la idea'),
                v_text($data, 'idea', 600, true, 'idea'),
                v_text($data, 'beneficio', 160, false, 'beneficio'),
                $ip,
            ]
        );
        json_response(['ok' => true, 'id' => (string) $id], 201);
    });

    // Panel: listado con filtro opcional ?estado=
    $r->add('GET', 'ideas', function () {
        require_admin();
        $estado = $_GET['estado'] ?? '';
        if ($estado !== '' && in_array($estado, ESTADOS_IDEA, true)) {
            $rows = db_all('SELECT * FROM ideas WHERE estado = ? ORDER BY creado_en DESC', [$estado]);
        } else {
            $rows = db_all('SELECT * FROM ideas ORDER BY creado_en DESC');
        }
        json_response(array_map('idea_json', $rows));
    });

    $r->add('PATCH', 'ideas/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        $actual = find_or_404('ideas', $id, 'Idea');
        $data = read_json_body();
        $estado = v_in($data, 'estado', ESTADOS_IDEA, $actual['estado']);
        $nota = array_key_exists('nota', $data) ? v_text($data, 'nota', 500, false, 'nota') : $actual['nota'];
        db_exec('UPDATE ideas SET estado = ?, nota = ? WHERE id = ?', [$estado, $nota, $id]);
        json_response(idea_json(find_or_404('ideas', $id, 'Idea')));
    });

    $r->add('DELETE', 'ideas/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('ideas', $id, 'Idea');
        db_exec('DELETE FROM ideas WHERE id = ?', [$id]);
        json_response(['ok' => true]);
    });
};

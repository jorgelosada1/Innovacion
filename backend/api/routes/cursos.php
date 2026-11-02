<?php
declare(strict_types=1);

const NIVELES_CURSO = ['Básico', 'Intermedio', 'Avanzado'];

function curso_json(array $c): array
{
    $temas = json_decode($c['temas'] ?: '[]', true);
    return [
        'id' => (string) $c['id'],
        'titulo' => $c['titulo'],
        'descripcion' => $c['descripcion'],
        'videoId' => $c['video_id'],
        'duracion' => $c['duracion'],
        'nivel' => $c['nivel'],
        'temas' => is_array($temas) ? $temas : [],
        'evaluacion' => (bool) $c['evaluacion'],
        'orden' => (int) $c['orden'],
        'activo' => (bool) $c['activo'],
    ];
}

function curso_input(array $data): array
{
    $videoId = v_text($data, 'videoId', 20, true, 'ID de YouTube');
    if (!preg_match('/^[A-Za-z0-9_-]{6,20}$/', $videoId)) throw new HttpError('El ID de YouTube no es válido', 422);

    $temas = $data['temas'] ?? [];
    if (is_string($temas)) $temas = explode(',', $temas);
    if (!is_array($temas)) throw new HttpError('Los temas no son válidos', 422);
    $temas = array_values(array_filter(array_map(fn ($t) => mb_substr(trim((string) $t), 0, 120), $temas), 'strlen'));
    if (count($temas) > 30) throw new HttpError('Máximo 30 temas por curso', 422);

    return [
        v_text($data, 'titulo', 200, true, 'título'),
        v_text($data, 'descripcion', 2000, true, 'descripción'),
        $videoId,
        v_text($data, 'duracion', 60, false, 'duración'),
        v_in($data, 'nivel', NIVELES_CURSO, 'Básico'),
        json_encode($temas, JSON_UNESCAPED_UNICODE),
        v_bool($data, 'evaluacion'),
        v_int($data, 'orden'),
        v_bool($data, 'activo', true),
    ];
}

return function (Router $r) {
    $r->add('GET', 'cursos', function () {
        $todos = !empty($_GET['todos']) && current_admin();
        $rows = db_all('SELECT * FROM cursos' . ($todos ? '' : ' WHERE activo = 1') . ' ORDER BY orden ASC, id ASC');
        json_response(array_map('curso_json', $rows));
    });

    $r->add('POST', 'cursos', function () {
        require_ajax_header();
        require_admin();
        $id = db_insert(
            'INSERT INTO cursos (titulo, descripcion, video_id, duracion, nivel, temas, evaluacion, orden, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            curso_input(read_json_body())
        );
        json_response(curso_json(find_or_404('cursos', $id, 'Curso')), 201);
    });

    $r->add('PUT', 'cursos/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('cursos', $id, 'Curso');
        $values = curso_input(read_json_body());
        $values[] = $id;
        db_exec('UPDATE cursos SET titulo = ?, descripcion = ?, video_id = ?, duracion = ?, nivel = ?, temas = ?, evaluacion = ?, orden = ?, activo = ? WHERE id = ?', $values);
        json_response(curso_json(find_or_404('cursos', $id, 'Curso')));
    });

    $r->add('DELETE', 'cursos/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('cursos', $id, 'Curso');
        db_exec('DELETE FROM cursos WHERE id = ?', [$id]);
        json_response(['ok' => true]);
    });
};

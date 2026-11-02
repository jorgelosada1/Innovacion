<?php
declare(strict_types=1);

function slide_json(array $s): array
{
    return [
        'id' => (string) $s['id'],
        'imagen' => $s['imagen'],
        'title' => $s['titulo'],
        'link' => $s['enlace'],
        'noticiaId' => $s['noticia_id'] === null ? null : (string) $s['noticia_id'],
        'orden' => (int) $s['orden'],
        'activo' => (bool) $s['activo'],
    ];
}

function slide_input(array $data): array
{
    $noticiaId = null;
    if (!empty($data['noticiaId'])) {
        $noticiaId = v_int($data, 'noticiaId');
        find_or_404('noticias', $noticiaId, 'Noticia vinculada');
    }
    return [
        v_image($data, 'imagen', true),
        v_text($data, 'title', 200, false, 'título'),
        v_link($data, 'link'),
        $noticiaId,
        v_bool($data, 'activo', true),
    ];
}

return function (Router $r) {
    $r->add('GET', 'slider', function () {
        $todos = !empty($_GET['todos']) && current_admin();
        $rows = db_all('SELECT * FROM slider' . ($todos ? '' : ' WHERE activo = 1') . ' ORDER BY orden ASC, id ASC');
        json_response(array_map('slide_json', $rows));
    });

    $r->add('POST', 'slider', function () {
        require_ajax_header();
        require_admin();
        $values = slide_input(read_json_body());
        $max = db_one('SELECT COALESCE(MAX(orden), 0) AS m FROM slider');
        $values[] = (int) $max['m'] + 1;
        $id = db_insert('INSERT INTO slider (imagen, titulo, enlace, noticia_id, activo, orden) VALUES (?, ?, ?, ?, ?, ?)', $values);
        json_response(slide_json(find_or_404('slider', $id, 'Banner')), 201);
    });

    $r->add('PUT', 'slider/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('slider', $id, 'Banner');
        $values = slide_input(read_json_body());
        $values[] = $id;
        db_exec('UPDATE slider SET imagen = ?, titulo = ?, enlace = ?, noticia_id = ?, activo = ? WHERE id = ?', $values);
        json_response(slide_json(find_or_404('slider', $id, 'Banner')));
    });

    // Nuevo orden: { "ids": ["3", "1", "2"] }
    $r->add('PUT', 'slider/orden', function () {
        require_ajax_header();
        require_admin();
        $ids = read_json_body()['ids'] ?? null;
        if (!is_array($ids)) throw new HttpError('Lista de banners no válida', 422);
        $pdo = db();
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('UPDATE slider SET orden = ? WHERE id = ?');
        foreach (array_values($ids) as $i => $id) {
            $stmt->execute([$i + 1, (int) $id]);
        }
        $pdo->commit();
        json_response(['ok' => true]);
    });

    $r->add('DELETE', 'slider/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('slider', $id, 'Banner');
        db_exec('DELETE FROM slider WHERE id = ?', [$id]);
        json_response(['ok' => true]);
    });
};

<?php
declare(strict_types=1);

function noticia_json(array $n): array
{
    return [
        'id' => (string) $n['id'],
        'titulo' => $n['titulo'],
        'resumen' => $n['resumen'],
        'contenido' => $n['contenido'],
        'imagen' => $n['imagen'],
        'fecha' => $n['fecha'],
        'publicado' => (bool) $n['publicado'],
    ];
}

function noticia_input(array $data): array
{
    return [
        v_text($data, 'titulo', 200, true, 'título'),
        v_text($data, 'resumen', 500, true, 'resumen'),
        v_text($data, 'contenido', 20000, true, 'contenido'),
        v_image($data, 'imagen'),
        v_date($data, 'fecha'),
        v_bool($data, 'publicado', true),
    ];
}

return function (Router $r) {
    // Públicas: solo las noticias publicadas. El panel pide ?todas=1 para ver también los borradores.
    $r->add('GET', 'noticias', function () {
        $todas = !empty($_GET['todas']) && current_admin();
        $rows = db_all('SELECT * FROM noticias' . ($todas ? '' : ' WHERE publicado = 1') . ' ORDER BY fecha DESC, id DESC');
        json_response(array_map('noticia_json', $rows));
    });

    $r->add('GET', 'noticias/{id}', function (int $id) {
        $n = find_or_404('noticias', $id, 'Noticia');
        if (!$n['publicado'] && !current_admin()) throw new HttpError('Noticia no encontrada', 404);
        json_response(noticia_json($n));
    });

    $r->add('POST', 'noticias', function () {
        require_ajax_header();
        require_admin();
        $id = db_insert(
            'INSERT INTO noticias (titulo, resumen, contenido, imagen, fecha, publicado) VALUES (?, ?, ?, ?, ?, ?)',
            noticia_input(read_json_body())
        );
        json_response(noticia_json(find_or_404('noticias', $id, 'Noticia')), 201);
    });

    $r->add('PUT', 'noticias/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('noticias', $id, 'Noticia');
        $values = noticia_input(read_json_body());
        $values[] = $id;
        db_exec('UPDATE noticias SET titulo = ?, resumen = ?, contenido = ?, imagen = ?, fecha = ?, publicado = ? WHERE id = ?', $values);
        json_response(noticia_json(find_or_404('noticias', $id, 'Noticia')));
    });

    $r->add('DELETE', 'noticias/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('noticias', $id, 'Noticia');
        db_exec('DELETE FROM noticias WHERE id = ?', [$id]);
        json_response(['ok' => true]);
    });
};

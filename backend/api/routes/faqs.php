<?php
declare(strict_types=1);

function faq_json(array $f): array
{
    return [
        'id' => (string) $f['id'],
        'question' => $f['pregunta'],
        'answer' => $f['respuesta'],
        'orden' => (int) $f['orden'],
    ];
}

function faq_input(array $data): array
{
    return [
        v_text($data, 'question', 300, true, 'pregunta'),
        v_text($data, 'answer', 3000, true, 'respuesta'),
        v_int($data, 'orden'),
    ];
}

return function (Router $r) {
    $r->add('GET', 'faqs', function () {
        json_response(array_map('faq_json', db_all('SELECT * FROM faqs ORDER BY orden ASC, id ASC')));
    });

    $r->add('POST', 'faqs', function () {
        require_ajax_header();
        require_admin();
        $values = faq_input(read_json_body());
        if ($values[2] === 0) {
            $max = db_one('SELECT COALESCE(MAX(orden), 0) AS m FROM faqs');
            $values[2] = (int) $max['m'] + 1;
        }
        $id = db_insert('INSERT INTO faqs (pregunta, respuesta, orden) VALUES (?, ?, ?)', $values);
        json_response(faq_json(find_or_404('faqs', $id, 'Pregunta')), 201);
    });

    $r->add('PUT', 'faqs/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        $actual = find_or_404('faqs', $id, 'Pregunta');
        $values = faq_input(read_json_body());
        if ($values[2] === 0) $values[2] = (int) $actual['orden'];
        $values[] = $id;
        db_exec('UPDATE faqs SET pregunta = ?, respuesta = ?, orden = ? WHERE id = ?', $values);
        json_response(faq_json(find_or_404('faqs', $id, 'Pregunta')));
    });

    $r->add('DELETE', 'faqs/{id}', function (int $id) {
        require_ajax_header();
        require_admin();
        find_or_404('faqs', $id, 'Pregunta');
        db_exec('DELETE FROM faqs WHERE id = ?', [$id]);
        json_response(['ok' => true]);
    });
};

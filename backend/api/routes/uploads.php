<?php
declare(strict_types=1);

/** Subida de imágenes desde el panel (noticias y banners). */
return function (Router $r) {
    $r->add('POST', 'uploads', function () {
        require_ajax_header();
        require_admin();

        $file = $_FILES['archivo'] ?? null;
        if (!$file || !is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            throw new HttpError('No se recibió ninguna imagen', 422);
        }
        $maxMb = (int) (config('max_upload_mb') ?: 5);
        if (in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $file['size'] > $maxMb * 1024 * 1024) {
            throw new HttpError("La imagen supera el máximo de $maxMb MB", 413);
        }
        if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
            throw new HttpError('No se pudo recibir la imagen', 400);
        }

        // El tipo se detecta por el contenido real del archivo, no por su nombre
        $tipos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if (!isset($tipos[$mime]) || @getimagesize($file['tmp_name']) === false) {
            throw new HttpError('Formato no permitido. Usa JPG, PNG, WEBP o GIF', 415);
        }

        $subdir = date('Y/m');
        $dir = rtrim((string) config('uploads_dir'), '/') . '/' . $subdir;
        if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
            throw new HttpError('No se pudo crear la carpeta de imágenes', 500);
        }
        $name = bin2hex(random_bytes(12)) . '.' . $tipos[$mime];
        if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) {
            throw new HttpError('No se pudo guardar la imagen', 500);
        }
        @chmod("$dir/$name", 0644);

        $url = rtrim((string) config('uploads_url'), '/') . "/$subdir/$name";
        json_response(['url' => $url], 201);
    });
};

<?php
declare(strict_types=1);

/** Texto obligatorio u opcional, recortado y con longitud máxima. */
function v_text(array $data, string $key, int $max, bool $required = true, string $label = ''): string
{
    $label = $label ?: $key;
    $value = $data[$key] ?? '';
    if (!is_string($value) && !is_numeric($value)) {
        throw new HttpError("El campo \"$label\" no es válido", 422);
    }
    $value = trim((string) $value);
    if ($required && $value === '') {
        throw new HttpError("El campo \"$label\" es obligatorio", 422);
    }
    if (mb_strlen($value) > $max) {
        throw new HttpError("El campo \"$label\" supera los $max caracteres", 422);
    }
    return $value;
}

function v_bool(array $data, string $key, bool $default = false): int
{
    if (!array_key_exists($key, $data)) return $default ? 1 : 0;
    return filter_var($data[$key], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
}

function v_int(array $data, string $key, int $default = 0): int
{
    if (!isset($data[$key]) || $data[$key] === '') return $default;
    $value = filter_var($data[$key], FILTER_VALIDATE_INT);
    if ($value === false) throw new HttpError("El campo \"$key\" debe ser un número", 422);
    return (int) $value;
}

/** Fecha AAAA-MM-DD (por defecto, hoy). */
function v_date(array $data, string $key): string
{
    $value = trim((string) ($data[$key] ?? ''));
    if ($value === '') return date('Y-m-d');
    $d = DateTime::createFromFormat('Y-m-d', $value);
    if (!$d || $d->format('Y-m-d') !== $value) throw new HttpError('La fecha no es válida (AAAA-MM-DD)', 422);
    return $value;
}

/**
 * Ruta de imagen permitida: subida al servidor (/uploads/...), imagen incluida
 * en la web (asset:nombre) o una URL https.
 */
function v_image(array $data, string $key, bool $required = false): string
{
    $value = v_text($data, $key, 500, $required, 'imagen');
    if ($value === '') return '';
    if (preg_match('#^asset:[a-z0-9-]+$#', $value)) return $value;
    if (preg_match('#^/uploads/[A-Za-z0-9/_.-]+$#', $value) && strpos($value, '..') === false) return $value;
    if (preg_match('#^https://[^\s"<>]+$#i', $value)) return $value;
    throw new HttpError('La imagen debe subirse desde el panel o ser una URL https', 422);
}

/** Enlace interno (/ruta) o externo (https://...). */
function v_link(array $data, string $key): string
{
    $value = v_text($data, $key, 500, false, 'enlace');
    if ($value === '') return '';
    if (preg_match('#^/[A-Za-z0-9/_.\-?=&%]*$#', $value) || preg_match('#^https://[^\s"<>]+$#i', $value)) return $value;
    throw new HttpError('El enlace debe empezar por / o por https://', 422);
}

function v_in(array $data, string $key, array $options, string $default): string
{
    $value = (string) ($data[$key] ?? $default);
    if (!in_array($value, $options, true)) throw new HttpError("El valor de \"$key\" no es válido", 422);
    return $value;
}

/** Busca un registro por id o responde 404. */
function find_or_404(string $table, int $id, string $label): array
{
    $row = db_one("SELECT * FROM `$table` WHERE id = ?", [$id]);
    if (!$row) throw new HttpError("$label no encontrado", 404);
    return $row;
}

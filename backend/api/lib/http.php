<?php
declare(strict_types=1);

/** Error HTTP que se convierte en una respuesta JSON. */
class HttpError extends Exception
{
    public int $status;
    public array $extra;

    public function __construct(string $message, int $status = 400, array $extra = [])
    {
        parent::__construct($message);
        $this->status = $status;
        $this->extra = $extra;
    }
}

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status = 400, array $extra = []): void
{
    json_response(array_merge(['error' => $message], $extra), $status);
}

/**
 * Método HTTP real. Algunos hostings compartidos filtran PUT/PATCH/DELETE,
 * por eso el frontend envía POST con la cabecera X-HTTP-Method-Override.
 */
function request_method(): string
{
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($method === 'POST') {
        $override = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? '');
        if (in_array($override, ['PUT', 'PATCH', 'DELETE'], true)) {
            return $override;
        }
    }
    return $method;
}

/** Cuerpo JSON de la petición (máximo 1 MB). */
function read_json_body(): array
{
    $raw = file_get_contents('php://input', false, null, 0, 1024 * 1024 + 1);
    if ($raw === false || $raw === '') return [];
    if (strlen($raw) > 1024 * 1024) throw new HttpError('El contenido enviado es demasiado grande', 413);
    $data = json_decode($raw, true);
    if (!is_array($data)) throw new HttpError('El contenido enviado no es JSON válido', 400);
    return $data;
}

/** CORS solo para orígenes explícitamente permitidos (desarrollo local). */
function send_cors_headers(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') return;
    $allowed = [];
    try {
        $allowed = (array) (config('allowed_origins') ?? []);
    } catch (Throwable $ignored) {
    }
    if (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-HTTP-Method-Override');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Vary: Origin');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Las peticiones que modifican datos deben traer la cabecera X-Requested-With.
 * Un sitio externo no puede enviarla sin pasar por CORS, lo que evita ataques CSRF
 * (junto con la cookie de sesión SameSite=Strict).
 */
function require_ajax_header(): void
{
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'inne-web') {
        throw new HttpError('Petición no permitida', 403);
    }
}

/** Enrutador mínimo: registra rutas y despacha según método y ruta. */
class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $regex = '#^' . preg_replace('#\{(\w+)\}#', '(?P<$1>[0-9]+)', trim($pattern, '/')) . '$#';
        $this->routes[] = [$method, $regex, $handler];
    }

    public function dispatch(string $method, string $path): void
    {
        $path = trim($path, '/');
        $allowed = [];
        foreach ($this->routes as [$m, $regex, $handler]) {
            if (!preg_match($regex, $path, $match)) continue;
            if ($m !== $method) {
                $allowed[] = $m;
                continue;
            }
            $params = array_filter($match, 'is_string', ARRAY_FILTER_USE_KEY);
            $handler(...array_map('intval', array_values($params)));
            return;
        }
        if ($allowed) throw new HttpError('Método no permitido', 405);
        throw new HttpError('Ruta no encontrada', 404);
    }
}

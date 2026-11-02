<?php
declare(strict_types=1);

/**
 * Entrega index.html con las etiquetas SEO de cada página ya incluidas
 * (título, descripción, URL canónica, Open Graph y datos estructurados), para que
 * Google, WhatsApp, Facebook y LinkedIn las lean sin ejecutar JavaScript.
 *
 * El .htaccess de la raíz envía aquí todas las rutas de la web.
 * Los textos de cada página están en api/seo.json (copia de src/seo/seo.json).
 * Si algo falla, se entrega index.html tal cual: la web nunca deja de cargar.
 */

$root = dirname(__DIR__);
$html = @file_get_contents($root . '/index.html');

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');

if ($html === false) {
    http_response_code(500);
    echo 'El sitio no está disponible en este momento.';
    exit;
}

try {
    $seo = json_decode((string) @file_get_contents(__DIR__ . '/seo.json'), true);
    if (!is_array($seo) || empty($seo['pages'])) {
        echo $html;
        exit;
    }

    $site = rtrim((string) $seo['siteUrl'], '/');
    $abs = fn (string $url): string => preg_match('#^https?://#', $url) ? $url : $site . $url;
    $esc = fn ($s): string => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');

    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = '/' . trim($path, '/');

    // Conexión a la base solo cuando hace falta (noticias, preguntas frecuentes)
    $pdo = null;
    $db = function () use (&$pdo) {
        if ($pdo instanceof PDO) return $pdo;
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) return null;
        $c = (require $file)['db'] ?? null;
        if (!$c) return null;
        foreach (['DB_HOST' => 'host', 'DB_PORT' => 'port', 'DB_NAME' => 'name', 'DB_USER' => 'user', 'DB_PASS' => 'pass'] as $env => $k) {
            if (getenv($env) !== false && getenv($env) !== '') $c[$k] = getenv($env);
        }
        try {
            $pdo = new PDO(
                sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $c['host'], (int) $c['port'], $c['name']),
                $c['user'],
                $c['pass'],
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_TIMEOUT => 3]
            );
        } catch (Throwable $e) {
            error_log('[SEO INNE] ' . $e->getMessage());
            return null;
        }
        return $pdo;
    };

    $status = 200;
    $page = $seo['pages'][$path] ?? null;

    // Noticias de la base de datos: /noticias/{id}
    if (!$page && preg_match('#^/noticias/(\d+)$#', $path, $m)) {
        $conn = $db();
        $n = null;
        if ($conn) {
            $st = $conn->prepare('SELECT * FROM noticias WHERE id = ? AND publicado = 1');
            $st->execute([(int) $m[1]]);
            $n = $st->fetch() ?: null;
        }
        if ($n) {
            $img = (string) $n['imagen'];
            $page = [
                'title' => $n['titulo'] . ' | Innovación E-learning',
                'description' => mb_substr((string) $n['resumen'], 0, 300),
                'image' => preg_match('#^(/uploads/|https://)#', $img) ? $img : $seo['defaultImage'],
                'type' => 'article',
                'articleType' => 'NewsArticle',
                'published' => $n['fecha'],
                'modified' => substr((string) $n['actualizado_en'], 0, 10),
                'breadcrumb' => $n['titulo'],
                'parent' => '/noticias',
            ];
        } elseif (!$conn) {
            // Sin base de datos no se puede confirmar: se entrega como noticia genérica
            $page = ['breadcrumb' => 'Noticia', 'parent' => '/noticias'] + $seo['pages']['/noticias'];
        }
    }

    if (!$page) {
        $status = 404;
        $page = $seo['notFound'];
    }
    http_response_code($status);

    $title = $page['title'] ?? $seo['siteName'];
    $description = $page['description'] ?? $seo['pages']['/']['description'];
    $image = $abs($page['image'] ?? $seo['defaultImage']);
    $canonical = $abs($page['canonical'] ?? $path);
    $noindex = !empty($page['noindex']);

    $tags = [
        '<title>' . $esc($title) . '</title>',
        '<meta name="description" content="' . $esc($description) . '" />',
        '<meta name="robots" content="' . ($noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large') . '" />',
        '<meta property="og:type" content="' . (($page['type'] ?? '') === 'article' ? 'article' : 'website') . '" />',
        '<meta property="og:title" content="' . $esc($title) . '" />',
        '<meta property="og:description" content="' . $esc($description) . '" />',
        '<meta property="og:url" content="' . $esc($canonical) . '" />',
        '<meta property="og:image" content="' . $esc($image) . '" />',
        '<meta name="twitter:title" content="' . $esc($title) . '" />',
        '<meta name="twitter:description" content="' . $esc($description) . '" />',
        '<meta name="twitter:image" content="' . $esc($image) . '" />',
    ];
    if ($status === 200) {
        array_splice($tags, 3, 0, ['<link rel="canonical" href="' . $esc($canonical) . '" />']);
    }
    if (!empty($seo['googleSiteVerification'])) {
        $tags[] = '<meta name="google-site-verification" content="' . $esc($seo['googleSiteVerification']) . '" />';
    }

    // ===== Datos estructurados de la página =====
    $ld = [];
    if ($status === 200 && !$noindex) {
        if ($path !== '/') {
            $items = [['Inicio', '/']];
            $parent = $page['parent'] ?? null;
            if ($parent && isset($seo['pages'][$parent])) {
                $items[] = [$seo['pages'][$parent]['breadcrumb'] ?? $seo['pages'][$parent]['title'], $parent];
            }
            $items[] = [$page['breadcrumb'] ?? $title, $path];
            $ld[] = [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => array_map(fn ($it, $i) => [
                    '@type' => 'ListItem', 'position' => $i + 1, 'name' => $it[0], 'item' => $abs($it[1]),
                ], $items, array_keys($items)),
            ];
        }

        if (($page['type'] ?? '') === 'article' && !empty($page['published'])) {
            $ld[] = [
                '@context' => 'https://schema.org',
                '@type' => $page['articleType'] ?? 'BlogPosting',
                'headline' => mb_substr($title, 0, 110),
                'description' => $description,
                'image' => [$image],
                'datePublished' => $page['published'],
                'dateModified' => $page['modified'] ?? $page['published'],
                'inLanguage' => $seo['language'],
                'mainEntityOfPage' => $canonical,
                'author' => ['@type' => 'Organization', 'name' => $seo['organization']['name'], 'url' => $site . '/'],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => $seo['organization']['name'],
                    'logo' => ['@type' => 'ImageObject', 'url' => $abs($seo['organization']['logo'])],
                ],
            ];
        }

        // Preguntas frecuentes del inicio (desde la base de datos)
        if ($path === '/' && ($conn = $db())) {
            $faqs = $conn->query('SELECT pregunta, respuesta FROM faqs ORDER BY orden, id')->fetchAll();
            if ($faqs) {
                $ld[] = [
                    '@context' => 'https://schema.org',
                    '@type' => 'FAQPage',
                    'mainEntity' => array_map(fn ($f) => [
                        '@type' => 'Question',
                        'name' => $f['pregunta'],
                        'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['respuesta']],
                    ], $faqs),
                ];
            }
        }
    }
    foreach ($ld as $block) {
        $json = json_encode($block, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
        $tags[] = '<script type="application/ld+json" data-seo-page>' . $json . '</script>';
    }

    $block = "<!--seo-->\n    " . implode("\n    ", $tags) . "\n    <!--/seo-->";
    $out = preg_replace('#<!--seo-->.*?<!--/seo-->#s', str_replace(['\\', '$'], ['\\\\', '\\$'], $block), $html, 1);
    echo $out ?? $html;
} catch (Throwable $e) {
    error_log('[SEO INNE] ' . $e->getMessage());
    echo $html;
}

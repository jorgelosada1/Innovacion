<?php
declare(strict_types=1);

/**
 * Mapa del sitio para buscadores: /sitemap.xml (ver .htaccess de la raíz).
 * Incluye las páginas fijas indexables de api/seo.json y las noticias publicadas
 * de la base de datos, con su fecha de actualización.
 */

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

$seo = json_decode((string) @file_get_contents(__DIR__ . '/seo.json'), true) ?: ['siteUrl' => '', 'pages' => []];
$site = rtrim((string) $seo['siteUrl'], '/');
$deploy = date('Y-m-d', (int) (@filemtime(dirname(__DIR__) . '/index.html') ?: time()));
$urls = [];

foreach ($seo['pages'] as $path => $page) {
    if (!empty($page['noindex']) || !empty($page['canonical'])) continue;
    $urls[] = [
        'loc' => $site . $path,
        'lastmod' => $page['published'] ?? $deploy,
        'changefreq' => $page['changefreq'] ?? 'monthly',
        'priority' => $page['priority'] ?? '0.5',
    ];
}

try {
    $file = __DIR__ . '/config.php';
    if (is_file($file)) {
        $c = (require $file)['db'];
        $pdo = new PDO(
            sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', getenv('DB_HOST') ?: $c['host'], (int) (getenv('DB_PORT') ?: $c['port']), getenv('DB_NAME') ?: $c['name']),
            getenv('DB_USER') ?: $c['user'],
            getenv('DB_PASS') ?: $c['pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]
        );
        foreach ($pdo->query('SELECT id, actualizado_en FROM noticias WHERE publicado = 1 ORDER BY fecha DESC') as $n) {
            $urls[] = [
                'loc' => $site . '/noticias/' . $n['id'],
                'lastmod' => substr((string) $n['actualizado_en'], 0, 10),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ];
        }
    }
} catch (Throwable $e) {
    error_log('[SITEMAP INNE] ' . $e->getMessage());
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as $u) {
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($u['loc'], ENT_XML1) . "</loc>\n";
    echo '    <lastmod>' . htmlspecialchars($u['lastmod'], ENT_XML1) . "</lastmod>\n";
    echo '    <changefreq>' . htmlspecialchars($u['changefreq'], ENT_XML1) . "</changefreq>\n";
    echo '    <priority>' . htmlspecialchars($u['priority'], ENT_XML1) . "</priority>\n";
    echo "  </url>\n";
}
echo "</urlset>\n";

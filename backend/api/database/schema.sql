-- =====================================================================
--  Innovación E-learning · Esquema de base de datos
--  Compatible con MariaDB 10.5+ / MySQL 5.7+ (utf8mb4)
-- =====================================================================

CREATE TABLE IF NOT EXISTS admins (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario        VARCHAR(60)  NOT NULL,
  nombre         VARCHAR(120) NOT NULL DEFAULT '',
  password_hash  VARCHAR(255) NOT NULL,
  creado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso  DATETIME     NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Intentos fallidos de inicio de sesión (bloqueo temporal por fuerza bruta)
CREATE TABLE IF NOT EXISTS login_intentos (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip_hash    CHAR(64)     NOT NULL,
  usuario    VARCHAR(60)  NOT NULL DEFAULT '',
  creado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_intentos_ip (ip_hash, creado_en),
  KEY idx_intentos_usuario (usuario, creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS noticias (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo          VARCHAR(200) NOT NULL,
  resumen         VARCHAR(500) NOT NULL,
  contenido       MEDIUMTEXT   NOT NULL,
  imagen          VARCHAR(500) NOT NULL DEFAULT '',
  fecha           DATE         NOT NULL,
  publicado       TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_noticias_fecha (publicado, fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners del carrusel de inicio
CREATE TABLE IF NOT EXISTS slider (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  imagen      VARCHAR(500) NOT NULL,
  titulo      VARCHAR(200) NOT NULL DEFAULT '',
  enlace      VARCHAR(500) NOT NULL DEFAULT '',
  noticia_id  INT UNSIGNED NULL,
  orden       INT          NOT NULL DEFAULT 0,
  activo      TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_slider_orden (activo, orden),
  CONSTRAINT fk_slider_noticia FOREIGN KEY (noticia_id) REFERENCES noticias (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cursos (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo          VARCHAR(200) NOT NULL,
  descripcion     TEXT         NOT NULL,
  video_id        VARCHAR(20)  NOT NULL,
  duracion        VARCHAR(60)  NOT NULL DEFAULT '',
  nivel           VARCHAR(20)  NOT NULL DEFAULT 'Básico',
  temas           TEXT         NOT NULL,
  evaluacion      TINYINT(1)   NOT NULL DEFAULT 0,
  orden           INT          NOT NULL DEFAULT 0,
  activo          TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cursos_orden (activo, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pregunta        VARCHAR(300) NOT NULL,
  respuesta       TEXT         NOT NULL,
  orden           INT          NOT NULL DEFAULT 0,
  creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_faqs_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buzón de ideas de los colaboradores
CREATE TABLE IF NOT EXISTS ideas (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre          VARCHAR(60)  NOT NULL DEFAULT '',
  area            VARCHAR(60)  NOT NULL DEFAULT '',
  tipo            VARCHAR(20)  NOT NULL DEFAULT 'otro',
  titulo          VARCHAR(90)  NOT NULL,
  idea            TEXT         NOT NULL,
  beneficio       VARCHAR(160) NOT NULL DEFAULT '',
  estado          VARCHAR(20)  NOT NULL DEFAULT 'nueva',
  nota            VARCHAR(500) NOT NULL DEFAULT '',
  ip_hash         CHAR(64)     NOT NULL DEFAULT '',
  creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ideas_estado (estado, creado_en),
  KEY idx_ideas_ip (ip_hash, creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

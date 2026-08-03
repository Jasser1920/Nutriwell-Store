CREATE DATABASE IF NOT EXISTS nutriwell CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutriwell;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS admin_sessions;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS page_contents;
DROP TABLE IF EXISTS contact_reports;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_usage_tips;
DROP TABLE IF EXISTS product_nutrition;
DROP TABLE IF EXISTS product_formats;
DROP TABLE IF EXISTS product_flavors;
DROP TABLE IF EXISTS product_benefits;
DROP TABLE IF EXISTS product_descriptions;
DROP TABLE IF EXISTS products;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(191) DEFAULT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE admin_sessions (
  session_token VARCHAR(128) NOT NULL,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME DEFAULT NULL,
  PRIMARY KEY (session_token),
  KEY idx_admin_sessions_user (admin_user_id),
  CONSTRAINT fk_admin_sessions_user FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE page_contents (
  page_key VARCHAR(191) NOT NULL,
  content_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (page_key)
) ENGINE=InnoDB;

CREATE TABLE products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(191) NOT NULL,
  name VARCHAR(191) NOT NULL,
  category VARCHAR(191) NOT NULL,
  short_description TEXT NOT NULL,
  texture VARCHAR(191) NOT NULL,
  gout VARCHAR(191) NOT NULL,
  regime VARCHAR(191) NOT NULL,
  badge VARCHAR(64) DEFAULT NULL,
  badge_color VARCHAR(64) DEFAULT NULL,
  image TEXT DEFAULT NULL,
  nutrition_table_json LONGTEXT DEFAULT NULL,
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  price_ttc DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE product_descriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pd (product_id, sort_order),
  CONSTRAINT fk_pd FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_benefits (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pb (product_id, sort_order),
  CONSTRAINT fk_pb FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Nouvelle table pour les ingrédients
CREATE TABLE product_ingredients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pi (product_id, sort_order),
  CONSTRAINT fk_pi_ingredients FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Nouvelle table pour les avis importants
CREATE TABLE product_important_notices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pin (product_id, sort_order),
  CONSTRAINT fk_pin FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_flavors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(191) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pf (product_id, sort_order),
  CONSTRAINT fk_pf FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_formats (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(191) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pfo (product_id, sort_order),
  CONSTRAINT fk_pfo FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_nutrition (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  nutriment VARCHAR(191) NOT NULL,
  per_100ml VARCHAR(191) NOT NULL,
  per_portion VARCHAR(191) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pn (product_id, sort_order),
  CONSTRAINT fk_pn FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_usage_tips (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  icon VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_put (product_id, sort_order),
  CONSTRAINT fk_put FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pi (product_id, sort_order),
  CONSTRAINT fk_pi FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  reviewer_name VARCHAR(191) NOT NULL,
  rating INT NOT NULL,
  review_text TEXT NOT NULL,
  review_date DATE DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pr (product_id, sort_order),
  CONSTRAINT fk_pr FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE recipes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(191) NOT NULL,
  category VARCHAR(191) NOT NULL,
  summary TEXT NOT NULL,
  prep_time VARCHAR(64) NOT NULL,
  servings INT NOT NULL DEFAULT 1,
  image TEXT DEFAULT NULL,
  related_product_slug VARCHAR(191) DEFAULT NULL,
  ingredients LONGTEXT NOT NULL,
  steps LONGTEXT NOT NULL,
  tips LONGTEXT NOT NULL,
  nutrition LONGTEXT NOT NULL,
  nutrition_table_json LONGTEXT DEFAULT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_recipes_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE contact_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject VARCHAR(191) NOT NULL,
  message TEXT NOT NULL,
  email VARCHAR(191) NOT NULL,
  profile_type VARCHAR(191) DEFAULT NULL,
  civility VARCHAR(32) DEFAULT NULL,
  last_name VARCHAR(191) NOT NULL,
  first_name VARCHAR(191) NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  postal_code VARCHAR(32) DEFAULT NULL,
  city VARCHAR(191) DEFAULT NULL,
  country VARCHAR(191) DEFAULT NULL,
  phone_prefix VARCHAR(16) DEFAULT NULL,
  phone_number VARCHAR(32) DEFAULT NULL,
  attachment_url TEXT DEFAULT NULL,
  status ENUM('nouveau','traite','archive') NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Tables for dynamic product filters
CREATE TABLE filter_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  key_name VARCHAR(191) NOT NULL,
  label VARCHAR(191) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_filter_categories_key (key_name)
) ENGINE=InnoDB;

CREATE TABLE filter_options (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_filter_options_cat (category_id, sort_order),
  CONSTRAINT fk_filter_options_category FOREIGN KEY (category_id) REFERENCES filter_categories (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed basic categories and options (textures and gouts)
INSERT IGNORE INTO filter_categories (key_name, label, sort_order) VALUES
  ('texture', 'Texture', 10),
  ('gout', 'Goût', 20);

-- Textures
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Boisson', 'boisson', 1, 10 FROM filter_categories fc WHERE fc.key_name = 'texture' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'boisson');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Crème', 'creme', 1, 20 FROM filter_categories fc WHERE fc.key_name = 'texture' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'creme');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Poudre', 'poudre', 1, 30 FROM filter_categories fc WHERE fc.key_name = 'texture' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'poudre');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Gelée', 'gelee', 1, 40 FROM filter_categories fc WHERE fc.key_name = 'texture' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'gelee');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Purée', 'puree', 1, 50 FROM filter_categories fc WHERE fc.key_name = 'texture' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'puree');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Velouté', 'veloute', 1, 60 FROM filter_categories fc WHERE fc.key_name = 'texture' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'veloute');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Céréales', 'cereales', 1, 70 FROM filter_categories fc WHERE fc.key_name = 'texture' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'cereales');

-- Gouts
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Fruité', 'fruite', 1, 10 FROM filter_categories fc WHERE fc.key_name = 'gout' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'fruite');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Lacté', 'lacte', 1, 20 FROM filter_categories fc WHERE fc.key_name = 'gout' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'lacte');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Chocolat', 'chocolat', 1, 30 FROM filter_categories fc WHERE fc.key_name = 'gout' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'chocolat');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Vanille', 'vanille', 1, 40 FROM filter_categories fc WHERE fc.key_name = 'gout' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'vanille');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Café', 'cafe', 1, 50 FROM filter_categories fc WHERE fc.key_name = 'gout' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'cafe');
INSERT IGNORE INTO filter_options (category_id, label, slug, is_active, sort_order)
  SELECT fc.id, 'Neutre', 'neutre', 1, 60 FROM filter_categories fc WHERE fc.key_name = 'gout' AND NOT EXISTS (SELECT 1 FROM filter_options fo WHERE fo.slug = 'neutre');

-- Orders Management Tables
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_reference VARCHAR(64) NOT NULL,
  first_name VARCHAR(191) NOT NULL,
  last_name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  address VARCHAR(255) NOT NULL,
  postal_code VARCHAR(32) DEFAULT NULL,
  city VARCHAR(191) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  total_ttc DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('en_attente', 'acceptee', 'refusee') NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_ref (order_reference)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED DEFAULT NULL,
  product_name VARCHAR(191) NOT NULL,
  product_slug VARCHAR(191) DEFAULT NULL,
  flavor VARCHAR(191) DEFAULT NULL,
  format VARCHAR(191) DEFAULT NULL,
  unit_price_ttc DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  quantity INT NOT NULL DEFAULT 1,
  total_price_ttc DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id),
  KEY idx_oi_order (order_id),
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed Real Products
INSERT IGNORE INTO products (slug, name, category, short_description, texture, gout, regime, badge, badge_color, image, rating, review_count, price_ttc, is_published) VALUES
  ('futurefuel-breakfast-pro-cafe', 'FUTUREFUEL BREAKFAST PRO POUDRE PETIT DEJEUNER CAFE 400MG', 'Énergie - Vitalité', 'Poudre pour petit déjeuner hyperénergétique goût café, formule enrichie pour démarrer la journée avec vitalité.', 'Poudre', 'Café', 'Standard', 'TOP VENTE', 'bg-secondary text-secondary-foreground', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop', 4.8, 34, 49.000, 1),
  ('nutriwell-pro-poudre-de-proteines', 'NUTRIWELL PRO POUDRE DE PROTEINES 400MG', 'Énergie - Vitalité', 'Poudre de protéines hautement assimilable pour le maintien et le renforcement de la masse musculaire et la vitalité.', 'Poudre', 'Neutre', 'Hyperprotéiné', 'HAUTE QUALITÉ', 'bg-primary text-primary-foreground', 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop', 4.9, 52, 65.000, 1),
  ('nutriwell-growth-kids-chocolat', 'NUTRIWELL GROWTH KIDS POUDRE ENERGETIQUE CHOCOLAT 400MG', 'Énergie - Vitalité', 'Poudre énergétique spécialement formulée pour la croissance des enfants, goût chocolat gourmand.', 'Poudre', 'Chocolat', 'Standard', 'KIDS', 'bg-accent text-accent-foreground', 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=600&fit=crop', 4.7, 29, 48.000, 1),
  ('nutriwell-calorix-poudre-enrichissement', 'NUTRIWELL CALORIX POUDRE D ENRICHISSEMENT 400MG', 'Prise Du Poids', 'Poudre d enrichment calorique pour favoriser la prise de poids saine et l apport nutritionnel.', 'Poudre', 'Neutre', 'Hypercalorique', 'PRISE DE POIDS', 'bg-amber-600 text-white', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop', 4.6, 18, 26.000, 1),
  ('futurefuel-poudre-proteinee-chocolat', 'FUTUREFUEL POUDRE PROTEINEE CHOCOLAT 400MG', 'Énergie - Vitalité', 'Poudre protéinée gourmande goût chocolat, riche en acides aminés essentiels pour l énergie quotidienne.', 'Poudre', 'Chocolat', 'Hyperprotéiné', 'ENERGIE', 'bg-primary text-primary-foreground', 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop', 4.7, 41, 46.000, 1),
  ('nutriwell-energie-plus-fraise', 'NUTRIWELL ENERGIE+ POUDRE DE PROTEINES AROME FRAISE 400MG', 'Énergie - Vitalité', 'Poudre de protéines délicieusement parfumée à la fraise pour booster l énergie et la récupération.', 'Poudre', 'Fruité', 'Hyperprotéiné', 'FRUITÉ', 'bg-rose-500 text-white', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop', 4.8, 38, 49.000, 1),
  ('nutriwell-complet-hp-vanille', 'NUTRIWELL COMPLET HP POUDRE DE PROTEINES AROME VANILLE 400MG', 'Carence en vitamines et minéraux', 'Formule complète HP (Hyperprotéinée & Vitamines) arôme vanille pour combler les carences nutritionnelles.', 'Poudre', 'Vanille', 'Hyperprotéiné', 'COMPLET HP', 'bg-secondary text-secondary-foreground', 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop', 4.9, 45, 55.000, 1);



CREATE DATABASE IF NOT EXISTS nutriwell CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutriwell;

SET FOREIGN_KEY_CHECKS = 0;
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

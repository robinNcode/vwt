-- ============================================================
-- GARMENTS & FACTORY ERP SYSTEM — FULL DATABASE SCHEMA
-- Engine  : MySQL 8+  |  InnoDB  |  UTF8MB4
-- Design  : Multi-Company · Multi-Factory · Multilingual
-- Locales : bn (Bengali, default) · en (English)
-- Modules : 10 Core ERP Modules + Pricing/Financial
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ============================================================
-- MODULE 1 — USER & ACCESS MANAGEMENT
-- ============================================================

CREATE TABLE `companies` (
  `id`           BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `uuid`         CHAR(36)          NOT NULL,
  `name`         VARCHAR(255)      NOT NULL,
  `legal_name`   VARCHAR(255)      DEFAULT NULL,
  `code`         VARCHAR(50)       NOT NULL COMMENT 'Short unique org code',
  `country_code` CHAR(2)           NOT NULL DEFAULT 'BD',
  `currency_code` CHAR(3)          NOT NULL DEFAULT 'BDT',
  `locale`       ENUM('bn','en')   NOT NULL DEFAULT 'bn',
  `timezone`     VARCHAR(100)      NOT NULL DEFAULT 'Asia/Dhaka',
  `logo_url`     VARCHAR(500)      DEFAULT NULL,
  `website`      VARCHAR(255)      DEFAULT NULL,
  `email`        VARCHAR(255)      DEFAULT NULL,
  `phone`        VARCHAR(30)       DEFAULT NULL,
  `address`      TEXT              DEFAULT NULL,
  `tax_id`       VARCHAR(100)      DEFAULT NULL,
  `bin_number`   VARCHAR(100)      DEFAULT NULL COMMENT 'Business Identification Number',
  `is_active`    TINYINT(1)        NOT NULL DEFAULT 1,
  `created_at`   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`   DATETIME          DEFAULT NULL,
  `created_by`   BIGINT UNSIGNED   DEFAULT NULL,
  `updated_by`   BIGINT UNSIGNED   DEFAULT NULL,
  `deleted_by`   BIGINT UNSIGNED   DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_companies_uuid`  (`uuid`),
  UNIQUE KEY `uq_companies_code`  (`code`),
  KEY `idx_companies_deleted_at`  (`deleted_at`),
  KEY `idx_companies_country`     (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `users` (
  `id`                  BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `uuid`                CHAR(36)          NOT NULL,
  `company_id`          BIGINT UNSIGNED   NOT NULL,
  `username`            VARCHAR(100)      NOT NULL,
  `email`               VARCHAR(255)      NOT NULL,
  `password_hash`       VARCHAR(255)      NOT NULL,
  `full_name`           VARCHAR(255)      NOT NULL,
  `phone`               VARCHAR(30)       DEFAULT NULL,
  `avatar_url`          VARCHAR(500)      DEFAULT NULL,
  `locale`              ENUM('bn','en')   NOT NULL DEFAULT 'bn',
  `timezone`            VARCHAR(100)      NOT NULL DEFAULT 'Asia/Dhaka',
  `is_active`           TINYINT(1)        NOT NULL DEFAULT 1,
  `is_superadmin`       TINYINT(1)        NOT NULL DEFAULT 0,
  `last_login_at`       DATETIME          DEFAULT NULL,
  `last_login_ip`       VARCHAR(45)       DEFAULT NULL,
  `email_verified_at`   DATETIME          DEFAULT NULL,
  `password_changed_at` DATETIME          DEFAULT NULL,
  `failed_login_count`  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `locked_until`        DATETIME          DEFAULT NULL,
  `created_at`          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`          DATETIME          DEFAULT NULL,
  `created_by`          BIGINT UNSIGNED   DEFAULT NULL,
  `updated_by`          BIGINT UNSIGNED   DEFAULT NULL,
  `deleted_by`          BIGINT UNSIGNED   DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_uuid`      (`uuid`),
  UNIQUE KEY `uq_users_email`     (`email`),
  UNIQUE KEY `uq_users_username`  (`username`),
  KEY `idx_users_company_id`      (`company_id`),
  KEY `idx_users_deleted_at`      (`deleted_at`),
  KEY `idx_users_is_active`       (`is_active`),
  CONSTRAINT `fk_users_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `roles` (
  `id`          BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `company_id`  BIGINT UNSIGNED   DEFAULT NULL COMMENT 'NULL = system-wide role',
  `name`        VARCHAR(100)      NOT NULL,
  `slug`        VARCHAR(100)      NOT NULL,
  `description` TEXT              DEFAULT NULL,
  `is_system`   TINYINT(1)        NOT NULL DEFAULT 0,
  `created_at`  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME          DEFAULT NULL,
  `created_by`  BIGINT UNSIGNED   DEFAULT NULL,
  `updated_by`  BIGINT UNSIGNED   DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_company_slug` (`company_id`, `slug`),
  KEY `idx_roles_deleted_at`         (`deleted_at`),
  CONSTRAINT `fk_roles_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `permissions` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(150)    NOT NULL,
  `slug`        VARCHAR(150)    NOT NULL,
  `module`      VARCHAR(100)    NOT NULL,
  `action`      ENUM('create','read','update','delete','approve','export') NOT NULL,
  `description` TEXT            DEFAULT NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_permissions_slug` (`slug`),
  KEY `idx_permissions_module`     (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `role_permissions` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`       BIGINT UNSIGNED NOT NULL,
  `permission_id` BIGINT UNSIGNED NOT NULL,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`    BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_role_permissions`     (`role_id`, `permission_id`),
  KEY `idx_rp_permission_id`           (`permission_id`),
  CONSTRAINT `fk_rp_role`       FOREIGN KEY (`role_id`)       REFERENCES `roles`       (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `user_roles` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `role_id`    BIGINT UNSIGNED NOT NULL,
  `factory_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'Scope to specific factory if needed',
  `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_roles`         (`user_id`, `role_id`, `factory_id`),
  KEY `idx_ur_role_id`               (`role_id`),
  KEY `idx_ur_factory_id`            (`factory_id`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `sessions` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`        CHAR(36)        NOT NULL,
  `user_id`     BIGINT UNSIGNED NOT NULL,
  `token_hash`  VARCHAR(255)    NOT NULL,
  `ip_address`  VARCHAR(45)     DEFAULT NULL,
  `user_agent`  TEXT            DEFAULT NULL,
  `payload`     JSON            DEFAULT NULL,
  `expires_at`  DATETIME        NOT NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revoked_at`  DATETIME        DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sessions_uuid`       (`uuid`),
  KEY `idx_sessions_user_id`          (`user_id`),
  KEY `idx_sessions_token_hash`       (`token_hash`(64)),
  KEY `idx_sessions_expires_at`       (`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `audit_logs` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`         BIGINT UNSIGNED DEFAULT NULL,
  `company_id`      BIGINT UNSIGNED DEFAULT NULL,
  `event`           VARCHAR(100)    NOT NULL,
  `auditable_type`  VARCHAR(100)    NOT NULL,
  `auditable_id`    BIGINT UNSIGNED NOT NULL,
  `old_values`      JSON            DEFAULT NULL,
  `new_values`      JSON            DEFAULT NULL,
  `ip_address`      VARCHAR(45)     DEFAULT NULL,
  `user_agent`      TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_al_user_id`     (`user_id`),
  KEY `idx_al_company_id`  (`company_id`),
  KEY `idx_al_auditable`   (`auditable_type`, `auditable_id`),
  KEY `idx_al_created_at`  (`created_at`),
  KEY `idx_al_event`       (`event`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  PARTITION BY RANGE (YEAR(`created_at`)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
  );

-- ============================================================
-- MODULE 2 — COMPANY & FACTORY MANAGEMENT
-- ============================================================

CREATE TABLE `company_settings` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `setting_key`    VARCHAR(150)    NOT NULL,
  `setting_value`  TEXT            DEFAULT NULL,
  `setting_group`  VARCHAR(100)    NOT NULL DEFAULT 'general',
  `data_type`      ENUM('string','integer','boolean','json','decimal') NOT NULL DEFAULT 'string',
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_company_settings` (`company_id`, `setting_key`),
  KEY `idx_cs_group`               (`setting_group`),
  CONSTRAINT `fk_cs_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `factories` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`         CHAR(36)        NOT NULL,
  `company_id`   BIGINT UNSIGNED NOT NULL,
  `name`         VARCHAR(255)    NOT NULL,
  `code`         VARCHAR(50)     NOT NULL,
  `address`      TEXT            DEFAULT NULL,
  `city`         VARCHAR(100)    DEFAULT NULL,
  `country_code` CHAR(2)         NOT NULL DEFAULT 'BD',
  `phone`        VARCHAR(30)     DEFAULT NULL,
  `email`        VARCHAR(255)    DEFAULT NULL,
  `manager_id`   BIGINT UNSIGNED DEFAULT NULL,
  `is_active`    TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`   DATETIME        DEFAULT NULL,
  `created_by`   BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`   BIGINT UNSIGNED DEFAULT NULL,
  `deleted_by`   BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_factories_uuid`        (`uuid`),
  UNIQUE KEY `uq_factories_company_code`(`company_id`, `code`),
  KEY `idx_factories_company_id`        (`company_id`),
  KEY `idx_factories_deleted_at`        (`deleted_at`),
  CONSTRAINT `fk_factories_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `factory_departments` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `factory_id`  BIGINT UNSIGNED NOT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `code`        VARCHAR(50)     NOT NULL,
  `parent_id`   BIGINT UNSIGNED DEFAULT NULL COMMENT 'Self-referential for nested depts',
  `head_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT 'Department head user ID',
  `description` TEXT            DEFAULT NULL,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME        DEFAULT NULL,
  `created_by`  BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`  BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fd_factory_code`    (`factory_id`, `code`),
  KEY `idx_fd_parent_id`             (`parent_id`),
  CONSTRAINT `fk_fd_factory` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `production_lines` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `factory_id`    BIGINT UNSIGNED NOT NULL,
  `department_id` BIGINT UNSIGNED DEFAULT NULL,
  `name`          VARCHAR(255)    NOT NULL,
  `code`          VARCHAR(50)     NOT NULL,
  `capacity`      INT UNSIGNED    DEFAULT NULL COMMENT 'Units per shift',
  `shift_hours`   DECIMAL(5,2)    DEFAULT 8.00,
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME        DEFAULT NULL,
  `created_by`    BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`    BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pl_factory_code`  (`factory_id`, `code`),
  KEY `idx_pl_department_id`       (`department_id`),
  CONSTRAINT `fk_pl_factory`    FOREIGN KEY (`factory_id`)    REFERENCES `factories`           (`id`),
  CONSTRAINT `fk_pl_department` FOREIGN KEY (`department_id`) REFERENCES `factory_departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `warehouses` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`        CHAR(36)        NOT NULL,
  `company_id`  BIGINT UNSIGNED NOT NULL,
  `factory_id`  BIGINT UNSIGNED DEFAULT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `code`        VARCHAR(50)     NOT NULL,
  `type`        ENUM('raw_material','finished_goods','spare_parts','general','transit') NOT NULL DEFAULT 'general',
  `address`     TEXT            DEFAULT NULL,
  `manager_id`  BIGINT UNSIGNED DEFAULT NULL,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME        DEFAULT NULL,
  `created_by`  BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`  BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_warehouses_uuid`         (`uuid`),
  UNIQUE KEY `uq_warehouses_company_code` (`company_id`, `code`),
  KEY `idx_warehouses_factory_id`         (`factory_id`),
  KEY `idx_warehouses_deleted_at`         (`deleted_at`),
  CONSTRAINT `fk_warehouses_company` FOREIGN KEY (`company_id`) REFERENCES `companies`  (`id`),
  CONSTRAINT `fk_warehouses_factory` FOREIGN KEY (`factory_id`) REFERENCES `factories`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `warehouse_locations` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `warehouse_id` BIGINT UNSIGNED NOT NULL,
  `parent_id`    BIGINT UNSIGNED DEFAULT NULL COMMENT 'Zone > Aisle > Rack > Bin hierarchy',
  `name`         VARCHAR(100)    NOT NULL,
  `code`         VARCHAR(50)     NOT NULL,
  `type`         ENUM('zone','aisle','rack','bin','shelf') NOT NULL DEFAULT 'bin',
  `barcode`      VARCHAR(100)    DEFAULT NULL,
  `is_active`    TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wl_warehouse_code`    (`warehouse_id`, `code`),
  KEY `idx_wl_parent_id`               (`parent_id`),
  CONSTRAINT `fk_wl_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 9 — CURRENCIES (needed early for FK references)
-- ============================================================

CREATE TABLE `currencies` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code`            CHAR(3)         NOT NULL COMMENT 'ISO 4217',
  `name`            VARCHAR(100)    NOT NULL,
  `symbol`          VARCHAR(10)     NOT NULL,
  `decimal_places`  TINYINT         NOT NULL DEFAULT 2,
  `is_base`         TINYINT(1)      NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_currencies_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `exchange_rates` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `from_currency`    CHAR(3)         NOT NULL,
  `to_currency`      CHAR(3)         NOT NULL,
  `rate`             DECIMAL(20,8)   NOT NULL,
  `rate_date`        DATE            NOT NULL,
  `source`           VARCHAR(100)    DEFAULT NULL COMMENT 'e.g. Bangladesh Bank, manual',
  `created_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`       BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exchange_rate_date` (`from_currency`, `to_currency`, `rate_date`),
  KEY `idx_er_rate_date`             (`rate_date`),
  KEY `idx_er_to_currency`           (`to_currency`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 3 — PRODUCT & ACCESSORIES MANAGEMENT
-- ============================================================

CREATE TABLE `product_categories` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`  BIGINT UNSIGNED NOT NULL,
  `parent_id`   BIGINT UNSIGNED DEFAULT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `slug`        VARCHAR(255)    NOT NULL,
  `code`        VARCHAR(50)     DEFAULT NULL,
  `type`        ENUM('accessory','fabric','machinery_part','chemical','packaging','general') NOT NULL DEFAULT 'general',
  `image_url`   VARCHAR(500)    DEFAULT NULL,
  `sort_order`  SMALLINT        NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME        DEFAULT NULL,
  `created_by`  BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`  BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pc_company_slug`  (`company_id`, `slug`),
  KEY `idx_pc_parent_id`           (`parent_id`),
  KEY `idx_pc_deleted_at`          (`deleted_at`),
  CONSTRAINT `fk_pc_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_category_translations` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `locale`      CHAR(2)         NOT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `description` TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pct_category_locale` (`category_id`, `locale`),
  CONSTRAINT `fk_pct_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `brands` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`  BIGINT UNSIGNED NOT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `slug`        VARCHAR(255)    NOT NULL,
  `country_of_origin` CHAR(2)  DEFAULT NULL,
  `logo_url`    VARCHAR(500)    DEFAULT NULL,
  `website`     VARCHAR(255)    DEFAULT NULL,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME        DEFAULT NULL,
  `created_by`  BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_brands_company_slug` (`company_id`, `slug`),
  CONSTRAINT `fk_brands_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `units` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`   BIGINT UNSIGNED NOT NULL,
  `name`         VARCHAR(100)    NOT NULL,
  `abbreviation` VARCHAR(20)     NOT NULL,
  `type`         ENUM('weight','length','volume','quantity','area','time') NOT NULL DEFAULT 'quantity',
  `base_unit_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'For conversion: e.g. gram->kilogram',
  `conversion_factor` DECIMAL(20,8) DEFAULT 1.00000000,
  `is_active`    TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_units_company_abbr` (`company_id`, `abbreviation`),
  KEY `idx_units_base_unit_id`       (`base_unit_id`),
  CONSTRAINT `fk_units_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `products` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`                CHAR(36)        NOT NULL,
  `company_id`          BIGINT UNSIGNED NOT NULL,
  `category_id`         BIGINT UNSIGNED NOT NULL,
  `brand_id`            BIGINT UNSIGNED DEFAULT NULL,
  `unit_id`             BIGINT UNSIGNED NOT NULL COMMENT 'Primary unit',
  `sku`                 VARCHAR(100)    NOT NULL,
  `name`                VARCHAR(255)    NOT NULL COMMENT 'Default (Bengali) name',
  `slug`                VARCHAR(255)    NOT NULL,
  `description`         TEXT            DEFAULT NULL,
  `type`                ENUM('accessory','fabric','machinery_part','chemical','packaging','finished_good','raw_material') NOT NULL DEFAULT 'accessory',
  `country_of_origin`   CHAR(2)         DEFAULT NULL,
  `hs_code`             VARCHAR(50)     DEFAULT NULL COMMENT 'Harmonized System code for imports',
  `reorder_level`       DECIMAL(15,4)   DEFAULT 0.0000,
  `reorder_quantity`    DECIMAL(15,4)   DEFAULT 0.0000,
  `standard_cost`       DECIMAL(15,4)   DEFAULT 0.0000,
  `currency_code`       CHAR(3)         NOT NULL DEFAULT 'BDT',
  `weight_kg`           DECIMAL(10,4)   DEFAULT NULL,
  `is_serialized`       TINYINT(1)      NOT NULL DEFAULT 0,
  `is_batch_tracked`    TINYINT(1)      NOT NULL DEFAULT 0,
  `is_active`           TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`          DATETIME        DEFAULT NULL,
  `created_by`          BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`          BIGINT UNSIGNED DEFAULT NULL,
  `deleted_by`          BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_uuid`         (`uuid`),
  UNIQUE KEY `uq_products_company_sku`  (`company_id`, `sku`),
  KEY `idx_products_category_id`        (`category_id`),
  KEY `idx_products_brand_id`           (`brand_id`),
  KEY `idx_products_deleted_at`         (`deleted_at`),
  KEY `idx_products_type`               (`type`),
  CONSTRAINT `fk_products_company`  FOREIGN KEY (`company_id`)  REFERENCES `companies`          (`id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `fk_products_brand`    FOREIGN KEY (`brand_id`)    REFERENCES `brands`             (`id`),
  CONSTRAINT `fk_products_unit`     FOREIGN KEY (`unit_id`)     REFERENCES `units`              (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_translations` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `locale`      CHAR(2)         NOT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `description` TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pt_product_locale` (`product_id`, `locale`),
  CONSTRAINT `fk_pt_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_variants` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`     BIGINT UNSIGNED NOT NULL,
  `sku`            VARCHAR(100)    NOT NULL,
  `name`           VARCHAR(255)    NOT NULL,
  `attributes`     JSON            DEFAULT NULL COMMENT '{"color":"Red","size":"XL"}',
  `barcode`        VARCHAR(100)    DEFAULT NULL,
  `extra_cost`     DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `weight_kg`      DECIMAL(10,4)   DEFAULT NULL,
  `is_active`      TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`     DATETIME        DEFAULT NULL,
  `created_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pv_product_sku` (`product_id`, `sku`),
  KEY `idx_pv_barcode`           (`barcode`),
  KEY `idx_pv_deleted_at`        (`deleted_at`),
  CONSTRAINT `fk_pv_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_images` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `variant_id`  BIGINT UNSIGNED DEFAULT NULL,
  `url`         VARCHAR(500)    NOT NULL,
  `alt_text`    VARCHAR(255)    DEFAULT NULL,
  `is_primary`  TINYINT(1)      NOT NULL DEFAULT 0,
  `sort_order`  SMALLINT        NOT NULL DEFAULT 0,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pi_product_id` (`product_id`),
  KEY `idx_pi_variant_id` (`variant_id`),
  CONSTRAINT `fk_pi_product` FOREIGN KEY (`product_id`) REFERENCES `products`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_specifications` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `spec_key`   VARCHAR(150)    NOT NULL,
  `spec_value` TEXT            NOT NULL,
  `unit`       VARCHAR(50)     DEFAULT NULL,
  `sort_order` SMALLINT        NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_ps_product_id` (`product_id`),
  CONSTRAINT `fk_ps_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_barcodes` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `variant_id`  BIGINT UNSIGNED DEFAULT NULL,
  `barcode`     VARCHAR(150)    NOT NULL,
  `type`        ENUM('EAN13','EAN8','CODE128','QR','UPCA','custom') NOT NULL DEFAULT 'CODE128',
  `is_primary`  TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pb_barcode` (`barcode`),
  KEY `idx_pb_product_id`    (`product_id`),
  KEY `idx_pb_variant_id`    (`variant_id`),
  CONSTRAINT `fk_pb_product` FOREIGN KEY (`product_id`) REFERENCES `products`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pb_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_pricing` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`    BIGINT UNSIGNED NOT NULL,
  `variant_id`    BIGINT UNSIGNED DEFAULT NULL,
  `price_type`    ENUM('standard','supplier','import','wholesale','retail') NOT NULL DEFAULT 'standard',
  `supplier_id`   BIGINT UNSIGNED DEFAULT NULL,
  `currency_code` CHAR(3)         NOT NULL DEFAULT 'BDT',
  `price`         DECIMAL(15,4)   NOT NULL,
  `min_qty`       DECIMAL(15,4)   NOT NULL DEFAULT 1.0000,
  `effective_from` DATE           NOT NULL,
  `effective_to`  DATE            DEFAULT NULL,
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`    BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pp_product_id`   (`product_id`),
  KEY `idx_pp_variant_id`   (`variant_id`),
  KEY `idx_pp_supplier_id`  (`supplier_id`),
  KEY `idx_pp_price_type`   (`price_type`),
  CONSTRAINT `fk_pp_product` FOREIGN KEY (`product_id`) REFERENCES `products`         (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `product_price_history` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`    BIGINT UNSIGNED NOT NULL,
  `variant_id`    BIGINT UNSIGNED DEFAULT NULL,
  `old_price`     DECIMAL(15,4)   NOT NULL,
  `new_price`     DECIMAL(15,4)   NOT NULL,
  `currency_code` CHAR(3)         NOT NULL,
  `changed_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_by`    BIGINT UNSIGNED DEFAULT NULL,
  `reason`        TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pph_product_id` (`product_id`),
  KEY `idx_pph_changed_at` (`changed_at`),
  CONSTRAINT `fk_pph_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 4 — MACHINERY MANAGEMENT SYSTEM
-- ============================================================

CREATE TABLE `machinery_categories` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`  BIGINT UNSIGNED NOT NULL,
  `parent_id`   BIGINT UNSIGNED DEFAULT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `slug`        VARCHAR(255)    NOT NULL,
  `description` TEXT            DEFAULT NULL,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME        DEFAULT NULL,
  `created_by`  BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mc_company_slug` (`company_id`, `slug`),
  KEY `idx_mc_parent_id`          (`parent_id`),
  CONSTRAINT `fk_mc_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_category_translations` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `locale`      CHAR(2)         NOT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `description` TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mct_cat_locale` (`category_id`, `locale`),
  CONSTRAINT `fk_mct_category` FOREIGN KEY (`category_id`) REFERENCES `machinery_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_brands` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`        BIGINT UNSIGNED NOT NULL,
  `name`              VARCHAR(255)    NOT NULL,
  `slug`              VARCHAR(255)    NOT NULL,
  `country_of_origin` CHAR(2)         DEFAULT NULL,
  `logo_url`          VARCHAR(500)    DEFAULT NULL,
  `website`           VARCHAR(255)    DEFAULT NULL,
  `is_active`         TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`        DATETIME        DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mb_company_slug` (`company_id`, `slug`),
  CONSTRAINT `fk_mb_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_models` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `brand_id`        BIGINT UNSIGNED NOT NULL,
  `category_id`     BIGINT UNSIGNED NOT NULL,
  `model_number`    VARCHAR(150)    NOT NULL,
  `name`            VARCHAR(255)    NOT NULL,
  `specifications`  JSON            DEFAULT NULL,
  `country_of_origin` CHAR(2)       DEFAULT NULL,
  `year_introduced` SMALLINT        DEFAULT NULL,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`      DATETIME        DEFAULT NULL,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mm_brand_model` (`brand_id`, `model_number`),
  KEY `idx_mm_category_id`       (`category_id`),
  CONSTRAINT `fk_mm_brand`    FOREIGN KEY (`brand_id`)    REFERENCES `machinery_brands`     (`id`),
  CONSTRAINT `fk_mm_category` FOREIGN KEY (`category_id`) REFERENCES `machinery_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machineries` (
  `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`                 CHAR(36)        NOT NULL,
  `company_id`           BIGINT UNSIGNED NOT NULL,
  `factory_id`           BIGINT UNSIGNED NOT NULL,
  `category_id`          BIGINT UNSIGNED NOT NULL,
  `brand_id`             BIGINT UNSIGNED NOT NULL,
  `model_id`             BIGINT UNSIGNED DEFAULT NULL,
  `asset_code`           VARCHAR(100)    NOT NULL COMMENT 'Internal asset tag',
  `serial_number`        VARCHAR(200)    NOT NULL UNIQUE,
  `name`                 VARCHAR(255)    NOT NULL,
  `description`          TEXT            DEFAULT NULL,
  `purchase_date`        DATE            DEFAULT NULL,
  `purchase_price`       DECIMAL(15,4)   DEFAULT NULL,
  `purchase_currency`    CHAR(3)         DEFAULT 'BDT',
  `supplier_id`          BIGINT UNSIGNED DEFAULT NULL,
  `warranty_expires_at`  DATE            DEFAULT NULL,
  `status`               ENUM('active','idle','maintenance','retired','disposed') NOT NULL DEFAULT 'active',
  `location_description` VARCHAR(255)    DEFAULT NULL,
  `department_id`        BIGINT UNSIGNED DEFAULT NULL,
  `production_line_id`   BIGINT UNSIGNED DEFAULT NULL,
  `is_imported`          TINYINT(1)      NOT NULL DEFAULT 0,
  `import_country`       CHAR(2)         DEFAULT NULL,
  `installation_date`    DATE            DEFAULT NULL,
  `last_service_date`    DATE            DEFAULT NULL,
  `next_service_date`    DATE            DEFAULT NULL,
  `created_at`           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`           DATETIME        DEFAULT NULL,
  `created_by`           BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`           BIGINT UNSIGNED DEFAULT NULL,
  `deleted_by`           BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_machineries_uuid`       (`uuid`),
  UNIQUE KEY `uq_machineries_asset_code` (`company_id`, `asset_code`),
  KEY `idx_machineries_factory_id`       (`factory_id`),
  KEY `idx_machineries_category_id`      (`category_id`),
  KEY `idx_machineries_brand_id`         (`brand_id`),
  KEY `idx_machineries_status`           (`status`),
  KEY `idx_machineries_deleted_at`       (`deleted_at`),
  KEY `idx_machineries_next_service`     (`next_service_date`),
  CONSTRAINT `fk_mach_company`  FOREIGN KEY (`company_id`)  REFERENCES `companies`           (`id`),
  CONSTRAINT `fk_mach_factory`  FOREIGN KEY (`factory_id`)  REFERENCES `factories`           (`id`),
  CONSTRAINT `fk_mach_category` FOREIGN KEY (`category_id`) REFERENCES `machinery_categories`(`id`),
  CONSTRAINT `fk_mach_brand`    FOREIGN KEY (`brand_id`)    REFERENCES `machinery_brands`    (`id`),
  CONSTRAINT `fk_mach_model`    FOREIGN KEY (`model_id`)    REFERENCES `machinery_models`    (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_translations` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id` BIGINT UNSIGNED NOT NULL,
  `locale`       CHAR(2)         NOT NULL,
  `name`         VARCHAR(255)    NOT NULL,
  `description`  TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mt_mach_locale` (`machinery_id`, `locale`),
  CONSTRAINT `fk_mt_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_parts` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id`     BIGINT UNSIGNED NOT NULL,
  `product_id`       BIGINT UNSIGNED DEFAULT NULL COMMENT 'Link to product if stocked as inventory',
  `part_number`      VARCHAR(100)    NOT NULL,
  `name`             VARCHAR(255)    NOT NULL,
  `description`      TEXT            DEFAULT NULL,
  `quantity_per_unit` DECIMAL(10,4)  NOT NULL DEFAULT 1.0000,
  `unit_id`          BIGINT UNSIGNED NOT NULL,
  `is_critical`      TINYINT(1)      NOT NULL DEFAULT 0,
  `reorder_level`    DECIMAL(10,4)   DEFAULT 0.0000,
  `created_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mp_machinery_part` (`machinery_id`, `part_number`),
  KEY `idx_mp_product_id`           (`product_id`),
  CONSTRAINT `fk_mp_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`),
  CONSTRAINT `fk_mp_product`   FOREIGN KEY (`product_id`)   REFERENCES `products`    (`id`),
  CONSTRAINT `fk_mp_unit`      FOREIGN KEY (`unit_id`)      REFERENCES `units`       (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_assignments` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id`        BIGINT UNSIGNED NOT NULL,
  `factory_id`          BIGINT UNSIGNED NOT NULL,
  `department_id`       BIGINT UNSIGNED DEFAULT NULL,
  `production_line_id`  BIGINT UNSIGNED DEFAULT NULL,
  `assigned_by`         BIGINT UNSIGNED NOT NULL,
  `assigned_at`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `released_at`         DATETIME        DEFAULT NULL,
  `notes`               TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ma_machinery_id` (`machinery_id`),
  KEY `idx_ma_factory_id`   (`factory_id`),
  KEY `idx_ma_assigned_at`  (`assigned_at`),
  CONSTRAINT `fk_ma_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries`       (`id`),
  CONSTRAINT `fk_ma_factory`   FOREIGN KEY (`factory_id`)   REFERENCES `factories`         (`id`),
  CONSTRAINT `fk_ma_dept`      FOREIGN KEY (`department_id`) REFERENCES `factory_departments`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_service_logs` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id`   BIGINT UNSIGNED NOT NULL,
  `service_type`   ENUM('preventive','corrective','emergency','inspection','calibration') NOT NULL,
  `service_date`   DATE            NOT NULL,
  `performed_by`   VARCHAR(255)    DEFAULT NULL COMMENT 'Technician name or vendor',
  `vendor_id`      BIGINT UNSIGNED DEFAULT NULL,
  `description`    TEXT            DEFAULT NULL,
  `cost`           DECIMAL(15,4)   DEFAULT 0.0000,
  `currency_code`  CHAR(3)         NOT NULL DEFAULT 'BDT',
  `downtime_hours` DECIMAL(8,2)    DEFAULT 0.00,
  `next_service_date` DATE         DEFAULT NULL,
  `documents`      JSON            DEFAULT NULL COMMENT 'Array of document URLs',
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_msl_machinery_id`  (`machinery_id`),
  KEY `idx_msl_service_date`  (`service_date`),
  CONSTRAINT `fk_msl_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_depreciation` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id`      BIGINT UNSIGNED NOT NULL,
  `method`            ENUM('straight_line','double_declining','units_of_production') NOT NULL DEFAULT 'straight_line',
  `useful_life_years` SMALLINT        NOT NULL DEFAULT 10,
  `salvage_value`     DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `currency_code`     CHAR(3)         NOT NULL DEFAULT 'BDT',
  `depreciation_year` SMALLINT        NOT NULL,
  `depreciation_amount` DECIMAL(15,4) NOT NULL,
  `book_value`        DECIMAL(15,4)   NOT NULL,
  `recorded_at`       DATE            NOT NULL,
  `created_at`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`        BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_md_machinery_id` (`machinery_id`),
  KEY `idx_md_year`         (`depreciation_year`),
  CONSTRAINT `fk_md_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_purchase_history` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id`    BIGINT UNSIGNED NOT NULL,
  `supplier_id`     BIGINT UNSIGNED DEFAULT NULL,
  `purchase_date`   DATE            NOT NULL,
  `invoice_number`  VARCHAR(100)    DEFAULT NULL,
  `purchase_price`  DECIMAL(15,4)   NOT NULL,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `import_duty`     DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `freight_cost`    DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `insurance_cost`  DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `other_costs`     DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `total_landed_cost` DECIMAL(15,4) NOT NULL,
  `notes`           TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mph_machinery_id` (`machinery_id`),
  CONSTRAINT `fk_mph_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_pricing` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id`    BIGINT UNSIGNED DEFAULT NULL COMMENT 'NULL = model-level pricing',
  `model_id`        BIGINT UNSIGNED DEFAULT NULL,
  `price_type`      ENUM('purchase','rental','replacement','insurance') NOT NULL DEFAULT 'purchase',
  `supplier_id`     BIGINT UNSIGNED DEFAULT NULL,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'USD',
  `price`           DECIMAL(15,4)   NOT NULL,
  `effective_from`  DATE            NOT NULL,
  `effective_to`    DATE            DEFAULT NULL,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mpricing_machinery_id` (`machinery_id`),
  KEY `idx_mpricing_model_id`     (`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `machinery_documents` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `machinery_id`    BIGINT UNSIGNED NOT NULL,
  `document_type`   ENUM('manual','warranty','certificate','invoice','insurance','photo','other') NOT NULL,
  `title`           VARCHAR(255)    NOT NULL,
  `file_url`        VARCHAR(500)    NOT NULL,
  `file_size_kb`    INT UNSIGNED    DEFAULT NULL,
  `mime_type`       VARCHAR(100)    DEFAULT NULL,
  `uploaded_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mdoc_machinery_id` (`machinery_id`),
  CONSTRAINT `fk_mdoc_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 5 — SUPPLIER & VENDOR MANAGEMENT
-- ============================================================

CREATE TABLE `suppliers` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`            CHAR(36)        NOT NULL,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `name`            VARCHAR(255)    NOT NULL,
  `code`            VARCHAR(50)     NOT NULL,
  `type`            ENUM('local','international','manufacturer','agent','distributor') NOT NULL DEFAULT 'local',
  `country_code`    CHAR(2)         NOT NULL DEFAULT 'BD',
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `tax_id`          VARCHAR(100)    DEFAULT NULL,
  `website`         VARCHAR(255)    DEFAULT NULL,
  `email`           VARCHAR(255)    DEFAULT NULL,
  `phone`           VARCHAR(30)     DEFAULT NULL,
  `payment_terms`   VARCHAR(100)    DEFAULT NULL COMMENT 'e.g. NET30',
  `credit_limit`    DECIMAL(15,4)   DEFAULT 0.0000,
  `rating`          DECIMAL(3,2)    DEFAULT NULL COMMENT '1.00 to 5.00',
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `notes`           TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`      DATETIME        DEFAULT NULL,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`      BIGINT UNSIGNED DEFAULT NULL,
  `deleted_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_suppliers_uuid`         (`uuid`),
  UNIQUE KEY `uq_suppliers_company_code` (`company_id`, `code`),
  KEY `idx_suppliers_country`            (`country_code`),
  KEY `idx_suppliers_deleted_at`         (`deleted_at`),
  CONSTRAINT `fk_suppliers_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `supplier_contacts` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_id`  BIGINT UNSIGNED NOT NULL,
  `name`         VARCHAR(255)    NOT NULL,
  `designation`  VARCHAR(150)    DEFAULT NULL,
  `email`        VARCHAR(255)    DEFAULT NULL,
  `phone`        VARCHAR(30)     DEFAULT NULL,
  `is_primary`   TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sc_supplier_id` (`supplier_id`),
  CONSTRAINT `fk_sc_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `supplier_addresses` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_id`  BIGINT UNSIGNED NOT NULL,
  `type`         ENUM('billing','shipping','headquarters','factory') NOT NULL DEFAULT 'headquarters',
  `address_line1` VARCHAR(255)   NOT NULL,
  `address_line2` VARCHAR(255)   DEFAULT NULL,
  `city`         VARCHAR(100)    NOT NULL,
  `state`        VARCHAR(100)    DEFAULT NULL,
  `postal_code`  VARCHAR(20)     DEFAULT NULL,
  `country_code` CHAR(2)         NOT NULL,
  `is_primary`   TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sa_supplier_id` (`supplier_id`),
  CONSTRAINT `fk_sa_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `supplier_products` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_id`     BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `supplier_sku`    VARCHAR(100)    DEFAULT NULL,
  `lead_time_days`  SMALLINT        NOT NULL DEFAULT 7,
  `min_order_qty`   DECIMAL(15,4)   NOT NULL DEFAULT 1.0000,
  `is_preferred`    TINYINT(1)      NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sp_supplier_product`  (`supplier_id`, `product_id`),
  KEY `idx_sp_product_id`              (`product_id`),
  CONSTRAINT `fk_sp_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sp_product`  FOREIGN KEY (`product_id`)  REFERENCES `products`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `supplier_pricing` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_id`     BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `unit_price`      DECIMAL(15,4)   NOT NULL,
  `min_qty`         DECIMAL(15,4)   NOT NULL DEFAULT 1.0000,
  `effective_from`  DATE            NOT NULL,
  `effective_to`    DATE            DEFAULT NULL,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_spricing_supplier`  (`supplier_id`),
  KEY `idx_spricing_product`   (`product_id`),
  KEY `idx_spricing_effective` (`effective_from`, `effective_to`),
  CONSTRAINT `fk_spricing_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `fk_spricing_product`  FOREIGN KEY (`product_id`)  REFERENCES `products`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `supplier_documents` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_id`   BIGINT UNSIGNED NOT NULL,
  `document_type` ENUM('contract','certificate','profile','other') NOT NULL,
  `title`         VARCHAR(255)    NOT NULL,
  `file_url`      VARCHAR(500)    NOT NULL,
  `expires_at`    DATE            DEFAULT NULL,
  `uploaded_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by`   BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sdoc_supplier_id` (`supplier_id`),
  CONSTRAINT `fk_sdoc_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 6 — PROCUREMENT & PURCHASE SYSTEM
-- ============================================================

CREATE TABLE `purchase_requisitions` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`          CHAR(36)        NOT NULL,
  `company_id`    BIGINT UNSIGNED NOT NULL,
  `factory_id`    BIGINT UNSIGNED NOT NULL,
  `department_id` BIGINT UNSIGNED DEFAULT NULL,
  `requisition_no` VARCHAR(50)    NOT NULL,
  `requested_by`  BIGINT UNSIGNED NOT NULL,
  `required_date` DATE            NOT NULL,
  `priority`      ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status`        ENUM('draft','pending','approved','rejected','cancelled','converted') NOT NULL DEFAULT 'draft',
  `approved_by`   BIGINT UNSIGNED DEFAULT NULL,
  `approved_at`   DATETIME        DEFAULT NULL,
  `notes`         TEXT            DEFAULT NULL,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME        DEFAULT NULL,
  `created_by`    BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`    BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pr_uuid`         (`uuid`),
  UNIQUE KEY `uq_pr_company_no`   (`company_id`, `requisition_no`),
  KEY `idx_pr_factory_id`         (`factory_id`),
  KEY `idx_pr_status`             (`status`),
  KEY `idx_pr_requested_by`       (`requested_by`),
  CONSTRAINT `fk_pr_company`  FOREIGN KEY (`company_id`) REFERENCES `companies`  (`id`),
  CONSTRAINT `fk_pr_factory`  FOREIGN KEY (`factory_id`) REFERENCES `factories`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `purchase_requisition_items` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `requisition_id`   BIGINT UNSIGNED NOT NULL,
  `product_id`       BIGINT UNSIGNED NOT NULL,
  `variant_id`       BIGINT UNSIGNED DEFAULT NULL,
  `quantity`         DECIMAL(15,4)   NOT NULL,
  `unit_id`          BIGINT UNSIGNED NOT NULL,
  `estimated_cost`   DECIMAL(15,4)   DEFAULT NULL,
  `currency_code`    CHAR(3)         DEFAULT 'BDT',
  `notes`            TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pri_requisition_id` (`requisition_id`),
  KEY `idx_pri_product_id`     (`product_id`),
  CONSTRAINT `fk_pri_requisition` FOREIGN KEY (`requisition_id`) REFERENCES `purchase_requisitions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pri_product`     FOREIGN KEY (`product_id`)     REFERENCES `products`              (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `purchase_orders` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`           CHAR(36)        NOT NULL,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `factory_id`     BIGINT UNSIGNED NOT NULL,
  `supplier_id`    BIGINT UNSIGNED NOT NULL,
  `requisition_id` BIGINT UNSIGNED DEFAULT NULL,
  `po_number`      VARCHAR(50)     NOT NULL,
  `order_date`     DATE            NOT NULL,
  `expected_date`  DATE            DEFAULT NULL,
  `currency_code`  CHAR(3)         NOT NULL DEFAULT 'BDT',
  `exchange_rate`  DECIMAL(20,8)   NOT NULL DEFAULT 1.00000000,
  `subtotal`       DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `tax_amount`     DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `discount_amount` DECIMAL(15,4)  NOT NULL DEFAULT 0.0000,
  `shipping_cost`  DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `total_amount`   DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `status`         ENUM('draft','sent','confirmed','partial','received','closed','cancelled') NOT NULL DEFAULT 'draft',
  `approved_by`    BIGINT UNSIGNED DEFAULT NULL,
  `approved_at`    DATETIME        DEFAULT NULL,
  `notes`          TEXT            DEFAULT NULL,
  `shipping_terms` VARCHAR(100)    DEFAULT NULL COMMENT 'FOB, CIF, EXW, etc.',
  `payment_terms`  VARCHAR(100)    DEFAULT NULL,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`     DATETIME        DEFAULT NULL,
  `created_by`     BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_po_uuid`           (`uuid`),
  UNIQUE KEY `uq_po_company_number` (`company_id`, `po_number`),
  KEY `idx_po_supplier_id`          (`supplier_id`),
  KEY `idx_po_factory_id`           (`factory_id`),
  KEY `idx_po_status`               (`status`),
  KEY `idx_po_order_date`           (`order_date`),
  KEY `idx_po_deleted_at`           (`deleted_at`),
  CONSTRAINT `fk_po_company`   FOREIGN KEY (`company_id`)   REFERENCES `companies`  (`id`),
  CONSTRAINT `fk_po_factory`   FOREIGN KEY (`factory_id`)   REFERENCES `factories`  (`id`),
  CONSTRAINT `fk_po_supplier`  FOREIGN KEY (`supplier_id`)  REFERENCES `suppliers`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `purchase_order_items` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `po_id`           BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `variant_id`      BIGINT UNSIGNED DEFAULT NULL,
  `description`     VARCHAR(500)    DEFAULT NULL,
  `quantity`        DECIMAL(15,4)   NOT NULL,
  `received_qty`    DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `unit_id`         BIGINT UNSIGNED NOT NULL,
  `unit_price`      DECIMAL(15,4)   NOT NULL,
  `discount_pct`    DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
  `tax_pct`         DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
  `line_total`      DECIMAL(15,4)   NOT NULL,
  `notes`           TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_poi_po_id`      (`po_id`),
  KEY `idx_poi_product_id` (`product_id`),
  CONSTRAINT `fk_poi_po`      FOREIGN KEY (`po_id`)       REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_poi_product` FOREIGN KEY (`product_id`)  REFERENCES `products`        (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `goods_receipts` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`           CHAR(36)        NOT NULL,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `warehouse_id`   BIGINT UNSIGNED NOT NULL,
  `po_id`          BIGINT UNSIGNED NOT NULL,
  `grn_number`     VARCHAR(50)     NOT NULL COMMENT 'Goods Receipt Note number',
  `receipt_date`   DATE            NOT NULL,
  `received_by`    BIGINT UNSIGNED NOT NULL,
  `supplier_invoice_no` VARCHAR(100) DEFAULT NULL,
  `status`         ENUM('draft','confirmed','partial','complete') NOT NULL DEFAULT 'draft',
  `notes`          TEXT            DEFAULT NULL,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`     BIGINT UNSIGNED DEFAULT NULL,
  `updated_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_gr_uuid`           (`uuid`),
  UNIQUE KEY `uq_gr_company_number` (`company_id`, `grn_number`),
  KEY `idx_gr_po_id`                (`po_id`),
  KEY `idx_gr_warehouse_id`         (`warehouse_id`),
  KEY `idx_gr_receipt_date`         (`receipt_date`),
  CONSTRAINT `fk_gr_po`        FOREIGN KEY (`po_id`)        REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `fk_gr_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`      (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `goods_receipt_items` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `grn_id`          BIGINT UNSIGNED NOT NULL,
  `po_item_id`      BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `variant_id`      BIGINT UNSIGNED DEFAULT NULL,
  `batch_id`        BIGINT UNSIGNED DEFAULT NULL,
  `location_id`     BIGINT UNSIGNED DEFAULT NULL,
  `received_qty`    DECIMAL(15,4)   NOT NULL,
  `accepted_qty`    DECIMAL(15,4)   NOT NULL,
  `rejected_qty`    DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `unit_id`         BIGINT UNSIGNED NOT NULL,
  `unit_price`      DECIMAL(15,4)   NOT NULL,
  `notes`           TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_gri_grn_id`      (`grn_id`),
  KEY `idx_gri_product_id`  (`product_id`),
  KEY `idx_gri_po_item_id`  (`po_item_id`),
  CONSTRAINT `fk_gri_grn`     FOREIGN KEY (`grn_id`)      REFERENCES `goods_receipts`       (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gri_po_item` FOREIGN KEY (`po_item_id`)  REFERENCES `purchase_order_items` (`id`),
  CONSTRAINT `fk_gri_product` FOREIGN KEY (`product_id`)  REFERENCES `products`             (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `purchase_returns` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`            CHAR(36)        NOT NULL,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `grn_id`          BIGINT UNSIGNED NOT NULL,
  `supplier_id`     BIGINT UNSIGNED NOT NULL,
  `return_number`   VARCHAR(50)     NOT NULL,
  `return_date`     DATE            NOT NULL,
  `reason`          TEXT            DEFAULT NULL,
  `status`          ENUM('draft','confirmed','shipped','closed') NOT NULL DEFAULT 'draft',
  `total_amount`    DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pret_company_number` (`company_id`, `return_number`),
  KEY `idx_pret_grn_id`               (`grn_id`),
  KEY `idx_pret_supplier_id`          (`supplier_id`),
  CONSTRAINT `fk_pret_grn`      FOREIGN KEY (`grn_id`)      REFERENCES `goods_receipts` (`id`),
  CONSTRAINT `fk_pret_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`      (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `supplier_invoices` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`            CHAR(36)        NOT NULL,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `supplier_id`     BIGINT UNSIGNED NOT NULL,
  `po_id`           BIGINT UNSIGNED DEFAULT NULL,
  `invoice_number`  VARCHAR(100)    NOT NULL,
  `invoice_date`    DATE            NOT NULL,
  `due_date`        DATE            DEFAULT NULL,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `exchange_rate`   DECIMAL(20,8)   NOT NULL DEFAULT 1.00000000,
  `subtotal`        DECIMAL(15,4)   NOT NULL,
  `tax_amount`      DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `total_amount`    DECIMAL(15,4)   NOT NULL,
  `paid_amount`     DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `status`          ENUM('unpaid','partial','paid','overdue','disputed') NOT NULL DEFAULT 'unpaid',
  `notes`           TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_si_uuid`               (`uuid`),
  UNIQUE KEY `uq_si_company_invoice_no` (`company_id`, `invoice_number`),
  KEY `idx_si_supplier_id`              (`supplier_id`),
  KEY `idx_si_po_id`                    (`po_id`),
  KEY `idx_si_status`                   (`status`),
  KEY `idx_si_due_date`                 (`due_date`),
  CONSTRAINT `fk_si_company`  FOREIGN KEY (`company_id`)  REFERENCES `companies`  (`id`),
  CONSTRAINT `fk_si_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`  (`id`),
  CONSTRAINT `fk_si_po`       FOREIGN KEY (`po_id`)       REFERENCES `purchase_orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 7 — INVENTORY & WAREHOUSE MANAGEMENT
-- ============================================================

CREATE TABLE `inventory_batches` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`            CHAR(36)        NOT NULL,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `variant_id`      BIGINT UNSIGNED DEFAULT NULL,
  `batch_number`    VARCHAR(100)    NOT NULL,
  `lot_number`      VARCHAR(100)    DEFAULT NULL,
  `manufacture_date` DATE           DEFAULT NULL,
  `expiry_date`     DATE            DEFAULT NULL,
  `supplier_id`     BIGINT UNSIGNED DEFAULT NULL,
  `po_id`           BIGINT UNSIGNED DEFAULT NULL,
  `unit_cost`       DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `status`          ENUM('active','quarantine','expired','disposed') NOT NULL DEFAULT 'active',
  `notes`           TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ib_uuid`               (`uuid`),
  UNIQUE KEY `uq_ib_company_product_batch` (`company_id`, `product_id`, `batch_number`),
  KEY `idx_ib_product_id`               (`product_id`),
  KEY `idx_ib_expiry_date`              (`expiry_date`),
  CONSTRAINT `fk_ib_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `inventory_serials` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `variant_id`      BIGINT UNSIGNED DEFAULT NULL,
  `serial_number`   VARCHAR(200)    NOT NULL,
  `batch_id`        BIGINT UNSIGNED DEFAULT NULL,
  `warehouse_id`    BIGINT UNSIGNED DEFAULT NULL,
  `status`          ENUM('available','reserved','sold','returned','defective') NOT NULL DEFAULT 'available',
  `notes`           TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_is_company_serial` (`company_id`, `product_id`, `serial_number`),
  KEY `idx_is_product_id`           (`product_id`),
  KEY `idx_is_warehouse_id`         (`warehouse_id`),
  KEY `idx_is_status`               (`status`),
  CONSTRAINT `fk_is_product`   FOREIGN KEY (`product_id`)   REFERENCES `products`   (`id`),
  CONSTRAINT `fk_is_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `inventories` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `warehouse_id`    BIGINT UNSIGNED NOT NULL,
  `location_id`     BIGINT UNSIGNED DEFAULT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `variant_id`      BIGINT UNSIGNED DEFAULT NULL,
  `batch_id`        BIGINT UNSIGNED DEFAULT NULL,
  `quantity_on_hand`   DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  `quantity_reserved`  DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  `quantity_available` DECIMAL(15,4) GENERATED ALWAYS AS (`quantity_on_hand` - `quantity_reserved`) STORED,
  `average_cost`    DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `valuation_method` ENUM('FIFO','LIFO','AVCO') NOT NULL DEFAULT 'FIFO',
  `last_counted_at` DATETIME        DEFAULT NULL,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_inv_wh_product_batch` (`warehouse_id`, `product_id`, `variant_id`, `batch_id`),
  KEY `idx_inv_company_id`  (`company_id`),
  KEY `idx_inv_product_id`  (`product_id`),
  KEY `idx_inv_location_id` (`location_id`),
  CONSTRAINT `fk_inv_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`    (`id`),
  CONSTRAINT `fk_inv_product`   FOREIGN KEY (`product_id`)   REFERENCES `products`      (`id`),
  CONSTRAINT `fk_inv_batch`     FOREIGN KEY (`batch_id`)     REFERENCES `inventory_batches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `inventory_transactions` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`             CHAR(36)        NOT NULL,
  `company_id`       BIGINT UNSIGNED NOT NULL,
  `warehouse_id`     BIGINT UNSIGNED NOT NULL,
  `product_id`       BIGINT UNSIGNED NOT NULL,
  `variant_id`       BIGINT UNSIGNED DEFAULT NULL,
  `batch_id`         BIGINT UNSIGNED DEFAULT NULL,
  `transaction_type` ENUM('purchase_receipt','production_input','production_output','transfer_out','transfer_in','adjustment','return','damage','count') NOT NULL,
  `reference_type`   VARCHAR(100)    DEFAULT NULL COMMENT 'purchase_orders, production_orders, etc.',
  `reference_id`     BIGINT UNSIGNED DEFAULT NULL,
  `quantity`         DECIMAL(15,4)   NOT NULL COMMENT 'Positive=in, Negative=out',
  `unit_id`          BIGINT UNSIGNED NOT NULL,
  `unit_cost`        DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `currency_code`    CHAR(3)         NOT NULL DEFAULT 'BDT',
  `notes`            TEXT            DEFAULT NULL,
  `created_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`       BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_it_uuid`                  (`uuid`),
  KEY `idx_it_company_id`                  (`company_id`),
  KEY `idx_it_warehouse_product`           (`warehouse_id`, `product_id`),
  KEY `idx_it_transaction_type`            (`transaction_type`),
  KEY `idx_it_reference`                   (`reference_type`, `reference_id`),
  KEY `idx_it_created_at`                  (`created_at`),
  CONSTRAINT `fk_it_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_it_product`   FOREIGN KEY (`product_id`)   REFERENCES `products`   (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  PARTITION BY RANGE (YEAR(`created_at`)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
  );

-- -----------------------------------------------

CREATE TABLE `stock_adjustments` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`           CHAR(36)        NOT NULL,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `warehouse_id`   BIGINT UNSIGNED NOT NULL,
  `adj_number`     VARCHAR(50)     NOT NULL,
  `type`           ENUM('addition','reduction','damage','count','write_off') NOT NULL,
  `reason`         TEXT            NOT NULL,
  `status`         ENUM('draft','approved','posted') NOT NULL DEFAULT 'draft',
  `approved_by`    BIGINT UNSIGNED DEFAULT NULL,
  `approved_at`    DATETIME        DEFAULT NULL,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`     BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sa_company_number` (`company_id`, `adj_number`),
  KEY `idx_sa_warehouse_id`         (`warehouse_id`),
  KEY `idx_sa_status`               (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `stock_adjustment_items` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `adjustment_id`   BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `variant_id`      BIGINT UNSIGNED DEFAULT NULL,
  `batch_id`        BIGINT UNSIGNED DEFAULT NULL,
  `quantity`        DECIMAL(15,4)   NOT NULL,
  `unit_id`         BIGINT UNSIGNED NOT NULL,
  `reason_notes`    TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sai_adjustment_id` (`adjustment_id`),
  KEY `idx_sai_product_id`    (`product_id`),
  CONSTRAINT `fk_sai_adjustment` FOREIGN KEY (`adjustment_id`) REFERENCES `stock_adjustments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sai_product`    FOREIGN KEY (`product_id`)    REFERENCES `products`           (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `warehouse_transfers` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`                CHAR(36)        NOT NULL,
  `company_id`          BIGINT UNSIGNED NOT NULL,
  `from_warehouse_id`   BIGINT UNSIGNED NOT NULL,
  `to_warehouse_id`     BIGINT UNSIGNED NOT NULL,
  `transfer_number`     VARCHAR(50)     NOT NULL,
  `transfer_date`       DATE            NOT NULL,
  `status`              ENUM('draft','in_transit','received','cancelled') NOT NULL DEFAULT 'draft',
  `notes`               TEXT            DEFAULT NULL,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`          BIGINT UNSIGNED NOT NULL,
  `approved_by`         BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wt_company_number` (`company_id`, `transfer_number`),
  KEY `idx_wt_from_warehouse`       (`from_warehouse_id`),
  KEY `idx_wt_to_warehouse`         (`to_warehouse_id`),
  KEY `idx_wt_status`               (`status`),
  CONSTRAINT `fk_wt_from` FOREIGN KEY (`from_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_wt_to`   FOREIGN KEY (`to_warehouse_id`)   REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `warehouse_transfer_items` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transfer_id`  BIGINT UNSIGNED NOT NULL,
  `product_id`   BIGINT UNSIGNED NOT NULL,
  `variant_id`   BIGINT UNSIGNED DEFAULT NULL,
  `batch_id`     BIGINT UNSIGNED DEFAULT NULL,
  `quantity`     DECIMAL(15,4)   NOT NULL,
  `unit_id`      BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_wti_transfer_id` (`transfer_id`),
  KEY `idx_wti_product_id`  (`product_id`),
  CONSTRAINT `fk_wti_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `warehouse_transfers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wti_product`  FOREIGN KEY (`product_id`)  REFERENCES `products`            (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 8 — PRODUCTION MANAGEMENT
-- ============================================================

CREATE TABLE `bill_of_materials` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`             CHAR(36)        NOT NULL,
  `company_id`       BIGINT UNSIGNED NOT NULL,
  `product_id`       BIGINT UNSIGNED NOT NULL COMMENT 'Finished product',
  `variant_id`       BIGINT UNSIGNED DEFAULT NULL,
  `bom_code`         VARCHAR(50)     NOT NULL,
  `name`             VARCHAR(255)    NOT NULL,
  `version`          VARCHAR(20)     NOT NULL DEFAULT '1.0',
  `yield_quantity`   DECIMAL(15,4)   NOT NULL DEFAULT 1.0000,
  `yield_unit_id`    BIGINT UNSIGNED NOT NULL,
  `is_active`        TINYINT(1)      NOT NULL DEFAULT 1,
  `effective_from`   DATE            NOT NULL,
  `effective_to`     DATE            DEFAULT NULL,
  `notes`            TEXT            DEFAULT NULL,
  `created_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`       BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_bom_uuid`             (`uuid`),
  UNIQUE KEY `uq_bom_company_code_ver` (`company_id`, `bom_code`, `version`),
  KEY `idx_bom_product_id`             (`product_id`),
  CONSTRAINT `fk_bom_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `bom_items` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bom_id`          BIGINT UNSIGNED NOT NULL,
  `component_id`    BIGINT UNSIGNED NOT NULL COMMENT 'Raw material / accessory product',
  `variant_id`      BIGINT UNSIGNED DEFAULT NULL,
  `quantity`        DECIMAL(15,4)   NOT NULL,
  `unit_id`         BIGINT UNSIGNED NOT NULL,
  `waste_pct`       DECIMAL(5,2)    NOT NULL DEFAULT 0.00 COMMENT 'Expected waste percentage',
  `is_optional`     TINYINT(1)      NOT NULL DEFAULT 0,
  `notes`           TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_bi_bom_component` (`bom_id`, `component_id`, `variant_id`),
  KEY `idx_bi_component_id`        (`component_id`),
  CONSTRAINT `fk_bi_bom`       FOREIGN KEY (`bom_id`)       REFERENCES `bill_of_materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bi_component` FOREIGN KEY (`component_id`) REFERENCES `products`          (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `production_stages` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`    BIGINT UNSIGNED NOT NULL,
  `factory_id`    BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(255)    NOT NULL,
  `code`          VARCHAR(50)     NOT NULL,
  `sequence`      SMALLINT        NOT NULL DEFAULT 0,
  `description`   TEXT            DEFAULT NULL,
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ps_factory_code` (`factory_id`, `code`),
  KEY `idx_ps_company_id`         (`company_id`),
  CONSTRAINT `fk_ps_factory` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `production_orders` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`                CHAR(36)        NOT NULL,
  `company_id`          BIGINT UNSIGNED NOT NULL,
  `factory_id`          BIGINT UNSIGNED NOT NULL,
  `bom_id`              BIGINT UNSIGNED NOT NULL,
  `production_line_id`  BIGINT UNSIGNED DEFAULT NULL,
  `po_number`           VARCHAR(50)     NOT NULL COMMENT 'Production order number',
  `planned_qty`         DECIMAL(15,4)   NOT NULL,
  `produced_qty`        DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `lost_qty`            DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `unit_id`             BIGINT UNSIGNED NOT NULL,
  `planned_start`       DATE            NOT NULL,
  `planned_end`         DATE            NOT NULL,
  `actual_start`        DATETIME        DEFAULT NULL,
  `actual_end`          DATETIME        DEFAULT NULL,
  `status`              ENUM('draft','scheduled','in_progress','paused','completed','cancelled') NOT NULL DEFAULT 'draft',
  `priority`            ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `notes`               TEXT            DEFAULT NULL,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`          DATETIME        DEFAULT NULL,
  `created_by`          BIGINT UNSIGNED NOT NULL,
  `updated_by`          BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_prod_uuid`           (`uuid`),
  UNIQUE KEY `uq_prod_company_number` (`company_id`, `po_number`),
  KEY `idx_prodo_factory_id`          (`factory_id`),
  KEY `idx_prodo_bom_id`              (`bom_id`),
  KEY `idx_prodo_status`              (`status`),
  KEY `idx_prodo_planned_start`       (`planned_start`),
  CONSTRAINT `fk_prodo_company`  FOREIGN KEY (`company_id`)         REFERENCES `companies`     (`id`),
  CONSTRAINT `fk_prodo_factory`  FOREIGN KEY (`factory_id`)         REFERENCES `factories`     (`id`),
  CONSTRAINT `fk_prodo_bom`      FOREIGN KEY (`bom_id`)             REFERENCES `bill_of_materials` (`id`),
  CONSTRAINT `fk_prodo_pl`       FOREIGN KEY (`production_line_id`) REFERENCES `production_lines`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `production_order_items` (
  `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `production_order_id` BIGINT UNSIGNED NOT NULL,
  `bom_item_id`        BIGINT UNSIGNED NOT NULL,
  `product_id`         BIGINT UNSIGNED NOT NULL,
  `required_qty`       DECIMAL(15,4)   NOT NULL,
  `issued_qty`         DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `returned_qty`       DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `unit_id`            BIGINT UNSIGNED NOT NULL,
  `warehouse_id`       BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_proi_production_order_id` (`production_order_id`),
  KEY `idx_proi_product_id`          (`product_id`),
  CONSTRAINT `fk_proi_prod_order` FOREIGN KEY (`production_order_id`) REFERENCES `production_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_proi_bom_item`   FOREIGN KEY (`bom_item_id`)         REFERENCES `bom_items`         (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `work_orders` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`                CHAR(36)        NOT NULL,
  `production_order_id` BIGINT UNSIGNED NOT NULL,
  `stage_id`            BIGINT UNSIGNED NOT NULL,
  `production_line_id`  BIGINT UNSIGNED DEFAULT NULL,
  `wo_number`           VARCHAR(50)     NOT NULL,
  `planned_qty`         DECIMAL(15,4)   NOT NULL,
  `completed_qty`       DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `start_time`          DATETIME        DEFAULT NULL,
  `end_time`            DATETIME        DEFAULT NULL,
  `status`              ENUM('pending','in_progress','completed','paused') NOT NULL DEFAULT 'pending',
  `notes`               TEXT            DEFAULT NULL,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`          BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wo_uuid`   (`uuid`),
  KEY `idx_wo_prod_order`   (`production_order_id`),
  KEY `idx_wo_stage_id`     (`stage_id`),
  KEY `idx_wo_status`       (`status`),
  CONSTRAINT `fk_wo_prod_order` FOREIGN KEY (`production_order_id`) REFERENCES `production_orders` (`id`),
  CONSTRAINT `fk_wo_stage`      FOREIGN KEY (`stage_id`)            REFERENCES `production_stages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `production_outputs` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `production_order_id` BIGINT UNSIGNED NOT NULL,
  `work_order_id`       BIGINT UNSIGNED DEFAULT NULL,
  `product_id`          BIGINT UNSIGNED NOT NULL,
  `variant_id`          BIGINT UNSIGNED DEFAULT NULL,
  `warehouse_id`        BIGINT UNSIGNED NOT NULL,
  `quantity`            DECIMAL(15,4)   NOT NULL,
  `unit_id`             BIGINT UNSIGNED NOT NULL,
  `output_date`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `batch_number`        VARCHAR(100)    DEFAULT NULL,
  `quality_status`      ENUM('pass','fail','rework') NOT NULL DEFAULT 'pass',
  `notes`               TEXT            DEFAULT NULL,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`          BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_po_production_order_id` (`production_order_id`),
  KEY `idx_po_product_id`          (`product_id`),
  KEY `idx_po_output_date`         (`output_date`),
  CONSTRAINT `fk_prodout_prod_order` FOREIGN KEY (`production_order_id`) REFERENCES `production_orders` (`id`),
  CONSTRAINT `fk_prodout_product`    FOREIGN KEY (`product_id`)           REFERENCES `products`          (`id`),
  CONSTRAINT `fk_prodout_warehouse`  FOREIGN KEY (`warehouse_id`)         REFERENCES `warehouses`        (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `production_losses` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `production_order_id` BIGINT UNSIGNED NOT NULL,
  `product_id`          BIGINT UNSIGNED NOT NULL,
  `quantity`            DECIMAL(15,4)   NOT NULL,
  `unit_id`             BIGINT UNSIGNED NOT NULL,
  `loss_type`           ENUM('defect','wastage','damage','machine_fault','human_error') NOT NULL,
  `stage_id`            BIGINT UNSIGNED DEFAULT NULL,
  `reason`              TEXT            DEFAULT NULL,
  `loss_date`           DATE            NOT NULL,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`          BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pl_production_order_id` (`production_order_id`),
  KEY `idx_pl_loss_date`           (`loss_date`),
  CONSTRAINT `fk_prodloss_prod_order` FOREIGN KEY (`production_order_id`) REFERENCES `production_orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `line_assignments` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `production_order_id` BIGINT UNSIGNED NOT NULL,
  `production_line_id`  BIGINT UNSIGNED NOT NULL,
  `machinery_id`        BIGINT UNSIGNED DEFAULT NULL,
  `operator_id`         BIGINT UNSIGNED DEFAULT NULL COMMENT 'User / worker assigned',
  `assigned_at`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `released_at`         DATETIME        DEFAULT NULL,
  `notes`               TEXT            DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_la_prod_order`  (`production_order_id`),
  KEY `idx_la_prod_line`   (`production_line_id`),
  KEY `idx_la_machinery`   (`machinery_id`),
  CONSTRAINT `fk_la_prod_order`  FOREIGN KEY (`production_order_id`) REFERENCES `production_orders` (`id`),
  CONSTRAINT `fk_la_prod_line`   FOREIGN KEY (`production_line_id`)  REFERENCES `production_lines`  (`id`),
  CONSTRAINT `fk_la_machinery`   FOREIGN KEY (`machinery_id`)        REFERENCES `machineries`       (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 9 — PRICING & FINANCIAL STRUCTURES
-- ============================================================

CREATE TABLE `tax_rules` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `name`            VARCHAR(150)    NOT NULL,
  `code`            VARCHAR(50)     NOT NULL,
  `type`            ENUM('VAT','GST','import_duty','withholding','custom') NOT NULL DEFAULT 'VAT',
  `rate_pct`        DECIMAL(8,4)    NOT NULL,
  `country_code`    CHAR(2)         DEFAULT NULL,
  `applies_to`      ENUM('products','services','both') NOT NULL DEFAULT 'both',
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `effective_from`  DATE            NOT NULL,
  `effective_to`    DATE            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tr_company_code` (`company_id`, `code`),
  CONSTRAINT `fk_tr_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `pricing_rules` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `name`           VARCHAR(255)    NOT NULL,
  `rule_type`      ENUM('discount_pct','fixed_amount','price_override','markup_pct') NOT NULL,
  `applies_to`     ENUM('product','category','brand','supplier','all') NOT NULL DEFAULT 'all',
  `applies_to_id`  BIGINT UNSIGNED DEFAULT NULL,
  `currency_code`  CHAR(3)         NOT NULL DEFAULT 'BDT',
  `value`          DECIMAL(15,4)   NOT NULL,
  `min_qty`        DECIMAL(15,4)   NOT NULL DEFAULT 1.0000,
  `effective_from` DATE            NOT NULL,
  `effective_to`   DATE            DEFAULT NULL,
  `is_active`      TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_prule_company_id`   (`company_id`),
  KEY `idx_prule_applies_to`   (`applies_to`, `applies_to_id`),
  CONSTRAINT `fk_prule_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `discounts` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `code`           VARCHAR(100)    NOT NULL,
  `name`           VARCHAR(255)    NOT NULL,
  `type`           ENUM('percentage','fixed') NOT NULL DEFAULT 'percentage',
  `value`          DECIMAL(15,4)   NOT NULL,
  `max_uses`       INT UNSIGNED    DEFAULT NULL,
  `used_count`     INT UNSIGNED    NOT NULL DEFAULT 0,
  `min_order_value` DECIMAL(15,4)  DEFAULT NULL,
  `effective_from` DATE            NOT NULL,
  `effective_to`   DATE            DEFAULT NULL,
  `is_active`      TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_disc_company_code` (`company_id`, `code`),
  CONSTRAINT `fk_disc_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `costing` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `reference_type`  ENUM('production_order','purchase_order','machinery') NOT NULL,
  `reference_id`    BIGINT UNSIGNED NOT NULL,
  `cost_type`       ENUM('material','labour','overhead','depreciation','transport','custom') NOT NULL,
  `description`     VARCHAR(255)    NOT NULL,
  `amount`          DECIMAL(15,4)   NOT NULL,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `exchange_rate`   DECIMAL(20,8)   NOT NULL DEFAULT 1.00000000,
  `amount_base`     DECIMAL(15,4)   NOT NULL COMMENT 'Amount in base currency',
  `costed_at`       DATE            NOT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cost_reference` (`reference_type`, `reference_id`),
  KEY `idx_cost_company_id` (`company_id`),
  KEY `idx_cost_costed_at`  (`costed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `landed_costs` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `po_id`          BIGINT UNSIGNED NOT NULL,
  `cost_type`      ENUM('freight','insurance','import_duty','customs_clearance','port_handling','other') NOT NULL,
  `description`    VARCHAR(255)    DEFAULT NULL,
  `amount`         DECIMAL(15,4)   NOT NULL,
  `currency_code`  CHAR(3)         NOT NULL DEFAULT 'USD',
  `exchange_rate`  DECIMAL(20,8)   NOT NULL DEFAULT 1.00000000,
  `amount_base`    DECIMAL(15,4)   NOT NULL,
  `allocation_method` ENUM('by_value','by_weight','by_quantity','manual') NOT NULL DEFAULT 'by_value',
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`     BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_lc_po_id`      (`po_id`),
  KEY `idx_lc_company_id` (`company_id`),
  CONSTRAINT `fk_lc_po`      FOREIGN KEY (`po_id`)      REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `fk_lc_company` FOREIGN KEY (`company_id`) REFERENCES `companies`       (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 10 — MAINTENANCE & ENGINEERING
-- ============================================================

CREATE TABLE `maintenance_schedules` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`       BIGINT UNSIGNED NOT NULL,
  `machinery_id`     BIGINT UNSIGNED NOT NULL,
  `name`             VARCHAR(255)    NOT NULL,
  `type`             ENUM('preventive','inspection','calibration') NOT NULL DEFAULT 'preventive',
  `frequency_type`   ENUM('days','weeks','months','hours_run') NOT NULL DEFAULT 'months',
  `frequency_value`  SMALLINT        NOT NULL DEFAULT 1,
  `last_performed_at` DATE           DEFAULT NULL,
  `next_due_at`      DATE            NOT NULL,
  `estimated_hours`  DECIMAL(6,2)    DEFAULT NULL,
  `is_active`        TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`       BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ms_machinery_id` (`machinery_id`),
  KEY `idx_ms_next_due_at`  (`next_due_at`),
  CONSTRAINT `fk_ms_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `maintenance_engineers` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`  BIGINT UNSIGNED NOT NULL,
  `user_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT 'Link to system user if available',
  `name`        VARCHAR(255)    NOT NULL,
  `employee_id` VARCHAR(50)     DEFAULT NULL,
  `specialization` VARCHAR(255) DEFAULT NULL,
  `phone`       VARCHAR(30)     DEFAULT NULL,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_me_company_id` (`company_id`),
  KEY `idx_me_user_id`    (`user_id`),
  CONSTRAINT `fk_me_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `maintenance_requests` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`           CHAR(36)        NOT NULL,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `machinery_id`   BIGINT UNSIGNED NOT NULL,
  `request_number` VARCHAR(50)     NOT NULL,
  `type`           ENUM('preventive','corrective','emergency') NOT NULL DEFAULT 'corrective',
  `priority`       ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `reported_by`    BIGINT UNSIGNED NOT NULL,
  `description`    TEXT            NOT NULL,
  `status`         ENUM('open','assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'open',
  `downtime_start` DATETIME        DEFAULT NULL,
  `downtime_end`   DATETIME        DEFAULT NULL,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`     BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mr_company_number`   (`company_id`, `request_number`),
  KEY `idx_mr_machinery_id`           (`machinery_id`),
  KEY `idx_mr_status`                 (`status`),
  KEY `idx_mr_priority`               (`priority`),
  CONSTRAINT `fk_mr_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `maintenance_tasks` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `request_id`      BIGINT UNSIGNED NOT NULL,
  `schedule_id`     BIGINT UNSIGNED DEFAULT NULL,
  `engineer_id`     BIGINT UNSIGNED NOT NULL,
  `task_description` TEXT           NOT NULL,
  `scheduled_date`  DATE            NOT NULL,
  `completed_at`    DATETIME        DEFAULT NULL,
  `labour_hours`    DECIMAL(6,2)    DEFAULT 0.00,
  `labour_cost`     DECIMAL(15,4)   DEFAULT 0.0000,
  `parts_cost`      DECIMAL(15,4)   DEFAULT 0.0000,
  `total_cost`      DECIMAL(15,4)   DEFAULT 0.0000,
  `currency_code`   CHAR(3)         NOT NULL DEFAULT 'BDT',
  `status`          ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `notes`           TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by`      BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mt_request_id`  (`request_id`),
  KEY `idx_mt_engineer_id` (`engineer_id`),
  KEY `idx_mt_status`      (`status`),
  CONSTRAINT `fk_mt_request`  FOREIGN KEY (`request_id`)  REFERENCES `maintenance_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mt_engineer` FOREIGN KEY (`engineer_id`) REFERENCES `maintenance_engineers`(`id`),
  CONSTRAINT `fk_mt_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `maintenance_schedules`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `spare_parts_usage` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id`      BIGINT UNSIGNED NOT NULL,
  `product_id`   BIGINT UNSIGNED NOT NULL COMMENT 'Spare part product from inventory',
  `quantity`     DECIMAL(10,4)   NOT NULL,
  `unit_id`      BIGINT UNSIGNED NOT NULL,
  `unit_cost`    DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `total_cost`   DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `warehouse_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'Sourced from which warehouse',
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by`   BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_spu_task_id`    (`task_id`),
  KEY `idx_spu_product_id` (`product_id`),
  CONSTRAINT `fk_spu_task`    FOREIGN KEY (`task_id`)    REFERENCES `maintenance_tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_spu_product` FOREIGN KEY (`product_id`) REFERENCES `products`          (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MODULE 11 — REPORTING & ANALYTICS (Materialized/Summary)
-- ============================================================

CREATE TABLE `report_inventory_snapshots` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `snapshot_date`  DATE            NOT NULL,
  `company_id`     BIGINT UNSIGNED NOT NULL,
  `warehouse_id`   BIGINT UNSIGNED NOT NULL,
  `product_id`     BIGINT UNSIGNED NOT NULL,
  `quantity`       DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `unit_cost`      DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `total_value`    DECIMAL(18,4)   NOT NULL DEFAULT 0.0000,
  `currency_code`  CHAR(3)         NOT NULL DEFAULT 'BDT',
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ris_date_wh_prod` (`snapshot_date`, `warehouse_id`, `product_id`),
  KEY `idx_ris_company_date`       (`company_id`, `snapshot_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  PARTITION BY RANGE (YEAR(`snapshot_date`)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
  );

-- -----------------------------------------------

CREATE TABLE `report_production_daily` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `report_date`         DATE            NOT NULL,
  `company_id`          BIGINT UNSIGNED NOT NULL,
  `factory_id`          BIGINT UNSIGNED NOT NULL,
  `production_line_id`  BIGINT UNSIGNED DEFAULT NULL,
  `product_id`          BIGINT UNSIGNED NOT NULL,
  `planned_qty`         DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `produced_qty`        DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `lost_qty`            DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `efficiency_pct`      DECIMAL(5,2)    GENERATED ALWAYS AS (
                          IF(`planned_qty` > 0, ROUND((`produced_qty` / `planned_qty`) * 100, 2), 0)
                        ) STORED,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rpd_date_factory_line_prod` (`report_date`, `factory_id`, `production_line_id`, `product_id`),
  KEY `idx_rpd_company_date`                 (`company_id`, `report_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `report_machinery_utilization` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `report_date`    DATE            NOT NULL,
  `machinery_id`   BIGINT UNSIGNED NOT NULL,
  `factory_id`     BIGINT UNSIGNED NOT NULL,
  `hours_available` DECIMAL(6,2)   NOT NULL DEFAULT 0.00,
  `hours_running`  DECIMAL(6,2)    NOT NULL DEFAULT 0.00,
  `hours_downtime` DECIMAL(6,2)    NOT NULL DEFAULT 0.00,
  `utilization_pct` DECIMAL(5,2)   GENERATED ALWAYS AS (
                      IF(`hours_available` > 0, ROUND((`hours_running` / `hours_available`) * 100, 2), 0)
                    ) STORED,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rmu_date_machine` (`report_date`, `machinery_id`),
  KEY `idx_rmu_factory_date`       (`factory_id`, `report_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------

CREATE TABLE `report_purchase_analytics` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `report_month`    DATE            NOT NULL COMMENT 'First day of month',
  `company_id`      BIGINT UNSIGNED NOT NULL,
  `supplier_id`     BIGINT UNSIGNED NOT NULL,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `total_orders`    INT UNSIGNED    NOT NULL DEFAULT 0,
  `total_quantity`  DECIMAL(15,4)   NOT NULL DEFAULT 0.0000,
  `total_value_bdt` DECIMAL(18,4)   NOT NULL DEFAULT 0.0000,
  `avg_lead_days`   DECIMAL(6,2)    DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rpa_month_supplier_prod` (`report_month`, `company_id`, `supplier_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DEFERRED FOREIGN KEY CONSTRAINTS
-- (Added after all tables exist)
-- ============================================================

ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_ur_factory` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`id`);

ALTER TABLE `factories`
  ADD CONSTRAINT `fk_factories_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `product_pricing`
  ADD CONSTRAINT `fk_pp_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

ALTER TABLE `machinery_pricing`
  ADD CONSTRAINT `fk_mpricing_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

ALTER TABLE `machinery_pricing`
  ADD CONSTRAINT `fk_mpricing_model` FOREIGN KEY (`model_id`) REFERENCES `machinery_models` (`id`);

ALTER TABLE `machineries`
  ADD CONSTRAINT `fk_mach_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

ALTER TABLE `machineries`
  ADD CONSTRAINT `fk_mach_department` FOREIGN KEY (`department_id`) REFERENCES `factory_departments` (`id`);

ALTER TABLE `machineries`
  ADD CONSTRAINT `fk_mach_prod_line` FOREIGN KEY (`production_line_id`) REFERENCES `production_lines` (`id`);

ALTER TABLE `goods_receipt_items`
  ADD CONSTRAINT `fk_gri_batch` FOREIGN KEY (`batch_id`) REFERENCES `inventory_batches` (`id`);

ALTER TABLE `goods_receipt_items`
  ADD CONSTRAINT `fk_gri_location` FOREIGN KEY (`location_id`) REFERENCES `warehouse_locations` (`id`);

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

CREATE OR REPLACE VIEW `v_inventory_available` AS
SELECT
  i.id,
  i.company_id,
  w.name          AS warehouse_name,
  p.sku,
  COALESCE(pt.name, p.name) AS product_name,
  i.quantity_on_hand,
  i.quantity_reserved,
  i.quantity_available,
  i.average_cost,
  (i.quantity_available * i.average_cost) AS total_value,
  i.currency_code,
  i.updated_at
FROM inventories i
JOIN warehouses  w  ON w.id = i.warehouse_id
JOIN products    p  ON p.id = i.product_id
LEFT JOIN product_translations pt ON pt.product_id = p.id AND pt.locale = 'en'
WHERE p.deleted_at IS NULL;

-- -----------------------------------------------

CREATE OR REPLACE VIEW `v_production_order_summary` AS
SELECT
  po.id,
  po.company_id,
  po.po_number,
  f.name          AS factory_name,
  COALESCE(pt.name, p.name) AS product_name,
  po.planned_qty,
  po.produced_qty,
  po.lost_qty,
  ROUND((po.produced_qty / NULLIF(po.planned_qty, 0)) * 100, 2) AS efficiency_pct,
  po.status,
  po.planned_start,
  po.planned_end,
  po.actual_start,
  po.actual_end
FROM production_orders po
JOIN bill_of_materials bom ON bom.id  = po.bom_id
JOIN products          p   ON p.id    = bom.product_id
JOIN factories         f   ON f.id    = po.factory_id
LEFT JOIN product_translations pt ON pt.product_id = p.id AND pt.locale = 'en'
WHERE po.deleted_at IS NULL;

-- -----------------------------------------------

CREATE OR REPLACE VIEW `v_machinery_status` AS
SELECT
  m.id,
  m.company_id,
  m.asset_code,
  m.serial_number,
  COALESCE(mt.name, m.name) AS machinery_name,
  mc.name                   AS category_name,
  mb.name                   AS brand_name,
  f.name                    AS factory_name,
  m.status,
  m.next_service_date,
  DATEDIFF(m.next_service_date, CURDATE()) AS days_until_service,
  m.warranty_expires_at,
  DATEDIFF(m.warranty_expires_at, CURDATE()) AS warranty_days_remaining
FROM machineries m
JOIN machinery_categories mc ON mc.id = m.category_id
JOIN machinery_brands     mb ON mb.id = m.brand_id
JOIN factories            f  ON f.id  = m.factory_id
LEFT JOIN machinery_translations mt ON mt.machinery_id = m.id AND mt.locale = 'en'
WHERE m.deleted_at IS NULL;

-- -----------------------------------------------

CREATE OR REPLACE VIEW `v_supplier_invoice_aging` AS
SELECT
  si.id,
  si.company_id,
  s.name              AS supplier_name,
  si.invoice_number,
  si.invoice_date,
  si.due_date,
  si.total_amount,
  si.paid_amount,
  (si.total_amount - si.paid_amount) AS outstanding_amount,
  si.currency_code,
  DATEDIFF(CURDATE(), si.due_date) AS days_overdue,
  si.status
FROM supplier_invoices si
JOIN suppliers s ON s.id = si.supplier_id
WHERE si.status NOT IN ('paid')
ORDER BY si.due_date ASC;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- END OF SCHEMA
-- Total tables: ~80 | Views: 4 | Partitioned: 3
-- Version: 1.0.0 | Engine: InnoDB | Charset: utf8mb4_unicode_ci
-- ============================================================
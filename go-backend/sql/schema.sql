-- =============================================================
-- Volt Wave Tech – Full MySQL 8+ Schema
-- Single-brand E-commerce + CMS Platform
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS voltwavetech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE voltwavetech;

-- =============================================================
-- ADMIN / AUTH
-- =============================================================

CREATE TABLE roles (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME     NULL
) ENGINE=InnoDB;

CREATE TABLE permissions (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    slug        VARCHAR(150) NOT NULL UNIQUE,
    module      VARCHAR(100) NOT NULL COMMENT 'e.g. products, orders, cms',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE role_permission_map (
    role_id       BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rpm_role       FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    CONSTRAINT fk_rpm_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE users (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id      BIGINT UNSIGNED NOT NULL,
    name         VARCHAR(200)    NOT NULL,
    email        VARCHAR(255)    NOT NULL UNIQUE,
    password     VARCHAR(255)    NOT NULL,
    type         ENUM('admin','customer') NOT NULL DEFAULT 'customer',
    is_active    TINYINT(1)      NOT NULL DEFAULT 1,
    last_login   DATETIME        NULL,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME        NULL,
    CONSTRAINT fk_admin_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE INDEX idx_admin_users_email   ON admin_users(email);
CREATE INDEX idx_admin_users_role    ON admin_users(role_id);

-- =============================================================
-- CUSTOMERS
-- =============================================================

CREATE TABLE customers (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(200)  NOT NULL,
    email        VARCHAR(255)  NOT NULL UNIQUE,
    phone        VARCHAR(30)   NULL,
    password     VARCHAR(255)  NOT NULL,
    is_active    TINYINT(1)    NOT NULL DEFAULT 1,
    email_verified_at DATETIME NULL,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME      NULL
) ENGINE=InnoDB;

CREATE TABLE customer_addresses (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id   BIGINT UNSIGNED NOT NULL,
    label         VARCHAR(50)     NULL COMMENT 'Home, Office, etc.',
    recipient_name VARCHAR(200)   NOT NULL,
    phone         VARCHAR(30)     NOT NULL,
    address_line1 VARCHAR(255)    NOT NULL,
    address_line2 VARCHAR(255)    NULL,
    city          VARCHAR(100)    NOT NULL,
    district      VARCHAR(100)    NULL,
    postal_code   VARCHAR(20)     NULL,
    country       CHAR(2)         NOT NULL DEFAULT 'BD',
    is_default    TINYINT(1)      NOT NULL DEFAULT 0,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_addr_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_cust_addr_customer ON customer_addresses(customer_id);

-- =============================================================
-- PRODUCT CATEGORIES
-- =============================================================

CREATE TABLE product_categories (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id   BIGINT UNSIGNED NULL,
    name_bn     VARCHAR(200) NOT NULL,
    name_en     VARCHAR(200) NOT NULL,
    slug        VARCHAR(220) NOT NULL UNIQUE,
    description_bn TEXT      NULL,
    description_en TEXT      NULL,
    image_url   VARCHAR(500) NULL,
    sort_order  INT          NOT NULL DEFAULT 0,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    created_by  BIGINT UNSIGNED NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME     NULL,
    CONSTRAINT fk_cat_parent  FOREIGN KEY (parent_id)  REFERENCES product_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_cat_creator FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_cat_parent ON product_categories(parent_id);
CREATE INDEX idx_cat_slug   ON product_categories(slug);

-- =============================================================
-- ATTRIBUTE SYSTEM (EAV-lite, relational)
-- =============================================================

CREATE TABLE attribute_groups (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_bn    VARCHAR(150) NOT NULL,
    name_en    VARCHAR(150) NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE attributes (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id         BIGINT UNSIGNED NULL,
    name_bn          VARCHAR(150) NOT NULL,
    name_en          VARCHAR(150) NOT NULL,
    slug             VARCHAR(160) NOT NULL UNIQUE,
    input_type       ENUM('text','select','multiselect','boolean','number') NOT NULL DEFAULT 'select',
    unit             VARCHAR(30)  NULL COMMENT 'e.g. V, HP, mm',
    is_variant_attr  TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'Used in variant generation',
    sort_order       INT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_attr_group FOREIGN KEY (group_id) REFERENCES attribute_groups(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE attribute_options (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attribute_id BIGINT UNSIGNED NOT NULL,
    value_bn     VARCHAR(200) NOT NULL,
    value_en     VARCHAR(200) NOT NULL,
    sort_order   INT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_attropt_attr FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_attropt_attr ON attribute_options(attribute_id);

-- =============================================================
-- PRODUCTS
-- =============================================================

CREATE TABLE products (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id     BIGINT UNSIGNED NOT NULL,
    product_type    ENUM('accessory','machinery','garment','other') NOT NULL DEFAULT 'accessory',
    sku_prefix      VARCHAR(50)     NULL COMMENT 'Optional prefix for variant SKUs',
    name_bn         VARCHAR(300)    NOT NULL,
    name_en         VARCHAR(300)    NOT NULL,
    slug            VARCHAR(320)    NOT NULL UNIQUE,
    short_desc_bn   TEXT            NULL,
    short_desc_en   TEXT            NULL,
    description_bn  LONGTEXT        NULL,
    description_en  LONGTEXT        NULL,
    brand           VARCHAR(150)    NULL,
    model_number    VARCHAR(150)    NULL COMMENT 'Primarily for machinery',
    manufacturer    VARCHAR(200)    NULL,
    is_featured     TINYINT(1)      NOT NULL DEFAULT 0,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    meta_title_bn   VARCHAR(255)    NULL,
    meta_title_en   VARCHAR(255)    NULL,
    meta_desc_bn    TEXT            NULL,
    meta_desc_en    TEXT            NULL,
    created_by      BIGINT UNSIGNED NULL,
    updated_by      BIGINT UNSIGNED NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME        NULL,
    CONSTRAINT fk_prod_category FOREIGN KEY (category_id) REFERENCES product_categories(id),
    CONSTRAINT fk_prod_creator  FOREIGN KEY (created_by)  REFERENCES admin_users(id) ON DELETE SET NULL,
    CONSTRAINT fk_prod_updater  FOREIGN KEY (updated_by)  REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_prod_category  ON products(category_id);
CREATE INDEX idx_prod_type      ON products(product_type);
CREATE INDEX idx_prod_slug      ON products(slug);
CREATE INDEX idx_prod_featured  ON products(is_featured, is_active);
CREATE FULLTEXT INDEX ft_prod_name ON products(name_bn, name_en);

-- Product static attribute values (non-variant, informational)
CREATE TABLE product_attribute_values (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id   BIGINT UNSIGNED NOT NULL,
    attribute_id BIGINT UNSIGNED NOT NULL,
    option_id    BIGINT UNSIGNED NULL COMMENT 'If select type',
    value_custom VARCHAR(500)    NULL COMMENT 'If text/number type',
    UNIQUE KEY uq_prod_attr (product_id, attribute_id),
    CONSTRAINT fk_pav_product   FOREIGN KEY (product_id)   REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_pav_attribute FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE,
    CONSTRAINT fk_pav_option    FOREIGN KEY (option_id)    REFERENCES attribute_options(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_pav_product ON product_attribute_values(product_id);

-- Accessories ↔ Machine compatibility
CREATE TABLE product_compatibility (
    product_id    BIGINT UNSIGNED NOT NULL COMMENT 'Accessory product',
    compatible_id BIGINT UNSIGNED NOT NULL COMMENT 'Machine/parent product',
    PRIMARY KEY (product_id, compatible_id),
    CONSTRAINT fk_compat_product FOREIGN KEY (product_id)    REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_compat_parent  FOREIGN KEY (compatible_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
-- PRODUCT IMAGES
-- =============================================================

CREATE TABLE product_images (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    url        VARCHAR(500)    NOT NULL,
    alt_bn     VARCHAR(255)    NULL,
    alt_en     VARCHAR(255)    NULL,
    is_primary TINYINT(1)      NOT NULL DEFAULT 0,
    sort_order INT             NOT NULL DEFAULT 0,
    CONSTRAINT fk_img_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_img_product ON product_images(product_id);

-- =============================================================
-- PRODUCT VARIANTS & SKUs
-- =============================================================

CREATE TABLE product_variants (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    sku         VARCHAR(100)    NOT NULL UNIQUE,
    barcode     VARCHAR(100)    NULL,
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_variant_product ON product_variants(product_id);
CREATE INDEX idx_variant_sku     ON product_variants(sku);

CREATE TABLE product_variant_attributes (
    variant_id   BIGINT UNSIGNED NOT NULL,
    attribute_id BIGINT UNSIGNED NOT NULL,
    option_id    BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (variant_id, attribute_id),
    CONSTRAINT fk_va_variant   FOREIGN KEY (variant_id)   REFERENCES product_variants(id) ON DELETE CASCADE,
    CONSTRAINT fk_va_attribute FOREIGN KEY (attribute_id) REFERENCES attributes(id),
    CONSTRAINT fk_va_option    FOREIGN KEY (option_id)    REFERENCES attribute_options(id)
) ENGINE=InnoDB;

CREATE TABLE variant_images (
    variant_id BIGINT UNSIGNED NOT NULL,
    image_id   BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (variant_id, image_id),
    CONSTRAINT fk_vi_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    CONSTRAINT fk_vi_image   FOREIGN KEY (image_id)   REFERENCES product_images(id)   ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
-- PRICING
-- =============================================================

CREATE TABLE currencies (
    id       SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code     CHAR(3)      NOT NULL UNIQUE COMMENT 'ISO 4217',
    symbol   VARCHAR(10)  NOT NULL,
    name     VARCHAR(100) NOT NULL,
    rate     DECIMAL(15,6) NOT NULL DEFAULT 1.000000 COMMENT 'Rate vs base BDT',
    is_base  TINYINT(1)   NOT NULL DEFAULT 0,
    is_active TINYINT(1)  NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE product_prices (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id     BIGINT UNSIGNED  NOT NULL,
    currency_id    SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    base_price     DECIMAL(15,2)    NOT NULL,
    sale_price     DECIMAL(15,2)    NULL,
    cost_price     DECIMAL(15,2)    NULL COMMENT 'Internal reference',
    sale_starts_at DATETIME         NULL,
    sale_ends_at   DATETIME         NULL,
    is_active      TINYINT(1)       NOT NULL DEFAULT 1,
    UNIQUE KEY uq_variant_currency (variant_id, currency_id),
    CONSTRAINT fk_price_variant  FOREIGN KEY (variant_id)  REFERENCES product_variants(id) ON DELETE CASCADE,
    CONSTRAINT fk_price_currency FOREIGN KEY (currency_id) REFERENCES currencies(id)
) ENGINE=InnoDB;

CREATE INDEX idx_price_variant ON product_prices(variant_id);

CREATE TABLE price_history (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id  BIGINT UNSIGNED  NOT NULL,
    currency_id SMALLINT UNSIGNED NOT NULL,
    old_price   DECIMAL(15,2)    NOT NULL,
    new_price   DECIMAL(15,2)    NOT NULL,
    changed_by  BIGINT UNSIGNED  NULL,
    changed_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ph_variant  FOREIGN KEY (variant_id)  REFERENCES product_variants(id) ON DELETE CASCADE,
    CONSTRAINT fk_ph_currency FOREIGN KEY (currency_id) REFERENCES currencies(id),
    CONSTRAINT fk_ph_admin    FOREIGN KEY (changed_by)  REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- INVENTORY
-- =============================================================

CREATE TABLE warehouses (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    address    TEXT         NULL,
    is_default TINYINT(1)   NOT NULL DEFAULT 0,
    is_active  TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE stock (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id   BIGINT UNSIGNED NOT NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    quantity     INT             NOT NULL DEFAULT 0,
    reserved     INT             NOT NULL DEFAULT 0,
    updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_stock_variant_wh (variant_id, warehouse_id),
    CONSTRAINT fk_stock_variant   FOREIGN KEY (variant_id)   REFERENCES product_variants(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
) ENGINE=InnoDB;

CREATE INDEX idx_stock_variant ON stock(variant_id);

CREATE TABLE stock_movements (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id   BIGINT UNSIGNED NOT NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    movement_type ENUM('in','out','reserved','released','adjustment') NOT NULL,
    quantity     INT             NOT NULL,
    reference_type VARCHAR(50)  NULL COMMENT 'order, adjustment, return',
    reference_id   BIGINT UNSIGNED NULL,
    note           TEXT          NULL,
    created_by   BIGINT UNSIGNED NULL,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sm_variant   FOREIGN KEY (variant_id)   REFERENCES product_variants(id),
    CONSTRAINT fk_sm_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    CONSTRAINT fk_sm_admin     FOREIGN KEY (created_by)   REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_sm_variant ON stock_movements(variant_id);
CREATE INDEX idx_sm_ref     ON stock_movements(reference_type, reference_id);

-- =============================================================
-- ORDERS
-- =============================================================

CREATE TABLE orders (
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number       VARCHAR(50)     NOT NULL UNIQUE,
    customer_id        BIGINT UNSIGNED NULL COMMENT 'NULL for guest checkout',
    customer_name      VARCHAR(200)    NOT NULL,
    customer_email     VARCHAR(255)    NOT NULL,
    customer_phone     VARCHAR(30)     NOT NULL,

    -- Shipping snapshot (immutable)
    ship_address_line1 VARCHAR(255)    NOT NULL,
    ship_address_line2 VARCHAR(255)    NULL,
    ship_city          VARCHAR(100)    NOT NULL,
    ship_district      VARCHAR(100)    NULL,
    ship_postal_code   VARCHAR(20)     NULL,
    ship_country       CHAR(2)         NOT NULL DEFAULT 'BD',

    -- Billing snapshot
    bill_address_line1 VARCHAR(255)    NULL,
    bill_address_line2 VARCHAR(255)    NULL,
    bill_city          VARCHAR(100)    NULL,
    bill_country       CHAR(2)         NULL DEFAULT 'BD',

    currency_code      CHAR(3)         NOT NULL DEFAULT 'BDT',
    subtotal           DECIMAL(15,2)   NOT NULL,
    discount_amount    DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
    shipping_fee       DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
    tax_amount         DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
    grand_total        DECIMAL(15,2)   NOT NULL,

    status             ENUM('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
    payment_status     ENUM('unpaid','paid','partially_paid','refunded') NOT NULL DEFAULT 'unpaid',
    payment_method     VARCHAR(100)    NULL,
    payment_reference  VARCHAR(255)    NULL,

    notes              TEXT            NULL,
    created_by         BIGINT UNSIGNED NULL COMMENT 'Admin if placed by admin',
    created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at         DATETIME        NULL,

    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    CONSTRAINT fk_order_admin    FOREIGN KEY (created_by)  REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_order_number   ON orders(order_number);
CREATE INDEX idx_order_customer ON orders(customer_id);
CREATE INDEX idx_order_status   ON orders(status, payment_status);
CREATE INDEX idx_order_created  ON orders(created_at);

CREATE TABLE order_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    variant_id      BIGINT UNSIGNED NULL COMMENT 'NULL if variant was deleted',
    -- Immutable snapshots at time of order
    product_name_bn VARCHAR(300)    NOT NULL,
    product_name_en VARCHAR(300)    NOT NULL,
    sku             VARCHAR(100)    NOT NULL,
    variant_label   VARCHAR(300)    NULL COMMENT 'e.g. Color: Red, Size: XL',
    unit_price      DECIMAL(15,2)   NOT NULL,
    quantity        INT             NOT NULL,
    discount_amount DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
    line_total      DECIMAL(15,2)   NOT NULL,
    CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_oi_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_oi_order   ON order_items(order_id);
CREATE INDEX idx_oi_variant ON order_items(variant_id);

CREATE TABLE order_status_history (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT UNSIGNED NOT NULL,
    old_status VARCHAR(50)     NULL,
    new_status VARCHAR(50)     NOT NULL,
    note       TEXT            NULL,
    changed_by BIGINT UNSIGNED NULL,
    changed_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_osh_order FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_osh_admin FOREIGN KEY (changed_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_osh_order ON order_status_history(order_id);

-- =============================================================
-- INVOICES
-- =============================================================

CREATE TABLE invoices (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id         BIGINT UNSIGNED NOT NULL UNIQUE,
    invoice_number   VARCHAR(50)     NOT NULL UNIQUE,
    issued_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date         DATETIME        NULL,
    notes            TEXT            NULL,
    template_config  JSON            NULL COMMENT 'Invoice template settings snapshot',
    pdf_url          VARCHAR(500)    NULL,
    created_by       BIGINT UNSIGNED NULL,
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       DATETIME        NULL,
    CONSTRAINT fk_inv_order FOREIGN KEY (order_id)   REFERENCES orders(id),
    CONSTRAINT fk_inv_admin FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- QUOTATION BUILDER
-- =============================================================

CREATE TABLE quotations (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id    BIGINT UNSIGNED NULL,
    session_token  VARCHAR(255)    NULL COMMENT 'Guest quotation token',
    customer_name  VARCHAR(200)    NULL,
    customer_email VARCHAR(255)    NULL,
    customer_phone VARCHAR(30)     NULL,
    notes          TEXT            NULL,
    status         ENUM('draft','submitted','converted') NOT NULL DEFAULT 'draft',
    expires_at     DATETIME        NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quot_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE quotation_items (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT UNSIGNED NOT NULL,
    variant_id   BIGINT UNSIGNED NULL,
    product_name_en VARCHAR(300) NOT NULL,
    sku          VARCHAR(100)    NOT NULL,
    unit_price   DECIMAL(15,2)   NOT NULL,
    quantity     INT             NOT NULL DEFAULT 1,
    line_total   DECIMAL(15,2)   NOT NULL,
    CONSTRAINT fk_qi_quotation FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
    CONSTRAINT fk_qi_variant   FOREIGN KEY (variant_id)   REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_qi_quotation ON quotation_items(quotation_id);

-- =============================================================
-- CMS – PAGES
-- =============================================================

CREATE TABLE pages (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(320)    NOT NULL UNIQUE,
    title_bn    VARCHAR(255)    NOT NULL,
    title_en    VARCHAR(255)    NOT NULL,
    content_bn  LONGTEXT        NULL,
    content_en  LONGTEXT        NULL,
    status      ENUM('draft','published') NOT NULL DEFAULT 'draft',
    meta_title_bn  VARCHAR(255) NULL,
    meta_title_en  VARCHAR(255) NULL,
    meta_desc_bn   TEXT         NULL,
    meta_desc_en   TEXT         NULL,
    created_by  BIGINT UNSIGNED NULL,
    updated_by  BIGINT UNSIGNED NULL,
    published_at DATETIME       NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME        NULL,
    CONSTRAINT fk_page_creator FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    CONSTRAINT fk_page_updater FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE FULLTEXT INDEX ft_page_content ON pages(title_bn, title_en, content_bn, content_en);

CREATE TABLE page_sections (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page_id     BIGINT UNSIGNED NOT NULL,
    section_key VARCHAR(100)    NOT NULL COMMENT 'Identifier for frontend rendering',
    title_bn    VARCHAR(255)    NULL,
    title_en    VARCHAR(255)    NULL,
    content_bn  LONGTEXT        NULL,
    content_en  LONGTEXT        NULL,
    extra_data  JSON            NULL COMMENT 'Flexible extra fields',
    sort_order  INT             NOT NULL DEFAULT 0,
    CONSTRAINT fk_ps_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_ps_page ON page_sections(page_id);

-- =============================================================
-- CMS – BANNERS / SLIDERS
-- =============================================================

CREATE TABLE banners (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title_bn     VARCHAR(255)    NULL,
    title_en     VARCHAR(255)    NULL,
    subtitle_bn  VARCHAR(500)    NULL,
    subtitle_en  VARCHAR(500)    NULL,
    image_url    VARCHAR(500)    NOT NULL,
    link_url     VARCHAR(500)    NULL,
    placement    VARCHAR(100)    NOT NULL DEFAULT 'hero' COMMENT 'hero, sidebar, popup, etc.',
    is_active    TINYINT(1)      NOT NULL DEFAULT 1,
    starts_at    DATETIME        NULL,
    ends_at      DATETIME        NULL,
    sort_order   INT             NOT NULL DEFAULT 0,
    created_by   BIGINT UNSIGNED NULL,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME        NULL,
    CONSTRAINT fk_banner_creator FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- CMS – BLOG / ARTICLES
-- =============================================================

CREATE TABLE blog_categories (
    id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_bn  VARCHAR(200) NOT NULL,
    name_en  VARCHAR(200) NOT NULL,
    slug     VARCHAR(220) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE blog_posts (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id   BIGINT UNSIGNED NULL,
    slug          VARCHAR(320)    NOT NULL UNIQUE,
    title_bn      VARCHAR(255)    NOT NULL,
    title_en      VARCHAR(255)    NOT NULL,
    excerpt_bn    TEXT            NULL,
    excerpt_en    TEXT            NULL,
    content_bn    LONGTEXT        NULL,
    content_en    LONGTEXT        NULL,
    cover_image   VARCHAR(500)    NULL,
    status        ENUM('draft','published') NOT NULL DEFAULT 'draft',
    meta_title_bn VARCHAR(255)    NULL,
    meta_title_en VARCHAR(255)    NULL,
    meta_desc_bn  TEXT            NULL,
    meta_desc_en  TEXT            NULL,
    author_id     BIGINT UNSIGNED NULL,
    published_at  DATETIME        NULL,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME        NULL,
    CONSTRAINT fk_bp_category FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_bp_author   FOREIGN KEY (author_id)   REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_bp_slug   ON blog_posts(slug);
CREATE INDEX idx_bp_status ON blog_posts(status, published_at);
CREATE FULLTEXT INDEX ft_bp_content ON blog_posts(title_bn, title_en, content_bn, content_en);

-- =============================================================
-- SERVICES
-- =============================================================

CREATE TABLE services (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_bn         VARCHAR(300)    NOT NULL,
    name_en         VARCHAR(300)    NOT NULL,
    slug            VARCHAR(320)    NOT NULL UNIQUE,
    description_bn  TEXT            NULL,
    description_en  TEXT            NULL,
    price           DECIMAL(15,2)   NULL COMMENT 'NULL = quote-based',
    image_url       VARCHAR(500)    NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    sort_order      INT             NOT NULL DEFAULT 0,
    created_by      BIGINT UNSIGNED NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME        NULL,
    CONSTRAINT fk_svc_creator FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- CONTACT MESSAGES
-- =============================================================

CREATE TABLE contact_messages (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200)    NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    phone       VARCHAR(30)     NULL,
    subject     VARCHAR(255)    NULL,
    message     TEXT            NOT NULL,
    is_read     TINYINT(1)      NOT NULL DEFAULT 0,
    replied_at  DATETIME        NULL,
    replied_by  BIGINT UNSIGNED NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cm_admin FOREIGN KEY (replied_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_cm_read ON contact_messages(is_read, created_at);

-- =============================================================
-- SYSTEM SETTINGS
-- =============================================================

CREATE TABLE settings (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `group`     VARCHAR(100)    NOT NULL DEFAULT 'general',
    `key`       VARCHAR(150)    NOT NULL,
    `value`     TEXT            NULL,
    value_json  JSON            NULL,
    label_bn    VARCHAR(255)    NULL,
    label_en    VARCHAR(255)    NULL,
    updated_by  BIGINT UNSIGNED NULL,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_settings_key (`group`, `key`),
    CONSTRAINT fk_settings_admin FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- AUDIT & ACTIVITY LOGS
-- =============================================================

CREATE TABLE activity_logs (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id     BIGINT UNSIGNED NULL,
    ip_address   VARCHAR(45)     NULL,
    user_agent   VARCHAR(500)    NULL,
    action       VARCHAR(200)    NOT NULL COMMENT 'e.g. login, create_product',
    description  TEXT            NULL,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_al_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_al_admin   ON activity_logs(admin_id);
CREATE INDEX idx_al_created ON activity_logs(created_at);

CREATE TABLE audit_logs (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id       BIGINT UNSIGNED NULL,
    entity_type    VARCHAR(100)    NOT NULL COMMENT 'Table/model name',
    entity_id      BIGINT UNSIGNED NOT NULL,
    action         ENUM('create','update','delete','restore') NOT NULL,
    old_values     JSON            NULL,
    new_values     JSON            NULL,
    ip_address     VARCHAR(45)     NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alog_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_audit_entity  ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_admin   ON audit_logs(admin_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

SET foreign_key_checks = 1;

/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.0.45-0ubuntu0.24.04.1 : Database - voltwavebd_v1
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`voltwavebd_v1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `voltwavebd_v1`;

/*Table structure for table `accounting_expenses` */

DROP TABLE IF EXISTS `accounting_expenses`;

CREATE TABLE `accounting_expenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text,
  `date` datetime(3) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_accounting_expenses_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `accounting_expenses` */

insert  into `accounting_expenses`(`id`,`amount`,`category`,`description`,`date`,`created_at`,`updated_at`,`deleted_at`) values 
(1,50000.00,'Rent','Factory Rent','2026-06-01 13:00:05.248','2026-06-01 13:00:05.273','2026-06-01 13:00:05.273',NULL),
(2,15000.00,'Wages','Labor','2026-06-01 13:00:05.248','2026-06-01 13:00:05.275','2026-06-01 13:00:05.275',NULL),
(3,25000.00,'Utility','Electricity','2026-06-01 13:00:05.248','2026-06-01 13:00:05.279','2026-06-01 13:00:05.279',NULL);

/*Table structure for table `accounting_purchases` */

DROP TABLE IF EXISTS `accounting_purchases`;

CREATE TABLE `accounting_purchases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_accounting_purchases_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `accounting_purchases` */

insert  into `accounting_purchases`(`id`,`amount`,`vendor`,`date`,`reference`,`created_at`,`updated_at`,`deleted_at`) values 
(1,300000.00,'Vendor A','2026-06-01 13:00:05.248','PO-IMP-001','2026-06-01 13:00:05.260','2026-06-01 13:00:05.260',NULL),
(2,900000.00,'Vendor B','2026-06-01 13:00:05.248','PO-IMP-002','2026-06-01 13:00:05.265','2026-06-01 13:00:05.265',NULL),
(3,30000.00,'Vendor C','2026-06-01 13:00:05.248','PO-IMP-003','2026-06-01 13:00:05.268','2026-06-01 13:00:05.268',NULL);

/*Table structure for table `accounting_sales` */

DROP TABLE IF EXISTS `accounting_sales`;

CREATE TABLE `accounting_sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL,
  `date` datetime(3) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_accounting_sales_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `accounting_sales` */

insert  into `accounting_sales`(`id`,`amount`,`date`,`reference`,`created_at`,`updated_at`,`deleted_at`) values 
(1,495000.00,'2026-06-01 13:00:05.248','INV-2024-01','2026-06-01 13:00:05.249','2026-06-01 13:00:05.249',NULL),
(2,1375000.00,'2026-06-01 13:00:05.248','INV-2024-02','2026-06-01 13:00:05.253','2026-06-01 13:00:05.253',NULL),
(3,49500.00,'2026-06-01 13:00:05.248','INV-2024-03','2026-06-01 13:00:05.257','2026-06-01 13:00:05.257',NULL);

/*Table structure for table `accounting_service_revenues` */

DROP TABLE IF EXISTS `accounting_service_revenues`;

CREATE TABLE `accounting_service_revenues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL,
  `service_id` bigint unsigned DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_accounting_service_revenues_service_id` (`service_id`),
  KEY `idx_accounting_service_revenues_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `accounting_service_revenues` */

/*Table structure for table `activity_logs` */

DROP TABLE IF EXISTS `activity_logs`;

CREATE TABLE `activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `action` varchar(200) NOT NULL,
  `description` text,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_activity_logs_admin_id` (`admin_id`),
  KEY `idx_activity_logs_created_at` (`created_at`),
  CONSTRAINT `fk_activity_logs_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `activity_logs` */

/*Table structure for table `attribute_groups` */

DROP TABLE IF EXISTS `attribute_groups`;

CREATE TABLE `attribute_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name_bn` varchar(150) NOT NULL,
  `name_en` varchar(150) NOT NULL,
  `sort_order` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `attribute_groups` */

insert  into `attribute_groups`(`id`,`name_bn`,`name_en`,`sort_order`) values 
(1,'কারিগরি স্পেসিফিকেশন','Technical Specs',1),
(2,'ধারণক্ষমতা','Capacity',1);

/*Table structure for table `attribute_options` */

DROP TABLE IF EXISTS `attribute_options`;

CREATE TABLE `attribute_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attribute_id` bigint unsigned NOT NULL,
  `value_bn` varchar(200) NOT NULL,
  `value_en` varchar(200) NOT NULL,
  `sort_order` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_attribute_options_attribute_id` (`attribute_id`),
  CONSTRAINT `fk_attributes_options` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `attribute_options` */

insert  into `attribute_options`(`id`,`attribute_id`,`value_bn`,`value_en`,`sort_order`) values 
(1,1,'৫০০ কেভিএ','500 KVA',0),
(2,1,'১০০০ কেভিএ','1000 KVA',0),
(3,2,'৩০০ ভোল্ট','300V',0),
(4,4,'১০০','100',0),
(5,4,'২০০','200',0),
(6,4,'৩০০','300',0);

/*Table structure for table `attributes` */

DROP TABLE IF EXISTS `attributes`;

CREATE TABLE `attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_id` bigint unsigned DEFAULT NULL,
  `name_bn` varchar(150) NOT NULL,
  `name_en` varchar(150) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `input_type` varchar(20) NOT NULL DEFAULT 'select',
  `unit` varchar(30) DEFAULT NULL,
  `is_variant_attr` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_attributes_slug` (`slug`),
  KEY `idx_attributes_group_id` (`group_id`),
  CONSTRAINT `fk_attribute_groups_attributes` FOREIGN KEY (`group_id`) REFERENCES `attribute_groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `attributes` */

insert  into `attributes`(`id`,`group_id`,`name_bn`,`name_en`,`slug`,`input_type`,`unit`,`is_variant_attr`,`sort_order`) values 
(1,1,'ক্যাপাসিটি','Capacity','capacity','select','KVA',0,0),
(2,1,'ভোল্টেজ','Voltage','voltage','select','V',0,0),
(3,1,'ওয়ারেন্টি','Warranty','warranty','text','Years',0,0),
(4,2,'ওয়াট','Watt','watt','select','W',0,0);

/*Table structure for table `audit_logs` */

DROP TABLE IF EXISTS `audit_logs`;

CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint unsigned DEFAULT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `action` varchar(20) NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_audit_logs_admin_id` (`admin_id`),
  KEY `idx_audit_entity` (`entity_type`,`entity_id`),
  KEY `idx_audit_logs_created_at` (`created_at`),
  CONSTRAINT `fk_audit_logs_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `audit_logs` */

/*Table structure for table `banners` */

DROP TABLE IF EXISTS `banners`;

CREATE TABLE `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title_bn` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `subtitle_bn` varchar(500) DEFAULT NULL,
  `subtitle_en` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `placement` varchar(100) NOT NULL DEFAULT 'hero',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `starts_at` datetime(3) DEFAULT NULL,
  `ends_at` datetime(3) DEFAULT NULL,
  `sort_order` bigint NOT NULL DEFAULT '0',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_banners_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `banners` */

insert  into `banners`(`id`,`title_bn`,`title_en`,`subtitle_bn`,`subtitle_en`,`image_url`,`link_url`,`placement`,`is_active`,`starts_at`,`ends_at`,`sort_order`,`created_by`,`created_at`,`updated_at`,`deleted_at`) values 
(1,'শিল্পকৌশল মেশিনারি ইম্পোর্টার','Heavy Machinery Importers','বাংলাদেশের অবকাঠামো উন্নয়নে ফ্যাক্টরি-গ্রেড যন্ত্রপাতি।','Providing factory-grade tools to fuel Bangladesh\'s infrastructure.','/uploads/banners/factory-1.jpg',NULL,'hero',1,NULL,NULL,1,NULL,'2026-06-01 13:00:05.307','2026-06-01 13:00:05.307',NULL),
(2,'সিমেন্স অটোমেশন প্যানেল','Siemens Automation Panels',NULL,NULL,'/uploads/banners/automation-2.jpg',NULL,'hero',1,NULL,NULL,2,NULL,'2026-06-01 13:00:05.309','2026-06-01 13:00:05.309',NULL),
(3,'২৪/৭ ইঞ্জিনিয়ারিং সাপোর্ট','24/7 Engineering Support',NULL,NULL,'/uploads/banners/support-3.jpg',NULL,'hero',1,NULL,NULL,3,NULL,'2026-06-01 13:00:05.313','2026-06-01 13:00:05.313',NULL);

/*Table structure for table `blog_categories` */

DROP TABLE IF EXISTS `blog_categories`;

CREATE TABLE `blog_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name_bn` varchar(200) NOT NULL,
  `name_en` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_blog_categories_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `blog_categories` */

insert  into `blog_categories`(`id`,`name_bn`,`name_en`,`slug`) values 
(1,'ইন্ডাস্ট্রিয়াল অটোমেশন','Industrial Automation','industrial-automation'),
(2,'ইকুইপমেন্ট সেফটি','Equipment Safety','equipment-safety'),
(3,'ইঞ্জিনিয়ারিং কেস স্টাডি','Engineering Case Studies','engineering-case-studies');

/*Table structure for table `blog_posts` */

DROP TABLE IF EXISTS `blog_posts`;

CREATE TABLE `blog_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned DEFAULT NULL,
  `slug` varchar(320) NOT NULL,
  `title_bn` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `excerpt_bn` text,
  `excerpt_en` text,
  `content_bn` longtext,
  `content_en` longtext,
  `cover_image` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `meta_title_bn` varchar(255) DEFAULT NULL,
  `meta_title_en` varchar(255) DEFAULT NULL,
  `meta_desc_bn` text,
  `meta_desc_en` text,
  `author_id` bigint unsigned DEFAULT NULL,
  `published_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_blog_posts_slug` (`slug`),
  KEY `idx_blog_posts_author_id` (`author_id`),
  KEY `idx_blog_posts_deleted_at` (`deleted_at`),
  KEY `idx_blog_posts_category_id` (`category_id`),
  KEY `idx_blog_posts_status` (`status`),
  CONSTRAINT `fk_blog_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_blog_posts_category` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `blog_posts` */

/*Table structure for table `cart_items` */

DROP TABLE IF EXISTS `cart_items`;

CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint unsigned DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `service_id` bigint unsigned DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cart_items_deleted_at` (`deleted_at`),
  KEY `fk_cart_items_product` (`product_id`),
  KEY `fk_cart_items_service` (`service_id`),
  KEY `fk_carts_items` (`cart_id`),
  CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_cart_items_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `fk_carts_items` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cart_items` */

/*Table structure for table `carts` */

DROP TABLE IF EXISTS `carts`;

CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_carts_deleted_at` (`deleted_at`),
  KEY `fk_carts_user` (`user_id`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `carts` */

/*Table structure for table `contact_messages` */

DROP TABLE IF EXISTS `contact_messages`;

CREATE TABLE `contact_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `replied_at` datetime(3) DEFAULT NULL,
  `replied_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contact_messages_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `contact_messages` */

/*Table structure for table `currencies` */

DROP TABLE IF EXISTS `currencies`;

CREATE TABLE `currencies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(3) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `rate` decimal(15,6) NOT NULL DEFAULT '1.000000',
  `is_base` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_currencies_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `currencies` */

insert  into `currencies`(`id`,`code`,`symbol`,`name`,`rate`,`is_base`,`is_active`) values 
(1,'BDT','৳','Bangladeshi Taka',1.000000,1,1),
(2,'USD','$','US Dollar',0.009100,0,1),
(3,'EUR','€','Euro',0.008400,0,1);

/*Table structure for table `customer_addresses` */

DROP TABLE IF EXISTS `customer_addresses`;

CREATE TABLE `customer_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint unsigned NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `recipient_name` varchar(200) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(2) NOT NULL DEFAULT 'BD',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_customer_addresses_customer_id` (`customer_id`),
  CONSTRAINT `fk_customers_addresses` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `customer_addresses` */

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `email_verified_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_customers_email` (`email`),
  KEY `idx_customers_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `customers` */

/*Table structure for table `invoices` */

DROP TABLE IF EXISTS `invoices`;

CREATE TABLE `invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned DEFAULT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `issued_at` datetime(3) NOT NULL,
  `due_date` datetime(3) DEFAULT NULL,
  `notes` text,
  `template_config` json DEFAULT NULL,
  `pdf_url` varchar(500) DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_invoices_invoice_number` (`invoice_number`),
  UNIQUE KEY `idx_invoices_order_id` (`order_id`),
  KEY `idx_invoices_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_orders_invoice` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `invoices` */

/*Table structure for table `order_items` */

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned DEFAULT NULL,
  `product_name_bn` varchar(300) NOT NULL,
  `product_name_en` varchar(300) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `variant_label` varchar(300) DEFAULT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `quantity` bigint NOT NULL,
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `line_total` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_variant_id` (`variant_id`),
  CONSTRAINT `fk_orders_items` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `order_items` */

/*Table structure for table `order_status_histories` */

DROP TABLE IF EXISTS `order_status_histories`;

CREATE TABLE `order_status_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `note` text,
  `changed_by` bigint unsigned DEFAULT NULL,
  `changed_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_status_histories_order_id` (`order_id`),
  CONSTRAINT `fk_orders_status_history` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `order_status_histories` */

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `customer_name` varchar(200) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(30) NOT NULL,
  `ship_address_line1` varchar(255) NOT NULL,
  `ship_address_line2` varchar(255) DEFAULT NULL,
  `ship_city` varchar(100) NOT NULL,
  `ship_district` varchar(100) DEFAULT NULL,
  `ship_postal_code` varchar(20) DEFAULT NULL,
  `ship_country` varchar(2) NOT NULL DEFAULT 'BD',
  `bill_address_line1` varchar(255) DEFAULT NULL,
  `bill_address_line2` varchar(255) DEFAULT NULL,
  `bill_city` varchar(100) DEFAULT NULL,
  `bill_country` varchar(2) DEFAULT 'BD',
  `currency_code` varchar(3) NOT NULL DEFAULT 'BDT',
  `subtotal` decimal(15,2) NOT NULL,
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(15,2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(20) NOT NULL DEFAULT 'unpaid',
  `payment_method` varchar(100) DEFAULT NULL,
  `payment_reference` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_orders_order_number` (`order_number`),
  KEY `idx_orders_customer_id` (`customer_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `orders` */

insert  into `orders`(`id`,`order_number`,`customer_id`,`customer_name`,`customer_email`,`customer_phone`,`ship_address_line1`,`ship_address_line2`,`ship_city`,`ship_district`,`ship_postal_code`,`ship_country`,`bill_address_line1`,`bill_address_line2`,`bill_city`,`bill_country`,`currency_code`,`subtotal`,`discount_amount`,`shipping_fee`,`tax_amount`,`grand_total`,`status`,`payment_status`,`payment_method`,`payment_reference`,`notes`,`created_by`,`created_at`,`updated_at`,`deleted_at`) values 
(1,'ORD-IN-2024-001',NULL,'Test 1','test1@voltwave.tech','0181','Bashundhara R/A, Dhaka',NULL,'Dhaka',NULL,NULL,'BD',NULL,NULL,NULL,'BD','BDT',450000.00,0.00,0.00,45000.00,495000.00,'delivered','paid',NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.239','2026-06-01 13:00:05.239',NULL),
(2,'ORD-IN-2024-002',NULL,'Test 2','test2@voltwave.tech','0182','EPZ, Chittagong',NULL,'Chittagong',NULL,NULL,'BD',NULL,NULL,NULL,'BD','BDT',1250000.00,0.00,0.00,125000.00,1375000.00,'processing','partial',NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.242','2026-06-01 13:00:05.242',NULL),
(3,'ORD-IN-2024-003',NULL,'Test 3','test3@voltwave.tech','0183','Mirpur, Dhaka',NULL,'Dhaka',NULL,NULL,'BD',NULL,NULL,NULL,'BD','BDT',45000.00,0.00,0.00,4500.00,49500.00,'pending','unpaid',NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.245','2026-06-01 13:00:05.245',NULL);

/*Table structure for table `page_sections` */

DROP TABLE IF EXISTS `page_sections`;

CREATE TABLE `page_sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `page_id` bigint unsigned NOT NULL,
  `section_key` varchar(100) NOT NULL,
  `title_bn` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `content_bn` longtext,
  `content_en` longtext,
  `extra_data` json DEFAULT NULL,
  `sort_order` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_page_sections_page_id` (`page_id`),
  CONSTRAINT `fk_pages_sections` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `page_sections` */

/*Table structure for table `pages` */

DROP TABLE IF EXISTS `pages`;

CREATE TABLE `pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(320) NOT NULL,
  `title_bn` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `content_bn` longtext,
  `content_en` longtext,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `meta_title_bn` varchar(255) DEFAULT NULL,
  `meta_title_en` varchar(255) DEFAULT NULL,
  `meta_desc_bn` text,
  `meta_desc_en` text,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `published_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_pages_slug` (`slug`),
  KEY `idx_pages_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `pages` */

insert  into `pages`(`id`,`slug`,`title_bn`,`title_en`,`content_bn`,`content_en`,`status`,`meta_title_bn`,`meta_title_en`,`meta_desc_bn`,`meta_desc_en`,`created_by`,`updated_by`,`published_at`,`created_at`,`updated_at`,`deleted_at`) values 
(1,'about-us','আমাদের সম্পর্কে','About Us - Volt Wave Tech','ভোল্ট ওয়েভ টেক বাংলাদেশের একটি বিশ্বস্ত ভারী ইন্ডাস্ট্রিয়াল মেশিনারিজ সরবরাহকারী প্রতিষ্ঠান।','Volt Wave Tech is a globally certified heavy industrial machinery and automation provider in Bangladesh.','published',NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.281','2026-06-01 13:00:05.284','2026-06-01 13:00:05.284',NULL),
(2,'installation-services','ইন্সটলেশন সার্ভিস','Industrial Installation Services','ট্রান্সফরমার এবং জেনারেটরের সুরক্ষিত ইন্সটলেশন।','Secure deployment and commissioning of Transformers and Diesel Generators by certified engineers.','published',NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.281','2026-06-01 13:00:05.287','2026-06-01 13:00:05.287',NULL),
(3,'terms-and-conditions','ক্রয় নীতিমালা','Purchasing Terms',NULL,NULL,'draft',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.289','2026-06-01 13:00:05.289',NULL);

/*Table structure for table `permissions` */

DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `module` varchar(100) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_permissions_name` (`name`),
  UNIQUE KEY `idx_permissions_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `permissions` */

insert  into `permissions`(`id`,`name`,`slug`,`module`,`created_at`) values 
(1,'View Products','products.view','products','2026-06-01 13:00:04.951'),
(2,'Manage Products','products.manage','products','2026-06-01 13:00:04.955'),
(3,'View Services','services.view','services','2026-06-01 13:00:04.958'),
(4,'Manage Services','services.manage','services','2026-06-01 13:00:04.962'),
(5,'View Orders','orders.view','orders','2026-06-01 13:00:04.965'),
(6,'Manage Orders','orders.manage','orders','2026-06-01 13:00:04.968'),
(7,'View Quotations','quotations.view','quotations','2026-06-01 13:00:04.970'),
(8,'Manage Quotations','quotations.manage','quotations','2026-06-01 13:00:04.973'),
(9,'View Invoices','invoices.view','invoices','2026-06-01 13:00:04.976'),
(10,'Manage Invoices','invoices.manage','invoices','2026-06-01 13:00:04.980'),
(11,'View Accounting','accounting.view','accounting','2026-06-01 13:00:04.984'),
(12,'Manage Accounting','accounting.manage','accounting','2026-06-01 13:00:04.987'),
(13,'View Reports','reports.view','reports','2026-06-01 13:00:04.990'),
(14,'Manage Settings','settings.manage','settings','2026-06-01 13:00:04.992'),
(15,'Manage Users','users.manage','users','2026-06-01 13:00:04.995');

/*Table structure for table `price_histories` */

DROP TABLE IF EXISTS `price_histories`;

CREATE TABLE `price_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint unsigned NOT NULL,
  `currency_id` bigint unsigned NOT NULL,
  `old_price` decimal(15,2) NOT NULL,
  `new_price` decimal(15,2) NOT NULL,
  `changed_by` bigint unsigned DEFAULT NULL,
  `changed_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_price_histories_variant_id` (`variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `price_histories` */

/*Table structure for table `product_attribute_values` */

DROP TABLE IF EXISTS `product_attribute_values`;

CREATE TABLE `product_attribute_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `attribute_id` bigint unsigned NOT NULL,
  `option_id` bigint unsigned DEFAULT NULL,
  `value_custom` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_prod_attr` (`product_id`,`attribute_id`),
  KEY `idx_product_attribute_values_product_id` (`product_id`),
  KEY `fk_product_attribute_values_attribute` (`attribute_id`),
  KEY `fk_product_attribute_values_option` (`option_id`),
  CONSTRAINT `fk_product_attribute_values_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`),
  CONSTRAINT `fk_product_attribute_values_option` FOREIGN KEY (`option_id`) REFERENCES `attribute_options` (`id`),
  CONSTRAINT `fk_products_attribute_values` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product_attribute_values` */

/*Table structure for table `product_categories` */

DROP TABLE IF EXISTS `product_categories`;

CREATE TABLE `product_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `name_bn` varchar(200) NOT NULL,
  `name_en` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `description_bn` text,
  `description_en` text,
  `image_url` varchar(500) DEFAULT NULL,
  `sort_order` bigint NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_product_categories_slug` (`slug`),
  KEY `idx_product_categories_parent_id` (`parent_id`),
  KEY `idx_product_categories_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_product_categories_children` FOREIGN KEY (`parent_id`) REFERENCES `product_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product_categories` */

insert  into `product_categories`(`id`,`parent_id`,`name_bn`,`name_en`,`slug`,`description_bn`,`description_en`,`image_url`,`sort_order`,`is_active`,`created_by`,`created_at`,`updated_at`,`deleted_at`) values 
(1,NULL,'ইন্ডাস্ট্রিয়াল ট্রান্সফরমার','Industrial Transformers','industrial-transformers',NULL,NULL,NULL,0,1,NULL,'2026-06-01 13:00:05.138','2026-06-01 13:00:05.138',NULL),
(2,NULL,'পাওয়ার জেনারেটর','Power Generators','power-generators',NULL,NULL,NULL,0,1,NULL,'2026-06-01 13:00:05.141','2026-06-01 13:00:05.141',NULL),
(3,NULL,'পিএলসি ও অটোমেশন','PLC & Automation','plc-automation',NULL,NULL,NULL,0,1,NULL,'2026-06-01 13:00:05.143','2026-06-01 13:00:05.143',NULL),
(4,NULL,'সোলার প্যানেল','Solar Panels','solar-panels',NULL,NULL,NULL,1,1,NULL,'2026-06-01 13:00:05.197','2026-06-01 13:00:05.197',NULL),
(5,NULL,'ইনভার্টার','Inverters','inverters',NULL,NULL,NULL,2,1,NULL,'2026-06-01 13:00:05.200','2026-06-01 13:00:05.200',NULL),
(6,NULL,'ব্যাটারি','Batteries','batteries',NULL,NULL,NULL,3,1,NULL,'2026-06-01 13:00:05.203','2026-06-01 13:00:05.203',NULL),
(7,NULL,'এক্সেসরিজ','Accessories','accessories',NULL,NULL,NULL,4,1,NULL,'2026-06-01 13:00:05.205','2026-06-01 13:00:05.205',NULL);

/*Table structure for table `product_images` */

DROP TABLE IF EXISTS `product_images`;

CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `url` varchar(500) NOT NULL,
  `alt_bn` varchar(255) DEFAULT NULL,
  `alt_en` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product_id` (`product_id`),
  CONSTRAINT `fk_products_images` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product_images` */

/*Table structure for table `product_prices` */

DROP TABLE IF EXISTS `product_prices`;

CREATE TABLE `product_prices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint unsigned NOT NULL,
  `currency_id` bigint unsigned NOT NULL DEFAULT '1',
  `base_price` decimal(15,2) NOT NULL,
  `sale_price` decimal(15,2) DEFAULT NULL,
  `cost_price` decimal(15,2) DEFAULT NULL,
  `sale_starts_at` datetime(3) DEFAULT NULL,
  `sale_ends_at` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_variant_currency` (`variant_id`,`currency_id`),
  KEY `idx_product_prices_variant_id` (`variant_id`),
  KEY `fk_product_prices_currency` (`currency_id`),
  CONSTRAINT `fk_product_prices_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`),
  CONSTRAINT `fk_product_variants_prices` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product_prices` */

/*Table structure for table `product_variant_attributes` */

DROP TABLE IF EXISTS `product_variant_attributes`;

CREATE TABLE `product_variant_attributes` (
  `variant_id` bigint unsigned NOT NULL,
  `attribute_id` bigint unsigned NOT NULL,
  `option_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`variant_id`,`attribute_id`),
  KEY `idx_product_variant_attributes_variant_id` (`variant_id`),
  KEY `fk_product_variant_attributes_attribute` (`attribute_id`),
  KEY `fk_product_variant_attributes_option` (`option_id`),
  CONSTRAINT `fk_product_variant_attributes_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`),
  CONSTRAINT `fk_product_variant_attributes_option` FOREIGN KEY (`option_id`) REFERENCES `attribute_options` (`id`),
  CONSTRAINT `fk_product_variants_attributes` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product_variant_attributes` */

/*Table structure for table `product_variants` */

DROP TABLE IF EXISTS `product_variants`;

CREATE TABLE `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `sku` varchar(100) NOT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_product_variants_sku` (`sku`),
  KEY `idx_product_variants_product_id` (`product_id`),
  CONSTRAINT `fk_products_variants` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product_variants` */

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `product_type` varchar(20) NOT NULL DEFAULT 'accessory',
  `sku_prefix` varchar(50) DEFAULT NULL,
  `name_bn` varchar(300) NOT NULL,
  `name_en` varchar(300) NOT NULL,
  `slug` varchar(320) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` double NOT NULL DEFAULT '0',
  `stock` bigint NOT NULL DEFAULT '0',
  `short_desc_bn` text,
  `short_desc_en` text,
  `description_bn` longtext,
  `description_en` longtext,
  `brand` varchar(150) DEFAULT NULL,
  `model_number` varchar(150) DEFAULT NULL,
  `manufacturer` varchar(200) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `meta_title_bn` varchar(255) DEFAULT NULL,
  `meta_title_en` varchar(255) DEFAULT NULL,
  `meta_desc_bn` text,
  `meta_desc_en` text,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_products_slug` (`slug`),
  UNIQUE KEY `idx_products_sku` (`sku`),
  KEY `idx_products_category_id` (`category_id`),
  KEY `idx_products_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`category_id`,`product_type`,`sku_prefix`,`name_bn`,`name_en`,`slug`,`sku`,`price`,`stock`,`short_desc_bn`,`short_desc_en`,`description_bn`,`description_en`,`brand`,`model_number`,`manufacturer`,`is_featured`,`is_active`,`meta_title_bn`,`meta_title_en`,`meta_desc_bn`,`meta_desc_en`,`created_by`,`updated_by`,`created_at`,`updated_at`,`deleted_at`) values 
(4,4,'accessory',NULL,'মনো পিইআরসি সোলার প্যানেল ১০০ ওয়াট','Mono PERC Solar Panel 100W','mono-perc-100w','SOL-MONO-100',5500,50,NULL,NULL,NULL,NULL,'VoltWave',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.220','2026-06-01 13:00:05.220',NULL),
(5,5,'accessory',NULL,'স্মার্ট সোলার ইনভার্টার ১কেভিএ','Smart Solar Inverter 1kVA','smart-inverter-1kva','INV-SMT-1K',12000,15,NULL,NULL,NULL,NULL,'VoltWave',NULL,NULL,0,1,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 13:00:05.223','2026-06-01 13:00:05.223',NULL);

/*Table structure for table `quotation_items` */

DROP TABLE IF EXISTS `quotation_items`;

CREATE TABLE `quotation_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quotation_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned DEFAULT NULL,
  `product_name_en` varchar(300) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `quantity` bigint NOT NULL DEFAULT '1',
  `line_total` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quotation_items_quotation_id` (`quotation_id`),
  CONSTRAINT `fk_quotations_items` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `quotation_items` */

/*Table structure for table `quotations` */

DROP TABLE IF EXISTS `quotations`;

CREATE TABLE `quotations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quotation_number` varchar(50) NOT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `customer_name` varchar(200) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(30) DEFAULT NULL,
  `customer_address` text,
  `notes` text,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `expires_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_quotations_quotation_number` (`quotation_number`),
  KEY `idx_quotations_customer_id` (`customer_id`),
  KEY `idx_quotations_session_token` (`session_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `quotations` */

/*Table structure for table `role_permission_map` */

DROP TABLE IF EXISTS `role_permission_map`;

CREATE TABLE `role_permission_map` (
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `fk_role_permission_map_permission` (`permission_id`),
  CONSTRAINT `fk_role_permission_map_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `fk_role_permission_map_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `role_permission_map` */

insert  into `role_permission_map`(`role_id`,`permission_id`) values 
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8),
(1,9),
(1,10),
(1,11),
(1,12),
(1,13),
(1,14),
(1,15);

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_roles_name` (`name`),
  UNIQUE KEY `idx_roles_slug` (`slug`),
  KEY `idx_roles_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `roles` */

insert  into `roles`(`id`,`name`,`slug`,`created_at`,`updated_at`,`deleted_at`) values 
(1,'Super Admin','super-admin','2026-06-01 13:00:04.941','2026-06-01 13:00:36.507',NULL),
(2,'Admin','admin','2026-06-01 13:00:04.944','2026-06-01 13:00:04.944',NULL),
(3,'Procurement Manager','procurement-manager','2026-06-01 13:00:04.948','2026-06-01 13:00:04.948',NULL);

/*Table structure for table `services` */

DROP TABLE IF EXISTS `services`;

CREATE TABLE `services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name_bn` varchar(300) NOT NULL,
  `name_en` varchar(300) NOT NULL,
  `slug` varchar(320) NOT NULL,
  `description_bn` text,
  `description_en` text,
  `price` decimal(15,2) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` bigint NOT NULL DEFAULT '0',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_services_slug` (`slug`),
  KEY `idx_services_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `services` */

insert  into `services`(`id`,`name_bn`,`name_en`,`slug`,`description_bn`,`description_en`,`price`,`image_url`,`is_active`,`sort_order`,`created_by`,`created_at`,`updated_at`,`deleted_at`) values 
(1,'ডিস্ট্রিবিউশন ট্রান্সফরমার কমিশনিং','Distribution Transformer Commissioning','distribution-transformer-commissioning','৩০০-১০০০ কেভিএ ট্রান্সফরমার কমিশনিং সেবা।','300-1000 KVA Industrial Transformer configuration and commissioning services.',45000.00,NULL,1,1,NULL,'2026-06-01 13:00:05.293','2026-06-01 13:00:05.293',NULL),
(2,'পিএলসি অটোমেশন ইন্টিগ্রেশন','PLC Automation Integration','plc-automation-integration','সিমেন্স এবং শ্নাইডার পিএলসি প্যানেল ইন্টিগ্রেশন।','Complete logic and automation integration for Siemens and Schneider infrastructure.',75000.00,NULL,1,2,NULL,'2026-06-01 13:00:05.299','2026-06-01 13:00:05.299',NULL),
(3,'বার্ষিক রক্ষণাবেক্ষণ (AMC)','Annual Maintenance Contract (AMC)','annual-maintenance-contract','জেনারেটর এবং ক্যাবলিংয়ের সার্বক্ষণিক সার্ভিসিং।','24/7 on-call service and monthly maintenance for major operational generators.',150000.00,NULL,1,3,NULL,'2026-06-01 13:00:05.302','2026-06-01 13:00:05.302',NULL);

/*Table structure for table `settings` */

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(100) NOT NULL DEFAULT 'general',
  `key` varchar(150) NOT NULL,
  `value` text,
  `value_json` json DEFAULT NULL,
  `label_bn` varchar(255) DEFAULT NULL,
  `label_en` varchar(255) DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_settings_key` (`group`,`key`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `settings` */

insert  into `settings`(`id`,`group`,`key`,`value`,`value_json`,`label_bn`,`label_en`,`updated_by`,`updated_at`) values 
(1,'general','site_name','Volt Wave Tech',NULL,'সাইটের নাম','Site Name',NULL,'2026-06-01 13:00:36.593'),
(2,'general','site_address','Kazi Nazrul Islam Ave, Dhaka, Bangladesh',NULL,'সাইটের ঠিকানা','Site Address',NULL,'2026-06-01 13:00:36.595'),
(3,'general','site_email','info@voltwave.tech',NULL,'সাইট সাপোর্ট ইমেল','Site Support Email',NULL,'2026-06-01 13:00:36.598'),
(4,'general','site_phone','+880 1700-000000',NULL,'সাইট ফোন','Site Phone',NULL,'2026-06-01 13:00:36.600'),
(5,'general','footer_text','© 2024 Volt Wave Tech. All Rights Reserved.',NULL,'ফুটার টেক্সট','Footer Text',NULL,'2026-06-01 13:00:36.602'),
(6,'social','facebook_url','https://facebook.com/voltwavetech',NULL,'ফেসবুক ইউআরএল','Facebook URL',NULL,'2026-06-01 13:00:36.605'),
(7,'social','linkedin_url','https://linkedin.com/company/voltwave',NULL,'লিঙ্কডইন ইউআরএল','LinkedIn URL',NULL,'2026-06-01 13:00:36.608'),
(8,'logistics','machinery_import_tax','15.5',NULL,'যন্ত্রপাতি আমদানি ট্যাক্স %','Machinery Import Tax %',NULL,'2026-06-01 13:00:36.609'),
(9,'logistics','default_shipment_method','Freight',NULL,'ডিফল্ট শিপমেন্ট মেথড','Default Shipment Method',NULL,'2026-06-01 13:00:36.611'),
(10,'security','enable_mfa','false',NULL,'মাল্টি-ফ্যাক্টর অথেন্টিকেশন এনাবল করুন','Enable Multi-Factor Authentication',NULL,'2026-06-01 13:00:36.614'),
(11,'security','session_timeout','60',NULL,'সেশন টাইমআউট (মিনিট)','Session Timeout (minutes)',NULL,'2026-06-01 13:00:36.616'),
(12,'notifications','email_on_new_order','true',NULL,'নতুন অর্ডারে ইমেল নোটিফিকেশন','Email Notification on New Order',NULL,'2026-06-01 13:00:36.618'),
(13,'notifications','sms_on_critical_alert','true',NULL,'গুরুতর যন্ত্রপাতি ত্রুটির জন্য এসএমএস সতর্কতা','SMS Alert for Critical Machinery Errors',NULL,'2026-06-01 13:00:36.620');

/*Table structure for table `stock_movements` */

DROP TABLE IF EXISTS `stock_movements`;

CREATE TABLE `stock_movements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint unsigned NOT NULL,
  `warehouse_id` bigint unsigned NOT NULL,
  `movement_type` varchar(20) NOT NULL,
  `quantity` bigint NOT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `note` text,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_stock_movements_variant_id` (`variant_id`),
  KEY `idx_stock_movements_reference_id` (`reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `stock_movements` */

/*Table structure for table `stocks` */

DROP TABLE IF EXISTS `stocks`;

CREATE TABLE `stocks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint unsigned NOT NULL,
  `warehouse_id` bigint unsigned NOT NULL,
  `quantity` bigint NOT NULL DEFAULT '0',
  `reserved` bigint NOT NULL DEFAULT '0',
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_stock_variant_wh` (`variant_id`,`warehouse_id`),
  KEY `idx_stocks_variant_id` (`variant_id`),
  KEY `fk_stocks_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_product_variants_stock` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `fk_stocks_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `stocks` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` datetime(3) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`),
  KEY `idx_users_deleted_at` (`deleted_at`),
  KEY `idx_users_role_id` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`role_id`,`name`,`email`,`password`,`is_active`,`last_login`,`avatar_url`,`created_at`,`updated_at`,`deleted_at`) values 
(1,1,'System Admin','admin@voltwave.tech','$2a$10$hY/vIqvhxeCo4YxVl/MaJewUJJ/ikAT7V5qBmTxuOmZVXFXKBiX7i',1,NULL,NULL,'2026-06-01 13:00:05.089','2026-06-01 13:00:05.089',NULL);

/*Table structure for table `warehouses` */

DROP TABLE IF EXISTS `warehouses`;

CREATE TABLE `warehouses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `address` text,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `warehouses` */

insert  into `warehouses`(`id`,`name`,`address`,`is_default`,`is_active`,`created_at`) values 
(1,'Dhaka Central Logistics','Tejgaon Industrial Area, Dhaka',1,1,'2026-06-01 13:00:05.229'),
(2,'Chittagong Port Storage','Agrabad, Chittagong',0,1,'2026-06-01 13:00:05.231'),
(3,'Khulna Distribution Center','Sonadanga, Khulna',0,1,'2026-06-01 13:00:05.233');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

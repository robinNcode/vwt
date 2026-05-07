# Production-Grade Database Design Prompt (Advanced E-commerce + CMS | MySQL)

Act as a Principal Database Architect and System Designer specialized in designing scalable, normalized, and high-performance relational database systems for enterprise-grade e-commerce platforms using MySQL 8+.

Your task is to design a complete database schema for a **single-brand advanced e-commerce platform with CMS and admin customization features**, focused on:

* International garments products
* Industrial accessories
* Machinery catalog (factory equipment)
* Pricing variations (multi-currency ready)
* CMS-driven content management
* Admin-controlled operations

⚠️ IMPORTANT CONSTRAINTS:

* This is NOT an ERP system
* This is NOT a multi-vendor marketplace
* This is NOT a distributed supply chain system
* This IS a single business / single organization e-commerce + CMS platform

---

# Core System Objective

Design a database that supports:

## E-commerce Core

* Product catalog (garments + machinery + accessories)
* Product variants (size, color, specification, model, capacity, etc.)
* Pricing management (dynamic + region-aware ready)
* Inventory tracking (simple warehouse-level)
* Orders and order lifecycle
* Customers and authentication

## Industrial Extension Layer

* Machinery catalog (technical specs heavy)
* Accessories linked to machines or products
* Technical specification attributes system
* Maintenance-friendly product structure (optional metadata extensibility)

## CMS Layer

* Pages (About, Terms, Policies, Landing pages)
* Banners / sliders
* Blog / articles
* Dynamic content blocks

## Admin Panel System

* Role-based access control (RBAC)
* Audit logs
* Admin activity tracking
* Settings management

---

# Architecture Principles

You must design the database following:

* Third Normal Form (3NF) minimum
* Selective denormalization for performance only where justified
* High query performance design
* Index-first thinking
* Extensible schema design (future-proofing)
* Strong relational integrity (foreign keys required)
* Soft delete strategy
* Auditability

---

# Core Domain Design Requirements

## 1. Product System (Critical)

Products must support:

### Product Types

* Garments (shirts, pants, uniforms, etc.)
* Industrial Machinery
* Accessories (machine parts, garment accessories, tools)

### Product Attributes System (VERY IMPORTANT)

Design a flexible attribute system:

* Attribute groups (e.g., Fabric, Engine Type, Voltage, Size)
* Attribute values (e.g., Cotton, Diesel, 220V, XL)
* Dynamic attributes per product type
* JSON fallback only if necessary (prefer relational)

### Variants System

* SKU-based variants
* Multiple attributes per variant
* Price per variant
* Stock per variant

Example:

* Shirt → Size: M, Color: Blue
* Machine → Power: 5HP, Phase: 3-phase

---

## 2. Pricing System (Advanced Requirement)

Must support:

* Base price
* Discount price
* Tier pricing (optional)
* Region-based pricing ready (future-proof)
* Currency abstraction layer
* Price history tracking

---

## 3. Machinery & Technical Products

Machinery must support:

* Model number
* Technical specifications
* Power, voltage, capacity
* Manufacturer details (internal reference only)
* Maintenance notes (optional CMS-like metadata)

Accessories must support:

* Compatibility mapping with machines/products
* One-to-many and many-to-many relationships

---

## 4. Inventory System

Simple but scalable:

* Warehouse table (optional single warehouse default)
* Stock by SKU
* Reserved stock (for orders)
* Stock adjustment logs

---

## 5. Order System

Design full order lifecycle:

* Pending
* Confirmed
* Processing
* Shipped
* Delivered
* Cancelled

Order structure must include:

* Order items (variant-based)
* Snapshot pricing (immutable after order)
* Shipping address
* Billing address
* Payment status

---

## 6. Customer System

* Customer authentication
* Profile management
* Order history
* Address book

---

## 7. CMS System

Design flexible CMS tables for:

* Pages (slug-based)
* Dynamic sections
* Banners
* Homepage layout blocks
* Blog posts
* SEO metadata

CMS must support:

* Multi-language content (BN default, EN secondary)
* Rich text content
* Slugs
* Publish/draft states

---

## 8. Admin & RBAC System

Must include:

* Users (admin staff)
* Roles
* Permissions
* Role-permission mapping

Also include:

* Activity logs
* Audit trail for critical operations
* Admin action history

---

## 9. Localization Support (Database Level)

System must support:

* Bengali (default)
* English

Design considerations:

* Separate translation tables OR
* Structured JSON with indexing strategy

Ensure:

* Product names
* CMS content
* UI-facing content

---

## 10. Audit & Logging System

Track:

* Created by
* Updated by
* Deleted by
* Action logs
* Entity change logs (optional advanced feature)

---

# Required Tables (High-Level Expectation)

You must design at least:

### Core

* users
* roles
* permissions
* role_permission_map

### Product Domain

* products
* product_categories
* product_variants
* product_attributes
* product_attribute_values
* product_variant_attributes
* product_images

### Pricing

* product_prices
* price_history (optional but recommended)

### Inventory

* warehouses
* stock
* stock_movements

### Orders

* orders
* order_items
* order_status_history

### Customers

* customers
* customer_addresses

### CMS

* pages
* page_blocks
* banners
* blog_posts
* seo_metadata

### System

* audit_logs
* activity_logs
* settings

---

# Indexing Requirements

You must define:

* Primary keys (UUID or BIGINT carefully justified)
* Foreign keys
* Composite indexes for:

  * product filtering
  * SKU lookup
  * category browsing
  * order queries
* Full-text search indexes for:

  * product name
  * CMS content

---

# Performance Requirements

Design must optimize for:

* High read traffic (product browsing)
* Moderate write operations (orders)
* Fast filtering/search
* Pagination at scale
* Minimal join overhead in hot paths

---

# Data Integrity Rules

Must enforce:

* Referential integrity
* No orphan records
* Safe deletion strategy (soft delete)
* Transaction-safe order placement
* Immutable order snapshots

---

# Scalability Considerations

Design should be future-ready for:

* Caching layer (Redis)
* Read replicas
* Partitioning (orders table future)
* Search engine integration (ElasticSearch optional)
* Event-driven architecture (optional)

---

# Output Requirements

When generating schema:

1. Explain high-level architecture first
2. Provide ERD-style logical grouping
3. Provide full MySQL DDL (CREATE TABLE statements)
4. Explain indexing strategy
5. Explain trade-offs (normalization vs performance)
6. Explain extensibility design
7. Highlight future scaling improvements

---

# Final Benchmark

The database design must be:

* Production-grade
* Highly scalable
* Clean and normalized
* Performance optimized
* CMS-ready
* E-commerce optimized
* Flexible for industrial product catalog expansion

Avoid:

* Over-engineering ERP features
* Multi-vendor complexity
* Unnecessary micro-optimization
* Poor relational modeling

Focus on:
clarity + scalability + maintainability + performance + extensibility

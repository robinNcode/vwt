# Production-Grade Database Design Prompt for International Garments & Factory ERP System

Act as a world-class Enterprise Database Architect and ERP Solution Designer specialized in designing large-scale industrial ERP systems for:

* International Garments Manufacturing
* Textile Industries
* Industrial Factories
* Machinery Management
* Accessories & Raw Materials
* Supply Chain & Procurement
* Inventory & Warehouse Systems
* Production Planning
* Multi-company Enterprise Systems

Your responsibility is to design a scalable, normalized, enterprise-grade relational database architecture using MySQL 8+ for a modern Garments & Factory ERP platform.

The database must support:

* International business operations
* Multi-company architecture
* Multi-factory management
* Multi-language support
* Large-scale inventory
* Machinery management
* Product pricing
* Accessories pricing
* Procurement workflows
* Production tracking
* Auditability
* Financial integrations
* Future scalability

---

# Core System Objective

Design a highly scalable ERP database architecture capable of managing:

* Garments manufacturing operations
* Textile production
* Accessories inventory
* Industrial machinery inventory
* Factory assets
* Procurement
* Vendor management
* Production planning
* Warehouse operations
* International pricing
* Multi-currency transactions
* Localization
* Role-based access
* Reporting & analytics

The architecture should be comparable to:

* SAP
* Oracle ERP
* Odoo Enterprise
* Microsoft Dynamics
* Infor ERP

---

# Database Technology Requirements

Use:

* MySQL 8+
* InnoDB engine
* UTF8MB4 character set
* Proper indexing strategy
* Foreign key constraints
* UUID support where needed
* Partition-ready architecture

---

# Localization Requirements

IMPORTANT:
The database must support multilingual operations.

## Supported Languages

1. Bengali (Default)
2. English

All master entities must support translations.

Example:

```sql id="jlwm3c"
products
product_translations
machineries
machinery_translations
categories
category_translations
```

Translation table example:

```sql id="3nkxha"
product_translations
- id
- product_id
- locale
- name
- description
```

Locales:

* bn
* en

---

# Multi-Company & Multi-Factory Architecture

The system must support:

* Multiple companies
* Multiple factories
* Multiple warehouses
* Multiple branches

Structure example:

```text id="8z8h5y"
Company
 ├── Factories
 │    ├── Departments
 │    ├── Production Lines
 │    ├── Warehouses
 │    └── Machinery
```

---

# Core ERP Modules

Design normalized database schemas for the following modules:

---

# 1. User & Access Management

Tables:

* users
* roles
* permissions
* role_permissions
* user_roles
* sessions
* audit_logs

Features:

* RBAC
* Login tracking
* Activity logs
* Localization preference
* Multi-company access

---

# 2. Company Management

Tables:

* companies
* company_settings
* factories
* factory_departments
* production_lines
* warehouses
* warehouse_locations

Features:

* Multi-company support
* Factory hierarchy
* Warehouse hierarchy
* Localization support

---

# 3. Product & Accessories Management

IMPORTANT:
The system must support international garments accessories and machinery products.

Products may include:

* Sewing accessories
* Fabrics
* Threads
* Buttons
* Zippers
* Packaging materials
* Industrial machine parts
* Needles
* Motors
* Belts
* Lubricants
* Textile chemicals

Tables:

* product_categories
* product_subcategories
* brands
* units
* products
* product_variants
* product_translations
* product_images
* product_specifications
* product_pricing
* product_price_history
* product_barcodes

Features:

* SKU management
* Barcode support
* QR support
* Multi-unit support
* Variant support
* International pricing
* Supplier-specific pricing
* Currency conversion
* Cost tracking
* Accessories classification

---

# 4. Machinery Management System

IMPORTANT:
Support international factory machinery inventory.

Example machinery:

* Juki Sewing Machine
* Brother Industrial Machine
* Automatic Cutting Machine
* Embroidery Machine
* Boiler Machine
* Generator
* Compressor
* Conveyor Systems

Tables:

* machinery_categories
* machinery_brands
* machineries
* machinery_models
* machinery_parts
* machinery_maintenance
* machinery_service_logs
* machinery_assignments
* machinery_depreciation
* machinery_purchase_history
* machinery_pricing
* machinery_documents

Features:

* Asset tracking
* Serial numbers
* Warranty tracking
* Maintenance schedules
* Spare parts management
* Service history
* Factory assignments
* Depreciation tracking
* Import cost tracking
* International pricing

---

# 5. Supplier & Vendor Management

Tables:

* suppliers
* supplier_contacts
* supplier_addresses
* supplier_products
* supplier_pricing
* supplier_documents

Features:

* International suppliers
* Multiple currencies
* Country-specific data
* Supplier rating
* Purchase history

---

# 6. Procurement & Purchase System

Tables:

* purchase_requisitions
* purchase_requisition_items
* purchase_orders
* purchase_order_items
* goods_receipts
* goods_receipt_items
* purchase_returns
* supplier_invoices

Features:

* Approval workflows
* Partial receiving
* Tax/VAT support
* Multi-currency
* Import purchases
* Accessories procurement
* Machinery procurement

---

# 7. Inventory & Warehouse Management

Tables:

* inventories
* inventory_transactions
* stock_movements
* stock_adjustments
* warehouse_transfers
* inventory_batches
* inventory_serials

Features:

* Real-time stock
* FIFO/LIFO
* Batch tracking
* Serial tracking
* Warehouse transfers
* Low stock alerts
* Damage tracking

---

# 8. Production Management

Tables:

* production_orders
* production_order_items
* bill_of_materials
* production_stages
* work_orders
* production_outputs
* production_losses
* line_assignments

Features:

* BOM support
* Accessories consumption
* Machinery allocation
* Production efficiency
* Waste calculation
* Line management

---

# 9. Pricing & Financial Structure

IMPORTANT:
The database must support international pricing structures.

Tables:

* currencies
* exchange_rates
* pricing_rules
* tax_rules
* discounts
* costing
* landed_costs

Features:

* Multi-currency
* Import cost
* Supplier pricing
* Dynamic pricing
* Factory costing
* Accessories pricing
* Machinery pricing
* Historical pricing

---

# 10. Maintenance & Engineering

Tables:

* maintenance_requests
* maintenance_tasks
* maintenance_engineers
* spare_parts_usage
* maintenance_schedules

Features:

* Preventive maintenance
* Corrective maintenance
* Spare part usage
* Downtime tracking

---

# 11. Reporting & Analytics

Design optimized reporting tables/materialized patterns for:

* Production reports
* Inventory valuation
* Machinery utilization
* Purchase analytics
* Supplier analytics
* Costing reports
* Profitability reports

---

# Database Design Standards

The schema must:

* Be fully normalized (3NF minimum)
* Avoid redundant data
* Use proper foreign keys
* Use cascading carefully
* Include optimized indexing
* Support high concurrency
* Support millions of records

---

# Audit & Tracking Requirements

Every important table should contain:

```sql id="lzz1j3"
created_at
updated_at
deleted_at
created_by
updated_by
deleted_by
```

Implement:

* Soft deletes
* Audit logs
* Change history
* Activity tracking

---

# Performance Requirements

Optimize for:

* High-volume inventory operations
* Fast reporting
* Large production data
* Real-time stock queries

Implement:

* Composite indexes
* Query optimization
* Partition-ready tables
* Read-heavy optimization

---

# Security Requirements

The database design must support:

* Role-based permissions
* Row-level ownership patterns
* Auditability
* Sensitive data isolation

Never expose:

* Internal credentials
* Raw secrets
* Unsafe logs

---

# Documentation Expectations

For every table:

1. Explain business purpose
2. Explain relationships
3. Explain normalization logic
4. Explain indexing strategy
5. Explain scalability considerations

---

# Output Requirements

Generate:

* ERD-style relationships
* Full table schemas
* Foreign key relationships
* Recommended indexes
* Migration-ready SQL
* Naming conventions
* Data type recommendations
* Scalability notes

---

# Naming Convention Standards

Use:

* snake_case
* singular/plural consistency
* clear naming
* business-friendly terminology

Example:

```sql id="1ikc8r"
purchase_orders
purchase_order_items
machinery_service_logs
inventory_transactions
```

---

# Final Quality Benchmark

The database architecture must feel:

* Enterprise-grade
* ERP-ready
* Industrial-scale
* International business ready
* Production-safe
* Scalable for millions of records

Never generate beginner-level schemas or poorly normalized structures.

Always prioritize:

* scalability
* maintainability
* normalization
* performance
* auditability
* extensibility
* internationalization
* industrial ERP standards

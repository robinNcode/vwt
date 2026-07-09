# Volt Wave Tech – Database Layer

> MySQL 8+ schema · GORM models · Auto-migrate · Seeders

---

## Directory Structure

```
voltwavetech/
├── sql/
│   └── schema.sql               # Full raw MySQL DDL (run once to create all tables)
├── migrations/
│   ├── migrate.go               # GORM AutoMigrate runner
│   └── models/
│       ├── auth_customer.go     # Role, Permission, User, Customer, CustomerAddress
│       ├── product.go           # Category, Attribute, Product, Variant, Price, Currency
│       ├── order_inventory.go   # Warehouse, Stock, Order, OrderItem, Invoice, Quotation
│       └── cms_system.go        # Page, Banner, Blog, Service, Contact, Settings, Logs
├── seeders/
│   └── seed.go                  # Bootstrap data seeder
└── go.mod
```

---

## Quick Start

### Option A — Raw SQL (recommended for first deploy)

```bash
mysql -u root -p < sql/schema.sql
```

### Option B — GORM AutoMigrate

```bash
# Set env vars
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=yourpassword
export DB_NAME=voltwavetech

# Run migrations
go run migrations/migrate.go

# Run seeders
go run seeders/seed.go
```

### Docker Compose example

```yaml
version: "3.9"
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: voltwavetech
    ports:
      - "3306:3306"
    volumes:
      - ./sql/schema.sql:/docker-entrypoint-initdb.d/schema.sql
```

---

## Default Credentials (after seeding)

| Field    | Value                   |
|----------|-------------------------|
| Email    | admin@voltwave.tech     |
| Password | Admin@123               |
| Role     | Super Admin             |

> ⚠️ Change the password immediately after first login.

---

## Key Design Decisions

| Topic | Decision |
|---|---|
| Primary Keys | `BIGINT UNSIGNED AUTO_INCREMENT` — predictable, fast joins, Redis-cache friendly |
| Soft Deletes | `deleted_at DATETIME NULL` on all user-facing entities |
| Localization | `_bn` / `_en` column pairs — avoids join overhead for 2-language setup |
| Order snapshots | All pricing/product names copied into `order_items` — immutable after placement |
| Pricing | `product_prices` per variant + currency with date-gated sale prices |
| Audit | `audit_logs` stores JSON `old_values` / `new_values` per entity change |
| Inventory | `stock.quantity - stock.reserved = available` pattern |
| Invoice config | `template_config JSON` column for per-invoice template overrides |

---

## Go Dependencies

```bash
go get gorm.io/gorm
go get gorm.io/driver/mysql
go get golang.org/x/crypto/bcrypt
```

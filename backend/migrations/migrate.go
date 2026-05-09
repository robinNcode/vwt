package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/migrations/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("warning: could not load .env file: %v", err)
	}

	dsn := buildDSN()

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	fmt.Println("🔄 Running auto-migrations...")

	err = db.AutoMigrate(
		// Auth & Admin
		&models.Role{},
		&models.Permission{},
		&models.User{},

		// Customers
		&models.Customer{},
		&models.CustomerAddress{},

		// Catalog
		&models.ProductCategory{},
		&models.AttributeGroup{},
		&models.Attribute{},
		&models.AttributeOption{},
		&models.Product{},
		&models.ProductImage{},
		&models.ProductAttributeValue{},
		&models.ProductVariant{},
		&models.ProductVariantAttribute{},

		// Pricing
		&models.Currency{},
		&models.ProductPrice{},
		&models.PriceHistory{},

		// Inventory
		&models.Warehouse{},
		&models.Stock{},
		&models.StockMovement{},

		// Orders
		&models.Order{},
		&models.OrderItem{},
		&models.OrderStatusHistory{},
		&models.Invoice{},

		// Quotations
		&models.Quotation{},
		&models.QuotationItem{},

		// CMS
		&models.Page{},
		&models.PageSection{},
		&models.Banner{},
		&models.BlogCategory{},
		&models.BlogPost{},

		// Services
		&models.Service{},

		// System
		&models.ContactMessage{},
		&models.Setting{},
		&models.ActivityLog{},
		&models.AuditLog{},
	)
	if err != nil {
		log.Fatalf("auto-migrate failed: %v", err)
	}

	fmt.Println("✅ Migrations completed successfully.")
}

func buildDSN() string {
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	user := getEnv("DB_USER", "root")
	password := getEnv("DB_PASSWORD", "")
	dbname := getEnv("DB_NAME", "voltwavetech")

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port, dbname,
	)
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

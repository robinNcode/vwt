package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/internal/config"
	dbPkg "github.com/robinncode/vwt/internal/db"
	"github.com/robinncode/vwt/internal/models"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Printf("warning: could not load .env file: %v", err)
	}

	cfg := config.Load()
	db, err := dbPkg.Connect(cfg)
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

		// Accounting
		&models.AccountingSale{},
		&models.AccountingPurchase{},
		&models.AccountingExpense{},
		&models.AccountingServiceRevenue{},
	)
	if err != nil {
		log.Fatalf("auto-migrate failed: %v", err)
	}

	fmt.Println("✅ Migrations completed successfully.")
}

// Removed Custom DB Setup helpers

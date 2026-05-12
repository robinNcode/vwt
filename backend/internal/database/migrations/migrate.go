package migrations

import (
	"fmt"
	"log"

	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	fmt.Println("🔄 Running auto-migrations...")

	err := db.AutoMigrate(
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
		log.Printf("auto-migrate failed: %v", err)
		return err
	}

	fmt.Println("✅ Auto-migrations completed successfully.")
	return nil
}

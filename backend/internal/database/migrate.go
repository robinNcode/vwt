package database

import (
	"fmt"
	"log"

	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	fmt.Println("🔄 Running auto-migrations...")

	err := db.AutoMigrate(
		// Auth & Admin
		&model.Role{},
		&model.Permission{},
		&model.User{},

		// Customers
		&model.Customer{},
		&model.CustomerAddress{},

		// Catalog
		&model.ProductCategory{},
		&model.AttributeGroup{},
		&model.Attribute{},
		&model.AttributeOption{},
		&model.Product{},
		&model.ProductImage{},
		&model.ProductAttributeValue{},
		&model.ProductVariant{},
		&model.ProductVariantAttribute{},

		// Pricing
		&model.Currency{},
		&model.ProductPrice{},
		&model.PriceHistory{},

		// Inventory
		&model.Warehouse{},
		&model.Stock{},
		&model.StockMovement{},

		// Orders
		&model.Order{},
		&model.OrderItem{},
		&model.OrderStatusHistory{},
		&model.Invoice{},

		// Quotations
		&model.Quotation{},
		&model.QuotationItem{},

		// CMS
		&model.Page{},
		&model.PageSection{},
		&model.Banner{},
		&model.BlogCategory{},
		&model.BlogPost{},

		// Services
		&model.Service{},

		// System
		&model.ContactMessage{},
		&model.Setting{},
		&model.ActivityLog{},
		&model.AuditLog{},

		// Accounting
		&model.AccountingSale{},
		&model.AccountingPurchase{},
		&model.AccountingExpense{},
		&model.AccountingServiceRevenue{},
	)

	if err != nil {
		log.Printf("auto-migrate failed: %v", err)
		return err
	}

	fmt.Println("✅ Auto-migrations completed successfully.")
	return nil
}

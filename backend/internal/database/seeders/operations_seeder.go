package seeders

import (
	"fmt"
	"time"

	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

func SeedOperations(db *gorm.DB) {
	fmt.Println("🚚 Seeding Operations (Inventory, Orders, Accounting)...")

	// 1. Warehouses
	warehouses := []models.Warehouse{
		{Name: "Dhaka Central Logistics", Address: strPtr("Tejgaon Industrial Area, Dhaka"), IsDefault: true, IsActive: true},
		{Name: "Chittagong Port Storage", Address: strPtr("Agrabad, Chittagong"), IsDefault: false, IsActive: true},
		{Name: "Khulna Distribution Center", Address: strPtr("Sonadanga, Khulna"), IsDefault: false, IsActive: true},
	}
	for i, wh := range warehouses {
		db.Where(models.Warehouse{Name: wh.Name}).FirstOrCreate(&warehouses[i])
	}

	// Fetch Products to map to
	var p models.Product
	db.Where("sku = ?", "HT-TR-500K").First(&p)
	var v models.ProductVariant
	db.Where("sku = ?", "HT-TR-500K-ORG").First(&v)

	// 2. Stock and Movements for Industrial Machineries
	if p.ID != 0 && v.ID != 0 {
		stocks := []models.Stock{
			{WarehouseID: warehouses[0].ID, VariantID: v.ID, Quantity: 5, Reserved: 2},
			{WarehouseID: warehouses[1].ID, VariantID: v.ID, Quantity: 15, Reserved: 5},
			{WarehouseID: warehouses[2].ID, VariantID: v.ID, Quantity: 2, Reserved: 1},
		}
		for i, s := range stocks {
			db.Where(models.Stock{WarehouseID: s.WarehouseID, VariantID: s.VariantID}).FirstOrCreate(&stocks[i])
		}

		movements := []models.StockMovement{
			{WarehouseID: warehouses[0].ID, VariantID: v.ID, MovementType: "in", Quantity: 5, Note: strPtr("PO-1002")},
			{WarehouseID: warehouses[1].ID, VariantID: v.ID, MovementType: "in", Quantity: 15, Note: strPtr("PO-PORT-104")},
			{WarehouseID: warehouses[2].ID, VariantID: v.ID, MovementType: "in", Quantity: 2, Note: strPtr("PO-KHU-11")},
		}
		for _, m := range movements {
			db.Where(models.StockMovement{Note: m.Note}).FirstOrCreate(&m)
		}
	}

	// 3. Orders & Order Items
	orders := []models.Order{
		{OrderNumber: "ORD-IN-2024-001", Subtotal: 450000.00, TaxAmount: 45000.00, GrandTotal: 495000.00, Status: "delivered", PaymentStatus: "paid", ShipAddressLine1: "Bashundhara R/A, Dhaka", ShipCity: "Dhaka", CustomerName: "Test 1", CustomerEmail: "test1@voltwave.tech", CustomerPhone: "0181"},
		{OrderNumber: "ORD-IN-2024-002", Subtotal: 1250000.00, TaxAmount: 125000.00, GrandTotal: 1375000.00, Status: "processing", PaymentStatus: "partial", ShipAddressLine1: "EPZ, Chittagong", ShipCity: "Chittagong", CustomerName: "Test 2", CustomerEmail: "test2@voltwave.tech", CustomerPhone: "0182"},
		{OrderNumber: "ORD-IN-2024-003", Subtotal: 45000.00, TaxAmount: 4500.00, GrandTotal: 49500.00, Status: "pending", PaymentStatus: "unpaid", ShipAddressLine1: "Mirpur, Dhaka", ShipCity: "Dhaka", CustomerName: "Test 3", CustomerEmail: "test3@voltwave.tech", CustomerPhone: "0183"},
	}
	for i, o := range orders {
		db.Where(models.Order{OrderNumber: o.OrderNumber}).FirstOrCreate(&orders[i])

		if v.ID != 0 {
			item := models.OrderItem{OrderID: orders[i].ID, VariantID: &v.ID, ProductNameBN: p.NameBN, ProductNameEN: p.NameEN, SKU: p.SKU, Quantity: 1, UnitPrice: orders[i].Subtotal, LineTotal: orders[i].Subtotal}
			db.Where(models.OrderItem{OrderID: item.OrderID}).FirstOrCreate(&item)
		}
	}

	// 4. Accounting Entries
	now := time.Now()
	sales := []models.AccountingSale{
		{Reference: "INV-2024-01", Amount: 495000.00, Date: now},
		{Reference: "INV-2024-02", Amount: 1375000.00, Date: now},
		{Reference: "INV-2024-03", Amount: 49500.00, Date: now},
	}
	for _, sl := range sales {
		db.Where(models.AccountingSale{Reference: sl.Reference}).FirstOrCreate(&sl)
	}

	purchases := []models.AccountingPurchase{
		{Reference: "PO-IMP-001", Vendor: "Vendor A", Amount: 300000.00, Date: now},
		{Reference: "PO-IMP-002", Vendor: "Vendor B", Amount: 900000.00, Date: now},
		{Reference: "PO-IMP-003", Vendor: "Vendor C", Amount: 30000.00, Date: now},
	}
	for _, pu := range purchases {
		db.Where(models.AccountingPurchase{Reference: pu.Reference}).FirstOrCreate(&pu)
	}

	expenses := []models.AccountingExpense{
		{Description: "Factory Rent", Category: "Rent", Amount: 50000.00, Date: now},
		{Description: "Labor", Category: "Wages", Amount: 15000.00, Date: now},
		{Description: "Electricity", Category: "Utility", Amount: 25000.00, Date: now},
	}
	for _, ex := range expenses {
		db.Where(models.AccountingExpense{Description: ex.Description}).FirstOrCreate(&ex)
	}
}

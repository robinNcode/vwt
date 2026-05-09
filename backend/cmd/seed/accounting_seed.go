package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/migrations/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		godotenv.Load()
	}

	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "127.0.0.1"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "3306"
	}
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "root"
	}
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "voltwavetech"
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port, dbname)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	fmt.Println("🌱 Seeding accounting data...")

	var count int64
	db.Model(&models.AccountingSale{}).Count(&count)
	if count == 0 {
		db.Create(&models.AccountingSale{Amount: 154000.0, Date: time.Now().AddDate(0, 0, -5), Reference: "INV-101"})
		db.Create(&models.AccountingSale{Amount: 210500.0, Date: time.Now().AddDate(0, 0, -2), Reference: "INV-102"})
		db.Create(&models.AccountingSale{Amount: 85000.0, Date: time.Now(), Reference: "INV-103"})
	}

	db.Model(&models.AccountingPurchase{}).Count(&count)
	if count == 0 {
		db.Create(&models.AccountingPurchase{Amount: 45000.0, Vendor: "Tech Supplier Inc", Date: time.Now().AddDate(0, 0, -10), Reference: "PO-201"})
		db.Create(&models.AccountingPurchase{Amount: 110000.0, Vendor: "Gadget Corp", Date: time.Now().AddDate(0, 0, -4), Reference: "PO-202"})
	}

	db.Model(&models.AccountingExpense{}).Count(&count)
	if count == 0 {
		db.Create(&models.AccountingExpense{Amount: 25000.0, Category: "Office Supplies", Description: "Monthly stationary", Date: time.Now().AddDate(0, 0, -15)})
		db.Create(&models.AccountingExpense{Amount: 45000.0, Category: "Marketing", Description: "Facebook Ads", Date: time.Now().AddDate(0, 0, -1)})
		db.Create(&models.AccountingExpense{Amount: 50000.0, Category: "Salaries", Description: "Support Team", Date: time.Now()})
	}

	db.Model(&models.AccountingServiceRevenue{}).Count(&count)
	if count == 0 {
		db.Create(&models.AccountingServiceRevenue{Amount: 15000.0, Date: time.Now().AddDate(0, 0, -25), Reference: "SVC-001"})
		db.Create(&models.AccountingServiceRevenue{Amount: 22000.0, Date: time.Now().AddDate(0, 0, -12), Reference: "SVC-002"})
	}

	fmt.Println("✅ Accounting seeders completed successfully.")
}

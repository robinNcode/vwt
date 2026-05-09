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

	fmt.Println("🌱 Seeding settings data...")

	settingsToSeed := []models.Setting{
		// General Configurations
		{Group: "general", Key: "contact_email", Value: stringPtr("contact@voltwavetech.com"), LabelEN: stringPtr("Contact Email")},
		{Group: "general", Key: "contact_phone", Value: stringPtr("+880 1234 567890"), LabelEN: stringPtr("Contact Phone")},
		{Group: "general", Key: "address_line_1", Value: stringPtr("Level 4, House 25, Road 14"), LabelEN: stringPtr("Address Line 1")},
		{Group: "general", Key: "address_line_2", Value: stringPtr("Dhanmondi, Dhaka"), LabelEN: stringPtr("Address Line 2")},

		// Public Pages Dynamic Data
		{Group: "public_pages", Key: "site_tagline", Value: stringPtr("Innovating the future"), LabelEN: stringPtr("Site Tagline")},
		{Group: "public_pages", Key: "meta_description", Value: stringPtr("Volt Wave Tech offers premier software solutions."), LabelEN: stringPtr("Meta Description")},
		{Group: "public_pages", Key: "logo_url", Value: stringPtr("/assets/images/final_logo.png"), LabelEN: stringPtr("Logo URL")},

		// Invoice / Quotation Template
		{Group: "invoice_template", Key: "footer_text", Value: stringPtr("Thank you for your business."), LabelEN: stringPtr("Footer Text")},
		{Group: "invoice_template", Key: "theme_color", Value: stringPtr("#F5A623"), LabelEN: stringPtr("Theme Color")},
		{Group: "invoice_template", Key: "default_tax_rate", Value: stringPtr("15"), LabelEN: stringPtr("Default Tax Rate (%)")},
	}

	for _, s := range settingsToSeed {
		var count int64
		db.Model(&models.Setting{}).Where("`group` = ? AND `key` = ?", s.Group, s.Key).Count(&count)
		if count == 0 {
			if err := db.Create(&s).Error; err != nil {
				log.Printf("Failed to seed %s/%s: %v", s.Group, s.Key, err)
			}
		}
	}

	fmt.Println("✅ Settings seeder completed successfully.")
}

func stringPtr(s string) *string {
	return &s
}

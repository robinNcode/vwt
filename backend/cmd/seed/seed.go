package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/migrations/models"
	"golang.org/x/crypto/bcrypt"
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
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}

	fmt.Println("🌱 Running seeders...")

	seedCurrencies(db)
	seedRoles(db)
	seedPermissions(db)
	seedUsers(db)
	seedWarehouses(db)
	seedProductCategories(db)
	seedAttributeGroups(db)
	seedAttributes(db)
	seedPages(db)
	seedSettings(db)
	seedBanners(db)
	seedBlogCategories(db)
	seedServices(db)

	fmt.Println("✅ Seeding completed successfully.")
}

// ─── Currencies ───────────────────────────────────────────────────────────────

func seedCurrencies(db *gorm.DB) {
	currencies := []models.Currency{
		{Code: "BDT", Symbol: "৳", Name: "Bangladeshi Taka", Rate: 1.000000, IsBase: true, IsActive: true},
		{Code: "USD", Symbol: "$", Name: "US Dollar", Rate: 0.009100, IsBase: false, IsActive: true},
	}
	for _, c := range currencies {
		db.Where(models.Currency{Code: c.Code}).FirstOrCreate(&c)
	}
	fmt.Println("  ✔ currencies")
}

// ─── Roles ────────────────────────────────────────────────────────────────────

func seedRoles(db *gorm.DB) {
	roles := []models.Role{
		{Name: "Super Admin", Slug: "super-admin"},
		{Name: "Admin", Slug: "admin"},
		{Name: "Editor", Slug: "editor"},
		{Name: "Support", Slug: "support"},
	}
	for _, r := range roles {
		db.Where(models.Role{Slug: r.Slug}).FirstOrCreate(&r)
	}
	fmt.Println("  ✔ roles")
}

// ─── Permissions ──────────────────────────────────────────────────────────────

func seedPermissions(db *gorm.DB) {
	permissions := []models.Permission{
		// Products
		{Name: "View Products", Slug: "products.view", Module: "products"},
		{Name: "Create Products", Slug: "products.create", Module: "products"},
		{Name: "Update Products", Slug: "products.update", Module: "products"},
		{Name: "Delete Products", Slug: "products.delete", Module: "products"},
		// Orders
		{Name: "View Orders", Slug: "orders.view", Module: "orders"},
		{Name: "Update Orders", Slug: "orders.update", Module: "orders"},
		{Name: "Delete Orders", Slug: "orders.delete", Module: "orders"},
		// Services
		{Name: "View Services", Slug: "services.view", Module: "services"},
		{Name: "Create Services", Slug: "services.create", Module: "services"},
		{Name: "Update Services", Slug: "services.update", Module: "services"},
		{Name: "Delete Services", Slug: "services.delete", Module: "services"},
		// CMS
		{Name: "View CMS", Slug: "cms.view", Module: "cms"},
		{Name: "Create CMS", Slug: "cms.create", Module: "cms"},
		{Name: "Update CMS", Slug: "cms.update", Module: "cms"},
		{Name: "Delete CMS", Slug: "cms.delete", Module: "cms"},
		// Customers
		{Name: "View Customers", Slug: "customers.view", Module: "customers"},
		// Invoices
		{Name: "View Invoices", Slug: "invoices.view", Module: "invoices"},
		{Name: "Create Invoices", Slug: "invoices.create", Module: "invoices"},
		{Name: "Update Invoices", Slug: "invoices.update", Module: "invoices"},
		{Name: "Delete Invoices", Slug: "invoices.delete", Module: "invoices"},
		// Settings
		{Name: "Manage Settings", Slug: "settings.manage", Module: "settings"},
		// Admin Users
		{Name: "Manage Admins", Slug: "admins.manage", Module: "admins"},
		// Logs
		{Name: "View Logs", Slug: "logs.view", Module: "logs"},
		// Messages
		{Name: "View Messages", Slug: "messages.view", Module: "messages"},
	}
	for _, p := range permissions {
		db.Where(models.Permission{Slug: p.Slug}).FirstOrCreate(&p)
	}

	// Assign all permissions to Super Admin
	var superAdminRole models.Role
	db.Where("slug = ?", "super-admin").First(&superAdminRole)
	var allPerms []models.Permission
	db.Find(&allPerms)
	db.Model(&superAdminRole).Association("Permissions").Replace(allPerms)

	fmt.Println("  ✔ permissions")
}

// ─── Admin Users ──────────────────────────────────────────────────────────────

func seedUsers(db *gorm.DB) {
	var superRole models.Role
	db.Where("slug = ?", "super-admin").First(&superRole)

	password, _ := bcrypt.GenerateFromPassword([]byte("Admin@123"), bcrypt.DefaultCost)

	admin := models.User{
		RoleID:   superRole.ID,
		Name:     "Super Admin",
		Email:    "admin@voltwave.tech",
		Password: string(password),
		IsActive: true,
	}
	db.Where(models.User{Email: admin.Email}).FirstOrCreate(&admin)
	fmt.Println("  ✔ admin users  (email: admin@voltwave.tech | password: Admin@123)")
}

// ─── Warehouses ───────────────────────────────────────────────────────────────

func seedWarehouses(db *gorm.DB) {
	wh := models.Warehouse{
		Name:      "Main Warehouse",
		Address:   strPtr("Dhaka, Bangladesh"),
		IsDefault: true,
		IsActive:  true,
	}
	db.Where(models.Warehouse{Name: wh.Name}).FirstOrCreate(&wh)
	fmt.Println("  ✔ warehouses")
}

// ─── Product Categories ───────────────────────────────────────────────────────

func seedProductCategories(db *gorm.DB) {
	categories := []models.ProductCategory{
		{NameBN: "ইলেকট্রিক্যাল এক্সেসরিজ", NameEN: "Electrical Accessories", Slug: "electrical-accessories", IsActive: true},
		{NameBN: "ইলেকট্রনিক্স এক্সেসরিজ", NameEN: "Electronics Accessories", Slug: "electronics-accessories", IsActive: true},
		{NameBN: "ওয়্যারিং ম্যাটেরিয়াল", NameEN: "Wiring Materials", Slug: "wiring-materials", IsActive: true},
		{NameBN: "সুইচ ও সকেট", NameEN: "Switches & Sockets", Slug: "switches-sockets", IsActive: true},
		{NameBN: "সার্কিট ব্রেকার", NameEN: "Circuit Breakers", Slug: "circuit-breakers", IsActive: true},
		{NameBN: "লাইটিং", NameEN: "Lighting", Slug: "lighting", IsActive: true},
		{NameBN: "ক্যাবল ও কানেক্টর", NameEN: "Cables & Connectors", Slug: "cables-connectors", IsActive: true},
		{NameBN: "পাওয়ার টুলস", NameEN: "Power Tools", Slug: "power-tools", IsActive: true},
		{NameBN: "মিটার ও টেস্টার", NameEN: "Meters & Testers", Slug: "meters-testers", IsActive: true},
	}
	for _, c := range categories {
		db.Where(models.ProductCategory{Slug: c.Slug}).FirstOrCreate(&c)
	}
	fmt.Println("  ✔ product categories")
}

// ─── Attribute Groups ─────────────────────────────────────────────────────────

func seedAttributeGroups(db *gorm.DB) {
	groups := []models.AttributeGroup{
		{NameBN: "বৈদ্যুতিক বৈশিষ্ট্য", NameEN: "Electrical Specs", SortOrder: 1},
		{NameBN: "শারীরিক বৈশিষ্ট্য", NameEN: "Physical Specs", SortOrder: 2},
		{NameBN: "সংযোগ", NameEN: "Connectivity", SortOrder: 3},
	}
	for _, g := range groups {
		db.Where(models.AttributeGroup{NameEN: g.NameEN}).FirstOrCreate(&g)
	}
	fmt.Println("  ✔ attribute groups")
}

// ─── Attributes ───────────────────────────────────────────────────────────────

func seedAttributes(db *gorm.DB) {
	var elecGroup, physGroup models.AttributeGroup
	db.Where("name_en = ?", "Electrical Specs").First(&elecGroup)
	db.Where("name_en = ?", "Physical Specs").First(&physGroup)

	attributes := []struct {
		attr    models.Attribute
		options []models.AttributeOption
	}{
		{
			attr: models.Attribute{GroupID: &elecGroup.ID, NameBN: "ভোল্টেজ", NameEN: "Voltage", Slug: "voltage", InputType: "select", Unit: strPtr("V"), IsVariantAttr: true},
			options: []models.AttributeOption{
				{ValueBN: "২২০ ভোল্ট", ValueEN: "220V"},
				{ValueBN: "৪৪০ ভোল্ট", ValueEN: "440V"},
				{ValueBN: "১২ ভোল্ট", ValueEN: "12V"},
				{ValueBN: "২৪ ভোল্ট", ValueEN: "24V"},
			},
		},
		{
			attr: models.Attribute{GroupID: &elecGroup.ID, NameBN: "কারেন্ট রেটিং", NameEN: "Current Rating", Slug: "current-rating", InputType: "select", Unit: strPtr("A"), IsVariantAttr: true},
			options: []models.AttributeOption{
				{ValueBN: "১০ অ্যাম্পিয়ার", ValueEN: "10A"},
				{ValueBN: "১৬ অ্যাম্পিয়ার", ValueEN: "16A"},
				{ValueBN: "৩২ অ্যাম্পিয়ার", ValueEN: "32A"},
				{ValueBN: "৬৩ অ্যাম্পিয়ার", ValueEN: "63A"},
			},
		},
		{
			attr: models.Attribute{GroupID: &elecGroup.ID, NameBN: "ফেজ", NameEN: "Phase", Slug: "phase", InputType: "select", IsVariantAttr: false},
			options: []models.AttributeOption{
				{ValueBN: "সিঙ্গেল ফেজ", ValueEN: "Single Phase"},
				{ValueBN: "থ্রি ফেজ", ValueEN: "Three Phase"},
			},
		},
		{
			attr: models.Attribute{GroupID: &physGroup.ID, NameBN: "রঙ", NameEN: "Color", Slug: "color", InputType: "select", IsVariantAttr: true},
			options: []models.AttributeOption{
				{ValueBN: "সাদা", ValueEN: "White"},
				{ValueBN: "কালো", ValueEN: "Black"},
				{ValueBN: "ধূসর", ValueEN: "Gray"},
				{ValueBN: "লাল", ValueEN: "Red"},
			},
		},
		{
			attr: models.Attribute{GroupID: &physGroup.ID, NameBN: "উপাদান", NameEN: "Material", Slug: "material", InputType: "select", IsVariantAttr: false},
			options: []models.AttributeOption{
				{ValueBN: "প্লাস্টিক", ValueEN: "Plastic"},
				{ValueBN: "ধাতু", ValueEN: "Metal"},
				{ValueBN: "রাবার", ValueEN: "Rubber"},
				{ValueBN: "তামা", ValueEN: "Copper"},
			},
		},
	}

	for _, a := range attributes {
		attr := a.attr
		db.Where(models.Attribute{Slug: attr.Slug}).FirstOrCreate(&attr)
		for _, opt := range a.options {
			opt.AttributeID = attr.ID
			db.Where(models.AttributeOption{AttributeID: attr.ID, ValueEN: opt.ValueEN}).FirstOrCreate(&opt)
		}
	}
	fmt.Println("  ✔ attributes & options")
}

// ─── Pages ────────────────────────────────────────────────────────────────────

func seedPages(db *gorm.DB) {
	now := time.Now()
	pages := []models.Page{
		{
			Slug:        "about-us",
			TitleBN:     "আমাদের সম্পর্কে",
			TitleEN:     "About Us",
			ContentBN:   strPtr("ভোল্ট ওয়েভ টেক বাংলাদেশের একটি বিশ্বস্ত ইলেকট্রিক্যাল ও ইলেকট্রনিক্স পণ্যের অনলাইন প্ল্যাটফর্ম।"),
			ContentEN:   strPtr("Volt Wave Tech is a trusted online platform for electrical and electronics accessories in Bangladesh."),
			Status:      "published",
			PublishedAt: &now,
		},
		{
			Slug:        "privacy-policy",
			TitleBN:     "গোপনীয়তা নীতি",
			TitleEN:     "Privacy Policy",
			ContentBN:   strPtr("আমাদের গোপনীয়তা নীতি সম্পর্কে বিস্তারিত তথ্য এখানে পাওয়া যাবে।"),
			ContentEN:   strPtr("Our privacy policy details will be available here."),
			Status:      "published",
			PublishedAt: &now,
		},
		{
			Slug:        "terms-and-conditions",
			TitleBN:     "নিয়ম ও শর্তাবলী",
			TitleEN:     "Terms & Conditions",
			ContentBN:   strPtr("আমাদের সেবা ব্যবহারের নিয়ম ও শর্তাবলী।"),
			ContentEN:   strPtr("Terms and conditions for using our services."),
			Status:      "published",
			PublishedAt: &now,
		},
		{
			Slug:    "return-policy",
			TitleBN: "রিটার্ন পলিসি",
			TitleEN: "Return Policy",
			Status:  "draft",
		},
	}
	for _, p := range pages {
		db.Where(models.Page{Slug: p.Slug}).FirstOrCreate(&p)
	}
	fmt.Println("  ✔ pages")
}

// ─── Settings ────────────────────────────────────────────────────────────────

func seedSettings(db *gorm.DB) {
	settings := []models.Setting{
		{Group: "general", Key: "site_name", Value: strPtr("Volt Wave Tech"), LabelEN: strPtr("Site Name")},
		{Group: "general", Key: "site_email", Value: strPtr("info@voltwave.tech"), LabelEN: strPtr("Site Email")},
		{Group: "general", Key: "site_phone", Value: strPtr("+8801XXXXXXXXX"), LabelEN: strPtr("Site Phone")},
		{Group: "general", Key: "site_address", Value: strPtr("Dhaka, Bangladesh"), LabelEN: strPtr("Site Address")},
		{Group: "general", Key: "default_currency", Value: strPtr("BDT"), LabelEN: strPtr("Default Currency")},
		{Group: "general", Key: "default_language", Value: strPtr("bn"), LabelEN: strPtr("Default Language")},
		{Group: "order", Key: "min_order_amount", Value: strPtr("0"), LabelEN: strPtr("Minimum Order Amount")},
		{Group: "order", Key: "free_shipping_threshold", Value: strPtr("1000"), LabelEN: strPtr("Free Shipping Above (BDT)")},
		{Group: "invoice", Key: "invoice_prefix", Value: strPtr("VWT-INV-"), LabelEN: strPtr("Invoice Number Prefix")},
		{Group: "invoice", Key: "invoice_footer", Value: strPtr("Thank you for your business!"), LabelEN: strPtr("Invoice Footer Text")},
		{Group: "seo", Key: "meta_title", Value: strPtr("Volt Wave Tech - Electrical & Electronics Accessories"), LabelEN: strPtr("Default Meta Title")},
		{Group: "seo", Key: "meta_description", Value: strPtr("Shop quality electrical and electronics accessories online in Bangladesh."), LabelEN: strPtr("Default Meta Description")},
	}
	for _, s := range settings {
		db.Where(models.Setting{Group: s.Group, Key: s.Key}).FirstOrCreate(&s)
	}
	fmt.Println("  ✔ settings")
}

// ─── Banners ─────────────────────────────────────────────────────────────────

func seedBanners(db *gorm.DB) {
	banners := []models.Banner{
		{
			TitleEN:    strPtr("Premium Electrical Accessories"),
			TitleBN:    strPtr("প্রিমিয়াম ইলেকট্রিক্যাল এক্সেসরিজ"),
			SubtitleEN: strPtr("Shop the latest electrical products at competitive prices."),
			SubtitleBN: strPtr("সেরা মূল্যে ইলেকট্রিক্যাল পণ্য কিনুন।"),
			ImageURL:   "/uploads/banners/hero-1.jpg",
			Placement:  "hero",
			IsActive:   true,
			SortOrder:  1,
		},
		{
			TitleEN:   strPtr("Exclusive Deals This Week"),
			TitleBN:   strPtr("এই সপ্তাহের বিশেষ অফার"),
			ImageURL:  "/uploads/banners/hero-2.jpg",
			Placement: "hero",
			IsActive:  true,
			SortOrder: 2,
		},
	}
	for i, b := range banners {
		var count int64
		db.Model(&models.Banner{}).Where("image_url = ?", b.ImageURL).Count(&count)
		if count == 0 {
			db.Create(&banners[i])
		}
	}
	fmt.Println("  ✔ banners")
}

// ─── Blog Categories ─────────────────────────────────────────────────────────

func seedBlogCategories(db *gorm.DB) {
	cats := []models.BlogCategory{
		{NameBN: "ইলেকট্রিক্যাল টিপস", NameEN: "Electrical Tips", Slug: "electrical-tips"},
		{NameBN: "পণ্য পর্যালোচনা", NameEN: "Product Reviews", Slug: "product-reviews"},
		{NameBN: "ইন্ডাস্ট্রি নিউজ", NameEN: "Industry News", Slug: "industry-news"},
	}
	for _, c := range cats {
		db.Where(models.BlogCategory{Slug: c.Slug}).FirstOrCreate(&c)
	}
	fmt.Println("  ✔ blog categories")
}

// ─── Services ────────────────────────────────────────────────────────────────

func seedServices(db *gorm.DB) {
	services := []models.Service{
		{
			NameBN:        "ইলেকট্রিক্যাল ইন্সটলেশন",
			NameEN:        "Electrical Installation",
			Slug:          "electrical-installation",
			DescriptionBN: strPtr("পেশাদার ইলেকট্রিশিয়ান দ্বারা ইলেকট্রিক্যাল ইন্সটলেশন সেবা।"),
			DescriptionEN: strPtr("Professional electrical installation service by certified electricians."),
			IsActive:      true,
			SortOrder:     1,
		},
		{
			NameBN:        "ইলেকট্রিক্যাল মেরামত",
			NameEN:        "Electrical Repair",
			Slug:          "electrical-repair",
			DescriptionBN: strPtr("দ্রুত ও নির্ভরযোগ্য ইলেকট্রিক্যাল মেরামত সেবা।"),
			DescriptionEN: strPtr("Fast and reliable electrical repair service."),
			IsActive:      true,
			SortOrder:     2,
		},
		{
			NameBN:        "কনসালটেশন",
			NameEN:        "Consultation",
			Slug:          "consultation",
			DescriptionBN: strPtr("বিশেষজ্ঞ পরামর্শ সেবা।"),
			DescriptionEN: strPtr("Expert consultation for your electrical needs."),
			Price:         float64Ptr(500.00),
			IsActive:      true,
			SortOrder:     3,
		},
	}
	for _, s := range services {
		db.Where(models.Service{Slug: s.Slug}).FirstOrCreate(&s)
	}
	fmt.Println("  ✔ services")
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func strPtr(s string) *string       { return &s }
func float64Ptr(f float64) *float64 { return &f }

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

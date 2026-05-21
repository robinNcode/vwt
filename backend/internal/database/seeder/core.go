package seeder

import (
	"fmt"

	"github.com/robinncode/vwt/internal/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedCore(db *gorm.DB) {
	fmt.Println("🚀 Seeding Core (Currencies, Roles, Users, Settings)...")

	// Currencies
	currencies := []model.Currency{
		{Code: "BDT", Symbol: "৳", Name: "Bangladeshi Taka", Rate: 1.000000, IsBase: true, IsActive: true},
		{Code: "USD", Symbol: "$", Name: "US Dollar", Rate: 0.009100, IsBase: false, IsActive: true},
		{Code: "EUR", Symbol: "€", Name: "Euro", Rate: 0.008400, IsBase: false, IsActive: true},
	}
	for _, c := range currencies {
		db.Where(model.Currency{Code: c.Code}).FirstOrCreate(&c)
	}

	// Roles
	roles := []model.Role{
		{Name: "Super Admin", Slug: "super-admin"},
		{Name: "Admin", Slug: "admin"},
		{Name: "Procurement Manager", Slug: "procurement-manager"},
	}
	for _, r := range roles {
		db.Where(model.Role{Slug: r.Slug}).FirstOrCreate(&r)
	}

	// Permissions
	permissions := []model.Permission{
		{Name: "View Products", Slug: "products.view", Module: "products"},
		{Name: "Manage Products", Slug: "products.manage", Module: "products"},
		{Name: "View Services", Slug: "services.view", Module: "services"},
		{Name: "Manage Services", Slug: "services.manage", Module: "services"},
		{Name: "View Orders", Slug: "orders.view", Module: "orders"},
		{Name: "Manage Orders", Slug: "orders.manage", Module: "orders"},
		{Name: "View Quotations", Slug: "quotations.view", Module: "quotations"},
		{Name: "Manage Quotations", Slug: "quotations.manage", Module: "quotations"},
		{Name: "View Invoices", Slug: "invoices.view", Module: "invoices"},
		{Name: "Manage Invoices", Slug: "invoices.manage", Module: "invoices"},
		{Name: "View Accounting", Slug: "accounting.view", Module: "accounting"},
		{Name: "Manage Accounting", Slug: "accounting.manage", Module: "accounting"},
		{Name: "View Reports", Slug: "reports.view", Module: "reports"},
		{Name: "Manage Settings", Slug: "settings.manage", Module: "settings"},
		{Name: "Manage Users", Slug: "users.manage", Module: "users"},
	}
	for _, p := range permissions {
		db.Where(model.Permission{Slug: p.Slug}).FirstOrCreate(&p)
	}

	var superRole model.Role
	db.Where("slug = ?", "super-admin").First(&superRole)
	var allPerms []model.Permission
	db.Find(&allPerms)
	db.Model(&superRole).Association("Permissions").Replace(allPerms)

	// Users
	password, _ := bcrypt.GenerateFromPassword([]byte("Admin@123"), bcrypt.DefaultCost)
	admin := model.User{
		RoleID:   superRole.ID,
		Name:     "System Admin",
		Email:    "admin@voltwave.tech",
		Password: string(password),
		IsActive: true,
	}
	db.Where(model.User{Email: admin.Email}).FirstOrCreate(&admin)

	// Settings
	settings := []model.Setting{
		{Group: "general", Key: "site_name", Value: strPtr("Volt Wave Tech"), LabelEN: strPtr("Site Name"), LabelBN: strPtr("সাইটের নাম")},
		{Group: "general", Key: "site_address", Value: strPtr("Kazi Nazrul Islam Ave, Dhaka, Bangladesh"), LabelEN: strPtr("Site Address"), LabelBN: strPtr("সাইটের ঠিকানা")},
		{Group: "general", Key: "site_email", Value: strPtr("info@voltwave.tech"), LabelEN: strPtr("Site Support Email"), LabelBN: strPtr("সাইট সাপোর্ট ইমেল")},
		{Group: "general", Key: "site_phone", Value: strPtr("+880 1700-000000"), LabelEN: strPtr("Site Phone"), LabelBN: strPtr("সাইট ফোন")},
		{Group: "general", Key: "footer_text", Value: strPtr("© 2024 Volt Wave Tech. All Rights Reserved."), LabelEN: strPtr("Footer Text"), LabelBN: strPtr("ফুটার টেক্সট")},

		{Group: "social", Key: "facebook_url", Value: strPtr("https://facebook.com/voltwavetech"), LabelEN: strPtr("Facebook URL"), LabelBN: strPtr("ফেসবুক ইউআরএল")},
		{Group: "social", Key: "linkedin_url", Value: strPtr("https://linkedin.com/company/voltwave"), LabelEN: strPtr("LinkedIn URL"), LabelBN: strPtr("লিঙ্কডইন ইউআরএল")},

		{Group: "logistics", Key: "machinery_import_tax", Value: strPtr("15.5"), LabelEN: strPtr("Machinery Import Tax %"), LabelBN: strPtr("যন্ত্রপাতি আমদানি ট্যাক্স %")},
		{Group: "logistics", Key: "default_shipment_method", Value: strPtr("Freight"), LabelEN: strPtr("Default Shipment Method"), LabelBN: strPtr("ডিফল্ট শিপমেন্ট মেথড")},

		{Group: "security", Key: "enable_mfa", Value: strPtr("false"), LabelEN: strPtr("Enable Multi-Factor Authentication"), LabelBN: strPtr("মাল্টি-ফ্যাক্টর অথেন্টিকেশন এনাবল করুন")},
		{Group: "security", Key: "session_timeout", Value: strPtr("60"), LabelEN: strPtr("Session Timeout (minutes)"), LabelBN: strPtr("সেশন টাইমআউট (মিনিট)")},

		{Group: "notifications", Key: "email_on_new_order", Value: strPtr("true"), LabelEN: strPtr("Email Notification on New Order"), LabelBN: strPtr("নতুন অর্ডারে ইমেল নোটিফিকেশন")},
		{Group: "notifications", Key: "sms_on_critical_alert", Value: strPtr("true"), LabelEN: strPtr("SMS Alert for Critical Machinery Errors"), LabelBN: strPtr("গুরুতর যন্ত্রপাতি ত্রুটির জন্য এসএমএস সতর্কতা")},
	}
	for _, s := range settings {
		db.Where(model.Setting{Group: s.Group, Key: s.Key}).Assign(s).FirstOrCreate(&s)
	}
}

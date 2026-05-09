package seeders

import (
	"fmt"

	"github.com/robinncode/vwt/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedCore(db *gorm.DB) {
	fmt.Println("🚀 Seeding Core (Currencies, Roles, Users, Settings)...")

	// Currencies
	currencies := []models.Currency{
		{Code: "BDT", Symbol: "৳", Name: "Bangladeshi Taka", Rate: 1.000000, IsBase: true, IsActive: true},
		{Code: "USD", Symbol: "$", Name: "US Dollar", Rate: 0.009100, IsBase: false, IsActive: true},
		{Code: "EUR", Symbol: "€", Name: "Euro", Rate: 0.008400, IsBase: false, IsActive: true},
	}
	for _, c := range currencies {
		db.Where(models.Currency{Code: c.Code}).FirstOrCreate(&c)
	}

	// Roles
	roles := []models.Role{
		{Name: "Super Admin", Slug: "super-admin"},
		{Name: "Admin", Slug: "admin"},
		{Name: "Procurement Manager", Slug: "procurement-manager"},
	}
	for _, r := range roles {
		db.Where(models.Role{Slug: r.Slug}).FirstOrCreate(&r)
	}

	// Permissions
	permissions := []models.Permission{
		{Name: "View Products", Slug: "products.view", Module: "products"},
		{Name: "Create Products", Slug: "products.create", Module: "products"},
		{Name: "Update Products", Slug: "products.update", Module: "products"},
		{Name: "View Orders", Slug: "orders.view", Module: "orders"},
		{Name: "Manage Heavy Machinery Settings", Slug: "settings.machinery", Module: "settings"},
	}
	for _, p := range permissions {
		db.Where(models.Permission{Slug: p.Slug}).FirstOrCreate(&p)
	}

	var superRole models.Role
	db.Where("slug = ?", "super-admin").First(&superRole)
	var allPerms []models.Permission
	db.Find(&allPerms)
	db.Model(&superRole).Association("Permissions").Replace(allPerms)

	// Users
	password, _ := bcrypt.GenerateFromPassword([]byte("Admin@123"), bcrypt.DefaultCost)
	admin := models.User{
		RoleID:   superRole.ID,
		Name:     "System Admin",
		Email:    "admin@voltwave.tech",
		Password: string(password),
		IsActive: true,
	}
	db.Where(models.User{Email: admin.Email}).FirstOrCreate(&admin)

	// Settings
	settings := []models.Setting{
		{Group: "general", Key: "site_name", Value: strPtr("Volt Wave Tech"), LabelEN: strPtr("Site Name")},
		{Group: "general", Key: "site_address", Value: strPtr("Kazi Nazrul Islam Ave, Dhaka, Bangladesh"), LabelEN: strPtr("Site Address")},
		{Group: "logistics", Key: "machinery_import_tax", Value: strPtr("15.5"), LabelEN: strPtr("Machinery Import Tax %")},
	}
	for _, s := range settings {
		db.Where(models.Setting{Group: s.Group, Key: s.Key}).FirstOrCreate(&s)
	}
}

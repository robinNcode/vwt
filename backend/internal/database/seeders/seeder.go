package seeders

import (
	"fmt"

	"gorm.io/gorm"
)

func RunAll(db *gorm.DB) {
	fmt.Println("🌱 Running Laravel-style Seeders Engine...")

	SeedCore(db)
	SeedCatalog(db)
	SeedProducts(db)
	SeedOperations(db)
	SeedCMS(db)

	fmt.Println("✅ All structured seeders deployed successfully!")
}

// Helpers
func strPtr(s string) *string       { return &s }
func float64Ptr(f float64) *float64 { return &f }

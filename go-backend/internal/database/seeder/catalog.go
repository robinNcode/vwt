package seeder

import (
	"fmt"

	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

func SeedCatalog(db *gorm.DB) {
	fmt.Println("🏭 Seeding Catalog (Industrial Machineries)...")

	// 1. Categories
	categories := []model.ProductCategory{
		{NameBN: "ইন্ডাস্ট্রিয়াল ট্রান্সফরমার", NameEN: "Industrial Transformers", Slug: "industrial-transformers", IsActive: true},
		{NameBN: "পাওয়ার জেনারেটর", NameEN: "Power Generators", Slug: "power-generators", IsActive: true},
		{NameBN: "পিএলসি ও অটোমেশন", NameEN: "PLC & Automation", Slug: "plc-automation", IsActive: true},
	}
	for _, c := range categories {
		db.Where(model.ProductCategory{Slug: c.Slug}).FirstOrCreate(&c)
	}

	// 2. Attribute Groups & Attributes
	group := model.AttributeGroup{NameBN: "কারিগরি স্পেসিফিকেশন", NameEN: "Technical Specs", SortOrder: 1}
	db.Where(model.AttributeGroup{NameEN: group.NameEN}).FirstOrCreate(&group)

	attrs := []model.Attribute{
		{GroupID: &group.ID, NameBN: "ক্যাপাসিটি", NameEN: "Capacity", Slug: "capacity", InputType: "select", Unit: strPtr("KVA")},
		{GroupID: &group.ID, NameBN: "ভোল্টেজ", NameEN: "Voltage", Slug: "voltage", InputType: "select", Unit: strPtr("V")},
		{GroupID: &group.ID, NameBN: "ওয়ারেন্টি", NameEN: "Warranty", Slug: "warranty", InputType: "text", Unit: strPtr("Years")},
	}
	for i, a := range attrs {
		db.Where(model.Attribute{Slug: a.Slug}).FirstOrCreate(&attrs[i])
	}

	opts := []model.AttributeOption{
		{AttributeID: attrs[0].ID, ValueBN: "৫০০ কেভিএ", ValueEN: "500 KVA"},
		{AttributeID: attrs[0].ID, ValueBN: "১০০০ কেভিএ", ValueEN: "1000 KVA"},
		{AttributeID: attrs[1].ID, ValueBN: "৩০০ ভোল্ট", ValueEN: "300V"},
	}
	for _, o := range opts {
		db.Where(model.AttributeOption{ValueEN: o.ValueEN, AttributeID: o.AttributeID}).FirstOrCreate(&o)
	}

	// 3. Products
	products := []model.Product{
		{
			CategoryID:   categories[0].ID,
			ProductType:  "heavy_machinery",
			NameBN:       "হিটাচি ৫০০ কেভিএ ডিস্ট্রিবিউশন ট্রান্সফরমার",
			NameEN:       "Hitachi 500KVA Distribution Transformer",
			Slug:         "hitachi-500kva-distribution-transformer",
			SKU:          "HT-TR-500K",
			Price:        450000.00,
			Brand:        strPtr("Hitachi"),
			Manufacturer: strPtr("Hitachi Energy Ltd"),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "heavy_machinery",
			NameBN:       "পারকিন্স ১০০০ কেভিএ ডিজেল জেনারেটর",
			NameEN:       "Perkins 1000KVA Diesel Generator",
			Slug:         "perkins-1000kva-diesel-generator",
			SKU:          "PK-GEN-1000K",
			Price:        1250000.00,
			Brand:        strPtr("Perkins"),
			Manufacturer: strPtr("Perkins Engines Co"),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[2].ID,
			ProductType:  "electronics",
			NameBN:       "সিমেন্স S7-1200 পিএলসি কন্ট্রোলার",
			NameEN:       "Siemens S7-1200 PLC Controller",
			Slug:         "siemens-s7-1200-plc",
			SKU:          "SM-S7-1200",
			Price:        45000.00,
			Brand:        strPtr("Siemens"),
			Manufacturer: strPtr("Siemens AG"),
			IsFeatured:   false,
			IsActive:     true,
		},
	}
	for i, p := range products {
		db.Where(model.Product{SKU: p.SKU}).FirstOrCreate(&products[i])
	}

	// 4. Images
	images := []model.ProductImage{
		{ProductID: products[0].ID, URL: "/images/catalog/hitachi-transformer.jpg", IsPrimary: true},
		{ProductID: products[1].ID, URL: "/images/catalog/perkins-generator.jpg", IsPrimary: true},
		{ProductID: products[2].ID, URL: "/images/catalog/siemens-plc.jpg", IsPrimary: true},
	}
	for _, img := range images {
		db.Where(model.ProductImage{URL: img.URL}).FirstOrCreate(&img)
	}

	// 5. Variants
	variants := []model.ProductVariant{
		{ProductID: products[0].ID, SKU: "HT-TR-500K-ORG", IsActive: true},
		{ProductID: products[1].ID, SKU: "PK-GEN-1000K-SIL", IsActive: true},
		{ProductID: products[2].ID, SKU: "SM-S7-1200-DEF", IsActive: true},
	}
	for i, v := range variants {
		db.Where(model.ProductVariant{SKU: v.SKU}).FirstOrCreate(&variants[i])
	}
}

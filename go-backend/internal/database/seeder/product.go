package seeder

import (
	"log"

	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

func SeedProducts(db *gorm.DB) {
	log.Println("Seeding Products...")

	// 1. Currencies
	currencies := []model.Currency{
		{Code: "BDT", Symbol: "৳", Name: "Bangladeshi Taka", Rate: 1, IsBase: true, IsActive: true},
		{Code: "USD", Symbol: "$", Name: "US Dollar", Rate: 110, IsBase: false, IsActive: true},
	}
	for _, c := range currencies {
		db.FirstOrCreate(&c, model.Currency{Code: c.Code})
	}

	// 2. Categories
	categories := []model.ProductCategory{
		{NameBN: "সোলার প্যানেল", NameEN: "Solar Panels", Slug: "solar-panels", SortOrder: 1},
		{NameBN: "ইনভার্টার", NameEN: "Inverters", Slug: "inverters", SortOrder: 2},
		{NameBN: "ব্যাটারি", NameEN: "Batteries", Slug: "batteries", SortOrder: 3},
		{NameBN: "এক্সেসরিজ", NameEN: "Accessories", Slug: "accessories", SortOrder: 4},
	}
	for i := range categories {
		db.FirstOrCreate(&categories[i], model.ProductCategory{Slug: categories[i].Slug})
	}

	// 3. Attribute Groups & Attributes
	capacityGroup := model.AttributeGroup{NameBN: "ধারণক্ষমতা", NameEN: "Capacity", SortOrder: 1}
	db.FirstOrCreate(&capacityGroup, model.AttributeGroup{NameEN: "Capacity"})

	wattAttr := model.Attribute{
		GroupID: &capacityGroup.ID,
		NameBN:  "ওয়াট",
		NameEN:  "Watt",
		Slug:    "watt",
		Unit:    ptr("W"),
	}
	db.FirstOrCreate(&wattAttr, model.Attribute{Slug: "watt"})

	// Options
	options := []model.AttributeOption{
		{AttributeID: wattAttr.ID, ValueBN: "১০০", ValueEN: "100"},
		{AttributeID: wattAttr.ID, ValueBN: "২০০", ValueEN: "200"},
		{AttributeID: wattAttr.ID, ValueBN: "৩০০", ValueEN: "300"},
	}
	for _, opt := range options {
		db.FirstOrCreate(&opt, model.AttributeOption{AttributeID: opt.AttributeID, ValueEN: opt.ValueEN})
	}

	// 4. Products
	products := []model.Product{
		{
			CategoryID: categories[0].ID,
			NameBN:     "মনো পিইআরসি সোলার প্যানেল ১০০ ওয়াট",
			NameEN:     "Mono PERC Solar Panel 100W",
			Slug:       "mono-perc-100w",
			SKU:        "SOL-MONO-100",
			Price:      5500,
			Stock:      50,
			Brand:      ptr("VoltWave"),
			IsFeatured: true,
		},
		{
			CategoryID: categories[1].ID,
			NameBN:     "স্মার্ট সোলার ইনভার্টার ১কেভিএ",
			NameEN:     "Smart Solar Inverter 1kVA",
			Slug:       "smart-inverter-1kva",
			SKU:        "INV-SMT-1K",
			Price:      12000,
			Stock:      15,
			Brand:      ptr("VoltWave"),
		},
	}

	for _, p := range products {
		db.FirstOrCreate(&p, model.Product{SKU: p.SKU})
	}

	log.Println("Product seeding completed.")
}

func ptr(s string) *string {
	return &s
}

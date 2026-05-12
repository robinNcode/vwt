package seeders

import (
	"fmt"
	"time"

	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

func SeedCMS(db *gorm.DB) {
	fmt.Println("🌐 Seeding CMS (Pages, Banners, Services, Blogs)...")

	now := time.Now()

	// 1. Pages
	pages := []models.Page{
		{
			Slug:        "about-us",
			TitleBN:     "আমাদের সম্পর্কে",
			TitleEN:     "About Us - Volt Wave Tech",
			ContentBN:   strPtr("ভোল্ট ওয়েভ টেক বাংলাদেশের একটি বিশ্বস্ত ভারী ইন্ডাস্ট্রিয়াল মেশিনারিজ সরবরাহকারী প্রতিষ্ঠান।"),
			ContentEN:   strPtr("Volt Wave Tech is a globally certified heavy industrial machinery and automation provider in Bangladesh."),
			Status:      "published",
			PublishedAt: &now,
		},
		{
			Slug:        "installation-services",
			TitleBN:     "ইন্সটলেশন সার্ভিস",
			TitleEN:     "Industrial Installation Services",
			ContentBN:   strPtr("ট্রান্সফরমার এবং জেনারেটরের সুরক্ষিত ইন্সটলেশন।"),
			ContentEN:   strPtr("Secure deployment and commissioning of Transformers and Diesel Generators by certified engineers."),
			Status:      "published",
			PublishedAt: &now,
		},
		{
			Slug:    "terms-and-conditions",
			TitleBN: "ক্রয় নীতিমালা",
			TitleEN: "Purchasing Terms",
			Status:  "draft",
		},
	}
	for _, p := range pages {
		db.Where(models.Page{Slug: p.Slug}).FirstOrCreate(&p)
	}

	// 2. Services
	services := []models.Service{
		{
			NameBN:        "ডিস্ট্রিবিউশন ট্রান্সফরমার কমিশনিং",
			NameEN:        "Distribution Transformer Commissioning",
			Slug:          "distribution-transformer-commissioning",
			DescriptionBN: strPtr("৩০০-১০০০ কেভিএ ট্রান্সফরমার কমিশনিং সেবা।"),
			DescriptionEN: strPtr("300-1000 KVA Industrial Transformer configuration and commissioning services."),
			Price:         float64Ptr(45000.00),
			IsActive:      true,
			SortOrder:     1,
		},
		{
			NameBN:        "পিএলসি অটোমেশন ইন্টিগ্রেশন",
			NameEN:        "PLC Automation Integration",
			Slug:          "plc-automation-integration",
			DescriptionBN: strPtr("সিমেন্স এবং শ্নাইডার পিএলসি প্যানেল ইন্টিগ্রেশন।"),
			DescriptionEN: strPtr("Complete logic and automation integration for Siemens and Schneider infrastructure."),
			Price:         float64Ptr(75000.00),
			IsActive:      true,
			SortOrder:     2,
		},
		{
			NameBN:        "বার্ষিক রক্ষণাবেক্ষণ (AMC)",
			NameEN:        "Annual Maintenance Contract (AMC)",
			Slug:          "annual-maintenance-contract",
			DescriptionBN: strPtr("জেনারেটর এবং ক্যাবলিংয়ের সার্বক্ষণিক সার্ভিসিং।"),
			DescriptionEN: strPtr("24/7 on-call service and monthly maintenance for major operational generators."),
			Price:         float64Ptr(150000.00),
			IsActive:      true,
			SortOrder:     3,
		},
	}
	for _, s := range services {
		db.Where(models.Service{Slug: s.Slug}).FirstOrCreate(&s)
	}

	// 3. Banners
	banners := []models.Banner{
		{
			TitleEN:    strPtr("Heavy Machinery Importers"),
			TitleBN:    strPtr("শিল্পকৌশল মেশিনারি ইম্পোর্টার"),
			SubtitleEN: strPtr("Providing factory-grade tools to fuel Bangladesh's infrastructure."),
			SubtitleBN: strPtr("বাংলাদেশের অবকাঠামো উন্নয়নে ফ্যাক্টরি-গ্রেড যন্ত্রপাতি।"),
			ImageURL:   "/uploads/banners/factory-1.jpg",
			Placement:  "hero",
			IsActive:   true,
			SortOrder:  1,
		},
		{
			TitleEN:   strPtr("Siemens Automation Panels"),
			TitleBN:   strPtr("সিমেন্স অটোমেশন প্যানেল"),
			ImageURL:  "/uploads/banners/automation-2.jpg",
			Placement: "hero",
			IsActive:  true,
			SortOrder: 2,
		},
		{
			TitleEN:   strPtr("24/7 Engineering Support"),
			TitleBN:   strPtr("২৪/৭ ইঞ্জিনিয়ারিং সাপোর্ট"),
			ImageURL:  "/uploads/banners/support-3.jpg",
			Placement: "hero",
			IsActive:  true,
			SortOrder: 3,
		},
	}
	for i, b := range banners {
		var count int64
		db.Model(&models.Banner{}).Where("image_url = ?", b.ImageURL).Count(&count)
		if count == 0 {
			db.Create(&banners[i])
		}
	}

	// 4. Blog Categories
	cats := []models.BlogCategory{
		{NameBN: "ইন্ডাস্ট্রিয়াল অটোমেশন", NameEN: "Industrial Automation", Slug: "industrial-automation"},
		{NameBN: "ইকুইপমেন্ট সেফটি", NameEN: "Equipment Safety", Slug: "equipment-safety"},
		{NameBN: "ইঞ্জিনিয়ারিং কেস স্টাডি", NameEN: "Engineering Case Studies", Slug: "engineering-case-studies"},
	}
	for _, c := range cats {
		db.Where(models.BlogCategory{Slug: c.Slug}).FirstOrCreate(&c)
	}
}

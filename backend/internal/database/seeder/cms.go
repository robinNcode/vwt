package seeder

import (
	"fmt"
	"time"

	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

func SeedCMS(db *gorm.DB) {
	fmt.Println("🌐 Seeding CMS (Pages, Banners, Services, Blogs)...")

	now := time.Now()

	// 1. Pages
	pages := []model.Page{
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
		db.Where(model.Page{Slug: p.Slug}).FirstOrCreate(&p)
	}

	// 2. Services
	services := []model.Service{
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
			NameBN:        "ফুল ফ্যাক্টরি ওয়্যারিং ও প্যানেল সেটআপ",
			NameEN:        "Full Factory Wiring & Panel Setup",
			Slug:          "full-factory-wiring-panel-setup",
			DescriptionBN: strPtr("কারখানার সম্পূর্ণ পাওয়ার, কন্ট্রোল ও প্যানেল ওয়্যারিং সেবা।"),
			DescriptionEN: strPtr("Complete factory power, control and panel wiring for industrial facilities."),
			Price:         float64Ptr(125000.00),
			IsActive:      true,
			SortOrder:     3,
		},
		{
			NameBN:        "এসি ইনস্টলেশন ও কমিশনিং",
			NameEN:        "AC Installation & Commissioning",
			Slug:          "ac-installation-commissioning",
			DescriptionBN: strPtr("কমার্শিয়াল ও ইন্ডাস্ট্রিয়াল এসি সেটআপ, টেস্টিং এবং কমিশনিং।"),
			DescriptionEN: strPtr("Commercial and industrial AC installation, testing and commissioning."),
			Price:         float64Ptr(18000.00),
			IsActive:      true,
			SortOrder:     4,
		},
		{
			NameBN:        "এসি সার্ভিসিং ও গ্যাস চার্জিং",
			NameEN:        "AC Servicing & Gas Charging",
			Slug:          "ac-servicing-gas-charging",
			DescriptionBN: strPtr("নিয়মিত এসি পরিষ্কার, গ্যাস চার্জিং এবং কুলিং পারফরম্যান্স অপ্টিমাইজেশন।"),
			DescriptionEN: strPtr("Routine AC cleaning, refrigerant charging and cooling performance optimization."),
			Price:         float64Ptr(8500.00),
			IsActive:      true,
			SortOrder:     5,
		},
		{
			NameBN:        "এয়ারট্যাক নিউমেটিক পার্টস ইনস্টলেশন",
			NameEN:        "AirTAC Pneumatic Parts Installation",
			Slug:          "airtac-pneumatic-parts-installation",
			DescriptionBN: strPtr("সোলেনয়েড ভালভ, সিলিন্ডার, ফিল্টার রেগুলেটর এবং এয়ার লাইন ফিটিং ইনস্টলেশন।"),
			DescriptionEN: strPtr("Installation of solenoid valves, cylinders, filter regulators and air line fittings."),
			Price:         float64Ptr(22000.00),
			IsActive:      true,
			SortOrder:     6,
		},
		{
			NameBN:        "এয়ার কমপ্রেসার লাইন ও পাইপিং",
			NameEN:        "Air Compressor Line & Piping",
			Slug:          "air-compressor-line-piping",
			DescriptionBN: strPtr("ফ্যাক্টরি জুড়ে কনপ্রেসড এয়ার পাইপিং, ড্রেন ও ফিল্টার লেআউট।"),
			DescriptionEN: strPtr("Compressed air piping, drain and filter layout across the factory floor."),
			Price:         float64Ptr(32000.00),
			IsActive:      true,
			SortOrder:     7,
		},
		{
			NameBN:        "হিট সিল মেশিন ইনস্টলেশন",
			NameEN:        "Heat Seal Machine Installation",
			Slug:          "heat-seal-machine-installation",
			DescriptionBN: strPtr("প্যাকেজিং লাইন, হিট সিলার এবং টেম্পারেচার কন্ট্রোল ইনস্টলেশন।"),
			DescriptionEN: strPtr("Packaging line, heat sealer and temperature control installation."),
			Price:         float64Ptr(28000.00),
			IsActive:      true,
			SortOrder:     8,
		},
		{
			NameBN:        "প্রিন্টিং মেশিন সেটআপ ও মেইনটেন্যান্স",
			NameEN:        "Printing Machine Setup & Maintenance",
			Slug:          "printing-machine-setup-maintenance",
			DescriptionBN: strPtr("ইন্ডাস্ট্রিয়াল প্রিন্টার, কোডিং সিস্টেম এবং রেজিস্ট্রেশন সেটআপ।"),
			DescriptionEN: strPtr("Industrial printer, coding system and registration setup with maintenance support."),
			Price:         float64Ptr(35000.00),
			IsActive:      true,
			SortOrder:     9,
		},
		{
			NameBN:        "বয়লার বার্নার ও সেফটি সার্ভিস",
			NameEN:        "Boiler Burner & Safety Service",
			Slug:          "boiler-burner-safety-service",
			DescriptionBN: strPtr("বার্নার, ফ্লেম ডিটেক্টর, সেফটি ভালভ এবং লেভেল কন্ট্রোল সার্ভিস।"),
			DescriptionEN: strPtr("Burner, flame detector, safety valve and level control service."),
			Price:         float64Ptr(42000.00),
			IsActive:      true,
			SortOrder:     10,
		},
		{
			NameBN:        "বার্ষিক রক্ষণাবেক্ষণ (AMC)",
			NameEN:        "Annual Maintenance Contract (AMC)",
			Slug:          "annual-maintenance-contract",
			DescriptionBN: strPtr("সার্বক্ষণিক সার্ভিসিং, ইমার্জেন্সি রিপেয়ার এবং প্রিভেন্টিভ মেইনটেন্যান্স।"),
			DescriptionEN: strPtr("24/7 on-call support, emergency repair and preventive maintenance."),
			Price:         float64Ptr(150000.00),
			IsActive:      true,
			SortOrder:     11,
		},
	}
	for _, s := range services {
		db.Where(model.Service{Slug: s.Slug}).FirstOrCreate(&s)
	}

	// 3. Banners
	banners := []model.Banner{
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
		db.Model(&model.Banner{}).Where("image_url = ?", b.ImageURL).Count(&count)
		if count == 0 {
			db.Create(&banners[i])
		}
	}

	// 4. Blog Categories
	cats := []model.BlogCategory{
		{NameBN: "ইন্ডাস্ট্রিয়াল অটোমেশন", NameEN: "Industrial Automation", Slug: "industrial-automation"},
		{NameBN: "ইকুইপমেন্ট সেফটি", NameEN: "Equipment Safety", Slug: "equipment-safety"},
		{NameBN: "ইঞ্জিনিয়ারিং কেস স্টাডি", NameEN: "Engineering Case Studies", Slug: "engineering-case-studies"},
	}
	for _, c := range cats {
		db.Where(model.BlogCategory{Slug: c.Slug}).FirstOrCreate(&c)
	}
}

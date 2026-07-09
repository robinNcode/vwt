package seeder

import (
	"log"
	"net/url"
	"strings"

	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

func SeedProducts(db *gorm.DB) {
	log.Println("Seeding Products...")

	// 1. Currencies
	currencies := []model.Currency{
		{Code: "BDT", Symbol: "৳", Name: "Bangladeshi Taka", Rate: 1, IsBase: true, IsActive: true},
		{Code: "USD", Symbol: "$", Name: "US Dollar", Rate: 0.0091, IsBase: false, IsActive: true},
	}
	for _, c := range currencies {
		db.Where(model.Currency{Code: c.Code}).FirstOrCreate(&c)
	}

	// 2. Categories
	categories := []model.ProductCategory{
		{
			NameBN:        "এয়ারট্যাক নিউমেটিক্স",
			NameEN:        "AirTAC Pneumatics",
			Slug:          "airtac-pneumatics",
			DescriptionEN: ptr("Current AirTAC pneumatic product families, including valves, preparation units, actuators, fittings and accessories."),
			SortOrder:     1,
			IsActive:      true,
		},
		{
			NameBN:        "বয়লার স্পেয়ার পার্টস",
			NameEN:        "Boiler Spare Parts",
			Slug:          "boiler-spare-parts",
			DescriptionEN: ptr("Boiler spare parts and service components aligned with MEL, Hurst, Yuanda and Brox boiler portfolios currently promoted by MEL Group."),
			SortOrder:     2,
			IsActive:      true,
		},
	}
	for i := range categories {
		db.Where(model.ProductCategory{Slug: categories[i].Slug}).Assign(categories[i]).FirstOrCreate(&categories[i])
	}

	// 3. Attribute Groups & Attributes
	capacityGroup := model.AttributeGroup{NameBN: "ধারণক্ষমতা", NameEN: "Capacity", SortOrder: 1}
	db.FirstOrCreate(&capacityGroup, model.AttributeGroup{NameEN: "Capacity"})

	electricalGroup := model.AttributeGroup{NameBN: "বৈদ্যুতিক স্পেসিফিকেশন", NameEN: "Electrical Specifications", SortOrder: 2}
	db.FirstOrCreate(&electricalGroup, model.AttributeGroup{NameEN: "Electrical Specifications"})

	pneumaticGroup := model.AttributeGroup{NameBN: "নিউমেটিক স্পেসিফিকেশন", NameEN: "Pneumatic Specifications", SortOrder: 3}
	db.FirstOrCreate(&pneumaticGroup, model.AttributeGroup{NameEN: "Pneumatic Specifications"})

	boilerGroup := model.AttributeGroup{NameBN: "বয়লার স্পেসিফিকেশন", NameEN: "Boiler Specifications", SortOrder: 4}
	db.FirstOrCreate(&boilerGroup, model.AttributeGroup{NameEN: "Boiler Specifications"})

	applicationGroup := model.AttributeGroup{NameBN: "প্রয়োগ", NameEN: "Application", SortOrder: 5}
	db.FirstOrCreate(&applicationGroup, model.AttributeGroup{NameEN: "Application"})

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

	voltageAttr := model.Attribute{GroupID: &electricalGroup.ID, NameBN: "ভোল্টেজ", NameEN: "Voltage", Slug: "voltage", InputType: "select", Unit: ptr("V")}
	db.FirstOrCreate(&voltageAttr, model.Attribute{Slug: "voltage"})

	portSizeAttr := model.Attribute{GroupID: &pneumaticGroup.ID, NameBN: "পোর্ট সাইজ", NameEN: "Port Size", Slug: "port-size", InputType: "select", Unit: ptr("inch")}
	db.FirstOrCreate(&portSizeAttr, model.Attribute{Slug: "port-size"})

	pressureAttr := model.Attribute{GroupID: &pneumaticGroup.ID, NameBN: "চাপের পরিসীমা", NameEN: "Pressure Range", Slug: "pressure-range", InputType: "select", Unit: ptr("bar")}
	db.FirstOrCreate(&pressureAttr, model.Attribute{Slug: "pressure-range"})

	boreAttr := model.Attribute{GroupID: &pneumaticGroup.ID, NameBN: "বোর সাইজ", NameEN: "Bore Size", Slug: "bore-size", InputType: "select", Unit: ptr("mm")}
	db.FirstOrCreate(&boreAttr, model.Attribute{Slug: "bore-size"})

	capacityRangeAttr := model.Attribute{GroupID: &boilerGroup.ID, NameBN: "ক্যাপাসিটি রেঞ্জ", NameEN: "Capacity Range", Slug: "capacity-range", InputType: "select", Unit: ptr("kg/hr")}
	db.FirstOrCreate(&capacityRangeAttr, model.Attribute{Slug: "capacity-range"})

	applicationAttr := model.Attribute{GroupID: &applicationGroup.ID, NameBN: "প্রয়োগ ক্ষেত্র", NameEN: "Application Area", Slug: "application-area", InputType: "text"}
	db.FirstOrCreate(&applicationAttr, model.Attribute{Slug: "application-area"})

	for _, opt := range []model.AttributeOption{
		{AttributeID: voltageAttr.ID, ValueBN: "২৪ ভোল্ট ডিসি", ValueEN: "24V DC"},
		{AttributeID: voltageAttr.ID, ValueBN: "১১০ ভোল্ট এসি", ValueEN: "110V AC"},
		{AttributeID: voltageAttr.ID, ValueBN: "২২০ ভোল্ট এসি", ValueEN: "220V AC"},
		{AttributeID: voltageAttr.ID, ValueBN: "৪১৫ ভোল্ট এসি", ValueEN: "415V AC"},
	} {
		db.FirstOrCreate(&opt, model.AttributeOption{AttributeID: opt.AttributeID, ValueEN: opt.ValueEN})
	}

	for _, opt := range []model.AttributeOption{
		{AttributeID: portSizeAttr.ID, ValueBN: "১/৮ ইঞ্চি", ValueEN: "1/8\""},
		{AttributeID: portSizeAttr.ID, ValueBN: "১/৪ ইঞ্চি", ValueEN: "1/4\""},
		{AttributeID: portSizeAttr.ID, ValueBN: "৩/৮ ইঞ্চি", ValueEN: "3/8\""},
		{AttributeID: portSizeAttr.ID, ValueBN: "১/২ ইঞ্চি", ValueEN: "1/2\""},
		{AttributeID: portSizeAttr.ID, ValueBN: "৩/৪ ইঞ্চি", ValueEN: "3/4\""},
	} {
		db.FirstOrCreate(&opt, model.AttributeOption{AttributeID: opt.AttributeID, ValueEN: opt.ValueEN})
	}

	for _, opt := range []model.AttributeOption{
		{AttributeID: pressureAttr.ID, ValueBN: "০-৮ বার", ValueEN: "0-8 bar"},
		{AttributeID: pressureAttr.ID, ValueBN: "০-১০ বার", ValueEN: "0-10 bar"},
		{AttributeID: pressureAttr.ID, ValueBN: "০-১৬ বার", ValueEN: "0-16 bar"},
	} {
		db.FirstOrCreate(&opt, model.AttributeOption{AttributeID: opt.AttributeID, ValueEN: opt.ValueEN})
	}

	for _, opt := range []model.AttributeOption{
		{AttributeID: boreAttr.ID, ValueBN: "২০ মিমি", ValueEN: "20 mm"},
		{AttributeID: boreAttr.ID, ValueBN: "২৫ মিমি", ValueEN: "25 mm"},
		{AttributeID: boreAttr.ID, ValueBN: "৩২ মিমি", ValueEN: "32 mm"},
		{AttributeID: boreAttr.ID, ValueBN: "৪০ মিমি", ValueEN: "40 mm"},
		{AttributeID: boreAttr.ID, ValueBN: "৫০ মিমি", ValueEN: "50 mm"},
	} {
		db.FirstOrCreate(&opt, model.AttributeOption{AttributeID: opt.AttributeID, ValueEN: opt.ValueEN})
	}

	for _, opt := range []model.AttributeOption{
		{AttributeID: capacityRangeAttr.ID, ValueBN: "১০০ কেজি/ঘন্টা", ValueEN: "100 kg/hr"},
		{AttributeID: capacityRangeAttr.ID, ValueBN: "৩০০ কেজি/ঘন্টা", ValueEN: "300 kg/hr"},
		{AttributeID: capacityRangeAttr.ID, ValueBN: "৫০০ কেজি/ঘন্টা", ValueEN: "500 kg/hr"},
		{AttributeID: capacityRangeAttr.ID, ValueBN: "১০০০ কেজি/ঘন্টা", ValueEN: "1000 kg/hr"},
	} {
		db.FirstOrCreate(&opt, model.AttributeOption{AttributeID: opt.AttributeID, ValueEN: opt.ValueEN})
	}

	// 4. Products
	products := []model.Product{
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক 4V210-08 সোলেনয়েড ভালভ",
			NameEN:       "AirTAC 4V210-08 Solenoid Valve",
			Slug:         "airtac-4v210-08-solenoid-valve",
			SKU:          "AT-4V210-08",
			Price:        2850,
			Stock:        42,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("5/2 way solenoid valve for fast pneumatic switching in automation lines."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক 4V310-10 সোলেনয়েড ভালভ",
			NameEN:       "AirTAC 4V310-10 Solenoid Valve",
			Slug:         "airtac-4v310-10-solenoid-valve",
			SKU:          "AT-4V310-10",
			Price:        3420,
			Stock:        36,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Compact solenoid valve suited for machine control and pneumatic distribution."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক 4V410-15 সোলেনয়েড ভালভ",
			NameEN:       "AirTAC 4V410-15 Solenoid Valve",
			Slug:         "airtac-4v410-15-solenoid-valve",
			SKU:          "AT-4V410-15",
			Price:        4680,
			Stock:        24,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("High-flow solenoid valve for larger pneumatic actuators and process equipment."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক 3V210-08 নিউমেটিক কন্ট্রোল ভালভ",
			NameEN:       "AirTAC 3V210-08 Pneumatic Control Valve",
			Slug:         "airtac-3v210-08-pneumatic-control-valve",
			SKU:          "AT-3V210-08",
			Price:        2550,
			Stock:        40,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Pilot-style pneumatic control valve for directional actuation."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক 4M210-08 ম্যানুয়াল কন্ট্রোল ভালভ",
			NameEN:       "AirTAC 4M210-08 Manual Control Valve",
			Slug:         "airtac-4m210-08-manual-control-valve",
			SKU:          "AT-4M210-08",
			Price:        1980,
			Stock:        50,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Manual pneumatic valve for operator-driven directional control."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক AFR2000 এয়ার ফিল্টার রেগুলেটর",
			NameEN:       "AirTAC AFR2000 Air Filter Regulator",
			Slug:         "airtac-afr2000-air-filter-regulator",
			SKU:          "AT-AFR2000",
			Price:        4100,
			Stock:        30,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Air preparation unit for filtering and regulating compressed air supply."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক AL2000 এয়ার লুব্রিকেটর",
			NameEN:       "AirTAC AL2000 Air Lubricator",
			Slug:         "airtac-al2000-air-lubricator",
			SKU:          "AT-AL2000",
			Price:        2950,
			Stock:        28,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Lubricator unit for protecting pneumatic components in continuous use."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক AC2000 এয়ার প্রস্তুতি ইউনিট",
			NameEN:       "AirTAC AC2000 Air Preparation Unit",
			Slug:         "airtac-ac2000-air-preparation-unit",
			SKU:          "AT-AC2000",
			Price:        6250,
			Stock:        18,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Combined air preparation set for stable pneumatic supply."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক SC স্ট্যান্ডার্ড সিলিন্ডার",
			NameEN:       "AirTAC SC Standard Cylinder",
			Slug:         "airtac-sc-standard-cylinder",
			SKU:          "AT-SC",
			Price:        3950,
			Stock:        33,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Standard pneumatic cylinder for general purpose linear motion."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক SDA কম্প্যাক্ট সিলিন্ডার",
			NameEN:       "AirTAC SDA Compact Cylinder",
			Slug:         "airtac-sda-compact-cylinder",
			SKU:          "AT-SDA",
			Price:        3650,
			Stock:        29,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Compact actuator for constrained installation spaces."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক SDAJ টুইন রড সিলিন্ডার",
			NameEN:       "AirTAC SDAJ Twin Rod Cylinder",
			Slug:         "airtac-sdaj-twin-rod-cylinder",
			SKU:          "AT-SDAJ",
			Price:        5480,
			Stock:        20,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Twin-rod cylinder for anti-rotation and guided motion tasks."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক MGPM গাইডেড সিলিন্ডার",
			NameEN:       "AirTAC MGPM Guided Cylinder",
			Slug:         "airtac-mgpm-guided-cylinder",
			SKU:          "AT-MGPM",
			Price:        6920,
			Stock:        16,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Guided cylinder for precision motion and load support."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক MPT রোটারি সিলিন্ডার",
			NameEN:       "AirTAC MPT Rotary Cylinder",
			Slug:         "airtac-mpt-rotary-cylinder",
			SKU:          "AT-MPT",
			Price:        7350,
			Stock:        14,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Rotary actuator for clamping, indexing and turn-over operations."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক HFZ ভ্যাকুয়াম জেনারেটর",
			NameEN:       "AirTAC HFZ Vacuum Generator",
			Slug:         "airtac-hfz-vacuum-generator",
			SKU:          "AT-HFZ",
			Price:        5150,
			Stock:        12,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Vacuum generation unit for pick-and-place and handling systems."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক PU6x4 নিউমেটিক টিউব",
			NameEN:       "AirTAC PU6x4 Pneumatic Tube",
			Slug:         "airtac-pu6x4-pneumatic-tube",
			SKU:          "AT-PU6X4",
			Price:        980,
			Stock:        120,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Polyurethane tubing for compressed-air distribution lines."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক PC কুইক কানেক্টর",
			NameEN:       "AirTAC PC Quick Connector",
			Slug:         "airtac-pc-quick-connector",
			SKU:          "AT-PC-CONN",
			Price:        1150,
			Stock:        86,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Quick-fit connector for clean and efficient tube connections."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক SL সাইলেন্সার",
			NameEN:       "AirTAC SL Silencer",
			Slug:         "airtac-sl-silencer",
			SKU:          "AT-SL-SIL",
			Price:        760,
			Stock:        95,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Pneumatic exhaust silencer for noise reduction and airflow control."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[0].ID,
			ProductType:  "pneumatic_component",
			NameBN:       "এয়ারট্যাক 3C ফুট পেডাল ভালভ",
			NameEN:       "AirTAC 3C Foot Pedal Valve",
			Slug:         "airtac-3c-foot-pedal-valve",
			SKU:          "AT-3C-FP",
			Price:        2380,
			Stock:        25,
			Brand:        ptr("AirTAC"),
			Manufacturer: ptr("AirTAC International Group"),
			ShortDescEN:  ptr("Hands-free valve control for machine tools and assembly lines."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "হার্স্ট বয়লার ফিড ওয়াটার পাম্প",
			NameEN:       "Hurst Boiler Feed Water Pump",
			Slug:         "hurst-boiler-feed-water-pump",
			SKU:          "BS-HURST-FWP",
			Price:        28500,
			Stock:        8,
			Brand:        ptr("Hurst"),
			Manufacturer: ptr("Hurst Boiler & Welding Company"),
			ShortDescEN:  ptr("Replacement pump for boiler feed water circulation and pressure support."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "হার্স্ট ফায়ার মাস্টার কন্ট্রোল প্যানেল",
			NameEN:       "Hurst Fire Master Control Panel",
			Slug:         "hurst-fire-master-control-panel",
			SKU:          "BS-HURST-FMC",
			Price:        32500,
			Stock:        5,
			Brand:        ptr("Hurst"),
			Manufacturer: ptr("Hurst Boiler & Welding Company"),
			ShortDescEN:  ptr("Integrated control panel for monitoring burner and boiler operating status."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "হার্স্ট ফ্লেম ডিটেক্টর",
			NameEN:       "Hurst Flame Detector",
			Slug:         "hurst-flame-detector",
			SKU:          "BS-HURST-FLD",
			Price:        14800,
			Stock:        11,
			Brand:        ptr("Hurst"),
			Manufacturer: ptr("Hurst Boiler & Welding Company"),
			ShortDescEN:  ptr("Safety sensor for reliable flame presence detection in boiler burners."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "হার্স্ট সেফটি ভালভ",
			NameEN:       "Hurst Safety Valve",
			Slug:         "hurst-safety-valve",
			SKU:          "BS-HURST-SV",
			Price:        12500,
			Stock:        14,
			Brand:        ptr("Hurst"),
			Manufacturer: ptr("Hurst Boiler & Welding Company"),
			ShortDescEN:  ptr("Overpressure protection valve for boiler safety and compliance."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "ইউয়ান্ডা ইকোনোমাইজার কয়েল",
			NameEN:       "Yuanda Economizer Coil",
			Slug:         "yuanda-economizer-coil",
			SKU:          "BS-YUANDA-ECO",
			Price:        27200,
			Stock:        6,
			Brand:        ptr("Yuanda"),
			Manufacturer: ptr("Yuanda Boiler Group"),
			ShortDescEN:  ptr("Heat recovery coil for improving boiler efficiency and fuel savings."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "ইউয়ান্ডা ইগনিশন ট্রান্সফরমার",
			NameEN:       "Yuanda Ignition Transformer",
			Slug:         "yuanda-ignition-transformer",
			SKU:          "BS-YUANDA-IGN",
			Price:        16800,
			Stock:        9,
			Brand:        ptr("Yuanda"),
			Manufacturer: ptr("Yuanda Boiler Group"),
			ShortDescEN:  ptr("High-voltage ignition component for reliable burner startup."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "ইউয়ান্ডা ওয়াটার লেভেল কন্ট্রোলার",
			NameEN:       "Yuanda Water Level Controller",
			Slug:         "yuanda-water-level-controller",
			SKU:          "BS-YUANDA-WLC",
			Price:        19800,
			Stock:        7,
			Brand:        ptr("Yuanda"),
			Manufacturer: ptr("Yuanda Boiler Group"),
			ShortDescEN:  ptr("Automatic level controller for stable boiler drum water management."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "ইউয়ান্ডা বয়লার প্রেসার গেজ",
			NameEN:       "Yuanda Boiler Pressure Gauge",
			Slug:         "yuanda-boiler-pressure-gauge",
			SKU:          "BS-YUANDA-PG",
			Price:        5800,
			Stock:        18,
			Brand:        ptr("Yuanda"),
			Manufacturer: ptr("Yuanda Boiler Group"),
			ShortDescEN:  ptr("Pressure indication instrument for boiler monitoring and maintenance."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "ব্রক্স থার্মাল অয়েল বয়লার নোজল",
			NameEN:       "Brox Thermal Oil Boiler Nozzle",
			Slug:         "brox-thermal-oil-boiler-nozzle",
			SKU:          "BS-BROX-NOZ",
			Price:        21500,
			Stock:        10,
			Brand:        ptr("Brox"),
			Manufacturer: ptr("Brox Boiler Systems"),
			ShortDescEN:  ptr("Burner nozzle for thermal oil boiler combustion and atomization."),
			IsFeatured:   true,
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "ব্রক্স কম্বাসশন ব্লোয়ার মোটর",
			NameEN:       "Brox Combustion Blower Motor",
			Slug:         "brox-combustion-blower-motor",
			SKU:          "BS-BROX-BLM",
			Price:        24800,
			Stock:        8,
			Brand:        ptr("Brox"),
			Manufacturer: ptr("Brox Boiler Systems"),
			ShortDescEN:  ptr("Air delivery motor for stable combustion and burner performance."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "এমইএল সাইট গ্লাস অ্যাসেম্বলি",
			NameEN:       "MEL Sight Glass Assembly",
			Slug:         "mel-sight-glass-assembly",
			SKU:          "BS-MEL-SGA",
			Price:        7200,
			Stock:        22,
			Brand:        ptr("MEL"),
			Manufacturer: ptr("MEL Group"),
			ShortDescEN:  ptr("Transparent level viewing assembly for boiler water inspection."),
			IsActive:     true,
		},
		{
			CategoryID:   categories[1].ID,
			ProductType:  "boiler_spare_part",
			NameBN:       "এমইএল গ্যাসকেট কিট",
			NameEN:       "MEL Gasket Kit",
			Slug:         "mel-gasket-kit",
			SKU:          "BS-MEL-GKT",
			Price:        5400,
			Stock:        26,
			Brand:        ptr("MEL"),
			Manufacturer: ptr("MEL Group"),
			ShortDescEN:  ptr("Sealing kit for routine boiler servicing and leak prevention."),
			IsActive:     true,
		},
	}

	for i := range products {
		db.Where(model.Product{SKU: products[i].SKU}).Assign(products[i]).FirstOrCreate(&products[i])
	}

	seedProductRelations(db, products)

	log.Println("Product seeding completed.")
}

func ptr(s string) *string {
	return &s
}

type productRelationValue struct {
	AttributeSlug string
	OptionValue   string
	CustomValue   string
}

type productRelationSpec struct {
	Images          []string
	AttributeValues []productRelationValue
	VariantAttrs    []productRelationValue
}

func seedProductRelations(db *gorm.DB, products []model.Product) {
	var currencies []model.Currency
	db.Find(&currencies)
	currencyIDs := map[string]uint{}
	currencyRates := map[string]float64{}
	for _, currency := range currencies {
		currencyIDs[currency.Code] = currency.ID
		currencyRates[currency.Code] = currency.Rate
	}

	var attributes []model.Attribute
	db.Where("slug IN ?", []string{"voltage", "port-size", "pressure-range", "bore-size", "capacity-range", "application-area"}).Find(&attributes)
	attributeBySlug := map[string]model.Attribute{}
	for _, attribute := range attributes {
		attributeBySlug[attribute.Slug] = attribute
	}

	optionByAttr := map[string]map[string]model.AttributeOption{}
	for _, slug := range []string{"voltage", "port-size", "pressure-range", "bore-size", "capacity-range"} {
		var opts []model.AttributeOption
		if attribute, ok := attributeBySlug[slug]; ok {
			db.Where("attribute_id = ?", attribute.ID).Find(&opts)
			optionByAttr[slug] = map[string]model.AttributeOption{}
			for _, opt := range opts {
				optionByAttr[slug][opt.ValueEN] = opt
			}
		}
	}

	for _, product := range products {
		relation := buildProductRelation(product)
		seedProductImages(db, product, relation)
		seedProductVariants(db, product, relation, currencyIDs, currencyRates, attributeBySlug, optionByAttr)
		seedProductAttributeValues(db, product, relation, attributeBySlug, optionByAttr)
	}
}

func seedProductImages(db *gorm.DB, product model.Product, relation productRelationSpec) {
	for i, imageURL := range relation.Images {
		img := model.ProductImage{ProductID: product.ID, URL: imageURL, IsPrimary: i == 0, SortOrder: i + 1}
		db.Where(model.ProductImage{ProductID: product.ID, SortOrder: i + 1}).Assign(img).FirstOrCreate(&img)
	}
}

func seedProductVariants(
	db *gorm.DB,
	product model.Product,
	relation productRelationSpec,
	currencyIDs map[string]uint,
	currencyRates map[string]float64,
	attributeBySlug map[string]model.Attribute,
	optionByAttr map[string]map[string]model.AttributeOption,
) {
	variantSKU := product.SKU + "-STD"
	variant := model.ProductVariant{ProductID: product.ID, SKU: variantSKU, IsActive: true}
	db.Where(model.ProductVariant{SKU: variantSKU}).Assign(variant).FirstOrCreate(&variant)

	for _, attrValue := range relation.VariantAttrs {
		attribute, ok := attributeBySlug[attrValue.AttributeSlug]
		if !ok {
			continue
		}
		option, ok := optionByAttr[attrValue.AttributeSlug][attrValue.OptionValue]
		if !ok {
			continue
		}
		variantAttr := model.ProductVariantAttribute{VariantID: variant.ID, AttributeID: attribute.ID, OptionID: option.ID}
		db.Where(model.ProductVariantAttribute{VariantID: variant.ID, AttributeID: attribute.ID}).Assign(variantAttr).FirstOrCreate(&variantAttr)
	}

	if bdtID, ok := currencyIDs["BDT"]; ok {
		price := model.ProductPrice{VariantID: variant.ID, CurrencyID: bdtID, BasePrice: product.Price, IsActive: true}
		db.Where(model.ProductPrice{VariantID: variant.ID, CurrencyID: bdtID}).Assign(price).FirstOrCreate(&price)
	}
	if usdID, ok := currencyIDs["USD"]; ok {
		usdRate := currencyRates["USD"]
		if usdRate == 0 {
			usdRate = 0.0091
		}
		price := model.ProductPrice{VariantID: variant.ID, CurrencyID: usdID, BasePrice: product.Price * usdRate, IsActive: true}
		db.Where(model.ProductPrice{VariantID: variant.ID, CurrencyID: usdID}).Assign(price).FirstOrCreate(&price)
	}
}

func seedProductAttributeValues(
	db *gorm.DB,
	product model.Product,
	relation productRelationSpec,
	attributeBySlug map[string]model.Attribute,
	optionByAttr map[string]map[string]model.AttributeOption,
) {
	for _, attrValue := range relation.AttributeValues {
		attribute, ok := attributeBySlug[attrValue.AttributeSlug]
		if !ok {
			continue
		}
		value := model.ProductAttributeValue{ProductID: product.ID, AttributeID: attribute.ID}
		if attrValue.OptionValue != "" {
			option, ok := optionByAttr[attrValue.AttributeSlug][attrValue.OptionValue]
			if !ok {
				continue
			}
			value.OptionID = &option.ID
		}
		if attrValue.CustomValue != "" {
			value.ValueCustom = &attrValue.CustomValue
		}
		db.Where(model.ProductAttributeValue{ProductID: product.ID, AttributeID: attribute.ID}).Assign(value).FirstOrCreate(&value)
	}
}

func buildProductRelation(product model.Product) productRelationSpec {
	lowerName := strings.ToLower(product.NameEN + " " + product.Slug)
	relation := productRelationSpec{
		Images: []string{productImagePath(product, 1)},
	}

	addValue := func(attributeSlug, optionValue, customValue string) {
		relation.AttributeValues = append(relation.AttributeValues, productRelationValue{AttributeSlug: attributeSlug, OptionValue: optionValue, CustomValue: customValue})
	}
	addVariant := func(attributeSlug, optionValue string) {
		relation.VariantAttrs = append(relation.VariantAttrs, productRelationValue{AttributeSlug: attributeSlug, OptionValue: optionValue})
	}

	switch {
	case strings.Contains(lowerName, "solenoid valve"):
		addValue("voltage", "24V DC", "")
		addValue("port-size", "1/4\"", "")
		addValue("pressure-range", "0-8 bar", "")
		addValue("application-area", "", "Automation line switching and directional control")
		addVariant("voltage", "24V DC")
		addVariant("port-size", "1/4\"")
	case strings.Contains(lowerName, "control valve") || strings.Contains(lowerName, "manual control valve") || strings.Contains(lowerName, "foot pedal valve"):
		addValue("voltage", "24V DC", "")
		addValue("port-size", "1/4\"", "")
		addValue("pressure-range", "0-8 bar", "")
		addValue("application-area", "", "Directional pneumatic control for machines and lines")
		addVariant("voltage", "24V DC")
		addVariant("port-size", "1/4\"")
	case strings.Contains(lowerName, "air filter regulator") || strings.Contains(lowerName, "air preparation unit") || strings.Contains(lowerName, "air lubricator"):
		addValue("port-size", "1/2\"", "")
		addValue("pressure-range", "0-10 bar", "")
		addValue("application-area", "", "Compressed air preparation and lubrication")
		addVariant("port-size", "1/2\"")
	case strings.Contains(lowerName, "standard cylinder"):
		addValue("bore-size", "32 mm", "")
		addValue("port-size", "1/4\"", "")
		addValue("application-area", "", "General-purpose linear motion")
		addVariant("bore-size", "32 mm")
		addVariant("port-size", "1/4\"")
	case strings.Contains(lowerName, "compact cylinder"):
		addValue("bore-size", "25 mm", "")
		addValue("port-size", "1/8\"", "")
		addValue("application-area", "", "Compact actuation in tight spaces")
		addVariant("bore-size", "25 mm")
		addVariant("port-size", "1/8\"")
	case strings.Contains(lowerName, "twin rod cylinder"):
		addValue("bore-size", "32 mm", "")
		addValue("port-size", "1/4\"", "")
		addValue("application-area", "", "Anti-rotation guided motion")
		addVariant("bore-size", "32 mm")
		addVariant("port-size", "1/4\"")
	case strings.Contains(lowerName, "guided cylinder"):
		addValue("bore-size", "40 mm", "")
		addValue("port-size", "3/8\"", "")
		addValue("application-area", "", "Precision motion with load support")
		addVariant("bore-size", "40 mm")
		addVariant("port-size", "3/8\"")
	case strings.Contains(lowerName, "rotary cylinder"):
		addValue("bore-size", "50 mm", "")
		addValue("port-size", "3/8\"", "")
		addValue("application-area", "", "Clamping, indexing and turn-over operations")
		addVariant("bore-size", "50 mm")
		addVariant("port-size", "3/8\"")
	case strings.Contains(lowerName, "vacuum generator"):
		addValue("voltage", "24V DC", "")
		addValue("port-size", "1/4\"", "")
		addValue("pressure-range", "0-8 bar", "")
		addValue("application-area", "", "Pick-and-place vacuum handling")
		addVariant("voltage", "24V DC")
		addVariant("port-size", "1/4\"")
	case strings.Contains(lowerName, "tube") || strings.Contains(lowerName, "connector") || strings.Contains(lowerName, "silencer"):
		addValue("port-size", "1/4\"", "")
		addValue("application-area", "", "Compressed air distribution and accessory fitting")
		addVariant("port-size", "1/4\"")
	case strings.Contains(lowerName, "feed water pump"):
		addValue("voltage", "415V AC", "")
		addValue("capacity-range", "500 kg/hr", "")
		addValue("application-area", "", "Boiler feed-water circulation and pressure support")
		addVariant("voltage", "415V AC")
		addVariant("capacity-range", "500 kg/hr")
	case strings.Contains(lowerName, "control panel"):
		addValue("voltage", "415V AC", "")
		addValue("application-area", "", "Boiler operating control and monitoring")
		addVariant("voltage", "415V AC")
	case strings.Contains(lowerName, "flame detector"):
		addValue("voltage", "220V AC", "")
		addValue("application-area", "", "Burner flame presence detection")
		addVariant("voltage", "220V AC")
	case strings.Contains(lowerName, "safety valve"):
		addValue("pressure-range", "0-16 bar", "")
		addValue("application-area", "", "Boiler overpressure protection")
		addVariant("pressure-range", "0-16 bar")
	case strings.Contains(lowerName, "economizer"):
		addValue("capacity-range", "1000 kg/hr", "")
		addValue("application-area", "", "Heat recovery and fuel efficiency")
		addVariant("capacity-range", "1000 kg/hr")
	case strings.Contains(lowerName, "ignition transformer"):
		addValue("voltage", "220V AC", "")
		addValue("application-area", "", "Burner ignition and startup support")
		addVariant("voltage", "220V AC")
	case strings.Contains(lowerName, "water level controller"):
		addValue("voltage", "220V AC", "")
		addValue("application-area", "", "Boiler drum level automation")
		addVariant("voltage", "220V AC")
	case strings.Contains(lowerName, "pressure gauge"):
		addValue("pressure-range", "0-16 bar", "")
		addValue("application-area", "", "Boiler pressure monitoring")
		addVariant("pressure-range", "0-16 bar")
	case strings.Contains(lowerName, "nozzle"):
		addValue("pressure-range", "0-16 bar", "")
		addValue("application-area", "", "Fuel atomization for boiler burners")
		addVariant("pressure-range", "0-16 bar")
	case strings.Contains(lowerName, "blower motor"):
		addValue("voltage", "415V AC", "")
		addValue("application-area", "", "Combustion air delivery")
		addVariant("voltage", "415V AC")
	case strings.Contains(lowerName, "sight glass"):
		addValue("application-area", "", "Boiler level inspection and visual monitoring")
	case strings.Contains(lowerName, "gasket kit"):
		addValue("application-area", "", "Routine boiler sealing and maintenance")
	default:
		addValue("application-area", "", "Industrial maintenance and service support")
	}

	if strings.Contains(lowerName, "boiler") || strings.Contains(lowerName, "panel") || strings.Contains(lowerName, "pump") || strings.Contains(lowerName, "economizer") || strings.Contains(lowerName, "detector") {
		relation.Images = append(relation.Images, productImagePath(product, 2))
	}

	return relation
}

func productImagePath(product model.Product, index int) string {
	folder := "airtac"
	if strings.Contains(strings.ToLower(product.NameEN), "boiler") || strings.Contains(strings.ToLower(product.ProductType), "boiler") {
		folder = "boiler"
	}
	label := product.NameEN
	if index > 1 {
		label += " alternate view"
	}
	return "https://placehold.co/900x700/e8eef8/172033.jpg?text=" + url.QueryEscape(folder+" - "+label)
}

package model

import (
	"time"

	"gorm.io/gorm"
)

// ─── ProductCategory ──────────────────────────────────────────────────────────

type ProductCategory struct {
	ID            uint             `gorm:"primaryKey;autoIncrement" json:"id"`
	ParentID      *uint            `gorm:"index" json:"parent_id,omitempty"`
	Parent        *ProductCategory `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Children      []ProductCategory `gorm:"foreignKey:ParentID" json:"children,omitempty"`
	NameBN        string           `gorm:"column:name_bn;size:200;not null" json:"name_bn"`
	NameEN        string           `gorm:"column:name_en;size:200;not null" json:"name_en"`
	Slug          string           `gorm:"size:220;not null;uniqueIndex" json:"slug"`
	DescriptionBN *string          `gorm:"column:description_bn;type:text" json:"description_bn,omitempty"`
	DescriptionEN *string          `gorm:"column:description_en;type:text" json:"description_en,omitempty"`
	ImageURL      *string          `gorm:"size:500" json:"image_url,omitempty"`
	SortOrder     int              `gorm:"not null;default:0" json:"sort_order"`
	IsActive      bool             `gorm:"not null;default:true" json:"is_active"`
	CreatedBy     *uint            `json:"created_by,omitempty"`
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
	DeletedAt     gorm.DeletedAt   `gorm:"index" json:"-"`
}

// ─── AttributeGroup ───────────────────────────────────────────────────────────

type AttributeGroup struct {
	ID        uint        `gorm:"primaryKey;autoIncrement" json:"id"`
	NameBN    string      `gorm:"column:name_bn;size:150;not null" json:"name_bn"`
	NameEN    string      `gorm:"column:name_en;size:150;not null" json:"name_en"`
	SortOrder int         `gorm:"not null;default:0" json:"sort_order"`
	Attributes []Attribute `gorm:"foreignKey:GroupID" json:"attributes,omitempty"`
}

// ─── Attribute ────────────────────────────────────────────────────────────────

type Attribute struct {
	ID             uint             `gorm:"primaryKey;autoIncrement" json:"id"`
	GroupID        *uint            `gorm:"index" json:"group_id,omitempty"`
	Group          *AttributeGroup  `gorm:"foreignKey:GroupID" json:"group,omitempty"`
	NameBN         string           `gorm:"column:name_bn;size:150;not null" json:"name_bn"`
	NameEN         string           `gorm:"column:name_en;size:150;not null" json:"name_en"`
	Slug           string           `gorm:"size:160;not null;uniqueIndex" json:"slug"`
	InputType      string           `gorm:"size:20;not null;default:'select'" json:"input_type"`
	Unit           *string          `gorm:"size:30" json:"unit,omitempty"`
	IsVariantAttr  bool             `gorm:"column:is_variant_attr;not null;default:false" json:"is_variant_attr"`
	SortOrder      int              `gorm:"not null;default:0" json:"sort_order"`
	Options        []AttributeOption `gorm:"foreignKey:AttributeID" json:"options,omitempty"`
}

// ─── AttributeOption ─────────────────────────────────────────────────────────

type AttributeOption struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	AttributeID uint      `gorm:"not null;index" json:"attribute_id"`
	Attribute   Attribute `gorm:"foreignKey:AttributeID" json:"-"`
	ValueBN     string    `gorm:"column:value_bn;size:200;not null" json:"value_bn"`
	ValueEN     string    `gorm:"column:value_en;size:200;not null" json:"value_en"`
	SortOrder   int       `gorm:"not null;default:0" json:"sort_order"`
}

// ─── Product ──────────────────────────────────────────────────────────────────

type Product struct {
	ID             uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	CategoryID     uint           `gorm:"not null;index" json:"category_id"`
	Category       ProductCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	ProductType    string         `gorm:"size:20;not null;default:'accessory'" json:"product_type"`
	SKUPrefix      *string        `gorm:"column:sku_prefix;size:50" json:"sku_prefix,omitempty"`
	NameBN         string         `gorm:"column:name_bn;size:300;not null" json:"name_bn"`
	NameEN         string         `gorm:"column:name_en;size:300;not null" json:"name_en"`
	Slug           string         `gorm:"size:320;not null;uniqueIndex" json:"slug"`
	SKU            string         `gorm:"size:100;uniqueIndex" json:"sku"`
	Price          float64        `gorm:"not null;default:0" json:"price"`
	Stock          int            `gorm:"not null;default:0" json:"stock"`
	ShortDescBN    *string        `gorm:"column:short_desc_bn;type:text" json:"short_desc_bn,omitempty"`
	ShortDescEN    *string        `gorm:"column:short_desc_en;type:text" json:"short_desc_en,omitempty"`
	DescriptionBN  *string        `gorm:"column:description_bn;type:longtext" json:"description_bn,omitempty"`
	DescriptionEN  *string        `gorm:"column:description_en;type:longtext" json:"description_en,omitempty"`
	Brand          *string        `gorm:"size:150" json:"brand,omitempty"`
	ModelNumber    *string        `gorm:"column:model_number;size:150" json:"model_number,omitempty"`
	Manufacturer   *string        `gorm:"size:200" json:"manufacturer,omitempty"`
	IsFeatured     bool           `gorm:"not null;default:false" json:"is_featured"`
	IsActive       bool           `gorm:"not null;default:true" json:"is_active"`
	MetaTitleBN    *string        `gorm:"column:meta_title_bn;size:255" json:"meta_title_bn,omitempty"`
	MetaTitleEN    *string        `gorm:"column:meta_title_en;size:255" json:"meta_title_en,omitempty"`
	MetaDescBN     *string        `gorm:"column:meta_desc_bn;type:text" json:"meta_desc_bn,omitempty"`
	MetaDescEN     *string        `gorm:"column:meta_desc_en;type:text" json:"meta_desc_en,omitempty"`
	CreatedBy      *uint          `json:"created_by,omitempty"`
	UpdatedBy      *uint          `json:"updated_by,omitempty"`
	// Relations
	Variants        []ProductVariant        `gorm:"foreignKey:ProductID" json:"variants,omitempty"`
	Images          []ProductImage          `gorm:"foreignKey:ProductID" json:"images,omitempty"`
	AttributeValues []ProductAttributeValue `gorm:"foreignKey:ProductID" json:"attribute_values,omitempty"`
	CreatedAt       time.Time               `json:"created_at"`
	UpdatedAt       time.Time               `json:"updated_at"`
	DeletedAt       gorm.DeletedAt          `gorm:"index" json:"-"`
}

// ─── ProductImage ─────────────────────────────────────────────────────────────

type ProductImage struct {
	ID        uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	ProductID uint    `gorm:"not null;index" json:"product_id"`
	URL       string  `gorm:"size:500;not null" json:"url"`
	AltBN     *string `gorm:"column:alt_bn;size:255" json:"alt_bn,omitempty"`
	AltEN     *string `gorm:"column:alt_en;size:255" json:"alt_en,omitempty"`
	IsPrimary bool    `gorm:"not null;default:false" json:"is_primary"`
	SortOrder int     `gorm:"not null;default:0" json:"sort_order"`
}

// ─── ProductAttributeValue ────────────────────────────────────────────────────

type ProductAttributeValue struct {
	ID          uint             `gorm:"primaryKey;autoIncrement" json:"id"`
	ProductID   uint             `gorm:"not null;index;uniqueIndex:uq_prod_attr" json:"product_id"`
	AttributeID uint             `gorm:"not null;uniqueIndex:uq_prod_attr" json:"attribute_id"`
	Attribute   Attribute        `gorm:"foreignKey:AttributeID" json:"attribute,omitempty"`
	OptionID    *uint            `json:"option_id,omitempty"`
	Option      *AttributeOption `gorm:"foreignKey:OptionID" json:"option,omitempty"`
	ValueCustom *string          `gorm:"column:value_custom;size:500" json:"value_custom,omitempty"`
}

// ─── ProductVariant ───────────────────────────────────────────────────────────

type ProductVariant struct {
	ID         uint                     `gorm:"primaryKey;autoIncrement" json:"id"`
	ProductID  uint                     `gorm:"not null;index" json:"product_id"`
	SKU        string                   `gorm:"size:100;not null;uniqueIndex" json:"sku"`
	Barcode    *string                  `gorm:"size:100" json:"barcode,omitempty"`
	IsActive   bool                     `gorm:"not null;default:true" json:"is_active"`
	Attributes []ProductVariantAttribute `gorm:"foreignKey:VariantID" json:"attributes,omitempty"`
	Prices     []ProductPrice           `gorm:"foreignKey:VariantID" json:"prices,omitempty"`
	Stock      []Stock                  `gorm:"foreignKey:VariantID" json:"stock,omitempty"`
	CreatedAt  time.Time                `json:"created_at"`
	UpdatedAt  time.Time                `json:"updated_at"`
}

// ─── ProductVariantAttribute ─────────────────────────────────────────────────

type ProductVariantAttribute struct {
	VariantID   uint            `gorm:"primaryKey;index" json:"variant_id"`
	AttributeID uint            `gorm:"primaryKey" json:"attribute_id"`
	OptionID    uint            `gorm:"not null" json:"option_id"`
	Attribute   Attribute       `gorm:"foreignKey:AttributeID" json:"attribute,omitempty"`
	Option      AttributeOption `gorm:"foreignKey:OptionID" json:"option,omitempty"`
}

func (ProductVariantAttribute) TableName() string { return "product_variant_attributes" }

// ─── Currency ────────────────────────────────────────────────────────────────

type Currency struct {
	ID       uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	Code     string  `gorm:"size:3;not null;uniqueIndex" json:"code"`
	Symbol   string  `gorm:"size:10;not null" json:"symbol"`
	Name     string  `gorm:"size:100;not null" json:"name"`
	Rate     float64 `gorm:"type:decimal(15,6);not null;default:1" json:"rate"`
	IsBase   bool    `gorm:"not null;default:false" json:"is_base"`
	IsActive bool    `gorm:"not null;default:true" json:"is_active"`
}

// ─── ProductPrice ─────────────────────────────────────────────────────────────

type ProductPrice struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	VariantID    uint      `gorm:"not null;index;uniqueIndex:uq_variant_currency" json:"variant_id"`
	CurrencyID   uint      `gorm:"not null;uniqueIndex:uq_variant_currency;default:1" json:"currency_id"`
	Currency     Currency  `gorm:"foreignKey:CurrencyID" json:"currency,omitempty"`
	BasePrice    float64   `gorm:"type:decimal(15,2);not null" json:"base_price"`
	SalePrice    *float64  `gorm:"type:decimal(15,2)" json:"sale_price,omitempty"`
	CostPrice    *float64  `gorm:"type:decimal(15,2)" json:"cost_price,omitempty"`
	SaleStartsAt *time.Time `gorm:"column:sale_starts_at" json:"sale_starts_at,omitempty"`
	SaleEndsAt   *time.Time `gorm:"column:sale_ends_at" json:"sale_ends_at,omitempty"`
	IsActive     bool      `gorm:"not null;default:true" json:"is_active"`
}

// ─── PriceHistory ─────────────────────────────────────────────────────────────

type PriceHistory struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	VariantID  uint      `gorm:"not null;index" json:"variant_id"`
	CurrencyID uint      `gorm:"not null" json:"currency_id"`
	OldPrice   float64   `gorm:"type:decimal(15,2);not null" json:"old_price"`
	NewPrice   float64   `gorm:"type:decimal(15,2);not null" json:"new_price"`
	ChangedBy  *uint     `json:"changed_by,omitempty"`
	ChangedAt  time.Time `gorm:"not null;autoCreateTime" json:"changed_at"`
}

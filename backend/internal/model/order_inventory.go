package model

import (
	"time"

	"gorm.io/gorm"
)

// ─── Warehouse ────────────────────────────────────────────────────────────────

type Warehouse struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"size:200;not null" json:"name"`
	Address   *string   `gorm:"type:text" json:"address,omitempty"`
	IsDefault bool      `gorm:"not null;default:false" json:"is_default"`
	IsActive  bool      `gorm:"not null;default:true" json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

// ─── Stock ────────────────────────────────────────────────────────────────────

type Stock struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	VariantID   uint      `gorm:"not null;index;uniqueIndex:uq_stock_variant_wh" json:"variant_id"`
	WarehouseID uint      `gorm:"not null;uniqueIndex:uq_stock_variant_wh" json:"warehouse_id"`
	Warehouse   Warehouse `gorm:"foreignKey:WarehouseID" json:"warehouse,omitempty"`
	Quantity    int       `gorm:"not null;default:0" json:"quantity"`
	Reserved    int       `gorm:"not null;default:0" json:"reserved"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Available returns sellable quantity
func (s *Stock) Available() int {
	avail := s.Quantity - s.Reserved
	if avail < 0 {
		return 0
	}
	return avail
}

// ─── StockMovement ────────────────────────────────────────────────────────────

type StockMovement struct {
	ID            uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	VariantID     uint      `gorm:"not null;index" json:"variant_id"`
	WarehouseID   uint      `gorm:"not null" json:"warehouse_id"`
	MovementType  string    `gorm:"size:20;not null" json:"movement_type"`
	Quantity      int       `gorm:"not null" json:"quantity"`
	ReferenceType *string   `gorm:"column:reference_type;size:50" json:"reference_type,omitempty"`
	ReferenceID   *uint     `gorm:"column:reference_id;index" json:"reference_id,omitempty"`
	Note          *string   `gorm:"type:text" json:"note,omitempty"`
	CreatedBy     *uint     `json:"created_by,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
}

// ─── Order ────────────────────────────────────────────────────────────────────

type Order struct {
	ID               uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderNumber      string         `gorm:"size:50;not null;uniqueIndex" json:"order_number"`
	CustomerID       *uint          `gorm:"index" json:"customer_id,omitempty"`
	Customer         *Customer      `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	CustomerName     string         `gorm:"column:customer_name;size:200;not null" json:"customer_name"`
	CustomerEmail    string         `gorm:"column:customer_email;size:255;not null" json:"customer_email"`
	CustomerPhone    string         `gorm:"column:customer_phone;size:30;not null" json:"customer_phone"`

	// Shipping snapshot
	ShipAddressLine1 string  `gorm:"column:ship_address_line1;size:255;not null" json:"ship_address_line1"`
	ShipAddressLine2 *string `gorm:"column:ship_address_line2;size:255" json:"ship_address_line2,omitempty"`
	ShipCity         string  `gorm:"column:ship_city;size:100;not null" json:"ship_city"`
	ShipDistrict     *string `gorm:"column:ship_district;size:100" json:"ship_district,omitempty"`
	ShipPostalCode   *string `gorm:"column:ship_postal_code;size:20" json:"ship_postal_code,omitempty"`
	ShipCountry      string  `gorm:"column:ship_country;size:2;not null;default:'BD'" json:"ship_country"`

	// Billing snapshot
	BillAddressLine1 *string `gorm:"column:bill_address_line1;size:255" json:"bill_address_line1,omitempty"`
	BillAddressLine2 *string `gorm:"column:bill_address_line2;size:255" json:"bill_address_line2,omitempty"`
	BillCity         *string `gorm:"column:bill_city;size:100" json:"bill_city,omitempty"`
	BillCountry      *string `gorm:"column:bill_country;size:2;default:'BD'" json:"bill_country,omitempty"`

	CurrencyCode     string  `gorm:"column:currency_code;size:3;not null;default:'BDT'" json:"currency_code"`
	Subtotal         float64 `gorm:"type:decimal(15,2);not null" json:"subtotal"`
	DiscountAmount   float64 `gorm:"type:decimal(15,2);not null;default:0" json:"discount_amount"`
	ShippingFee      float64 `gorm:"type:decimal(15,2);not null;default:0" json:"shipping_fee"`
	TaxAmount        float64 `gorm:"type:decimal(15,2);not null;default:0" json:"tax_amount"`
	GrandTotal       float64 `gorm:"type:decimal(15,2);not null" json:"grand_total"`

	Status          string  `gorm:"size:20;not null;default:'pending';index" json:"status"`
	PaymentStatus   string  `gorm:"column:payment_status;size:20;not null;default:'unpaid'" json:"payment_status"`
	PaymentMethod   *string `gorm:"column:payment_method;size:100" json:"payment_method,omitempty"`
	PaymentReference *string `gorm:"column:payment_reference;size:255" json:"payment_reference,omitempty"`
	Notes           *string `gorm:"type:text" json:"notes,omitempty"`
	CreatedBy       *uint   `json:"created_by,omitempty"`

	Items         []OrderItem          `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	StatusHistory []OrderStatusHistory `gorm:"foreignKey:OrderID" json:"status_history,omitempty"`
	Invoice       *Invoice             `gorm:"foreignKey:OrderID" json:"invoice,omitempty"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── OrderItem ────────────────────────────────────────────────────────────────

type OrderItem struct {
	ID             uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID        uint    `gorm:"not null;index" json:"order_id"`
	VariantID      *uint   `gorm:"index" json:"variant_id,omitempty"`
	ProductNameBN  string  `gorm:"column:product_name_bn;size:300;not null" json:"product_name_bn"`
	ProductNameEN  string  `gorm:"column:product_name_en;size:300;not null" json:"product_name_en"`
	SKU            string  `gorm:"size:100;not null" json:"sku"`
	VariantLabel   *string `gorm:"column:variant_label;size:300" json:"variant_label,omitempty"`
	UnitPrice      float64 `gorm:"column:unit_price;type:decimal(15,2);not null" json:"unit_price"`
	Quantity       int     `gorm:"not null" json:"quantity"`
	DiscountAmount float64 `gorm:"column:discount_amount;type:decimal(15,2);not null;default:0" json:"discount_amount"`
	LineTotal      float64 `gorm:"column:line_total;type:decimal(15,2);not null" json:"line_total"`
}

// ─── OrderStatusHistory ───────────────────────────────────────────────────────

type OrderStatusHistory struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID   uint      `gorm:"not null;index" json:"order_id"`
	OldStatus *string   `gorm:"column:old_status;size:50" json:"old_status,omitempty"`
	NewStatus string    `gorm:"column:new_status;size:50;not null" json:"new_status"`
	Note      *string   `gorm:"type:text" json:"note,omitempty"`
	ChangedBy *uint     `json:"changed_by,omitempty"`
	ChangedAt time.Time `gorm:"autoCreateTime" json:"changed_at"`
}

// ─── Invoice ─────────────────────────────────────────────────────────────────

type Invoice struct {
	ID             uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID        uint           `gorm:"not null;uniqueIndex" json:"order_id"`
	InvoiceNumber  string         `gorm:"column:invoice_number;size:50;not null;uniqueIndex" json:"invoice_number"`
	IssuedAt       time.Time      `gorm:"column:issued_at;not null;autoCreateTime" json:"issued_at"`
	DueDate        *time.Time     `gorm:"column:due_date" json:"due_date,omitempty"`
	Notes          *string        `gorm:"type:text" json:"notes,omitempty"`
	TemplateConfig *string        `gorm:"column:template_config;type:json" json:"template_config,omitempty"`
	PDFURL         *string        `gorm:"column:pdf_url;size:500" json:"pdf_url,omitempty"`
	CreatedBy      *uint          `json:"created_by,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── Quotation ────────────────────────────────────────────────────────────────

type Quotation struct {
	ID             uint            `gorm:"primaryKey;autoIncrement" json:"id"`
	CustomerID     *uint           `gorm:"index" json:"customer_id,omitempty"`
	SessionToken   *string         `gorm:"column:session_token;size:255;index" json:"session_token,omitempty"`
	CustomerName   *string         `gorm:"column:customer_name;size:200" json:"customer_name,omitempty"`
	CustomerEmail  *string         `gorm:"column:customer_email;size:255" json:"customer_email,omitempty"`
	CustomerPhone  *string         `gorm:"column:customer_phone;size:30" json:"customer_phone,omitempty"`
	Notes          *string         `gorm:"type:text" json:"notes,omitempty"`
	Status         string          `gorm:"size:20;not null;default:'draft'" json:"status"`
	ExpiresAt      *time.Time      `gorm:"column:expires_at" json:"expires_at,omitempty"`
	Items          []QuotationItem `gorm:"foreignKey:QuotationID" json:"items,omitempty"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
}

// ─── QuotationItem ────────────────────────────────────────────────────────────

type QuotationItem struct {
	ID            uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	QuotationID   uint    `gorm:"not null;index" json:"quotation_id"`
	VariantID     *uint   `json:"variant_id,omitempty"`
	ProductNameEN string  `gorm:"column:product_name_en;size:300;not null" json:"product_name_en"`
	SKU           string  `gorm:"size:100;not null" json:"sku"`
	UnitPrice     float64 `gorm:"column:unit_price;type:decimal(15,2);not null" json:"unit_price"`
	Quantity      int     `gorm:"not null;default:1" json:"quantity"`
	LineTotal     float64 `gorm:"column:line_total;type:decimal(15,2);not null" json:"line_total"`
}

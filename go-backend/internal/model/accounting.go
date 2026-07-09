package model

import (
	"time"

	"gorm.io/gorm"
)

// AccountingSale represents revenue from generic sales operations
type AccountingSale struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Amount    float64        `gorm:"type:decimal(15,2);not null" json:"amount"`
	Date      time.Time      `gorm:"not null" json:"date"`
	Reference string         `gorm:"size:255" json:"reference,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// AccountingPurchase represents expenses from inventory and product purchases
type AccountingPurchase struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Amount    float64        `gorm:"type:decimal(15,2);not null" json:"amount"`
	Vendor    string         `gorm:"size:255" json:"vendor,omitempty"`
	Date      time.Time      `gorm:"not null" json:"date"`
	Reference string         `gorm:"size:255" json:"reference,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// AccountingExpense represents general overhead and operating expenses
type AccountingExpense struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Amount      float64        `gorm:"type:decimal(15,2);not null" json:"amount"`
	Category    string         `gorm:"size:100;not null" json:"category"`
	Description string         `gorm:"type:text" json:"description,omitempty"`
	Date        time.Time      `gorm:"not null" json:"date"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// AccountingServiceRevenue represents revenue specifically from rendering services
type AccountingServiceRevenue struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Amount    float64        `gorm:"type:decimal(15,2);not null" json:"amount"`
	ServiceID *uint          `gorm:"index" json:"service_id,omitempty"`
	Date      time.Time      `gorm:"not null" json:"date"`
	Reference string         `gorm:"size:255" json:"reference,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

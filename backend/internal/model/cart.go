package model

import (
	"time"

	"gorm.io/gorm"
)

type Cart struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	UserID    *uint          `json:"user_id"` // Nullable for anonymous carts if needed later
	User      *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Items     []CartItem     `json:"items"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type CartItem struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CartID    uint           `json:"cart_id"`
	ProductID uint           `json:"product_id"`
	Product   *Product       `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Quantity  int            `json:"quantity"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

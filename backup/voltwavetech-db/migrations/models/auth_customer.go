package models

import (
	"time"

	"gorm.io/gorm"
)

// ─── Role ─────────────────────────────────────────────────────────────────────

type Role struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string         `gorm:"size:100;not null;uniqueIndex" json:"name"`
	Slug        string         `gorm:"size:100;not null;uniqueIndex" json:"slug"`
	Permissions []Permission   `gorm:"many2many:role_permission_map;" json:"permissions,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── Permission ───────────────────────────────────────────────────────────────

type Permission struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"size:150;not null;uniqueIndex" json:"name"`
	Slug      string    `gorm:"size:150;not null;uniqueIndex" json:"slug"`
	Module    string    `gorm:"size:100;not null" json:"module"`
	CreatedAt time.Time `json:"created_at"`
}

// ─── User ────────────────────────────────────────────────────────────────

type User struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	RoleID    uint           `gorm:"not null;index" json:"role_id"`
	Role      Role           `gorm:"foreignKey:RoleID" json:"role,omitempty"`
	Name      string         `gorm:"size:200;not null" json:"name"`
	Email     string         `gorm:"size:255;not null;uniqueIndex" json:"email"`
	Password  string         `gorm:"size:255;not null" json:"-"`
	IsActive  bool           `gorm:"not null;default:true" json:"is_active"`
	LastLogin *time.Time     `json:"last_login,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── Customer ─────────────────────────────────────────────────────────────────

type Customer struct {
	ID                uint              `gorm:"primaryKey;autoIncrement" json:"id"`
	Name              string            `gorm:"size:200;not null" json:"name"`
	Email             string            `gorm:"size:255;not null;uniqueIndex" json:"email"`
	Phone             *string           `gorm:"size:30" json:"phone,omitempty"`
	Password          string            `gorm:"size:255;not null" json:"-"`
	IsActive          bool              `gorm:"not null;default:true" json:"is_active"`
	EmailVerifiedAt   *time.Time        `json:"email_verified_at,omitempty"`
	Addresses         []CustomerAddress `gorm:"foreignKey:CustomerID" json:"addresses,omitempty"`
	CreatedAt         time.Time         `json:"created_at"`
	UpdatedAt         time.Time         `json:"updated_at"`
	DeletedAt         gorm.DeletedAt    `gorm:"index" json:"-"`
}

// ─── CustomerAddress ──────────────────────────────────────────────────────────

type CustomerAddress struct {
	ID            uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	CustomerID    uint    `gorm:"not null;index" json:"customer_id"`
	Customer      Customer `gorm:"foreignKey:CustomerID" json:"-"`
	Label         *string `gorm:"size:50" json:"label,omitempty"`
	RecipientName string  `gorm:"size:200;not null" json:"recipient_name"`
	Phone         string  `gorm:"size:30;not null" json:"phone"`
	AddressLine1  string  `gorm:"size:255;not null" json:"address_line1"`
	AddressLine2  *string `gorm:"size:255" json:"address_line2,omitempty"`
	City          string  `gorm:"size:100;not null" json:"city"`
	District      *string `gorm:"size:100" json:"district,omitempty"`
	PostalCode    *string `gorm:"size:20" json:"postal_code,omitempty"`
	Country       string  `gorm:"size:2;not null;default:'BD'" json:"country"`
	IsDefault     bool    `gorm:"not null;default:false" json:"is_default"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

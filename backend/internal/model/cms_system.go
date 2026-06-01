package model

import (
	"time"

	"gorm.io/gorm"
)

// ─── Page ─────────────────────────────────────────────────────────────────────

type Page struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Slug        string         `gorm:"size:320;not null;uniqueIndex" json:"slug"`
	TitleBN     string         `gorm:"column:title_bn;size:255;not null" json:"title_bn"`
	TitleEN     string         `gorm:"column:title_en;size:255;not null" json:"title_en"`
	ContentBN   *string        `gorm:"column:content_bn;type:longtext" json:"content_bn,omitempty"`
	ContentEN   *string        `gorm:"column:content_en;type:longtext" json:"content_en,omitempty"`
	Status      string         `gorm:"size:20;not null;default:'draft'" json:"status"`
	MetaTitleBN *string        `gorm:"column:meta_title_bn;size:255" json:"meta_title_bn,omitempty"`
	MetaTitleEN *string        `gorm:"column:meta_title_en;size:255" json:"meta_title_en,omitempty"`
	MetaDescBN  *string        `gorm:"column:meta_desc_bn;type:text" json:"meta_desc_bn,omitempty"`
	MetaDescEN  *string        `gorm:"column:meta_desc_en;type:text" json:"meta_desc_en,omitempty"`
	CreatedBy   *uint          `json:"created_by,omitempty"`
	UpdatedBy   *uint          `json:"updated_by,omitempty"`
	PublishedAt *time.Time     `gorm:"column:published_at" json:"published_at,omitempty"`
	Sections    []PageSection  `gorm:"foreignKey:PageID" json:"sections,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── PageSection ──────────────────────────────────────────────────────────────

type PageSection struct {
	ID         uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	PageID     uint    `gorm:"not null;index" json:"page_id"`
	SectionKey string  `gorm:"column:section_key;size:100;not null" json:"section_key"`
	TitleBN    *string `gorm:"column:title_bn;size:255" json:"title_bn,omitempty"`
	TitleEN    *string `gorm:"column:title_en;size:255" json:"title_en,omitempty"`
	ContentBN  *string `gorm:"column:content_bn;type:longtext" json:"content_bn,omitempty"`
	ContentEN  *string `gorm:"column:content_en;type:longtext" json:"content_en,omitempty"`
	ExtraData  *string `gorm:"column:extra_data;type:json" json:"extra_data,omitempty"`
	SortOrder  int     `gorm:"not null;default:0" json:"sort_order"`
}

// ─── Banner ───────────────────────────────────────────────────────────────────

type Banner struct {
	ID         uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	TitleBN    *string        `gorm:"column:title_bn;size:255" json:"title_bn,omitempty"`
	TitleEN    *string        `gorm:"column:title_en;size:255" json:"title_en,omitempty"`
	SubtitleBN *string        `gorm:"column:subtitle_bn;size:500" json:"subtitle_bn,omitempty"`
	SubtitleEN *string        `gorm:"column:subtitle_en;size:500" json:"subtitle_en,omitempty"`
	ImageURL   string         `gorm:"column:image_url;size:500;not null" json:"image_url"`
	LinkURL    *string        `gorm:"column:link_url;size:500" json:"link_url,omitempty"`
	Placement  string         `gorm:"size:100;not null;default:'hero'" json:"placement"`
	IsActive   bool           `gorm:"not null;default:true" json:"is_active"`
	StartsAt   *time.Time     `gorm:"column:starts_at" json:"starts_at,omitempty"`
	EndsAt     *time.Time     `gorm:"column:ends_at" json:"ends_at,omitempty"`
	SortOrder  int            `gorm:"not null;default:0" json:"sort_order"`
	CreatedBy  *uint          `json:"created_by,omitempty"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── BlogCategory ─────────────────────────────────────────────────────────────

type BlogCategory struct {
	ID     uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	NameBN string `gorm:"column:name_bn;size:200;not null" json:"name_bn"`
	NameEN string `gorm:"column:name_en;size:200;not null" json:"name_en"`
	Slug   string `gorm:"size:220;not null;uniqueIndex" json:"slug"`
}

// ─── BlogPost ─────────────────────────────────────────────────────────────────

type BlogPost struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	CategoryID   *uint          `gorm:"index" json:"category_id,omitempty"`
	Category     *BlogCategory  `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Slug         string         `gorm:"size:320;not null;uniqueIndex" json:"slug"`
	TitleBN      string         `gorm:"column:title_bn;size:255;not null" json:"title_bn"`
	TitleEN      string         `gorm:"column:title_en;size:255;not null" json:"title_en"`
	ExcerptBN    *string        `gorm:"column:excerpt_bn;type:text" json:"excerpt_bn,omitempty"`
	ExcerptEN    *string        `gorm:"column:excerpt_en;type:text" json:"excerpt_en,omitempty"`
	ContentBN    *string        `gorm:"column:content_bn;type:longtext" json:"content_bn,omitempty"`
	ContentEN    *string        `gorm:"column:content_en;type:longtext" json:"content_en,omitempty"`
	CoverImage   *string        `gorm:"column:cover_image;size:500" json:"cover_image,omitempty"`
	Status       string         `gorm:"size:20;not null;default:'draft';index" json:"status"`
	MetaTitleBN  *string        `gorm:"column:meta_title_bn;size:255" json:"meta_title_bn,omitempty"`
	MetaTitleEN  *string        `gorm:"column:meta_title_en;size:255" json:"meta_title_en,omitempty"`
	MetaDescBN   *string        `gorm:"column:meta_desc_bn;type:text" json:"meta_desc_bn,omitempty"`
	MetaDescEN   *string        `gorm:"column:meta_desc_en;type:text" json:"meta_desc_en,omitempty"`
	AuthorID     *uint          `gorm:"index" json:"author_id,omitempty"`
	Author       *User     `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	PublishedAt  *time.Time     `gorm:"column:published_at" json:"published_at,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── Service ──────────────────────────────────────────────────────────────────

type Service struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	NameBN        string         `gorm:"column:name_bn;size:300;not null" json:"name_bn"`
	NameEN        string         `gorm:"column:name_en;size:300;not null" json:"name_en"`
	Slug          string         `gorm:"size:320;not null;uniqueIndex" json:"slug"`
	DescriptionBN *string        `gorm:"column:description_bn;type:text" json:"description_bn,omitempty"`
	DescriptionEN *string        `gorm:"column:description_en;type:text" json:"description_en,omitempty"`
	Price         *float64       `gorm:"type:decimal(15,2)" json:"price,omitempty"`
	ImageURL      *string        `gorm:"column:image_url;size:500" json:"image_url,omitempty"`
	IsActive      bool           `gorm:"not null;default:true" json:"is_active"`
	SortOrder     int            `gorm:"not null;default:0" json:"sort_order"`
	CreatedBy     *uint          `json:"created_by,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// ─── ContactMessage ───────────────────────────────────────────────────────────

type ContactMessage struct {
	ID         uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	Name       string     `gorm:"size:200;not null" json:"name"`
	Email      string     `gorm:"size:255;not null" json:"email"`
	Phone      *string    `gorm:"size:30" json:"phone,omitempty"`
	Subject    *string    `gorm:"size:255" json:"subject,omitempty"`
	Message    string     `gorm:"type:text;not null" json:"message"`
	IsRead     bool       `gorm:"column:is_read;not null;default:false;index" json:"is_read"`
	RepliedAt  *time.Time `gorm:"column:replied_at" json:"replied_at,omitempty"`
	RepliedBy  *uint      `gorm:"column:replied_by" json:"replied_by,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
}

// ─── Setting ─────────────────────────────────────────────────────────────────

type Setting struct {
	ID        uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	Group     string  `gorm:"column:group;size:100;not null;uniqueIndex:uq_settings_key;default:'general'" json:"group"`
	Key       string  `gorm:"column:key;size:150;not null;uniqueIndex:uq_settings_key" json:"key"`
	Value     *string `gorm:"column:value;type:text" json:"value,omitempty"`
	ValueJSON *string `gorm:"column:value_json;type:json" json:"value_json,omitempty"`
	LabelBN   *string `gorm:"column:label_bn;size:255" json:"label_bn,omitempty"`
	LabelEN   *string `gorm:"column:label_en;size:255" json:"label_en,omitempty"`
	UpdatedBy *uint   `json:"updated_by,omitempty"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ─── ActivityLog ─────────────────────────────────────────────────────────────

type ActivityLog struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	AdminID     *uint     `gorm:"index" json:"admin_id,omitempty"`
	Admin       *User `gorm:"foreignKey:AdminID" json:"admin,omitempty"`
	IPAddress   *string   `gorm:"column:ip_address;size:45" json:"ip_address,omitempty"`
	UserAgent   *string   `gorm:"column:user_agent;size:500" json:"user_agent,omitempty"`
	Action      string    `gorm:"size:200;not null" json:"action"`
	Description *string   `gorm:"type:text" json:"description,omitempty"`
	CreatedAt   time.Time `gorm:"index" json:"created_at"`
}

// ─── AuditLog ─────────────────────────────────────────────────────────────────

type AuditLog struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	AdminID    *uint     `gorm:"index" json:"admin_id,omitempty"`
	Admin      *User `gorm:"foreignKey:AdminID" json:"admin,omitempty"`
	EntityType string    `gorm:"column:entity_type;size:100;not null;index:idx_audit_entity" json:"entity_type"`
	EntityID   uint      `gorm:"column:entity_id;not null;index:idx_audit_entity" json:"entity_id"`
	Action     string    `gorm:"size:20;not null" json:"action"`
	OldValues  *string   `gorm:"column:old_values;type:json" json:"old_values,omitempty"`
	NewValues  *string   `gorm:"column:new_values;type:json" json:"new_values,omitempty"`
	IPAddress  *string   `gorm:"column:ip_address;size:45" json:"ip_address,omitempty"`
	CreatedAt  time.Time `gorm:"index" json:"created_at"`
}

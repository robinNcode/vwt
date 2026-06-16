package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type ContactRepository interface {
	List(search string) ([]model.ContactMessage, error)
	Create(m *model.ContactMessage) error
	GetByID(id uint) (*model.ContactMessage, error)
	MarkRead(id uint) error
	CountUnread() (int64, error)
}

type contactRepository struct {
	db *gorm.DB
}

func NewContactRepository(db *gorm.DB) ContactRepository {
	return &contactRepository{db: db}
}

func (r *contactRepository) List(search string) ([]model.ContactMessage, error) {
	var out []model.ContactMessage
	q := r.db.Model(&model.ContactMessage{})
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("name LIKE ? OR email LIKE ? OR subject LIKE ?", like, like, like)
	}
	err := q.Order("id DESC").Find(&out).Error
	return out, err
}

func (r *contactRepository) Create(m *model.ContactMessage) error {
	return r.db.Create(m).Error
}

func (r *contactRepository) GetByID(id uint) (*model.ContactMessage, error) {
	var m model.ContactMessage
	err := r.db.First(&m, id).Error
	return &m, err
}

func (r *contactRepository) MarkRead(id uint) error {
	return r.db.Model(&model.ContactMessage{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *contactRepository) CountUnread() (int64, error) {
	var count int64
	err := r.db.Model(&model.ContactMessage{}).Where("is_read = ?", false).Count(&count).Error
	return count, err
}

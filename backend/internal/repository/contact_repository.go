package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type ContactRepository interface {
	List(search string) ([]models.ContactMessage, error)
	Create(m *models.ContactMessage) error
	GetByID(id uint) (*models.ContactMessage, error)
	MarkRead(id uint) error
}

type contactRepository struct {
	db *gorm.DB
}

func NewContactRepository(db *gorm.DB) ContactRepository {
	return &contactRepository{db: db}
}

func (r *contactRepository) List(search string) ([]models.ContactMessage, error) {
	var out []models.ContactMessage
	q := r.db.Model(&models.ContactMessage{})
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("name LIKE ? OR email LIKE ? OR subject LIKE ?", like, like, like)
	}
	err := q.Order("id DESC").Find(&out).Error
	return out, err
}

func (r *contactRepository) Create(m *models.ContactMessage) error {
	return r.db.Create(m).Error
}

func (r *contactRepository) GetByID(id uint) (*models.ContactMessage, error) {
	var m models.ContactMessage
	err := r.db.First(&m, id).Error
	return &m, err
}

func (r *contactRepository) MarkRead(id uint) error {
	return r.db.Model(&models.ContactMessage{}).Where("id = ?", id).Update("is_read", true).Error
}

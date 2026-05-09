package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type QuotationRepository interface {
	List() ([]models.Quotation, error)
	GetByID(id uint) (*models.Quotation, error)
	Create(q *models.Quotation) error
	UpdateStatus(id uint, status string) error
}

type quotationRepository struct {
	db *gorm.DB
}

func NewQuotationRepository(db *gorm.DB) QuotationRepository {
	return &quotationRepository{db: db}
}

func (r *quotationRepository) List() ([]models.Quotation, error) {
	var out []models.Quotation
	err := r.db.Preload("Items").Order("id DESC").Find(&out).Error
	return out, err
}

func (r *quotationRepository) GetByID(id uint) (*models.Quotation, error) {
	var q models.Quotation
	err := r.db.Preload("Items").First(&q, id).Error
	return &q, err
}

func (r *quotationRepository) Create(q *models.Quotation) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		return tx.Create(q).Error
	})
}

func (r *quotationRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&models.Quotation{}).Where("id = ?", id).Update("status", status).Error
}

package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type QuotationRepository interface {
	List() ([]model.Quotation, error)
	GetByID(id uint) (*model.Quotation, error)
	Create(q *model.Quotation) error
	UpdateStatus(id uint, status string) error
}

type quotationRepository struct {
	db *gorm.DB
}

func NewQuotationRepository(db *gorm.DB) QuotationRepository {
	return &quotationRepository{db: db}
}

func (r *quotationRepository) List() ([]model.Quotation, error) {
	var out []model.Quotation
	err := r.db.Preload("Items").Order("id DESC").Find(&out).Error
	return out, err
}

func (r *quotationRepository) GetByID(id uint) (*model.Quotation, error) {
	var q model.Quotation
	err := r.db.Preload("Items").First(&q, id).Error
	return &q, err
}

func (r *quotationRepository) Create(q *model.Quotation) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		return tx.Create(q).Error
	})
}

func (r *quotationRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&model.Quotation{}).Where("id = ?", id).Update("status", status).Error
}

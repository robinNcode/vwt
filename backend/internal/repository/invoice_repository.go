package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type InvoiceRepository interface {
	List() ([]models.Invoice, error)
	GetByID(id uint) (*models.Invoice, error)
	Create(inv *models.Invoice) error
	Update(inv *models.Invoice) error
	Delete(id uint) error
}

type invoiceRepository struct {
	db *gorm.DB
}

func NewInvoiceRepository(db *gorm.DB) InvoiceRepository {
	return &invoiceRepository{db: db}
}

func (r *invoiceRepository) List() ([]models.Invoice, error) {
	var out []models.Invoice
	err := r.db.Where("deleted_at IS NULL").Order("id DESC").Find(&out).Error
	return out, err
}

func (r *invoiceRepository) GetByID(id uint) (*models.Invoice, error) {
	var inv models.Invoice
	err := r.db.Where("id = ? AND deleted_at IS NULL", id).First(&inv).Error
	return &inv, err
}

func (r *invoiceRepository) Create(inv *models.Invoice) error {
	return r.db.Create(inv).Error
}

func (r *invoiceRepository) Update(inv *models.Invoice) error {
	return r.db.Save(inv).Error
}

func (r *invoiceRepository) Delete(id uint) error {
	return r.db.Delete(&models.Invoice{}, id).Error
}

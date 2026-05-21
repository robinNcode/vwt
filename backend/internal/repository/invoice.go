package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type InvoiceRepository interface {
	List() ([]model.Invoice, error)
	GetByID(id uint) (*model.Invoice, error)
	Create(inv *model.Invoice) error
	Update(inv *model.Invoice) error
	Delete(id uint) error
}

type invoiceRepository struct {
	db *gorm.DB
}

func NewInvoiceRepository(db *gorm.DB) InvoiceRepository {
	return &invoiceRepository{db: db}
}

func (r *invoiceRepository) List() ([]model.Invoice, error) {
	var out []model.Invoice
	err := r.db.Where("deleted_at IS NULL").Order("id DESC").Find(&out).Error
	return out, err
}

func (r *invoiceRepository) GetByID(id uint) (*model.Invoice, error) {
	var inv model.Invoice
	err := r.db.Where("id = ? AND deleted_at IS NULL", id).First(&inv).Error
	return &inv, err
}

func (r *invoiceRepository) Create(inv *model.Invoice) error {
	return r.db.Create(inv).Error
}

func (r *invoiceRepository) Update(inv *model.Invoice) error {
	return r.db.Save(inv).Error
}

func (r *invoiceRepository) Delete(id uint) error {
	return r.db.Delete(&model.Invoice{}, id).Error
}

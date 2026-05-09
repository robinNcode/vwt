package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type InvoiceService interface {
	ListInvoices() ([]models.Invoice, error)
	GetInvoiceByID(id uint) (*models.Invoice, error)
	CreateInvoice(inv *models.Invoice) error
	UpdateInvoice(inv *models.Invoice) error
	DeleteInvoice(id uint) error
}

type invoiceService struct {
	repo repository.InvoiceRepository
}

func NewInvoiceService(repo repository.InvoiceRepository) InvoiceService {
	return &invoiceService{repo: repo}
}

func (s *invoiceService) ListInvoices() ([]models.Invoice, error) {
	return s.repo.List()
}

func (s *invoiceService) GetInvoiceByID(id uint) (*models.Invoice, error) {
	return s.repo.GetByID(id)
}

func (s *invoiceService) CreateInvoice(inv *models.Invoice) error {
	return s.repo.Create(inv)
}

func (s *invoiceService) UpdateInvoice(inv *models.Invoice) error {
	return s.repo.Update(inv)
}

func (s *invoiceService) DeleteInvoice(id uint) error {
	return s.repo.Delete(id)
}

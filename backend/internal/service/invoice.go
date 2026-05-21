package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type InvoiceService interface {
	ListInvoices() ([]model.Invoice, error)
	GetInvoiceByID(id uint) (*model.Invoice, error)
	CreateInvoice(inv *model.Invoice) error
	UpdateInvoice(inv *model.Invoice) error
	DeleteInvoice(id uint) error
}

type invoiceService struct {
	repo repository.InvoiceRepository
}

func NewInvoiceService(repo repository.InvoiceRepository) InvoiceService {
	return &invoiceService{repo: repo}
}

func (s *invoiceService) ListInvoices() ([]model.Invoice, error) {
	return s.repo.List()
}

func (s *invoiceService) GetInvoiceByID(id uint) (*model.Invoice, error) {
	return s.repo.GetByID(id)
}

func (s *invoiceService) CreateInvoice(inv *model.Invoice) error {
	return s.repo.Create(inv)
}

func (s *invoiceService) UpdateInvoice(inv *model.Invoice) error {
	return s.repo.Update(inv)
}

func (s *invoiceService) DeleteInvoice(id uint) error {
	return s.repo.Delete(id)
}

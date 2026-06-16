package service

import (
	"fmt"

	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type InvoiceService interface {
	ListInvoices() ([]model.Invoice, error)
	GetInvoiceByID(id uint) (*model.Invoice, error)
	CreateInvoice(inv *model.Invoice) error
	UpdateInvoice(inv *model.Invoice) error
	DeleteInvoice(id uint) error
	GetNextInvoiceNumber() (string, error)
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

func (s *invoiceService) GetNextInvoiceNumber() (string, error) {
	lastNum, err := s.repo.GetLatestInvoiceNumber()
	if err != nil {
		return "", err
	}
	if lastNum == "" {
		return "INV-1001", nil
	}
	// Extract numeric part assuming format INV-XXXX
	// Let's do simple increment if it matches INV- format
	if len(lastNum) > 4 && lastNum[:4] == "INV-" {
		var num int
		fmt.Sscanf(lastNum[4:], "%d", &num)
		if num > 0 {
			return fmt.Sprintf("INV-%d", num+1), nil
		}
	}
	// Default fallback
	return "INV-1001", nil
}

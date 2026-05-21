package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type QuotationService interface {
	ListQuotations() ([]model.Quotation, error)
	GetQuotationByID(id uint) (*model.Quotation, error)
	RequestQuotation(q *model.Quotation) error
	UpdateQuotationStatus(id uint, status string) error
}

type quotationService struct {
	repo repository.QuotationRepository
}

func NewQuotationService(repo repository.QuotationRepository) QuotationService {
	return &quotationService{repo: repo}
}

func (s *quotationService) ListQuotations() ([]model.Quotation, error) {
	return s.repo.List()
}

func (s *quotationService) GetQuotationByID(id uint) (*model.Quotation, error) {
	return s.repo.GetByID(id)
}

func (s *quotationService) RequestQuotation(q *model.Quotation) error {
	if q.Status == "" {
		q.Status = "draft"
	}
	return s.repo.Create(q)
}

func (s *quotationService) UpdateQuotationStatus(id uint, status string) error {
	return s.repo.UpdateStatus(id, status)
}

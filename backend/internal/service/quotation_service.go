package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type QuotationService interface {
	ListQuotations() ([]models.Quotation, error)
	GetQuotationByID(id uint) (*models.Quotation, error)
	RequestQuotation(q *models.Quotation) error
	UpdateQuotationStatus(id uint, status string) error
}

type quotationService struct {
	repo repository.QuotationRepository
}

func NewQuotationService(repo repository.QuotationRepository) QuotationService {
	return &quotationService{repo: repo}
}

func (s *quotationService) ListQuotations() ([]models.Quotation, error) {
	return s.repo.List()
}

func (s *quotationService) GetQuotationByID(id uint) (*models.Quotation, error) {
	return s.repo.GetByID(id)
}

func (s *quotationService) RequestQuotation(q *models.Quotation) error {
	if q.Status == "" {
		q.Status = "draft"
	}
	return s.repo.Create(q)
}

func (s *quotationService) UpdateQuotationStatus(id uint, status string) error {
	return s.repo.UpdateStatus(id, status)
}

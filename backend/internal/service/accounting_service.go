package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type AccountingService interface {
	ListSales() ([]models.AccountingSale, error)
	CreateSale(s *models.AccountingSale) error

	ListPurchases() ([]models.AccountingPurchase, error)
	CreatePurchase(p *models.AccountingPurchase) error

	ListExpenses() ([]models.AccountingExpense, error)
	CreateExpense(e *models.AccountingExpense) error

	ListServiceRevenues() ([]models.AccountingServiceRevenue, error)
	CreateServiceRevenue(r *models.AccountingServiceRevenue) error
}

type accountingService struct {
	repo repository.AccountingRepository
}

func NewAccountingService(repo repository.AccountingRepository) AccountingService {
	return &accountingService{repo: repo}
}

func (s *accountingService) ListSales() ([]models.AccountingSale, error) {
	return s.repo.ListSales()
}

func (s *accountingService) CreateSale(sl *models.AccountingSale) error {
	return s.repo.CreateSale(sl)
}

func (s *accountingService) ListPurchases() ([]models.AccountingPurchase, error) {
	return s.repo.ListPurchases()
}

func (s *accountingService) CreatePurchase(p *models.AccountingPurchase) error {
	return s.repo.CreatePurchase(p)
}

func (s *accountingService) ListExpenses() ([]models.AccountingExpense, error) {
	return s.repo.ListExpenses()
}

func (s *accountingService) CreateExpense(e *models.AccountingExpense) error {
	return s.repo.CreateExpense(e)
}

func (s *accountingService) ListServiceRevenues() ([]models.AccountingServiceRevenue, error) {
	return s.repo.ListServiceRevenues()
}

func (s *accountingService) CreateServiceRevenue(r *models.AccountingServiceRevenue) error {
	return s.repo.CreateServiceRevenue(r)
}

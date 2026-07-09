package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type AccountingService interface {
	ListSales() ([]model.AccountingSale, error)
	CreateSale(s *model.AccountingSale) error

	ListPurchases() ([]model.AccountingPurchase, error)
	CreatePurchase(p *model.AccountingPurchase) error

	ListExpenses() ([]model.AccountingExpense, error)
	CreateExpense(e *model.AccountingExpense) error

	ListServiceRevenues() ([]model.AccountingServiceRevenue, error)
	CreateServiceRevenue(r *model.AccountingServiceRevenue) error
}

type accountingService struct {
	repo repository.AccountingRepository
}

func NewAccountingService(repo repository.AccountingRepository) AccountingService {
	return &accountingService{repo: repo}
}

func (s *accountingService) ListSales() ([]model.AccountingSale, error) {
	return s.repo.ListSales()
}

func (s *accountingService) CreateSale(sl *model.AccountingSale) error {
	return s.repo.CreateSale(sl)
}

func (s *accountingService) ListPurchases() ([]model.AccountingPurchase, error) {
	return s.repo.ListPurchases()
}

func (s *accountingService) CreatePurchase(p *model.AccountingPurchase) error {
	return s.repo.CreatePurchase(p)
}

func (s *accountingService) ListExpenses() ([]model.AccountingExpense, error) {
	return s.repo.ListExpenses()
}

func (s *accountingService) CreateExpense(e *model.AccountingExpense) error {
	return s.repo.CreateExpense(e)
}

func (s *accountingService) ListServiceRevenues() ([]model.AccountingServiceRevenue, error) {
	return s.repo.ListServiceRevenues()
}

func (s *accountingService) CreateServiceRevenue(r *model.AccountingServiceRevenue) error {
	return s.repo.CreateServiceRevenue(r)
}

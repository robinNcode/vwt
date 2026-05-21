package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type AccountingRepository interface {
	// Sales
	ListSales() ([]model.AccountingSale, error)
	CreateSale(s *model.AccountingSale) error

	// Purchases
	ListPurchases() ([]model.AccountingPurchase, error)
	CreatePurchase(p *model.AccountingPurchase) error

	// Expenses
	ListExpenses() ([]model.AccountingExpense, error)
	CreateExpense(e *model.AccountingExpense) error

	// Service Revenue
	ListServiceRevenues() ([]model.AccountingServiceRevenue, error)
	CreateServiceRevenue(r *model.AccountingServiceRevenue) error
}

type accountingRepository struct {
	db *gorm.DB
}

func NewAccountingRepository(db *gorm.DB) AccountingRepository {
	return &accountingRepository{db: db}
}

func (r *accountingRepository) ListSales() ([]model.AccountingSale, error) {
	var sales []model.AccountingSale
	err := r.db.Order("date DESC").Find(&sales).Error
	return sales, err
}

func (r *accountingRepository) CreateSale(s *model.AccountingSale) error {
	return r.db.Create(s).Error
}

func (r *accountingRepository) ListPurchases() ([]model.AccountingPurchase, error) {
	var purchases []model.AccountingPurchase
	err := r.db.Order("date DESC").Find(&purchases).Error
	return purchases, err
}

func (r *accountingRepository) CreatePurchase(p *model.AccountingPurchase) error {
	return r.db.Create(p).Error
}

func (r *accountingRepository) ListExpenses() ([]model.AccountingExpense, error) {
	var expenses []model.AccountingExpense
	err := r.db.Order("date DESC").Find(&expenses).Error
	return expenses, err
}

func (r *accountingRepository) CreateExpense(e *model.AccountingExpense) error {
	return r.db.Create(e).Error
}

func (r *accountingRepository) ListServiceRevenues() ([]model.AccountingServiceRevenue, error) {
	var revs []model.AccountingServiceRevenue
	err := r.db.Order("date DESC").Find(&revs).Error
	return revs, err
}

func (r *accountingRepository) CreateServiceRevenue(rev *model.AccountingServiceRevenue) error {
	return r.db.Create(rev).Error
}

package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type AccountingRepository interface {
	// Sales
	ListSales() ([]models.AccountingSale, error)
	CreateSale(s *models.AccountingSale) error

	// Purchases
	ListPurchases() ([]models.AccountingPurchase, error)
	CreatePurchase(p *models.AccountingPurchase) error

	// Expenses
	ListExpenses() ([]models.AccountingExpense, error)
	CreateExpense(e *models.AccountingExpense) error

	// Service Revenue
	ListServiceRevenues() ([]models.AccountingServiceRevenue, error)
	CreateServiceRevenue(r *models.AccountingServiceRevenue) error
}

type accountingRepository struct {
	db *gorm.DB
}

func NewAccountingRepository(db *gorm.DB) AccountingRepository {
	return &accountingRepository{db: db}
}

func (r *accountingRepository) ListSales() ([]models.AccountingSale, error) {
	var sales []models.AccountingSale
	err := r.db.Order("date DESC").Find(&sales).Error
	return sales, err
}

func (r *accountingRepository) CreateSale(s *models.AccountingSale) error {
	return r.db.Create(s).Error
}

func (r *accountingRepository) ListPurchases() ([]models.AccountingPurchase, error) {
	var purchases []models.AccountingPurchase
	err := r.db.Order("date DESC").Find(&purchases).Error
	return purchases, err
}

func (r *accountingRepository) CreatePurchase(p *models.AccountingPurchase) error {
	return r.db.Create(p).Error
}

func (r *accountingRepository) ListExpenses() ([]models.AccountingExpense, error) {
	var expenses []models.AccountingExpense
	err := r.db.Order("date DESC").Find(&expenses).Error
	return expenses, err
}

func (r *accountingRepository) CreateExpense(e *models.AccountingExpense) error {
	return r.db.Create(e).Error
}

func (r *accountingRepository) ListServiceRevenues() ([]models.AccountingServiceRevenue, error) {
	var revs []models.AccountingServiceRevenue
	err := r.db.Order("date DESC").Find(&revs).Error
	return revs, err
}

func (r *accountingRepository) CreateServiceRevenue(rev *models.AccountingServiceRevenue) error {
	return r.db.Create(rev).Error
}

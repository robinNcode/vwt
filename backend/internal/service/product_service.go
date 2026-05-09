package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type ProductService interface {
	ListProducts(search string) ([]models.Product, error)
	CreateProduct(p *models.Product) error
	GetProductByID(id uint) (*models.Product, error)
	UpdateProduct(p *models.Product) error
	DeleteProduct(id uint) error
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) ListProducts(search string) ([]models.Product, error) {
	return s.repo.List(search)
}

func (s *productService) CreateProduct(p *models.Product) error {
	return s.repo.Create(p)
}

func (s *productService) GetProductByID(id uint) (*models.Product, error) {
	return s.repo.GetByID(id)
}

func (s *productService) UpdateProduct(p *models.Product) error {
	return s.repo.Update(p)
}

func (s *productService) DeleteProduct(id uint) error {
	return s.repo.Delete(id)
}

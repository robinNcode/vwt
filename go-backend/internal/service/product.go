package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type ProductService interface {
	ListProducts(search string) ([]model.Product, error)
	ListPublicProducts(search string) ([]model.Product, error)
	CreateProduct(p *model.Product) error
	GetProductByID(id uint) (*model.Product, error)
	UpdateProduct(p *model.Product) error
	DeleteProduct(id uint) error
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) ListProducts(search string) ([]model.Product, error) {
	return s.repo.List(search)
}

func (s *productService) ListPublicProducts(search string) ([]model.Product, error) {
	return s.repo.ListPublic(search)
}

func (s *productService) CreateProduct(p *model.Product) error {
	return s.repo.Create(p)
}

func (s *productService) GetProductByID(id uint) (*model.Product, error) {
	return s.repo.GetByID(id)
}

func (s *productService) UpdateProduct(p *model.Product) error {
	return s.repo.Update(p)
}

func (s *productService) DeleteProduct(id uint) error {
	return s.repo.Delete(id)
}

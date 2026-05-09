package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type ProductRepository interface {
	List(search string) ([]models.Product, error)
	ListPublic(search string) ([]models.Product, error)
	Create(p *models.Product) error
	GetByID(id uint) (*models.Product, error)
	Update(p *models.Product) error
	Delete(id uint) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) List(search string) ([]models.Product, error) {
	var out []models.Product
	q := r.db.Where("deleted_at IS NULL").Preload("Category").Preload("Images").Preload("Variants")
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("name_bn LIKE ? OR name_en LIKE ? OR slug LIKE ?", like, like, like)
	}
	err := q.Order("id DESC").Find(&out).Error
	return out, err
}

func (r *productRepository) ListPublic(search string) ([]models.Product, error) {
	var out []models.Product
	q := r.db.Where("deleted_at IS NULL AND is_active = ?", true).Preload("Category").Preload("Images").Preload("Variants")
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("name_bn LIKE ? OR name_en LIKE ? OR slug LIKE ?", like, like, like)
	}
	err := q.Order("id DESC").Find(&out).Error
	return out, err
}

func (r *productRepository) Create(p *models.Product) error {
	return r.db.Create(p).Error
}

func (r *productRepository) GetByID(id uint) (*models.Product, error) {
	var p models.Product
	err := r.db.Where("id = ? AND deleted_at IS NULL", id).Preload("Category").Preload("Images").Preload("Variants").Preload("AttributeValues").First(&p).Error
	return &p, err
}

func (r *productRepository) Update(p *models.Product) error {
	return r.db.Save(p).Error
}

func (r *productRepository) Delete(id uint) error {
	return r.db.Where("id = ? AND deleted_at IS NULL", id).Delete(&models.Product{}).Error
}

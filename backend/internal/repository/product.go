package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type ProductRepository interface {
	List(search string) ([]model.Product, error)
	ListPublic(search string) ([]model.Product, error)
	Create(p *model.Product) error
	GetByID(id uint) (*model.Product, error)
	Update(p *model.Product) error
	Delete(id uint) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) List(search string) ([]model.Product, error) {
	var out []model.Product
	q := r.db.Where("deleted_at IS NULL").Preload("Category").Preload("Images").Preload("Variants")
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("name_bn LIKE ? OR name_en LIKE ? OR slug LIKE ?", like, like, like)
	}
	err := q.Order("id DESC").Find(&out).Error
	return out, err
}

func (r *productRepository) ListPublic(search string) ([]model.Product, error) {
	var out []model.Product
	q := r.db.Where("deleted_at IS NULL AND is_active = ?", true).Preload("Category").Preload("Images").Preload("Variants")
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("name_bn LIKE ? OR name_en LIKE ? OR slug LIKE ?", like, like, like)
	}
	err := q.Order("id DESC").Find(&out).Error
	return out, err
}

func (r *productRepository) Create(p *model.Product) error {
	return r.db.Create(p).Error
}

func (r *productRepository) GetByID(id uint) (*model.Product, error) {
	var p model.Product
	err := r.db.Where("id = ? AND deleted_at IS NULL", id).Preload("Category").Preload("Images").Preload("Variants").Preload("AttributeValues").First(&p).Error
	return &p, err
}

func (r *productRepository) Update(p *model.Product) error {
	return r.db.Save(p).Error
}

func (r *productRepository) Delete(id uint) error {
	return r.db.Where("id = ? AND deleted_at IS NULL", id).Delete(&model.Product{}).Error
}

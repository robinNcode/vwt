package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type ServiceRepository interface {
	List(search string) ([]models.Service, error)
	Create(s *models.Service) error
	GetByID(id uint) (*models.Service, error)
	Update(s *models.Service) error
	Delete(id uint) error
}

type serviceRepository struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) ServiceRepository {
	return &serviceRepository{db: db}
}

func (r *serviceRepository) List(search string) ([]models.Service, error) {
	var out []models.Service
	q := r.db.Where("deleted_at IS NULL")
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("name_bn LIKE ? OR name_en LIKE ?", like, like)
	}
	err := q.Order("sort_order ASC, id DESC").Find(&out).Error
	return out, err
}

func (r *serviceRepository) Create(s *models.Service) error {
	return r.db.Create(s).Error
}

func (r *serviceRepository) GetByID(id uint) (*models.Service, error) {
	var s models.Service
	err := r.db.Where("id = ? AND deleted_at IS NULL", id).First(&s).Error
	return &s, err
}

func (r *serviceRepository) Update(s *models.Service) error {
	return r.db.Save(s).Error
}

func (r *serviceRepository) Delete(id uint) error {
	return r.db.Delete(&models.Service{}, id).Error
}

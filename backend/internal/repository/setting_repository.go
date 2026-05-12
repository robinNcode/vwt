package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type SettingRepository interface {
	List() ([]models.Setting, error)
	GetByGroup(group string) ([]models.Setting, error)
	GetByKey(group, key string) (*models.Setting, error)
	Create(s *models.Setting) error
	Update(s *models.Setting) error
	Delete(id uint) error
}

type settingRepository struct {
	db *gorm.DB
}

func NewSettingRepository(db *gorm.DB) SettingRepository {
	return &settingRepository{db: db}
}

func (r *settingRepository) List() ([]models.Setting, error) {
	var out []models.Setting
	err := r.db.Order("`group` ASC, `key` ASC").Find(&out).Error
	return out, err
}

func (r *settingRepository) GetByGroup(group string) ([]models.Setting, error) {
	var out []models.Setting
	err := r.db.Where("`group` = ?", group).Order("`key` ASC").Find(&out).Error
	return out, err
}

func (r *settingRepository) GetByKey(group, key string) (*models.Setting, error) {
	var s models.Setting
	err := r.db.Where("`group` = ? AND `key` = ?", group, key).First(&s).Error
	return &s, err
}

func (r *settingRepository) Create(s *models.Setting) error {
	return r.db.Create(s).Error
}

func (r *settingRepository) Update(s *models.Setting) error {
	return r.db.Save(s).Error
}

func (r *settingRepository) Delete(id uint) error {
	return r.db.Delete(&models.Setting{}, id).Error
}

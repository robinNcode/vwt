package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type SettingRepository interface {
	List() ([]model.Setting, error)
	GetByGroup(group string) ([]model.Setting, error)
	GetByKey(group, key string) (*model.Setting, error)
	Create(s *model.Setting) error
	Update(s *model.Setting) error
	BulkUpdate(settings []model.Setting) error
	Delete(id uint) error
}

type settingRepository struct {
	db *gorm.DB
}

func NewSettingRepository(db *gorm.DB) SettingRepository {
	return &settingRepository{db: db}
}

func (r *settingRepository) List() ([]model.Setting, error) {
	var out []model.Setting
	err := r.db.Order("`group` ASC, `key` ASC").Find(&out).Error
	return out, err
}

func (r *settingRepository) GetByGroup(group string) ([]model.Setting, error) {
	var out []model.Setting
	err := r.db.Where("`group` = ?", group).Order("`key` ASC").Find(&out).Error
	return out, err
}

func (r *settingRepository) GetByKey(group, key string) (*model.Setting, error) {
	var s model.Setting
	err := r.db.Where("`group` = ? AND `key` = ?", group, key).First(&s).Error
	return &s, err
}

func (r *settingRepository) Create(s *model.Setting) error {
	return r.db.Create(s).Error
}

func (r *settingRepository) Update(s *model.Setting) error {
	return r.db.Save(s).Error
}

func (r *settingRepository) BulkUpdate(settings []model.Setting) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		for _, s := range settings {
			if err := tx.Save(&s).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *settingRepository) Delete(id uint) error {
	return r.db.Delete(&model.Setting{}, id).Error
}

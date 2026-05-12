package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type RoleRepository interface {
	List() ([]models.Role, error)
	GetByID(id uint) (*models.Role, error)
	Create(r *models.Role) error
	Update(r *models.Role) error
	Delete(id uint) error
	ListPermissions() ([]models.Permission, error)
	UpdatePermissions(roleID uint, permIDs []uint) error
}

type roleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) List() ([]models.Role, error) {
	var roles []models.Role
	err := r.db.Preload("Permissions").Find(&roles).Error
	return roles, err
}

func (r *roleRepository) GetByID(id uint) (*models.Role, error) {
	var role models.Role
	err := r.db.Preload("Permissions").First(&role, id).Error
	return &role, err
}

func (r *roleRepository) Create(role *models.Role) error {
	return r.db.Create(role).Error
}

func (r *roleRepository) Update(role *models.Role) error {
	return r.db.Save(role).Error
}

func (r *roleRepository) Delete(id uint) error {
	return r.db.Delete(&models.Role{}, id).Error
}

func (r *roleRepository) ListPermissions() ([]models.Permission, error) {
	var perms []models.Permission
	err := r.db.Find(&perms).Error
	return perms, err
}

func (r *roleRepository) UpdatePermissions(roleID uint, permIDs []uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var role models.Role
		if err := tx.First(&role, roleID).Error; err != nil {
			return err
		}
		var perms []models.Permission
		if len(permIDs) > 0 {
			if err := tx.Find(&perms, permIDs).Error; err != nil {
				return err
			}
		}
		return tx.Model(&role).Association("Permissions").Replace(perms)
	})
}

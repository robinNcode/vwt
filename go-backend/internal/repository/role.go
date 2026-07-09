package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type RoleRepository interface {
	List() ([]model.Role, error)
	GetByID(id uint) (*model.Role, error)
	Create(r *model.Role) error
	Update(r *model.Role) error
	Delete(id uint) error
	ListPermissions() ([]model.Permission, error)
	UpdatePermissions(roleID uint, permIDs []uint) error
}

type roleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) List() ([]model.Role, error) {
	var roles []model.Role
	err := r.db.Preload("Permissions").Find(&roles).Error
	return roles, err
}

func (r *roleRepository) GetByID(id uint) (*model.Role, error) {
	var role model.Role
	err := r.db.Preload("Permissions").First(&role, id).Error
	return &role, err
}

func (r *roleRepository) Create(role *model.Role) error {
	return r.db.Create(role).Error
}

func (r *roleRepository) Update(role *model.Role) error {
	return r.db.Save(role).Error
}

func (r *roleRepository) Delete(id uint) error {
	return r.db.Delete(&model.Role{}, id).Error
}

func (r *roleRepository) ListPermissions() ([]model.Permission, error) {
	var perms []model.Permission
	err := r.db.Find(&perms).Error
	return perms, err
}

func (r *roleRepository) UpdatePermissions(roleID uint, permIDs []uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var role model.Role
		if err := tx.First(&role, roleID).Error; err != nil {
			return err
		}
		var perms []model.Permission
		if len(permIDs) > 0 {
			if err := tx.Find(&perms, permIDs).Error; err != nil {
				return err
			}
		}
		return tx.Model(&role).Association("Permissions").Replace(perms)
	})
}

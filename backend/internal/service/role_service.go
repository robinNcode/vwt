package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type RoleService interface {
	ListRoles() ([]models.Role, error)
	GetRoleByID(id uint) (*models.Role, error)
	CreateRole(r *models.Role) error
	UpdateRole(r *models.Role) error
	DeleteRole(id uint) error
	ListPermissions() ([]models.Permission, error)
	UpdateRolePermissions(roleID uint, permIDs []uint) error
}

type roleService struct {
	repo repository.RoleRepository
}

func NewRoleService(repo repository.RoleRepository) RoleService {
	return &roleService{repo: repo}
}

func (s *roleService) ListRoles() ([]models.Role, error) {
	return s.repo.List()
}

func (s *roleService) GetRoleByID(id uint) (*models.Role, error) {
	return s.repo.GetByID(id)
}

func (s *roleService) CreateRole(r *models.Role) error {
	return s.repo.Create(r)
}

func (s *roleService) UpdateRole(r *models.Role) error {
	return s.repo.Update(r)
}

func (s *roleService) DeleteRole(id uint) error {
	return s.repo.Delete(id)
}

func (s *roleService) ListPermissions() ([]models.Permission, error) {
	return s.repo.ListPermissions()
}

func (s *roleService) UpdateRolePermissions(roleID uint, permIDs []uint) error {
	return s.repo.UpdatePermissions(roleID, permIDs)
}

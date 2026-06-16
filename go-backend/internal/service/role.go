package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type RoleService interface {
	ListRoles() ([]model.Role, error)
	GetRoleByID(id uint) (*model.Role, error)
	CreateRole(r *model.Role) error
	UpdateRole(r *model.Role) error
	DeleteRole(id uint) error
	ListPermissions() ([]model.Permission, error)
	UpdateRolePermissions(roleID uint, permIDs []uint) error
}

type roleService struct {
	repo repository.RoleRepository
}

func NewRoleService(repo repository.RoleRepository) RoleService {
	return &roleService{repo: repo}
}

func (s *roleService) ListRoles() ([]model.Role, error) {
	return s.repo.List()
}

func (s *roleService) GetRoleByID(id uint) (*model.Role, error) {
	return s.repo.GetByID(id)
}

func (s *roleService) CreateRole(r *model.Role) error {
	return s.repo.Create(r)
}

func (s *roleService) UpdateRole(r *model.Role) error {
	return s.repo.Update(r)
}

func (s *roleService) DeleteRole(id uint) error {
	return s.repo.Delete(id)
}

func (s *roleService) ListPermissions() ([]model.Permission, error) {
	return s.repo.ListPermissions()
}

func (s *roleService) UpdateRolePermissions(roleID uint, permIDs []uint) error {
	return s.repo.UpdatePermissions(roleID, permIDs)
}

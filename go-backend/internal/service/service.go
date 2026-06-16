package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type ServiceService interface {
	ListServices(search string) ([]model.Service, error)
	CreateService(s *model.Service) error
	GetServiceByID(id uint) (*model.Service, error)
	UpdateService(s *model.Service) error
	DeleteService(id uint) error
}

type serviceService struct {
	repo repository.ServiceRepository
}

func NewServiceService(repo repository.ServiceRepository) ServiceService {
	return &serviceService{repo: repo}
}

func (s *serviceService) ListServices(search string) ([]model.Service, error) {
	return s.repo.List(search)
}

func (s *serviceService) CreateService(sl *model.Service) error {
	return s.repo.Create(sl)
}

func (s *serviceService) GetServiceByID(id uint) (*model.Service, error) {
	return s.repo.GetByID(id)
}

func (s *serviceService) UpdateService(sl *model.Service) error {
	return s.repo.Update(sl)
}

func (s *serviceService) DeleteService(id uint) error {
	return s.repo.Delete(id)
}

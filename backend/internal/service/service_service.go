package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type ServiceService interface {
	ListServices(search string) ([]models.Service, error)
	CreateService(s *models.Service) error
	GetServiceByID(id uint) (*models.Service, error)
	UpdateService(s *models.Service) error
	DeleteService(id uint) error
}

type serviceService struct {
	repo repository.ServiceRepository
}

func NewServiceService(repo repository.ServiceRepository) ServiceService {
	return &serviceService{repo: repo}
}

func (s *serviceService) ListServices(search string) ([]models.Service, error) {
	return s.repo.List(search)
}

func (s *serviceService) CreateService(sl *models.Service) error {
	return s.repo.Create(sl)
}

func (s *serviceService) GetServiceByID(id uint) (*models.Service, error) {
	return s.repo.GetByID(id)
}

func (s *serviceService) UpdateService(sl *models.Service) error {
	return s.repo.Update(sl)
}

func (s *serviceService) DeleteService(id uint) error {
	return s.repo.Delete(id)
}

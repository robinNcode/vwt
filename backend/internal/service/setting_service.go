package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type SettingService interface {
	GetAllSettings() ([]models.Setting, error)
	GetSettingsByGroup(group string) ([]models.Setting, error)
	GetSetting(group, key string) (*models.Setting, error)
	CreateSetting(s *models.Setting) error
	UpdateSetting(s *models.Setting) error
	BulkUpdateSettings(settings []models.Setting) error
	DeleteSetting(id uint) error
}

type settingService struct {
	repo repository.SettingRepository
}

func NewSettingService(repo repository.SettingRepository) SettingService {
	return &settingService{repo: repo}
}

func (s *settingService) GetAllSettings() ([]models.Setting, error) {
	return s.repo.List()
}

func (s *settingService) GetSettingsByGroup(group string) ([]models.Setting, error) {
	return s.repo.GetByGroup(group)
}

func (s *settingService) GetSetting(group, key string) (*models.Setting, error) {
	return s.repo.GetByKey(group, key)
}

func (s *settingService) CreateSetting(sl *models.Setting) error {
	return s.repo.Create(sl)
}

func (s *settingService) UpdateSetting(sl *models.Setting) error {
	return s.repo.Update(sl)
}

func (s *settingService) BulkUpdateSettings(settings []models.Setting) error {
	return s.repo.BulkUpdate(settings)
}

func (s *settingService) DeleteSetting(id uint) error {
	return s.repo.Delete(id)
}

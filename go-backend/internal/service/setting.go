package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type SettingService interface {
	GetAllSettings() ([]model.Setting, error)
	GetSettingsByGroup(group string) ([]model.Setting, error)
	GetSetting(group, key string) (*model.Setting, error)
	CreateSetting(s *model.Setting) error
	UpdateSetting(s *model.Setting) error
	BulkUpdateSettings(settings []model.Setting) error
	DeleteSetting(id uint) error
}

type settingService struct {
	repo repository.SettingRepository
}

func NewSettingService(repo repository.SettingRepository) SettingService {
	return &settingService{repo: repo}
}

func (s *settingService) GetAllSettings() ([]model.Setting, error) {
	return s.repo.List()
}

func (s *settingService) GetSettingsByGroup(group string) ([]model.Setting, error) {
	return s.repo.GetByGroup(group)
}

func (s *settingService) GetSetting(group, key string) (*model.Setting, error) {
	return s.repo.GetByKey(group, key)
}

func (s *settingService) CreateSetting(sl *model.Setting) error {
	return s.repo.Create(sl)
}

func (s *settingService) UpdateSetting(sl *model.Setting) error {
	return s.repo.Update(sl)
}

func (s *settingService) BulkUpdateSettings(settings []model.Setting) error {
	return s.repo.BulkUpdate(settings)
}

func (s *settingService) DeleteSetting(id uint) error {
	return s.repo.Delete(id)
}

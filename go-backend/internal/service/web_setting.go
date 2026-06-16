package service

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"

	"github.com/robinncode/vwt/internal/model"
)

type WebSettingService interface {
	Get() (*model.WebSettings, error)
	Update(settings *model.WebSettings) error
}

type webSettingService struct {
	filePath string
	mu       sync.RWMutex
}

func NewWebSettingService(storageDir string) WebSettingService {
	filePath := filepath.Join(storageDir, "web_settings.json")
	return &webSettingService{
		filePath: filePath,
	}
}

func (s *webSettingService) Get() (*model.WebSettings, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if _, err := os.Stat(s.filePath); os.IsNotExist(err) {
		// Return default settings if file doesn't exist
		return &model.WebSettings{
			SiteName: "Volt Wave Tech",
		}, nil
	}

	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return nil, err
	}

	var settings model.WebSettings
	if err := json.Unmarshal(data, &settings); err != nil {
		return nil, err
	}

	return &settings, nil
}

func (s *webSettingService) Update(settings *model.WebSettings) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Ensure directory exists
	dir := filepath.Dir(s.filePath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}

	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.filePath, data, 0644)
}

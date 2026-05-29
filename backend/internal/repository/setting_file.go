package repository

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"time"

	"github.com/robinncode/vwt/internal/model"
)

type fileSettingRepository struct {
	filePath string
	mu       sync.RWMutex
}

func NewFileSettingRepository(storageDir string) SettingRepository {
	filePath := filepath.Join(storageDir, "settings.json")
	return &fileSettingRepository{
		filePath: filePath,
	}
}

func (r *fileSettingRepository) load() ([]model.Setting, error) {
	if _, err := os.Stat(r.filePath); os.IsNotExist(err) {
		return []model.Setting{}, nil
	}

	data, err := os.ReadFile(r.filePath)
	if err != nil {
		return nil, err
	}

	var settings []model.Setting
	if err := json.Unmarshal(data, &settings); err != nil {
		return nil, err
	}

	return settings, nil
}

func (r *fileSettingRepository) save(settings []model.Setting) error {
	dir := filepath.Dir(r.filePath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}

	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.filePath, data, 0644)
}

func (r *fileSettingRepository) List() ([]model.Setting, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	settings, err := r.load()
	if err != nil {
		return nil, err
	}

	sort.Slice(settings, func(i, j int) bool {
		if settings[i].Group != settings[j].Group {
			return settings[i].Group < settings[j].Group
		}
		return settings[i].Key < settings[j].Key
	})

	return settings, nil
}

func (r *fileSettingRepository) GetByGroup(group string) ([]model.Setting, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	all, err := r.load()
	if err != nil {
		return nil, err
	}

	var out []model.Setting
	for _, s := range all {
		if s.Group == group {
			out = append(out, s)
		}
	}

	sort.Slice(out, func(i, j int) bool {
		return out[i].Key < out[i].Key
	})

	return out, nil
}

func (r *fileSettingRepository) GetByKey(group, key string) (*model.Setting, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	all, err := r.load()
	if err != nil {
		return nil, err
	}

	for _, s := range all {
		if s.Group == group && s.Key == key {
			return &s, nil
		}
	}

	return nil, nil
}

func (r *fileSettingRepository) Create(s *model.Setting) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	all, err := r.load()
	if err != nil {
		return err
	}

	maxID := uint(0)
	for _, item := range all {
		if item.ID > maxID {
			maxID = item.ID
		}
	}
	s.ID = maxID + 1
	s.UpdatedAt = time.Now()

	all = append(all, *s)
	return r.save(all)
}

func (r *fileSettingRepository) Update(s *model.Setting) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	all, err := r.load()
	if err != nil {
		return err
	}

	found := false
	for i, item := range all {
		if item.ID == s.ID {
			s.UpdatedAt = time.Now()
			all[i] = *s
			found = true
			break
		}
	}

	if !found {
		// Fallback to update by key/group if ID not provided correctly
		for i, item := range all {
			if item.Group == s.Group && item.Key == s.Key {
				s.ID = item.ID
				s.UpdatedAt = time.Now()
				all[i] = *s
				found = true
				break
			}
		}
	}

	return r.save(all)
}

func (r *fileSettingRepository) BulkUpdate(settings []model.Setting) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	all, err := r.load()
	if err != nil {
		return err
	}

	for _, s := range settings {
		found := false
		for i, item := range all {
			if (s.ID != 0 && item.ID == s.ID) || (item.Group == s.Group && item.Key == s.Key) {
				s.ID = item.ID
				s.UpdatedAt = time.Now()
				all[i] = s
				found = true
				break
			}
		}
		if !found {
			// If not found, we could create it, but usually update means it should exist.
			// Let's create it to be safe for bulk operations.
			maxID := uint(0)
			for _, item := range all {
				if item.ID > maxID {
					maxID = item.ID
				}
			}
			s.ID = maxID + 1
			s.UpdatedAt = time.Now()
			all = append(all, s)
		}
	}

	return r.save(all)
}

func (r *fileSettingRepository) Delete(id uint) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	all, err := r.load()
	if err != nil {
		return err
	}

	var next []model.Setting
	for _, s := range all {
		if s.ID != id {
			next = append(next, s)
		}
	}

	return r.save(next)
}

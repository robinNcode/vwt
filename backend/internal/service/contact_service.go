package service

import (
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type ContactService interface {
	ListMessages(search string) ([]models.ContactMessage, error)
	CreateMessage(m *models.ContactMessage) error
	MarkAsRead(id uint) error
}

type contactService struct {
	repo repository.ContactRepository
}

func NewContactService(repo repository.ContactRepository) ContactService {
	return &contactService{repo: repo}
}

func (s *contactService) ListMessages(search string) ([]models.ContactMessage, error) {
	return s.repo.List(search)
}

func (s *contactService) CreateMessage(m *models.ContactMessage) error {
	return s.repo.Create(m)
}

func (s *contactService) MarkAsRead(id uint) error {
	return s.repo.MarkRead(id)
}

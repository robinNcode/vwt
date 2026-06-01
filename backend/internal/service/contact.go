package service

import (
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/repository"
)

type ContactService interface {
	ListMessages(search string) ([]model.ContactMessage, error)
	CreateMessage(m *model.ContactMessage) error
	MarkAsRead(id uint) error
	GetUnreadCount() (int64, error)
}

type contactService struct {
	repo repository.ContactRepository
}

func NewContactService(repo repository.ContactRepository) ContactService {
	return &contactService{repo: repo}
}

func (s *contactService) ListMessages(search string) ([]model.ContactMessage, error) {
	return s.repo.List(search)
}

func (s *contactService) CreateMessage(m *model.ContactMessage) error {
	return s.repo.Create(m)
}

func (s *contactService) MarkAsRead(id uint) error {
	return s.repo.MarkRead(id)
}

func (s *contactService) GetUnreadCount() (int64, error) {
	return s.repo.CountUnread()
}

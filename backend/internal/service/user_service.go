package service

import (
	"errors"

	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	ListUsers() ([]models.User, error)
	GetUserByID(id uint) (*models.User, error)
	CreateUser(u *models.User, password string) error
	UpdateUser(u *models.User, password string) error
	DeleteUser(id uint) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) ListUsers() ([]models.User, error) {
	return s.repo.List()
}

func (s *userService) GetUserByID(id uint) (*models.User, error) {
	return s.repo.GetByID(id)
}

func (s *userService) CreateUser(u *models.User, password string) error {
	if password == "" {
		return errors.New("password is required")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hash)
	return s.repo.Create(u)
}

func (s *userService) UpdateUser(u *models.User, password string) error {
	if password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		u.Password = string(hash)
	} else {
		// Keep existing password
		existing, err := s.repo.GetByID(u.ID)
		if err != nil {
			return err
		}
		u.Password = existing.Password
	}
	return s.repo.Update(u)
}

func (s *userService) DeleteUser(id uint) error {
	return s.repo.Delete(id)
}

package repository

import (
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	List() ([]models.User, error)
	GetByID(id uint) (*models.User, error)
	GetByEmail(email string) (*models.User, error)
	Create(u *models.User) error
	Update(u *models.User) error
	Delete(id uint) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) List() ([]models.User, error) {
	var users []models.User
	err := r.db.Preload("Role").Find(&users).Error
	return users, err
}

func (r *userRepository) GetByID(id uint) (*models.User, error) {
	var u models.User
	err := r.db.Preload("Role.Permissions").First(&u, id).Error
	return &u, err
}

func (r *userRepository) GetByEmail(email string) (*models.User, error) {
	var u models.User
	err := r.db.Where("email = ?", email).First(&u).Error
	return &u, err
}

func (r *userRepository) Create(u *models.User) error {
	return r.db.Create(u).Error
}

func (r *userRepository) Update(u *models.User) error {
	return r.db.Save(u).Error
}

func (r *userRepository) Delete(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}

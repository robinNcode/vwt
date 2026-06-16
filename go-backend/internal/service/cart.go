package service

import (
	"errors"

	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type CartService interface {
	GetCart(userID uint) (*model.Cart, error)
	AddToCart(userID uint, productID *uint, serviceID *uint, quantity int) (*model.Cart, error)
	UpdateItemQuantity(userID uint, itemID uint, quantity int) (*model.Cart, error)
	RemoveItem(userID uint, itemID uint) (*model.Cart, error)
	ClearCart(userID uint) error
}

type cartService struct {
	db *gorm.DB
}

func NewCartService(db *gorm.DB) CartService {
	return &cartService{db: db}
}

func (s *cartService) GetCart(userID uint) (*model.Cart, error) {
	var cart model.Cart
	err := s.db.Preload("Items").Preload("Items.Product").Preload("Items.Service").Where("user_id = ?", userID).FirstOrCreate(&cart, model.Cart{UserID: &userID}).Error
	return &cart, err
}

func (s *cartService) AddToCart(userID uint, productID *uint, serviceID *uint, quantity int) (*model.Cart, error) {
	cart, err := s.GetCart(userID)
	if err != nil {
		return nil, err
	}

	if productID == nil && serviceID == nil {
		return nil, errors.New("either product_id or service_id must be provided")
	}

	// Check if item already in cart
	var existingItem model.CartItem
	query := s.db.Where("cart_id = ?", cart.ID)
	if productID != nil {
		// Validate product exists
		var product model.Product
		if err := s.db.First(&product, *productID).Error; err != nil {
			return nil, errors.New("product not found")
		}
		query = query.Where("product_id = ?", *productID)
	} else {
		// Validate service exists
		var service model.Service
		if err := s.db.First(&service, *serviceID).Error; err != nil {
			return nil, errors.New("service not found")
		}
		query = query.Where("service_id = ?", *serviceID)
	}

	err = query.First(&existingItem).Error

	if err == nil {
		// Update quantity
		existingItem.Quantity += quantity
		s.db.Save(&existingItem)
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		// Add new item
		newItem := model.CartItem{
			CartID:    cart.ID,
			ProductID: productID,
			ServiceID: serviceID,
			Quantity:  quantity,
		}
		s.db.Create(&newItem)
	} else {
		return nil, err
	}

	return s.GetCart(userID)
}

func (s *cartService) UpdateItemQuantity(userID uint, itemID uint, quantity int) (*model.Cart, error) {
	cart, err := s.GetCart(userID)
	if err != nil {
		return nil, err
	}

	var item model.CartItem
	if err := s.db.Where("id = ? AND cart_id = ?", itemID, cart.ID).First(&item).Error; err != nil {
		return nil, errors.New("cart item not found")
	}

	if quantity <= 0 {
		s.db.Delete(&item)
	} else {
		item.Quantity = quantity
		s.db.Save(&item)
	}

	return s.GetCart(userID)
}

func (s *cartService) RemoveItem(userID uint, itemID uint) (*model.Cart, error) {
	cart, err := s.GetCart(userID)
	if err != nil {
		return nil, err
	}

	s.db.Where("id = ? AND cart_id = ?", itemID, cart.ID).Delete(&model.CartItem{})

	return s.GetCart(userID)
}

func (s *cartService) ClearCart(userID uint) error {
	cart, err := s.GetCart(userID)
	if err != nil {
		return err
	}

	return s.db.Where("cart_id = ?", cart.ID).Delete(&model.CartItem{}).Error
}

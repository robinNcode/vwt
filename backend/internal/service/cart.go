package service

import (
	"errors"

	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type CartService interface {
	GetCart(userID uint) (*model.Cart, error)
	AddToCart(userID uint, productID uint, quantity int) (*model.Cart, error)
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
	err := s.db.Preload("Items").Preload("Items.Product").Where("user_id = ?", userID).FirstOrCreate(&cart, model.Cart{UserID: &userID}).Error
	return &cart, err
}

func (s *cartService) AddToCart(userID uint, productID uint, quantity int) (*model.Cart, error) {
	cart, err := s.GetCart(userID)
	if err != nil {
		return nil, err
	}

	// Validate product exists and has stock
	var product model.Product
	if err := s.db.First(&product, productID).Error; err != nil {
		return nil, errors.New("product not found")
	}

	// Check if item already in cart
	var existingItem model.CartItem
	err = s.db.Where("cart_id = ? AND product_id = ?", cart.ID, productID).First(&existingItem).Error

	if err == nil {
		// Update quantity
		existingItem.Quantity += quantity
		s.db.Save(&existingItem)
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		// Add new item
		newItem := model.CartItem{
			CartID:    cart.ID,
			ProductID: productID,
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

package service

import (
	"fmt"
	"time"

	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/repository"
)

type OrderService interface {
	ListOrders(status string) ([]models.Order, error)
	GetOrderByID(id uint) (*models.Order, error)
	TrackOrder(number string) (*models.Order, error)
	PlaceOrder(req *models.Order) error
	UpdateOrderStatus(id uint, newStatus string) error
}

type orderService struct {
	repo repository.OrderRepository
}

func NewOrderService(repo repository.OrderRepository) OrderService {
	return &orderService{repo: repo}
}

func (s *orderService) ListOrders(status string) ([]models.Order, error) {
	return s.repo.List(status)
}

func (s *orderService) GetOrderByID(id uint) (*models.Order, error) {
	return s.repo.GetByID(id)
}

func (s *orderService) TrackOrder(number string) (*models.Order, error) {
	return s.repo.GetByNumber(number)
}

func (s *orderService) PlaceOrder(o *models.Order) error {
	if o.OrderNumber == "" {
		o.OrderNumber = fmt.Sprintf("ORD-%s", time.Now().Format("20060102-150405"))
	}
	if o.Status == "" {
		o.Status = "pending"
	}
	if o.PaymentStatus == "" {
		o.PaymentStatus = "unpaid"
	}
	return s.repo.Create(o)
}

func (s *orderService) UpdateOrderStatus(id uint, newStatus string) error {
	o, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	return s.repo.UpdateStatus(id, o.Status, newStatus)
}

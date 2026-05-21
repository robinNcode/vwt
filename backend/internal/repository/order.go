package repository

import (
	"github.com/robinncode/vwt/internal/model"
	"gorm.io/gorm"
)

type OrderRepository interface {
	List(status string) ([]model.Order, error)
	GetByID(id uint) (*model.Order, error)
	GetByNumber(number string) (*model.Order, error)
	Create(o *model.Order) error
	UpdateStatus(id uint, oldStatus, newStatus string) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) List(status string) ([]model.Order, error) {
	var out []model.Order
	q := r.db.Where("deleted_at IS NULL")
	if status != "" {
		q = q.Where("status = ?", status)
	}
	err := q.Order("id DESC").Find(&out).Error
	return out, err
}

func (r *orderRepository) GetByID(id uint) (*model.Order, error) {
	var o model.Order
	err := r.db.Preload("Items").Where("id = ? AND deleted_at IS NULL", id).First(&o).Error
	return &o, err
}

func (r *orderRepository) GetByNumber(number string) (*model.Order, error) {
	var o model.Order
	err := r.db.Preload("Items").Where("order_number = ? AND deleted_at IS NULL", number).First(&o).Error
	return &o, err
}

func (r *orderRepository) Create(o *model.Order) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(o).Error; err != nil {
			return err
		}
		// Create Status History
		hist := model.OrderStatusHistory{
			OrderID:   o.ID,
			NewStatus: o.Status,
		}
		return tx.Create(&hist).Error
	})
}

func (r *orderRepository) UpdateStatus(id uint, oldStatus, newStatus string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&model.Order{}).Where("id = ?", id).Update("status", newStatus).Error; err != nil {
			return err
		}
		hist := model.OrderStatusHistory{
			OrderID:   id,
			OldStatus: &oldStatus,
			NewStatus: newStatus,
		}
		return tx.Create(&hist).Error
	})
}

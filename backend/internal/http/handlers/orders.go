package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/http/response"
	"github.com/robinncode/vwt/migrations/models"
	"gorm.io/gorm"
)

type OrdersHandler struct {
	db *gorm.DB
}

func NewOrdersHandler(db *gorm.DB) *OrdersHandler { return &OrdersHandler{db: db} }

func (h *OrdersHandler) List(c *gin.Context) {
	var out []models.Order
	q := h.db.Where("deleted_at IS NULL")
	if st := strings.TrimSpace(c.Query("status")); st != "" {
		q = q.Where("status = ?", st)
	}
	if err := q.Order("id DESC").Find(&out).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch orders", nil)
		return
	}
	response.OK(c, "Orders fetched successfully", out)
}

func (h *OrdersHandler) GetByID(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	var o models.Order
	if err := h.db.Preload("Items").Where("id = ? AND deleted_at IS NULL", uint(id64)).First(&o).Error; err != nil {
		response.Fail(c, http.StatusNotFound, "Order not found", nil)
		return
	}
	response.OK(c, "Order fetched successfully", o)
}

func (h *OrdersHandler) TrackByNumber(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	var o models.Order
	if err := h.db.Preload("Items").Where("order_number = ? AND deleted_at IS NULL", id).First(&o).Error; err != nil {
		response.Fail(c, http.StatusNotFound, "Order not found", nil)
		return
	}
	response.OK(c, "Order fetched successfully", o)
}

type createOrderReq struct {
	CustomerName  string `json:"customer_name"`
	CustomerEmail string `json:"customer_email"`
	CustomerPhone string `json:"customer_phone"`

	ShipAddressLine1 string  `json:"ship_address_line1"`
	ShipAddressLine2 *string `json:"ship_address_line2"`
	ShipCity         string  `json:"ship_city"`
	ShipDistrict     *string `json:"ship_district"`
	ShipPostalCode   *string `json:"ship_postal_code"`
	ShipCountry      string  `json:"ship_country"`

	CurrencyCode string  `json:"currency_code"`
	Subtotal     float64 `json:"subtotal"`
	GrandTotal   float64 `json:"grand_total"`

	Notes *string `json:"notes"`
	Items []struct {
		VariantID     *uint   `json:"variant_id"`
		ProductNameBN string  `json:"product_name_bn"`
		ProductNameEN string  `json:"product_name_en"`
		SKU           string  `json:"sku"`
		UnitPrice     float64 `json:"unit_price"`
		Quantity      int     `json:"quantity"`
		LineTotal     float64 `json:"line_total"`
	} `json:"items"`
}

func (h *OrdersHandler) Create(c *gin.Context) {
	var req createOrderReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if req.CustomerName == "" || req.CustomerEmail == "" || req.CustomerPhone == "" || req.ShipAddressLine1 == "" || req.ShipCity == "" {
		response.Fail(c, http.StatusBadRequest, "Missing customer/shipping fields", nil)
		return
	}
	if len(req.Items) == 0 {
		response.Fail(c, http.StatusBadRequest, "Order items required", nil)
		return
	}
	if req.CurrencyCode == "" {
		req.CurrencyCode = "BDT"
	}
	if req.ShipCountry == "" {
		req.ShipCountry = "BD"
	}

	orderNumber := "ORD-" + time.Now().Format("20060102-150405")

	txErr := h.db.Transaction(func(tx *gorm.DB) error {
		o := models.Order{
			OrderNumber:      orderNumber,
			CustomerName:     req.CustomerName,
			CustomerEmail:    req.CustomerEmail,
			CustomerPhone:    req.CustomerPhone,
			ShipAddressLine1: req.ShipAddressLine1,
			ShipAddressLine2: req.ShipAddressLine2,
			ShipCity:         req.ShipCity,
			ShipDistrict:     req.ShipDistrict,
			ShipPostalCode:   req.ShipPostalCode,
			ShipCountry:      req.ShipCountry,
			CurrencyCode:     req.CurrencyCode,
			Subtotal:         req.Subtotal,
			GrandTotal:       req.GrandTotal,
			Status:           "pending",
			PaymentStatus:    "unpaid",
			Notes:            req.Notes,
		}
		if err := tx.Create(&o).Error; err != nil {
			return err
		}

		items := make([]models.OrderItem, 0, len(req.Items))
		for _, it := range req.Items {
			if it.SKU == "" || it.ProductNameEN == "" || it.ProductNameBN == "" || it.Quantity <= 0 {
				return gin.Error{Err: errBad("Invalid order item"), Type: gin.ErrorTypeBind}
			}
			quantity := it.Quantity
			items = append(items, models.OrderItem{
				OrderID:       o.ID,
				VariantID:     it.VariantID,
				ProductNameBN: it.ProductNameBN,
				ProductNameEN: it.ProductNameEN,
				SKU:           it.SKU,
				UnitPrice:     it.UnitPrice,
				Quantity:      quantity,
				LineTotal:     it.LineTotal,
			})
		}
		if err := tx.Create(&items).Error; err != nil {
			return err
		}

		hist := models.OrderStatusHistory{
			OrderID:   o.ID,
			NewStatus: "pending",
		}
		if err := tx.Create(&hist).Error; err != nil {
			return err
		}

		c.Set("created.order_id", o.ID)
		return nil
	})
	if txErr != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create order", txErr.Error())
		return
	}

	var created models.Order
	if orderID, ok := c.Get("created.order_id"); ok {
		h.db.Preload("Items").First(&created, orderID)
	}
	response.Created(c, "Order created successfully", created)
}

type updateOrderReq struct {
	Status string `json:"status"`
}

func (h *OrdersHandler) UpdateStatus(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	var req updateOrderReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Status = strings.TrimSpace(strings.ToLower(req.Status))
	if req.Status == "" {
		response.Fail(c, http.StatusBadRequest, "status is required", nil)
		return
	}

	var o models.Order
	if err := h.db.Where("id = ? AND deleted_at IS NULL", uint(id64)).First(&o).Error; err != nil {
		response.Fail(c, http.StatusNotFound, "Order not found", nil)
		return
	}

	old := o.Status
	o.Status = req.Status
	if err := h.db.Save(&o).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update order", nil)
		return
	}

	hist := models.OrderStatusHistory{
		OrderID:   o.ID,
		OldStatus: &old,
		NewStatus: req.Status,
	}
	_ = h.db.Create(&hist).Error

	response.OK(c, "Order updated successfully", o)
}

func errBad(msg string) error { return &badReqErr{msg: msg} }

type badReqErr struct{ msg string }

func (e *badReqErr) Error() string { return e.msg }

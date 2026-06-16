package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/service"
)

type OrdersHandler struct {
	svc service.OrderService
}

func NewOrdersHandler(svc service.OrderService) *OrdersHandler {
	return &OrdersHandler{svc: svc}
}

func (h *OrdersHandler) List(c *gin.Context) {
	st := strings.TrimSpace(c.Query("status"))
	out, err := h.svc.ListOrders(st)
	if err != nil {
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
	o, err := h.svc.GetOrderByID(uint(id64))
	if err != nil {
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
	o, err := h.svc.TrackOrder(id)
	if err != nil {
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

	o := model.Order{
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
		Notes:            req.Notes,
	}

	for _, it := range req.Items {
		o.Items = append(o.Items, model.OrderItem{
			VariantID:     it.VariantID,
			ProductNameBN: it.ProductNameBN,
			ProductNameEN: it.ProductNameEN,
			SKU:           it.SKU,
			UnitPrice:     it.UnitPrice,
			Quantity:      it.Quantity,
			LineTotal:     it.LineTotal,
		})
	}

	if err := h.svc.PlaceOrder(&o); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create order", err.Error())
		return
	}

	response.Created(c, "Order created successfully", o)
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
	st := strings.TrimSpace(strings.ToLower(req.Status))
	if st == "" {
		response.Fail(c, http.StatusBadRequest, "status is required", nil)
		return
	}

	if err := h.svc.UpdateOrderStatus(uint(id64), st); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update order", nil)
		return
	}

	response.OK(c, "Order updated successfully", gin.H{"id": uint(id64), "status": st})
}

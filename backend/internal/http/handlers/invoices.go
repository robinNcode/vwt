package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/http/response"
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type InvoicesHandler struct {
	db *gorm.DB
}

func NewInvoicesHandler(db *gorm.DB) *InvoicesHandler { return &InvoicesHandler{db: db} }

func (h *InvoicesHandler) List(c *gin.Context) {
	var out []models.Invoice
	if err := h.db.Where("deleted_at IS NULL").Order("id DESC").Find(&out).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch invoices", nil)
		return
	}
	response.OK(c, "Invoices fetched successfully", out)
}

type invoiceUpsertReq struct {
	OrderID       uint   `json:"order_id"`
	InvoiceNumber string `json:"invoice_number"`
}

func (h *InvoicesHandler) Create(c *gin.Context) {
	var req invoiceUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.InvoiceNumber = strings.TrimSpace(req.InvoiceNumber)
	if req.OrderID == 0 || req.InvoiceNumber == "" {
		response.Fail(c, http.StatusBadRequest, "order_id and invoice_number are required", nil)
		return
	}
	inv := models.Invoice{
		OrderID:       req.OrderID,
		InvoiceNumber: req.InvoiceNumber,
	}
	if err := h.db.Create(&inv).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create invoice", nil)
		return
	}
	response.Created(c, "Invoice created successfully", inv)
}

func (h *InvoicesHandler) Update(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	var req invoiceUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.InvoiceNumber = strings.TrimSpace(req.InvoiceNumber)
	if req.OrderID == 0 || req.InvoiceNumber == "" {
		response.Fail(c, http.StatusBadRequest, "order_id and invoice_number are required", nil)
		return
	}

	var inv models.Invoice
	if err := h.db.Where("id = ? AND deleted_at IS NULL", uint(id64)).First(&inv).Error; err != nil {
		response.Fail(c, http.StatusNotFound, "Invoice not found", nil)
		return
	}

	inv.OrderID = req.OrderID
	inv.InvoiceNumber = req.InvoiceNumber
	if err := h.db.Save(&inv).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update invoice", nil)
		return
	}
	response.OK(c, "Invoice updated successfully", inv)
}

func (h *InvoicesHandler) Delete(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	if err := h.db.Where("id = ? AND deleted_at IS NULL", uint(id64)).Delete(&models.Invoice{}).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to delete invoice", nil)
		return
	}
	response.OK(c, "Invoice deleted successfully", gin.H{"id": uint(id64)})
}

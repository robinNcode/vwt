package handler

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/service"
)

type InvoicesHandler struct {
	svc service.InvoiceService
}

func NewInvoicesHandler(svc service.InvoiceService) *InvoicesHandler {
	return &InvoicesHandler{svc: svc}
}

func (h *InvoicesHandler) List(c *gin.Context) {
	out, err := h.svc.ListInvoices()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch invoices", nil)
		return
	}
	response.OK(c, "Invoices fetched successfully", out)
}

func (h *InvoicesHandler) NextNumber(c *gin.Context) {
	num, err := h.svc.GetNextInvoiceNumber()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to generate invoice number", nil)
		return
	}
	response.OK(c, "Success", gin.H{"invoice_number": num})
}

type invoiceUpsertReq struct {
	OrderID        uint    `json:"order_id"`
	InvoiceNumber  string  `json:"invoice_number"`
	DueDate        *string `json:"due_date"`
	Notes          *string `json:"notes"`
	TemplateConfig *string `json:"template_config"`
}

func (h *InvoicesHandler) Create(c *gin.Context) {
	var req invoiceUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.InvoiceNumber = strings.TrimSpace(req.InvoiceNumber)
	if req.InvoiceNumber == "" {
		response.Fail(c, http.StatusBadRequest, "invoice_number is required", nil)
		return
	}

	var orderIdPtr *uint
	if req.OrderID > 0 {
		oID := req.OrderID
		orderIdPtr = &oID
	}

	inv := model.Invoice{
		OrderID:        orderIdPtr,
		InvoiceNumber:  req.InvoiceNumber,
		Notes:          req.Notes,
		TemplateConfig: req.TemplateConfig,
	}

	if req.DueDate != nil && *req.DueDate != "" {
		t, err := time.Parse("2006-01-02", *req.DueDate)
		if err == nil {
			inv.DueDate = &t
		}
	}

	if err := h.svc.CreateInvoice(&inv); err != nil {
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

	inv, err := h.svc.GetInvoiceByID(uint(id64))
	if err != nil || inv == nil {
		response.Fail(c, http.StatusNotFound, "Invoice not found", nil)
		return
	}

	var orderIdPtr *uint
	if req.OrderID > 0 {
		oID := req.OrderID
		orderIdPtr = &oID
	}

	inv.OrderID = orderIdPtr
	inv.InvoiceNumber = strings.TrimSpace(req.InvoiceNumber)
	inv.Notes = req.Notes
	inv.TemplateConfig = req.TemplateConfig

	if req.DueDate != nil && *req.DueDate != "" {
		t, err := time.Parse("2006-01-02", *req.DueDate)
		if err == nil {
			inv.DueDate = &t
		}
	}

	if err := h.svc.UpdateInvoice(inv); err != nil {
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
	if err := h.svc.DeleteInvoice(uint(id64)); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to delete invoice", nil)
		return
	}
	response.OK(c, "Invoice deleted successfully", gin.H{"id": uint(id64)})
}

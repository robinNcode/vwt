package handler

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/service"
)

type QuotationsHandler struct {
	svc service.QuotationService
}

func NewQuotationsHandler(svc service.QuotationService) *QuotationsHandler {
	return &QuotationsHandler{svc: svc}
}

type quotationCreateReq struct {
	CustomerName    *string `json:"customer_name"`
	CustomerEmail   *string `json:"customer_email"`
	CustomerPhone   *string `json:"customer_phone"`
	CustomerAddress *string `json:"customer_address"`
	Notes           *string `json:"notes"`
	ExpiresAt       *string `json:"expires_at"`
	Items           []struct {
		VariantID     *uint   `json:"variant_id"`
		ProductNameEN string  `json:"product_name_en"`
		SKU           string  `json:"sku"`
		UnitPrice     float64 `json:"unit_price"`
		Quantity      int     `json:"quantity"`
	} `json:"items"`
}

func (h *QuotationsHandler) Create(c *gin.Context) {
	var req quotationCreateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if len(req.Items) == 0 {
		response.Fail(c, http.StatusBadRequest, "At least one quotation item is required", nil)
		return
	}

	q := models.Quotation{
		CustomerName:    req.CustomerName,
		CustomerEmail:   req.CustomerEmail,
		CustomerPhone:   req.CustomerPhone,
		CustomerAddress: req.CustomerAddress,
		Notes:           req.Notes,
	}

	if req.ExpiresAt != nil && *req.ExpiresAt != "" {
		t, err := time.Parse("2006-01-02", *req.ExpiresAt)
		if err == nil {
			q.ExpiresAt = &t
		}
	}

	for _, it := range req.Items {
		if strings.TrimSpace(it.ProductNameEN) == "" || strings.TrimSpace(it.SKU) == "" || it.Quantity <= 0 {
			response.Fail(c, http.StatusBadRequest, "Invalid quotation item", nil)
			return
		}
		q.Items = append(q.Items, model.QuotationItem{
			VariantID:     it.VariantID,
			ProductNameEN: strings.TrimSpace(it.ProductNameEN),
			SKU:           strings.TrimSpace(it.SKU),
			UnitPrice:     it.UnitPrice,
			Quantity:      it.Quantity,
			LineTotal:     it.UnitPrice * float64(it.Quantity),
		})
	}

	if err := h.svc.RequestQuotation(&q); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create quotation", err.Error())
		return
	}
	response.Created(c, "Quotation created successfully", q)
}

func (h *QuotationsHandler) List(c *gin.Context) {
	out, err := h.svc.ListQuotations()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch quotations", nil)
		return
	}
	response.OK(c, "Quotations fetched successfully", out)
}

func (h *QuotationsHandler) UpdateStatus(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	st := strings.TrimSpace(strings.ToLower(req.Status))
	if st == "" {
		response.Fail(c, http.StatusBadRequest, "status is required", nil)
		return
	}

	if err := h.svc.UpdateQuotationStatus(uint(id64), st); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update quotation", nil)
		return
	}
	response.OK(c, "Quotation updated successfully", gin.H{"id": uint(id64), "status": st})
}

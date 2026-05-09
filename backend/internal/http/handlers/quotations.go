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

type QuotationsHandler struct {
	db *gorm.DB
}

func NewQuotationsHandler(db *gorm.DB) *QuotationsHandler { return &QuotationsHandler{db: db} }

type quotationCreateReq struct {
	CustomerName  *string `json:"customer_name"`
	CustomerEmail *string `json:"customer_email"`
	CustomerPhone *string `json:"customer_phone"`
	Notes         *string `json:"notes"`
	Items         []struct {
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

	var created models.Quotation
	txErr := h.db.Transaction(func(tx *gorm.DB) error {
		q := models.Quotation{
			CustomerName:  req.CustomerName,
			CustomerEmail: req.CustomerEmail,
			CustomerPhone: req.CustomerPhone,
			Notes:         req.Notes,
			Status:        "draft",
		}
		if err := tx.Create(&q).Error; err != nil {
			return err
		}

		items := make([]models.QuotationItem, 0, len(req.Items))
		for _, it := range req.Items {
			if strings.TrimSpace(it.ProductNameEN) == "" || strings.TrimSpace(it.SKU) == "" || it.Quantity <= 0 {
				return errBad("Invalid quotation item")
			}
			items = append(items, models.QuotationItem{
				QuotationID:   q.ID,
				VariantID:     it.VariantID,
				ProductNameEN: strings.TrimSpace(it.ProductNameEN),
				SKU:           strings.TrimSpace(it.SKU),
				UnitPrice:     it.UnitPrice,
				Quantity:      it.Quantity,
				LineTotal:     it.UnitPrice * float64(it.Quantity),
			})
		}
		if err := tx.Create(&items).Error; err != nil {
			return err
		}

		if err := tx.Preload("Items").First(&created, q.ID).Error; err != nil {
			return err
		}
		return nil
	})
	if txErr != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create quotation", txErr.Error())
		return
	}
	response.Created(c, "Quotation created successfully", created)
}

func (h *QuotationsHandler) List(c *gin.Context) {
	var out []models.Quotation
	if err := h.db.Preload("Items").Order("id DESC").Find(&out).Error; err != nil {
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
	req.Status = strings.TrimSpace(strings.ToLower(req.Status))
	if req.Status == "" {
		response.Fail(c, http.StatusBadRequest, "status is required", nil)
		return
	}

	var q models.Quotation
	if err := h.db.First(&q, uint(id64)).Error; err != nil {
		response.Fail(c, http.StatusNotFound, "Quotation not found", nil)
		return
	}
	q.Status = req.Status
	if err := h.db.Save(&q).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update quotation", nil)
		return
	}
	response.OK(c, "Quotation updated successfully", q)
}

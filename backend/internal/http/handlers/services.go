package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/http/response"
	"github.com/robinncode/vwt/migrations/models"
	"gorm.io/gorm"
)

type ServicesHandler struct {
	db *gorm.DB
}

func NewServicesHandler(db *gorm.DB) *ServicesHandler { return &ServicesHandler{db: db} }

func (h *ServicesHandler) List(c *gin.Context) {
	var out []models.Service
	q := h.db.Where("deleted_at IS NULL")
	if s := strings.TrimSpace(c.Query("search")); s != "" {
		like := "%" + s + "%"
		q = q.Where("name_bn LIKE ? OR name_en LIKE ? OR slug LIKE ?", like, like, like)
	}
	if err := q.Order("sort_order ASC, id DESC").Find(&out).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch services", nil)
		return
	}
	response.OK(c, "Services fetched successfully", out)
}

type serviceUpsertReq struct {
	NameBN    string   `json:"name_bn"`
	NameEN    string   `json:"name_en"`
	Slug      string   `json:"slug"`
	Price     *float64 `json:"price"`
	IsActive  bool     `json:"is_active"`
	SortOrder int      `json:"sort_order"`
}

func (h *ServicesHandler) Create(c *gin.Context) {
	var req serviceUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Slug = strings.TrimSpace(req.Slug)
	if req.NameBN == "" || req.NameEN == "" || req.Slug == "" {
		response.Fail(c, http.StatusBadRequest, "name_bn, name_en, slug are required", nil)
		return
	}

	svc := models.Service{
		NameBN:    req.NameBN,
		NameEN:    req.NameEN,
		Slug:      req.Slug,
		Price:     req.Price,
		IsActive:  req.IsActive,
		SortOrder: req.SortOrder,
	}
	if err := h.db.Create(&svc).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create service", nil)
		return
	}
	response.Created(c, "Service created successfully", svc)
}

func (h *ServicesHandler) Update(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}

	var req serviceUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	var svc models.Service
	if err := h.db.Where("id = ? AND deleted_at IS NULL", uint(id64)).First(&svc).Error; err != nil {
		response.Fail(c, http.StatusNotFound, "Service not found", nil)
		return
	}

	req.Slug = strings.TrimSpace(req.Slug)
	if req.NameBN == "" || req.NameEN == "" || req.Slug == "" {
		response.Fail(c, http.StatusBadRequest, "name_bn, name_en, slug are required", nil)
		return
	}

	svc.NameBN = req.NameBN
	svc.NameEN = req.NameEN
	svc.Slug = req.Slug
	svc.Price = req.Price
	svc.IsActive = req.IsActive
	svc.SortOrder = req.SortOrder

	if err := h.db.Save(&svc).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update service", nil)
		return
	}
	response.OK(c, "Service updated successfully", svc)
}

func (h *ServicesHandler) Delete(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}

	if err := h.db.Where("id = ? AND deleted_at IS NULL", uint(id64)).Delete(&models.Service{}).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to delete service", nil)
		return
	}
	response.OK(c, "Service deleted successfully", gin.H{"id": uint(id64)})
}

package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/http/response"
	"github.com/robinncode/vwt/internal/models"
	"github.com/robinncode/vwt/internal/service"
)

type ProductsHandler struct {
	svc service.ProductService
}

func NewProductsHandler(svc service.ProductService) *ProductsHandler {
	return &ProductsHandler{svc: svc}
}

func (h *ProductsHandler) List(c *gin.Context) {
	s := strings.TrimSpace(c.Query("search"))
	out, err := h.svc.ListProducts(s)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch products", nil)
		return
	}
	response.OK(c, "Products fetched successfully", out)
}

type productUpsertReq struct {
	CategoryID  uint   `json:"category_id"`
	ProductType string `json:"product_type"`
	NameBN      string `json:"name_bn"`
	NameEN      string `json:"name_en"`
	Slug        string `json:"slug"`
	IsActive    bool   `json:"is_active"`
	IsFeatured  bool   `json:"is_featured"`
}

func (h *ProductsHandler) Create(c *gin.Context) {
	var req productUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Slug = strings.TrimSpace(req.Slug)
	if req.CategoryID == 0 || req.NameBN == "" || req.NameEN == "" || req.Slug == "" {
		response.Fail(c, http.StatusBadRequest, "category_id, name_bn, name_en, slug are required", nil)
		return
	}

	p := models.Product{
		CategoryID:  req.CategoryID,
		ProductType: req.ProductType,
		NameBN:      req.NameBN,
		NameEN:      req.NameEN,
		Slug:        req.Slug,
		IsActive:    req.IsActive,
		IsFeatured:  req.IsFeatured,
	}
	if err := h.svc.CreateProduct(&p); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create product", nil)
		return
	}
	response.Created(c, "Product created successfully", p)
}

func (h *ProductsHandler) Update(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}

	var req productUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	var p *models.Product
	p, err := h.svc.GetProductByID(uint(id64))
	if err != nil || p == nil {
		response.Fail(c, http.StatusNotFound, "Product not found", nil)
		return
	}

	req.Slug = strings.TrimSpace(req.Slug)
	if req.CategoryID == 0 || req.NameBN == "" || req.NameEN == "" || req.Slug == "" {
		response.Fail(c, http.StatusBadRequest, "category_id, name_bn, name_en, slug are required", nil)
		return
	}

	p.CategoryID = req.CategoryID
	p.ProductType = req.ProductType
	p.NameBN = req.NameBN
	p.NameEN = req.NameEN
	p.Slug = req.Slug
	p.IsActive = req.IsActive
	p.IsFeatured = req.IsFeatured

	if err := h.svc.UpdateProduct(p); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update product", nil)
		return
	}
	response.OK(c, "Product updated successfully", p)
}

func (h *ProductsHandler) Delete(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}

	if err := h.svc.DeleteProduct(uint(id64)); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to delete product", nil)
		return
	}
	response.OK(c, "Product deleted successfully", gin.H{"id": uint(id64)})
}

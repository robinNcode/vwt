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

func (h *ProductsHandler) ListPublic(c *gin.Context) {
	s := strings.TrimSpace(c.Query("search"))
	out, err := h.svc.ListPublicProducts(s)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch public products", nil)
		return
	}
	response.OK(c, "Products fetched successfully", out)
}

type productUpsertReq struct {
	CategoryID    uint    `form:"category_id"`
	ProductType   string  `form:"product_type"`
	NameBN        string  `form:"name_bn"`
	NameEN        string  `form:"name_en"`
	Slug          string  `form:"slug"`
	SKU           string  `form:"sku"`
	Price         float64 `form:"price"`
	Stock         int     `form:"stock"`
	ShortDescBN   *string `form:"short_desc_bn"`
	ShortDescEN   *string `form:"short_desc_en"`
	DescriptionBN *string `form:"description_bn"`
	DescriptionEN *string `form:"description_en"`
	Brand         *string `form:"brand"`
	ModelNumber   *string `form:"model_number"`
	Manufacturer  *string `form:"manufacturer"`
	IsActive      bool    `form:"is_active"`
	IsFeatured    bool    `form:"is_featured"`
}

func (h *ProductsHandler) Create(c *gin.Context) {
	var req productUpsertReq
	if err := c.ShouldBind(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Slug = strings.TrimSpace(req.Slug)
	if req.CategoryID == 0 || req.NameBN == "" || req.NameEN == "" || req.Slug == "" {
		response.Fail(c, http.StatusBadRequest, "category_id, name_bn, name_en, slug are required", nil)
		return
	}

	p := model.Product{
		CategoryID:    req.CategoryID,
		ProductType:   req.ProductType,
		NameBN:        req.NameBN,
		NameEN:        req.NameEN,
		Slug:          req.Slug,
		SKU:           req.SKU,
		Price:         req.Price,
		Stock:         req.Stock,
		ShortDescBN:   req.ShortDescBN,
		ShortDescEN:   req.ShortDescEN,
		DescriptionBN: req.DescriptionBN,
		DescriptionEN: req.DescriptionEN,
		Brand:         req.Brand,
		ModelNumber:   req.ModelNumber,
		Manufacturer:  req.Manufacturer,
		IsActive:      req.IsActive,
		IsFeatured:    req.IsFeatured,
	}

	// Handle Image Upload
	file, _ := c.FormFile("image")
	if file != nil {
		filename := "product_" + strconv.FormatInt(time.Now().Unix(), 10) + "_" + file.Filename
		filepath := "public/uploads/products/" + filename
		if err := c.SaveUploadedFile(file, filepath); err == nil {
			p.Images = []model.ProductImage{{URL: "/" + filepath, IsPrimary: true}}
		}
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
	if err := c.ShouldBind(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	var p *model.Product
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

	// Update fields
	p.CategoryID = req.CategoryID
	p.ProductType = req.ProductType
	p.NameBN = req.NameBN
	p.NameEN = req.NameEN
	p.Slug = req.Slug
	p.SKU = req.SKU
	p.Price = req.Price
	p.Stock = req.Stock
	p.ShortDescBN = req.ShortDescBN
	p.ShortDescEN = req.ShortDescEN
	p.DescriptionBN = req.DescriptionBN
	p.DescriptionEN = req.DescriptionEN
	p.Brand = req.Brand
	p.ModelNumber = req.ModelNumber
	p.Manufacturer = req.Manufacturer
	p.IsActive = req.IsActive
	p.IsFeatured = req.IsFeatured

	// Handle Image Upload Replace
	file, _ := c.FormFile("image")
	if file != nil {
		filename := "product_" + strconv.FormatInt(time.Now().Unix(), 10) + "_" + file.Filename
		filepath := "public/uploads/products/" + filename
		if err := c.SaveUploadedFile(file, filepath); err == nil {
			if len(p.Images) > 0 {
				p.Images[0].URL = "/" + filepath
			} else {
				p.Images = []model.ProductImage{{URL: "/" + filepath, IsPrimary: true, ProductID: p.ID}}
			}
		}
	}

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

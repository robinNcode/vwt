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

type ServicesHandler struct {
	svc service.ServiceService
}

func NewServicesHandler(svc service.ServiceService) *ServicesHandler {
	return &ServicesHandler{svc: svc}
}

func (h *ServicesHandler) List(c *gin.Context) {
	s := strings.TrimSpace(c.Query("search"))
	out, err := h.svc.ListServices(s)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch services", nil)
		return
	}
	response.OK(c, "Services fetched successfully", out)
}

type serviceUpsertReq struct {
	NameBN        string   `form:"name_bn"`
	NameEN        string   `form:"name_en"`
	Slug          string   `form:"slug"`
	DescriptionBN *string  `form:"description_bn"`
	DescriptionEN *string  `form:"description_en"`
	Price         *float64 `form:"price"`
	IsActive      bool     `form:"is_active"`
	SortOrder     int      `form:"sort_order"`
}

func (h *ServicesHandler) Create(c *gin.Context) {
	var req serviceUpsertReq
	if err := c.ShouldBind(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Slug = strings.TrimSpace(req.Slug)
	if req.NameBN == "" || req.NameEN == "" || req.Slug == "" {
		response.Fail(c, http.StatusBadRequest, "name_bn, name_en, slug are required", nil)
		return
	}

	s := model.Service{
		NameBN:        req.NameBN,
		NameEN:        req.NameEN,
		Slug:          req.Slug,
		DescriptionBN: req.DescriptionBN,
		DescriptionEN: req.DescriptionEN,
		Price:         req.Price,
		IsActive:      req.IsActive,
		SortOrder:     req.SortOrder,
	}

	// Handle Image Upload
	file, _ := c.FormFile("image")
	if file != nil {
		filename := "service_" + strconv.FormatInt(time.Now().Unix(), 10) + "_" + file.Filename
		filepath := "public/uploads/services/" + filename
		if err := c.SaveUploadedFile(file, filepath); err == nil {
			url := "/public/uploads/services/" + filename
			s.ImageURL = &url
		}
	}

	if err := h.svc.CreateService(&s); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create service", nil)
		return
	}
	response.Created(c, "Service created successfully", s)
}

func (h *ServicesHandler) Update(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}

	var req serviceUpsertReq
	if err := c.ShouldBind(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	s, err := h.svc.GetServiceByID(uint(id64))
	if err != nil || s == nil {
		response.Fail(c, http.StatusNotFound, "Service not found", nil)
		return
	}

	req.Slug = strings.TrimSpace(req.Slug)
	if req.NameBN == "" || req.NameEN == "" || req.Slug == "" {
		response.Fail(c, http.StatusBadRequest, "name_bn, name_en, slug are required", nil)
		return
	}

	s.NameBN = req.NameBN
	s.NameEN = req.NameEN
	s.Slug = req.Slug
	s.DescriptionBN = req.DescriptionBN
	s.DescriptionEN = req.DescriptionEN
	s.Price = req.Price
	s.IsActive = req.IsActive
	s.SortOrder = req.SortOrder

	// Handle Image Upload Replace
	file, _ := c.FormFile("image")
	if file != nil {
		filename := "service_" + strconv.FormatInt(time.Now().Unix(), 10) + "_" + file.Filename
		filepath := "public/uploads/services/" + filename
		if err := c.SaveUploadedFile(file, filepath); err == nil {
			url := "/public/uploads/services/" + filename
			s.ImageURL = &url
		}
	}

	if err := h.svc.UpdateService(s); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update service", nil)
		return
	}
	response.OK(c, "Service updated successfully", s)
}

func (h *ServicesHandler) Delete(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	if err := h.svc.DeleteService(uint(id64)); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to delete service", nil)
		return
	}
	response.OK(c, "Service deleted successfully", gin.H{"id": uint(id64)})
}

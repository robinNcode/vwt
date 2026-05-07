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

type SettingsHandler struct {
	db *gorm.DB
}

func NewSettingsHandler(db *gorm.DB) *SettingsHandler { return &SettingsHandler{db: db} }

func (h *SettingsHandler) List(c *gin.Context) {
	var out []models.Setting
	if err := h.db.Order("`group` ASC, `key` ASC").Find(&out).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch settings", nil)
		return
	}
	response.OK(c, "Settings fetched successfully", out)
}

type settingUpsertReq struct {
	Group     string  `json:"group"`
	Key       string  `json:"key"`
	Value     *string `json:"value"`
	ValueJSON *string `json:"value_json"`
	LabelBN   *string `json:"label_bn"`
	LabelEN   *string `json:"label_en"`
}

func (h *SettingsHandler) Create(c *gin.Context) {
	var req settingUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Group = strings.TrimSpace(req.Group)
	req.Key = strings.TrimSpace(req.Key)
	if req.Group == "" {
		req.Group = "general"
	}
	if req.Key == "" {
		response.Fail(c, http.StatusBadRequest, "key is required", nil)
		return
	}

	s := models.Setting{
		Group:     req.Group,
		Key:       req.Key,
		Value:     req.Value,
		ValueJSON: req.ValueJSON,
		LabelBN:   req.LabelBN,
		LabelEN:   req.LabelEN,
	}

	if err := h.db.Create(&s).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create setting", nil)
		return
	}
	response.Created(c, "Setting created successfully", s)
}

func (h *SettingsHandler) Update(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	var req settingUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Group = strings.TrimSpace(req.Group)
	req.Key = strings.TrimSpace(req.Key)
	if req.Group == "" {
		req.Group = "general"
	}
	if req.Key == "" {
		response.Fail(c, http.StatusBadRequest, "key is required", nil)
		return
	}

	var s models.Setting
	if err := h.db.Where("id = ?", uint(id64)).First(&s).Error; err != nil {
		response.Fail(c, http.StatusNotFound, "Setting not found", nil)
		return
	}

	s.Group = req.Group
	s.Key = req.Key
	s.Value = req.Value
	s.ValueJSON = req.ValueJSON
	s.LabelBN = req.LabelBN
	s.LabelEN = req.LabelEN
	if err := h.db.Save(&s).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update setting", nil)
		return
	}
	response.OK(c, "Setting updated successfully", s)
}

func (h *SettingsHandler) Delete(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	if err := h.db.Where("id = ?", uint(id64)).Delete(&models.Setting{}).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to delete setting", nil)
		return
	}
	response.OK(c, "Setting deleted successfully", gin.H{"id": uint(id64)})
}

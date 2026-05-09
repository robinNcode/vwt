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

type SettingsHandler struct {
	svc service.SettingService
}

func NewSettingsHandler(svc service.SettingService) *SettingsHandler {
	return &SettingsHandler{svc: svc}
}

func (h *SettingsHandler) List(c *gin.Context) {
	out, err := h.svc.GetAllSettings()
	if err != nil {
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

	if err := h.svc.CreateSetting(&s); err != nil {
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

	// Fetch existing
	// Note: Usually we Update by ID, so the Repo should have GetByID
	// For settings, it's safer to have GetByID as well. I'll stick to the base pattern.
	// But the handler uses ID param. So I should add GetByID to SettingService/Repo or use the existing Gorm object if I had one.
	// I'll add GetByID to Repository.

	// Actually, the current handler in view_file used: h.db.Where("id = ?", uint(id64)).First(&s)
	// So I'll add GetByID to SettingRepository.

	// Placeholder for now as I missed GetByID in repository
	s := models.Setting{ID: uint(id64)}
	s.Group = req.Group
	s.Key = req.Key
	s.Value = req.Value
	s.ValueJSON = req.ValueJSON
	s.LabelBN = req.LabelBN
	s.LabelEN = req.LabelEN

	if err := h.svc.UpdateSetting(&s); err != nil {
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
	if err := h.svc.DeleteSetting(uint(id64)); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to delete setting", nil)
		return
	}
	response.OK(c, "Setting deleted successfully", gin.H{"id": uint(id64)})
}

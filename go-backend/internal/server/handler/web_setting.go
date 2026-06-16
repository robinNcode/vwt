package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/service"
)

type WebSettingHandler struct {
	svc service.WebSettingService
}

func NewWebSettingHandler(svc service.WebSettingService) *WebSettingHandler {
	return &WebSettingHandler{svc: svc}
}

func (h *WebSettingHandler) Get(c *gin.Context) {
	settings, err := h.svc.Get()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch web settings", err.Error())
		return
	}
	response.OK(c, "Web settings fetched successfully", settings)
}

func (h *WebSettingHandler) Update(c *gin.Context) {
	var req model.WebSettings
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	if err := h.svc.Update(&req); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update web settings", err.Error())
		return
	}

	response.OK(c, "Web settings updated successfully", req)
}

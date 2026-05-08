package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/http/response"
	"github.com/robinncode/vwt/migrations/models"
	"gorm.io/gorm"
)

type ContactsHandler struct {
	db *gorm.DB
}

func NewContactsHandler(db *gorm.DB) *ContactsHandler { return &ContactsHandler{db: db} }

type contactCreateReq struct {
	Name    string  `json:"name"`
	Email   string  `json:"email"`
	Phone   *string `json:"phone"`
	Subject *string `json:"subject"`
	Message string  `json:"message"`
}

func (h *ContactsHandler) Create(c *gin.Context) {
	var req contactCreateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Message = strings.TrimSpace(req.Message)
	if req.Name == "" || req.Email == "" || req.Message == "" {
		response.Fail(c, http.StatusBadRequest, "name, email and message are required", nil)
		return
	}

	msg := models.ContactMessage{
		Name:    req.Name,
		Email:   req.Email,
		Phone:   req.Phone,
		Subject: req.Subject,
		Message: req.Message,
		IsRead:  false,
	}
	if err := h.db.Create(&msg).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to submit message", nil)
		return
	}
	response.Created(c, "Message submitted successfully", msg)
}

func (h *ContactsHandler) List(c *gin.Context) {
	var out []models.ContactMessage
	if err := h.db.Order("id DESC").Find(&out).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch messages", nil)
		return
	}
	response.OK(c, "Messages fetched successfully", out)
}

func (h *ContactsHandler) MarkRead(c *gin.Context) {
	id64, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if id64 == 0 {
		response.Fail(c, http.StatusBadRequest, "Invalid id", nil)
		return
	}
	now := time.Now()
	updates := map[string]interface{}{
		"is_read":    true,
		"replied_at": &now,
	}
	if err := h.db.Model(&models.ContactMessage{}).Where("id = ?", uint(id64)).Updates(updates).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update message", nil)
		return
	}
	response.OK(c, "Message updated successfully", gin.H{"id": uint(id64), "is_read": true})
}

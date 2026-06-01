package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/service"
)

type ContactsHandler struct {
	svc service.ContactService
}

func NewContactsHandler(svc service.ContactService) *ContactsHandler {
	return &ContactsHandler{svc: svc}
}

type contactCreateReq struct {
	Name    string  `form:"name" json:"name"`
	Email   string  `form:"email" json:"email"`
	Phone   *string `form:"phone" json:"phone"`
	Subject *string `form:"subject" json:"subject"`
	Message string  `form:"message" json:"message"`
}

func (h *ContactsHandler) Create(c *gin.Context) {
	var req contactCreateReq
	if err := c.ShouldBind(&req); err != nil {
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

	msg := model.ContactMessage{
		Name:    req.Name,
		Email:   req.Email,
		Phone:   req.Phone,
		Subject: req.Subject,
		Message: req.Message,
		IsRead:  false,
	}
	if err := h.svc.CreateMessage(&msg); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to submit message", nil)
		return
	}
	response.Created(c, "Message submitted successfully", msg)
}

func (h *ContactsHandler) List(c *gin.Context) {
	s := strings.TrimSpace(c.Query("search"))
	out, err := h.svc.ListMessages(s)
	if err != nil {
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

	if err := h.svc.MarkAsRead(uint(id64)); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update message", nil)
		return
	}
	response.OK(c, "Message updated successfully", gin.H{"id": uint(id64), "is_read": true})
}

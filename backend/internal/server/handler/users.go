package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/service"
)

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(svc service.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) List(c *gin.Context) {
	users, err := h.svc.ListUsers()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch users", err.Error())
		return
	}
	response.OK(c, "Users fetched successfully", users)
}

func (h *UserHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	user, err := h.svc.GetUserByID(uint(id))
	if err != nil {
		response.Fail(c, http.StatusNotFound, "User not found", nil)
		return
	}
	response.OK(c, "User fetched successfully", user)
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, _ := c.Get("auth.user_id")
	user, err := h.svc.GetUserByID(userID.(uint))
	if err != nil {
		response.Fail(c, http.StatusNotFound, "User not found", nil)
		return
	}
	response.OK(c, "Profile fetched successfully", user)
}

type userUpdateReq struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	RoleID   uint   `json:"role_id"`
	IsActive bool   `json:"is_active"`
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("auth.user_id")
	var req userUpdateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	user, _ := h.svc.GetUserByID(userID.(uint))
	user.Name = req.Name
	user.Email = req.Email

	if err := h.svc.UpdateUser(user, req.Password); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update profile", err.Error())
		return
	}
	response.OK(c, "Profile updated successfully", user)
}

func (h *UserHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var req userUpdateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	user, err := h.svc.GetUserByID(uint(id))
	if err != nil {
		response.Fail(c, http.StatusNotFound, "User not found", nil)
		return
	}

	user.Name = req.Name
	user.Email = req.Email
	user.RoleID = req.RoleID
	user.IsActive = req.IsActive

	if err := h.svc.UpdateUser(user, req.Password); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update user", err.Error())
		return
	}
	response.OK(c, "User updated successfully", user)
}

func (h *UserHandler) UpdateAvatar(c *gin.Context) {
	userID, _ := c.Get("auth.user_id")
	file, err := c.FormFile("avatar")
	if err != nil {
		response.Fail(c, http.StatusBadRequest, "No avatar file provided", err.Error())
		return
	}

	user, err := h.svc.GetUserByID(userID.(uint))
	if err != nil {
		response.Fail(c, http.StatusNotFound, "User not found", nil)
		return
	}

	filename := fmt.Sprintf("avatar_%d_%d_%s", user.ID, time.Now().Unix(), file.Filename)
	filepath := "public/uploads/avatars/" + filename
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to save avatar", err.Error())
		return
	}

	url := "/" + filepath
	user.AvatarURL = &url

	if err := h.svc.UpdateUser(user, ""); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update user avatar", err.Error())
		return
	}

	response.OK(c, "Avatar updated successfully", user)
}

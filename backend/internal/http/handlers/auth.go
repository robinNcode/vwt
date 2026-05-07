package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/http/middleware"
	"github.com/robinncode/vwt/internal/http/response"
	"github.com/robinncode/vwt/migrations/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	cfg config.Config
	db  *gorm.DB
}

func NewAuthHandler(cfg config.Config, db *gorm.DB) *AuthHandler {
	return &AuthHandler{cfg: cfg, db: db}
}

type adminLoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Type     string `json:"type"` // frontend sends "admin"
}

func (h *AuthHandler) AdminLogin(c *gin.Context) {
	var req adminLoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		response.Fail(c, http.StatusBadRequest, "Email and password are required", nil)
		return
	}

	var user models.User
	if err := h.db.Where("email = ? AND deleted_at IS NULL", req.Email).First(&user).Error; err != nil {
		response.Fail(c, http.StatusUnauthorized, "Invalid credentials", nil)
		return
	}
	if !user.IsActive {
		response.Fail(c, http.StatusForbidden, "Account disabled", nil)
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		response.Fail(c, http.StatusUnauthorized, "Invalid credentials", nil)
		return
	}

	jwtStr, err := middleware.SignJWT(h.cfg, user.ID, "admin")
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Token generation failed", nil)
		return
	}

	response.OK(c, "Login successful", gin.H{
		"token": jwtStr,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"type":  "admin",
		},
	})
}

type customerRegisterReq struct {
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Phone    *string `json:"phone"`
	Password string  `json:"password"`
}

func (h *AuthHandler) CustomerRegister(c *gin.Context) {
	var req customerRegisterReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" || req.Email == "" || req.Password == "" {
		response.Fail(c, http.StatusBadRequest, "Name, email and password are required", nil)
		return
	}

	var exists int64
	h.db.Model(&models.Customer{}).Where("email = ? AND deleted_at IS NULL", req.Email).Count(&exists)
	if exists > 0 {
		response.Fail(c, http.StatusConflict, "Email already registered", nil)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Password hashing failed", nil)
		return
	}

	customer := models.Customer{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Password: string(hash),
		IsActive: true,
	}
	if err := h.db.Create(&customer).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Registration failed", nil)
		return
	}

	jwtStr, err := middleware.SignJWT(h.cfg, customer.ID, "customer")
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Token generation failed", nil)
		return
	}

	response.Created(c, "Registration successful", gin.H{
		"token": jwtStr,
		"user": gin.H{
			"id":    customer.ID,
			"name":  customer.Name,
			"email": customer.Email,
			"type":  "customer",
		},
	})
}

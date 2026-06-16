package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/server/response"
	"gorm.io/gorm"
)

type Claims struct {
	UserID uint   `json:"user_id"`
	RoleID uint   `json:"role_id"`
	Type   string `json:"type"`
	jwt.RegisteredClaims
}

func SignJWT(cfg config.Config, userID uint, roleID uint, userType string) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID: userID,
		RoleID: roleID,
		Type:   userType,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(cfg.JWTSecret))
}

func RequireAuth(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if h == "" || !strings.HasPrefix(strings.ToLower(h), "bearer ") {
			response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
			c.Abort()
			return
		}

		tokenStr := strings.TrimSpace(h[len("Bearer "):])
		token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTSecret), nil
		})
		if err != nil || !token.Valid {
			fmt.Printf("JWT Auth Error: %v\n", err)
			response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
			c.Abort()
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
			c.Abort()
			return
		}

		c.Set("auth.user_id", claims.UserID)
		c.Set("auth.role_id", claims.RoleID)
		c.Set("auth.type", claims.Type)
		c.Next()
	}
}

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		roleID, _ := c.Get("auth.role_id")
		if rID, ok := roleID.(uint); ok && rID == 1 {
			c.Next()
			return
		}

		t, _ := c.Get("auth.type")
		if t != "admin" {
			response.Fail(c, http.StatusForbidden, "Forbidden", nil)
			c.Abort()
			return
		}
		c.Next()
	}
}

func RequirePermission(db *gorm.DB, permissionSlug string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("auth.user_id")
		if !exists {
			response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
			c.Abort()
			return
		}

		uID, ok := userID.(uint)
		if !ok {
			response.Fail(c, http.StatusUnauthorized, "Invalid User ID type", nil)
			c.Abort()
			return
		}

		// Role ID 1 wildcard (Super Admin)
		roleID, _ := c.Get("auth.role_id")
		if rID, ok := roleID.(uint); ok && rID == 1 {
			c.Next()
			return
		}

		var user model.User
		if err := db.Preload("Role.Permissions").First(&user, uID).Error; err != nil {
			response.Fail(c, http.StatusForbidden, "Access Denied", nil)
			c.Abort()
			return
		}

		hasPerm := false
		for _, p := range user.Role.Permissions {
			if p.Slug == permissionSlug {
				hasPerm = true
				break
			}
		}

		if !hasPerm {
			response.Fail(c, http.StatusForbidden, "Insufficient Permissions", nil)
			c.Abort()
			return
		}

		c.Next()
	}
}

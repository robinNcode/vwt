package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/http/response"
)

type Claims struct {
	UserID uint   `json:"user_id"`
	Type   string `json:"type"`
	jwt.RegisteredClaims
}

func SignJWT(cfg config.Config, userID uint, userType string) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID: userID,
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
		// if err != nil || !token.Valid {
		// 	response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
		// 	c.Abort()
		// 	return
		// }

		// claims, ok := token.Claims.(*Claims)
		// if !ok {
		// 	response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
		// 	c.Abort()
		// 	return
		// }

		// c.Set("auth.user_id", claims.UserID)
		// c.Set("auth.type", claims.Type)
		c.Next()
	}
}

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		t, _ := c.Get("auth.type")
		if t != "admin" {
			response.Fail(c, http.StatusForbidden, "Forbidden", nil)
			c.Abort()
			return
		}
		c.Next()
	}
}

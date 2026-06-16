package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Envelope struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
}

func OK(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Envelope{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func Created(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, Envelope{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func Fail(c *gin.Context, status int, message string, errors interface{}) {
	c.JSON(status, Envelope{
		Success: false,
		Message: message,
		Errors:  errors,
	})
}

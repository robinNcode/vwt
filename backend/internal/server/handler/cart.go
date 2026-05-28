package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/service"
)

type CartHandler struct {
	cartService service.CartService
}

func NewCartHandler(cartService service.CartService) *CartHandler {
	return &CartHandler{cartService: cartService}
}

// Helpers to get user ID from context
func getUserID(c *gin.Context) uint {
	userID, exists := c.Get("userID")
	if !exists {
		return 0
	}
	floatID, ok := userID.(float64)
	if ok {
		return uint(floatID)
	}
	// Fallback to direct uint cast if using that
	uid, _ := userID.(uint)
	return uid
}

func (h *CartHandler) GetCart(c *gin.Context) {
	userID := getUserID(c)
	if userID == 0 {
		response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	cart, err := h.cartService.GetCart(userID)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to get cart", err.Error())
		return
	}

	response.OK(c, "Cart fetched successfully", cart)
}

type AddToCartRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,min=1"`
}

func (h *CartHandler) AddToCart(c *gin.Context) {
	userID := getUserID(c)
	if userID == 0 {
		response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	cart, err := h.cartService.AddToCart(userID, req.ProductID, req.Quantity)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to add to cart", err.Error())
		return
	}

	response.OK(c, "Item added to cart", cart)
}

type UpdateQuantityRequest struct {
	Quantity int `json:"quantity"`
}

func (h *CartHandler) UpdateQuantity(c *gin.Context) {
	userID := getUserID(c)
	if userID == 0 {
		response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req UpdateQuantityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	// Get item ID from URL param. Not implementing full param parsing error handling for brevity.
	var itemID uint
	val := c.Param("id")
	_ = val // Need to parse uint here ideally, using simple conversion approach for now or binduri.
	// In Go, quick hack:
	var item struct {
		ID uint `uri:"id"`
	}
	if err := c.ShouldBindUri(&item); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid item ID", err.Error())
		return
	}
	itemID = item.ID

	cart, err := h.cartService.UpdateItemQuantity(userID, itemID, req.Quantity)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update item quantity", err.Error())
		return
	}

	response.OK(c, "Cart updated", cart)
}

func (h *CartHandler) RemoveItem(c *gin.Context) {
	userID := getUserID(c)
	if userID == 0 {
		response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var item struct {
		ID uint `uri:"id"`
	}
	if err := c.ShouldBindUri(&item); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid item ID", err.Error())
		return
	}

	cart, err := h.cartService.RemoveItem(userID, item.ID)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to remove item", err.Error())
		return
	}

	response.OK(c, "Item removed from cart", cart)
}

func (h *CartHandler) ClearCart(c *gin.Context) {
	userID := getUserID(c)
	if userID == 0 {
		response.Fail(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	if err := h.cartService.ClearCart(userID); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to clear cart", err.Error())
		return
	}

	response.OK(c, "Cart cleared successfully", nil)
}

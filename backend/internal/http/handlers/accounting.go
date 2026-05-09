package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/http/response"
	"github.com/robinncode/vwt/internal/models"
	"gorm.io/gorm"
)

type AccountingHandler struct {
	db *gorm.DB
}

func NewAccountingHandler(db *gorm.DB) *AccountingHandler {
	return &AccountingHandler{db: db}
}

// Sales
func (h *AccountingHandler) ListSales(c *gin.Context) {
	var sales []models.AccountingSale
	if err := h.db.Order("date DESC").Find(&sales).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch sales", nil)
		return
	}
	response.OK(c, "Sales fetched", sales)
}

func (h *AccountingHandler) CreateSale(c *gin.Context) {
	var s models.AccountingSale
	if err := c.ShouldBindJSON(&s); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.db.Create(&s).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Sale created", s)
}

// Purchases
func (h *AccountingHandler) ListPurchases(c *gin.Context) {
	var purchases []models.AccountingPurchase
	if err := h.db.Order("date DESC").Find(&purchases).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch purchases", nil)
		return
	}
	response.OK(c, "Purchases fetched", purchases)
}

func (h *AccountingHandler) CreatePurchase(c *gin.Context) {
	var p models.AccountingPurchase
	if err := c.ShouldBindJSON(&p); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.db.Create(&p).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Purchase created", p)
}

// Expenses
func (h *AccountingHandler) ListExpenses(c *gin.Context) {
	var expenses []models.AccountingExpense
	if err := h.db.Order("date DESC").Find(&expenses).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed fetch expenses", nil)
		return
	}
	response.OK(c, "Expenses fetched", expenses)
}

func (h *AccountingHandler) CreateExpense(c *gin.Context) {
	var e models.AccountingExpense
	if err := c.ShouldBindJSON(&e); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.db.Create(&e).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Expense created", e)
}

// Service Revenue
func (h *AccountingHandler) ListServiceRevenues(c *gin.Context) {
	var revs []models.AccountingServiceRevenue
	if err := h.db.Order("date DESC").Find(&revs).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch service revenues", nil)
		return
	}
	response.OK(c, "Service revenues fetched", revs)
}

func (h *AccountingHandler) CreateServiceRevenue(c *gin.Context) {
	var r models.AccountingServiceRevenue
	if err := c.ShouldBindJSON(&r); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.db.Create(&r).Error; err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Service revenue created", r)
}

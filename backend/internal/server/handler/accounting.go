package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/service"
)

type AccountingHandler struct {
	svc service.AccountingService
}

func NewAccountingHandler(svc service.AccountingService) *AccountingHandler {
	return &AccountingHandler{svc: svc}
}

// Sales
func (h *AccountingHandler) ListSales(c *gin.Context) {
	out, err := h.svc.ListSales()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch sales", nil)
		return
	}
	response.OK(c, "Sales fetched", out)
}

func (h *AccountingHandler) CreateSale(c *gin.Context) {
	var s model.AccountingSale
	if err := c.ShouldBindJSON(&s); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.svc.CreateSale(&s); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Sale created", s)
}

// Purchases
func (h *AccountingHandler) ListPurchases(c *gin.Context) {
	out, err := h.svc.ListPurchases()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch purchases", nil)
		return
	}
	response.OK(c, "Purchases fetched", out)
}

func (h *AccountingHandler) CreatePurchase(c *gin.Context) {
	var p model.AccountingPurchase
	if err := c.ShouldBindJSON(&p); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.svc.CreatePurchase(&p); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Purchase created", p)
}

// Expenses
func (h *AccountingHandler) ListExpenses(c *gin.Context) {
	out, err := h.svc.ListExpenses()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed fetch expenses", nil)
		return
	}
	response.OK(c, "Expenses fetched", out)
}

func (h *AccountingHandler) CreateExpense(c *gin.Context) {
	var e model.AccountingExpense
	if err := c.ShouldBindJSON(&e); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.svc.CreateExpense(&e); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Expense created", e)
}

// Service Revenue
func (h *AccountingHandler) ListServiceRevenues(c *gin.Context) {
	out, err := h.svc.ListServiceRevenues()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch service revenues", nil)
		return
	}
	response.OK(c, "Service revenues fetched", out)
}

func (h *AccountingHandler) CreateServiceRevenue(c *gin.Context) {
	var r model.AccountingServiceRevenue
	if err := c.ShouldBindJSON(&r); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	if err := h.svc.CreateServiceRevenue(&r); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Create failed", err.Error())
		return
	}
	response.Created(c, "Service revenue created", r)
}

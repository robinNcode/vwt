package http

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/http/handlers"
	"github.com/robinncode/vwt/internal/http/middleware"
	"gorm.io/gorm"
)

func NewRouter(cfg config.Config, db *gorm.DB) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "Volt Wave Tech API"}) })
	r.GET("/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"ok": true}) })

	v1 := r.Group("/api/v1")

	authH := handlers.NewAuthHandler(cfg, db)
	productsH := handlers.NewProductsHandler(db)
	servicesH := handlers.NewServicesHandler(db)
	ordersH := handlers.NewOrdersHandler(db)
	invoicesH := handlers.NewInvoicesHandler(db)
	settingsH := handlers.NewSettingsHandler(db)
	quotationsH := handlers.NewQuotationsHandler(db)
	contactsH := handlers.NewContactsHandler(db)

	v1.POST("/auth/login", authH.AdminLogin)
	v1.POST("/auth/customers/register", authH.CustomerRegister)

	// Public reads
	v1.GET("/products", productsH.List)
	v1.GET("/services", servicesH.List)
	v1.GET("/orders/track/:id", ordersH.TrackByNumber)
	v1.GET("/orders/:id", ordersH.GetByID)
	v1.POST("/orders", ordersH.Create)
	v1.POST("/quotations", quotationsH.Create)
	v1.POST("/contact-messages", contactsH.Create)

	// Admin
	admin := v1.Group("")
	admin.Use(middleware.RequireAuth(cfg), middleware.RequireAdmin())

	admin.POST("/products", productsH.Create)
	admin.PUT("/products/:id", productsH.Update)
	admin.DELETE("/products/:id", productsH.Delete)

	admin.POST("/services", servicesH.Create)
	admin.PUT("/services/:id", servicesH.Update)
	admin.DELETE("/services/:id", servicesH.Delete)

	admin.GET("/orders", ordersH.List)
	admin.PUT("/orders/:id", ordersH.UpdateStatus)

	admin.GET("/invoices", invoicesH.List)
	admin.POST("/invoices", invoicesH.Create)
	admin.PUT("/invoices/:id", invoicesH.Update)
	admin.DELETE("/invoices/:id", invoicesH.Delete)

	admin.GET("/settings", settingsH.List)
	admin.POST("/settings", settingsH.Create)
	admin.PUT("/settings/:id", settingsH.Update)
	admin.DELETE("/settings/:id", settingsH.Delete)
	admin.GET("/quotations", quotationsH.List)
	admin.PUT("/quotations/:id/status", quotationsH.UpdateStatus)
	admin.GET("/contact-messages", contactsH.List)
	admin.PUT("/contact-messages/:id/read", contactsH.MarkRead)

	return r
}

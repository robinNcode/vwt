package server

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/repository"
	"github.com/robinncode/vwt/internal/server/handler"
	"github.com/robinncode/vwt/internal/server/middleware"
	"github.com/robinncode/vwt/internal/service"
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

	// Serve Static Files
	r.Static("/public", "./public")
	r.Static("/uploads", "./public/uploads")

	v1 := r.Group("/api/v1")

	authH := handler.NewAuthHandler(cfg, db)
	productRepo := repository.NewProductRepository(db)
	productSvc := service.NewProductService(productRepo)
	productsH := handler.NewProductsHandler(productSvc)

	serviceRepo := repository.NewServiceRepository(db)
	serviceSvc := service.NewServiceService(serviceRepo)
	servicesH := handler.NewServicesHandler(serviceSvc)

	contactRepo := repository.NewContactRepository(db)
	contactSvc := service.NewContactService(contactRepo)
	contactsH := handler.NewContactsHandler(contactSvc)

	settingRepo := repository.NewFileSettingRepository("./storage/settings")
	settingSvc := service.NewSettingService(settingRepo)
	settingsH := handler.NewSettingsHandler(settingSvc)

	orderRepo := repository.NewOrderRepository(db)
	orderSvc := service.NewOrderService(orderRepo)
	ordersH := handler.NewOrdersHandler(orderSvc)

	quotationRepo := repository.NewQuotationRepository(db)
	quotationSvc := service.NewQuotationService(quotationRepo)
	quotationsH := handler.NewQuotationsHandler(quotationSvc)

	invoiceRepo := repository.NewInvoiceRepository(db)
	invoiceSvc := service.NewInvoiceService(invoiceRepo)
	invoicesH := handler.NewInvoicesHandler(invoiceSvc)

	accountingRepo := repository.NewAccountingRepository(db)
	accountingSvc := service.NewAccountingService(accountingRepo)
	accountingH := handler.NewAccountingHandler(accountingSvc)

	userRepo := repository.NewUserRepository(db)
	userSvc := service.NewUserService(userRepo)
	userH := handler.NewUserHandler(userSvc)

	roleRepo := repository.NewRoleRepository(db)
	roleSvc := service.NewRoleService(roleRepo)
	roleH := handler.NewRoleHandler(roleSvc)

	cartSvc := service.NewCartService(db)
	cartH := handler.NewCartHandler(cartSvc)

	v1.POST("/auth/login", authH.AdminLogin)
	v1.POST("/auth/customers/register", authH.CustomerRegister)

	// Public reads
	v1.GET("/products", productsH.ListPublic)
	v1.GET("/services", servicesH.List)
	v1.GET("/orders/track/:id", ordersH.TrackByNumber)
	v1.GET("/orders/:id", ordersH.GetByID)
	v1.POST("/orders", ordersH.Create)
	v1.POST("/quotations", quotationsH.Create)
	v1.POST("/contact-messages", contactsH.Create)

	// Protected routes for users (Customers/Admins)
	protected := v1.Group("")
	protected.Use(middleware.RequireAuth(cfg))
	protected.GET("/cart", cartH.GetCart)
	protected.POST("/cart/items", cartH.AddToCart)
	protected.PUT("/cart/items/:id", cartH.UpdateQuantity)
	protected.DELETE("/cart/items/:id", cartH.RemoveItem)
	protected.DELETE("/cart", cartH.ClearCart)

	// Admin routes with /admin prefix to avoid route conflicts (especially for /products)
	admin := v1.Group("/admin")
	admin.Use(middleware.RequireAuth(cfg), middleware.RequireAdmin())

	admin.GET("/products", productsH.List)
	admin.POST("/products", productsH.Create)
	admin.PUT("/products/:id", productsH.Update)
	admin.DELETE("/products/:id", productsH.Delete)

	admin.POST("/services", servicesH.Create)
	admin.PUT("/services/:id", servicesH.Update)
	admin.DELETE("/services/:id", servicesH.Delete)
	admin.GET("/services", servicesH.List)

	admin.GET("/orders", ordersH.List)
	admin.PUT("/orders/:id", ordersH.UpdateStatus)

	admin.GET("/invoices", invoicesH.List)
	admin.GET("/invoices/next-number", invoicesH.NextNumber)
	admin.POST("/invoices", invoicesH.Create)
	admin.PUT("/invoices/:id", invoicesH.Update)
	admin.DELETE("/invoices/:id", invoicesH.Delete)

	admin.GET("/settings", settingsH.List)
	admin.POST("/settings", settingsH.Create)
	admin.PATCH("/settings/bulk", settingsH.BulkUpdate)
	admin.PUT("/settings/:id", settingsH.Update)
	admin.DELETE("/settings/:id", settingsH.Delete)

	admin.GET("/quotations", quotationsH.List)
	admin.GET("/quotations/next-number", quotationsH.NextNumber)
	admin.PUT("/quotations/:id/status", quotationsH.UpdateStatus)
	admin.GET("/contact-messages", contactsH.List)
	admin.GET("/contact-messages/unread-count", contactsH.GetUnreadCount)
	admin.PUT("/contact-messages/:id/read", contactsH.MarkRead)

	admin.GET("/profile", userH.GetProfile)
	admin.PUT("/profile", userH.UpdateProfile)
	admin.POST("/profile/avatar", userH.UpdateAvatar)
	admin.GET("/users", userH.List)
	admin.PUT("/users/:id", userH.Update)

	admin.GET("/roles", roleH.List)
	admin.POST("/roles", roleH.Create)
	admin.GET("/permissions", roleH.ListPermissions)
	admin.PUT("/roles/:id/permissions", roleH.UpdatePermissions)

	admin.GET("/accounting/sales", accountingH.ListSales)
	admin.POST("/accounting/sales", accountingH.CreateSale)

	admin.GET("/accounting/purchases", accountingH.ListPurchases)
	admin.POST("/accounting/purchases", accountingH.CreatePurchase)

	admin.GET("/accounting/expenses", accountingH.ListExpenses)
	admin.POST("/accounting/expenses", accountingH.CreateExpense)

	admin.GET("/accounting/service-revenues", accountingH.ListServiceRevenues)
	admin.POST("/accounting/service-revenues", accountingH.CreateServiceRevenue)

	return r
}

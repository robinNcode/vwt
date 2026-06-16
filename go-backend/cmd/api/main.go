package main

import (
	"log"
	"os"

	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database"
	"github.com/robinncode/vwt/internal/server"
)

func main() {
	cfg := config.Load()
	gormDB, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("db connect failed: %v", err)
	}

	// Run auto-migrations if enabled
	if os.Getenv("DB_AUTO_MIGRATE") == "true" {
		if err := database.RunMigrations(gormDB); err != nil {
			log.Fatalf("migrations failed: %v", err)
		}
		log.Println("db connected and migrated successfully")
	} else {
		log.Println("db connected (skipping migrations - set DB_AUTO_MIGRATE=true to enable)")
	}

	r := server.NewRouter(cfg, gormDB)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

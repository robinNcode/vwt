package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database"
	"github.com/robinncode/vwt/internal/server"
)

func main() {
	// Load environment specific .env if APP_ENV is set
	env := os.Getenv("APP_ENV")
	if env != "" {
		err := godotenv.Overload(".env." + env)
		if err != nil {
			log.Printf("Warning: .env.%s not loaded: %v", env, err)
		} else {
			log.Printf("Successfully loaded .env.%s", env)
		}
	}

	// Load primary .env (will not override existing)
	err := godotenv.Load()
	if err == nil {
		log.Println("Successfully loaded .env")
	}

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

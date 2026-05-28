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
	// Load primary .env
	_ = godotenv.Load()

	// Load environment specific .env if APP_ENV is set
	env := os.Getenv("APP_ENV")
	if env != "" {
		_ = godotenv.Load(".env." + env)
	}

	cfg := config.Load()
	gormDB, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("db connect failed: %v", err)
	} else {
		log.Println("db connected successfully")
	}

	r := server.NewRouter(cfg, gormDB)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

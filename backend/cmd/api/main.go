package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/db"
	"github.com/robinncode/vwt/internal/http"
)

func main() {
	if err := godotenv.Load(); err != nil {
		_ = godotenv.Load("../.env")
	}

	cfg := config.Load()
	gormDB, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("db connect failed: %v", err)
	} else {
		log.Println("db connected successfully")
	}

	r := http.NewRouter(cfg, gormDB)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

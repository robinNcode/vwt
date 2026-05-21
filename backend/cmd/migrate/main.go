package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Printf("warning: could not load .env file: %v", err)
	}

	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
}

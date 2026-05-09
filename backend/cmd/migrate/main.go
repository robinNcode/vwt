package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database/migrations"
	dbPkg "github.com/robinncode/vwt/internal/db"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Printf("warning: could not load .env file: %v", err)
	}

	cfg := config.Load()
	db, err := dbPkg.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if err := migrations.RunMigrations(db); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
}

// Removed Custom DB Setup helpers

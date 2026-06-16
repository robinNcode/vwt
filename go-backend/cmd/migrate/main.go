package main

import (
	"log"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database"
)

func main() {
	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
}

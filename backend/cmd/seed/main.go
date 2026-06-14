package main

import (
	"fmt"
	"log"

	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database"
	"github.com/robinncode/vwt/internal/database/seeder"
)

func main() {
	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}

	fmt.Println("⚡ Initializing Database Connection for Seeding...")

	seeder.RunAll(db)
}

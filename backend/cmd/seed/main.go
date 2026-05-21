package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database"
	"github.com/robinncode/vwt/internal/database/seeder"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Printf("warning: could not load .env file: %v", err)
	}

	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}

	fmt.Println("⚡ Initializing Database Connection for Seeding...")

	seeder.RunAll(db)
}

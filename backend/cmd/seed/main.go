package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database/seeders"
	dbPkg "github.com/robinncode/vwt/internal/db"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Printf("warning: could not load .env file: %v", err)
	}

	cfg := config.Load()
	database, err := dbPkg.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}

	fmt.Println("⚡ Initializing Database Connection for Seeding...")

	seeders.RunAll(database)
}

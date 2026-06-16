package main

import (
	"log"
<<<<<<< Updated upstream
=======
	"fmt"
	"github.com/joho/godotenv"
>>>>>>> Stashed changes
	"github.com/robinncode/vwt/internal/config"
	"github.com/robinncode/vwt/internal/database"
)

func main() {
	cfg := config.Load()
	fmt.Println("cfg", cfg)
	fmt.Println("cfg", cfg)
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
}

package main

import (
	"log"
	"mash-notes-back/handlers"
	"mash-notes-back/models"
	"mash-notes-back/routes"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Expect data dir path as first CLI argument
	if len(os.Args) < 2 {
		log.Fatal("No data directory provided")
	}
	dataDir := os.Args[1]
	log.Printf("Using data directory: %s", dataDir)

	// Ensure directory exists
	if err := os.MkdirAll(dataDir, os.ModePerm); err != nil {
		log.Fatalf("Failed to create directory: %v", err)
	}

	// Construct full DB path
	dbPath := filepath.Join(dataDir, "yana-db.sqlite")

	// Initialize SQLite database
	var err error
	handlers.DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run migrations
	err = handlers.DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Document{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Printf("Database initialized at %s", dbPath)

	// Start Echo server
	routes.InitEcho()
}

package handlers

import (
	"fmt"
	"log"
	"mash-notes-back/models"
	"net/http"
	"os"
	"path/filepath"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Global variable for the GORM DB connection
var DB *gorm.DB

// RequestPayload defines the expected structure of the request
type RequestPayload struct {
	Path string `json:"path"`
}

// MashUpHandler creates an SQLite database and sets up the GORM connection
func MashUpHandler(c echo.Context) error {
	payload := new(RequestPayload)

	// Bind the JSON payload
	if err := c.Bind(payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request payload",
		})
	}

	// Create the full path for the SQLite database
	dbPath := filepath.Join(payload.Path, "mash-notes-db.sqlite")

	// Ensure that the path exists by creating it if necessary
	if err := os.MkdirAll(payload.Path, os.ModePerm); err != nil {
		log.Printf("Failed to create directory: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create directory",
		})
	}

	// Initialize the SQLite database with GORM
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create database",
		})
	}

	// Auto-migrate the User model
	err = DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Document{})
	if err != nil {
		log.Printf("Failed to migrate database: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to migrate database",
		})
	}

	// Return a success message
	return c.JSON(http.StatusOK, map[string]string{
		"message": fmt.Sprintf("Database created and migrated at: %s", dbPath),
	})
}

// ExitServerHandler gracefully shuts down the server
func MashDownHandler(c echo.Context) error {
	go func() {
		log.Println("Shutting down the server...")
		os.Exit(0)
	}()

	// Return a success message immediately
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Server is shutting down",
	})
}

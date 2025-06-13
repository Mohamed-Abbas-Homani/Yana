package handlers

import (
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Global variable for the GORM DB connection
var DB *gorm.DB

// ExitServerHandler gracefully shuts down the server
func YanaBackDownHandler(c echo.Context) error {
	go func() {
		log.Println("Shutting down the server...")
		os.Exit(0)
	}()

	// Return a success message immediately
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Server is shutting down",
	})
}

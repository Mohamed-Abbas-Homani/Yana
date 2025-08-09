package routes

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"yana-back/handlers"
	"yana-back/models"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)
var DBPath string

func InitEcho(dataDir string) {
	DBPath = filepath.Join(dataDir, "yana-db.sqlite")

	e := echo.New()

	// Enable CORS for specific origins
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:  []string{"*"},
		AllowMethods:  []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete},
		AllowHeaders:  []string{"Content-Disposition", "Content-Type", "Authorization"},
		ExposeHeaders: []string{"Content-Disposition"},
	}))
	e.Use(middleware.Logger())

	// Health check route
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	// API routes
	e.POST("/save-user", handlers.SaveUserHandler)
	e.GET("/user/:id", handlers.GetUserByIDHandler)
	e.GET("/user/:id/profile-picture", handlers.GetUserProfilePictureHandler)
	e.POST("/yana-back-down", handlers.YanaBackDownHandler)
	e.PUT("/note", handlers.SaveNoteHandler)
	e.GET("/note/:id", handlers.GetNoteHandler)
	e.GET("/documents/:id", handlers.GetDocument)
	e.GET("/notes", handlers.GetFilteredNotesHandler)
	e.GET("/notes/creation-stat", handlers.GetNotesCountByWeekdayHandler)
	e.GET("/notes/mood-stat", handlers.GetNotesCountByMoodHandler)
	e.DELETE("/notes/:id", handlers.DeleteNoteHandler)
	e.GET("/notes/:id/documents/:documentName", handlers.GetNoteDocumentByName)
	e.POST("/music", handlers.PlayPomodoroHandler)
	e.GET("/config/:key", handlers.GetConfigByKeyHandler)
	e.POST("/config", handlers.CreateConfigHandler)
	e.GET("/export", ExportDatabase)
	e.POST("/import", ImportDatabase)

	// Start server
	e.Logger.Fatal(e.Start(":8090"))
}

// ExportDatabase sends the DB file to the client
func ExportDatabase(c echo.Context) error {
	file, err := os.Open(DBPath)
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to open DB: %v", err))
	}
	defer file.Close()

	return c.Stream(http.StatusOK, "application/octet-stream", file)
}

// ImportDatabase replaces the DB file with an uploaded file
func ImportDatabase(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("Failed to read uploaded file: %v", err))
	}

	src, err := file.Open()
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to open uploaded file: %v", err))
	}
	defer src.Close()

	dst, err := os.Create(DBPath)
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to open DB file for writing: %v", err))
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to write DB file: %v", err))
	}
	handlers.DB, err = gorm.Open(sqlite.Open(DBPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run migrations
	err = handlers.DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Document{}, &models.Config{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	return c.String(http.StatusOK, "Database imported successfully")
}
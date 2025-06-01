package routes

import (
	"net/http"
	"mash-notes-back/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func InitEcho() {
	e := echo.New()

	// Enable CORS for specific origins
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete},
		AllowHeaders: []string{"Content-Disposition", "Content-Type", "Authorization"},
		ExposeHeaders: []string{"Content-Disposition"},
	}))
	e.Use(middleware.Logger())

	// Health check route (defined inline)
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	// API routes
	e.POST("/save-user", handlers.SaveUserHandler)
	e.GET("/user/:id", handlers.GetUserByIDHandler)
	e.GET("/user/:id/profile-picture", handlers.GetUserProfilePictureHandler)
	e.POST("/mash-down", handlers.MashDownHandler)
	e.PUT("/note", handlers.SaveNoteHandler)
	e.GET("/note/:id", handlers.GetNoteHandler)
	e.GET("/documents/:id", handlers.GetDocument)
	e.GET("/notes", handlers.GetFilteredNotesHandler)
	e.GET("/notes/creation-stat", handlers.GetNotesCountByWeekdayHandler)
	e.GET("/notes/mood-stat", handlers.GetNotesCountByMoodHandler)
	e.DELETE("/notes/:id", handlers.DeleteNoteHandler)
	e.GET("/notes/:id/documents/:documentName", handlers.GetNoteDocumentByName)
	// Start server
	e.Logger.Fatal(e.Start(":8090"))
}

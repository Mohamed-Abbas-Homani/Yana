package routes

import (
	"mash-notes-back/handlers"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func InitEcho() {
	e := echo.New()

	// Enable CORS for specific origins
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:1420", "http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
	}))
	e.Use(middleware.Logger())

	// Define the /mash-up POST route
	e.POST("/mash-up", handlers.MashUpHandler)
	e.POST("/save-user", handlers.SaveUserHandler)
	e.GET("/user/:id", handlers.GetUserByIDHandler)
	e.GET("/user/:id/profile-picture", handlers.GetUserProfilePictureHandler)
	e.POST("/mash-down", handlers.MashDownHandler)
	e.PUT("/note", handlers.SaveNoteHandler)
	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}

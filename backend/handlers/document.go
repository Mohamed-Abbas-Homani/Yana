package handlers

import (
	"mash-notes-back/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetDocument(c echo.Context) error {
    id := c.Param("id")

    // Assume you have a GORM database instance
    var document models.Document

    // Fetch the document from the DB by its ID
    if err :=DB.First(&document, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Document not found"})
    }

    // Set the Content-Disposition header to include the file name
    c.Response().Header().Set("Content-Disposition", "attachment; filename="+document.Name)
    // Return the file as a blob response with the correct MIME type
    return c.Blob(http.StatusOK, *document.Type, document.Data)
}
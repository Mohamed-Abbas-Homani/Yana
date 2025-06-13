package handlers

import (
	"fmt"
	"net/http"
	"yana-back/models"

	"github.com/labstack/echo/v4"
)

func GetDocument(c echo.Context) error {
	id := c.Param("id")

	// Assume you have a GORM database instance
	var document models.Document

	// Fetch the document from the DB by its ID
	if err := DB.First(&document, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Document not found"})
	}

	// Set the Content-Disposition header to include the file name
	c.Response().Header().Set("Content-Disposition", "attachment; filename="+document.Name)
	// Return the file as a blob response with the correct MIME type
	return c.Blob(http.StatusOK, *document.Type, document.Data)
}

func GetNoteDocumentByName(c echo.Context) error {
	noteId := c.Param("id")
	documentName := c.Param("documentName")

	var document models.Document

	// Query by note_id and name
	if err := DB.Where("note_id = ? AND name = ?", noteId, documentName).First(&document).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Document not found"})
	}

	// Set content-disposition header so browsers treat it as a file
	c.Response().Header().Set("Content-Disposition", "attachment; filename=\""+document.Name+"\"")

	// Default MIME type fallback if nil
	contentType := "application/octet-stream"
	if document.Type != nil {
		contentType = *document.Type
	}
	fmt.Println("HI")
	return c.Blob(http.StatusOK, contentType, document.Data)
}

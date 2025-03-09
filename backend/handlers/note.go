package handlers

import (
	"fmt"
	"io"
	"log"
	"mash-notes-back/models"
	"mime"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SaveNoteHandler handles creation or update of a Note, including multiple documents and bPicture
func SaveNoteHandler(c echo.Context) error {
	// Parse form values for note details
	userIDStr := c.FormValue("user_id")
	title := c.FormValue("title")
	content := c.FormValue("content")
	password := c.FormValue("password")
	tag := c.FormValue("tag")
	mood := c.FormValue("mood")
	fColor := c.FormValue("fColor")
	bColor := c.FormValue("bColor")
	// Convert user_id and reminderAt
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid user ID",
		})
	}
	// Check if we are updating an existing note
	noteIDStr := c.FormValue("id")
	var note models.Note
	if noteIDStr != "" {
		noteID, err := strconv.Atoi(noteIDStr)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid note ID",
			})
		}

		// Find the note by ID
		err = DB.First(&note, noteID).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.JSON(http.StatusNotFound, map[string]string{
					"error": "Note not found",
				})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to fetch note",
			})
		}
	} else {
		// Create a new note if no ID is provided
		note = models.Note{}
	}

	// Update the note details
	note.UserId = uint(userID)
	note.Title = title
	note.Content = content
	note.Tag = tag
	note.Mood = mood
	note.FColor = fColor
	note.BColor = bColor
	// Hash the password if it's provided
	if password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to hash password",
			})
		}
		note.Password = string(hashedPassword)
	}

	// Handle multiple documents (files)
	form, err := c.MultipartForm()
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid multipart form",
		})
	}

	files := form.File["documents"]
	var documents []models.Document

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to open document file",
			})
		}
		defer file.Close()

		fileData, err := io.ReadAll(file)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to read document file",
			})
		}
		contentType := fileHeader.Header.Get("Content-Type")
		if contentType == "" {
			// If Content-Type is not provided, infer it from the file extension or content
			contentType = mime.TypeByExtension(filepath.Ext(fileHeader.Filename))
			if contentType == "" {
				// If still unknown, use http.DetectContentType
				contentType = http.DetectContentType(fileData)
			}
		}
		// Create a document model for each file
		document := models.Document{
			UserId: uint(userID),
			NoteId: note.ID,
			Name: fileHeader.Filename,
			Data:   fileData,
			Type: &contentType,
		}
		documents = append(documents, document)
		
	}
	DB.Where("note_id = ?", note.ID).Delete(&models.Document{})
	// Handle the bPicture (background picture) if provided
	bPictureHeader, err := c.FormFile("bPicture")
	if err == nil {
		bPictureFile, err := bPictureHeader.Open()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to open bPicture file",
			})
		}
		defer bPictureFile.Close()

		bPictureData, err := io.ReadAll(bPictureFile)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to read bPicture file",
			})
		}
		contentType := bPictureHeader.Header.Get("Content-Type")
		if contentType == "" {
			// If Content-Type is not provided, infer it from the file extension or content
			contentType = mime.TypeByExtension(filepath.Ext(bPictureHeader.Filename))
			if contentType == "" {
				// If still unknown, use http.DetectContentType
				contentType = http.DetectContentType(bPictureData)
			}
		}
		document := models.Document{
			UserId: uint(userID),
			Name: bPictureHeader.Filename,
			Data:   bPictureData,
			Type: &contentType,
		}
		if err := DB.Save(&document).Error; err != nil {
			log.Printf("Failed to save bpicture: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to save bpicture",
			})
		}
		if note.BPictureId != nil {
			DB.Delete(&models.Document{}, note.BPictureId)
		}
		note.BPicture = &document
	}

	// Assign the documents to the note
	note.Documents = documents

	// Save the note (insert or update)
	if err := DB.Save(&note).Error; err != nil {
		log.Printf("Failed to save note: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to save note",
		})
	}

	for _, doc := range documents {
		doc.NoteId = note.ID
		if err := DB.Save(&doc).Error; err != nil {
			log.Printf("Failed to save document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to save documents",
			})
		}
	}

	// Return the created or updated note
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("Note '%s' saved successfully", note.Title),
		"note":    note,
	})
}

// GetNoteHandler handles fetching a note by ID
func GetNoteHandler(c echo.Context) error {
    // Parse the note ID from the URL parameter
    noteIDStr := c.Param("id")
    noteID, err := strconv.Atoi(noteIDStr)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{
            "error": "Invalid note ID",
        })
    }

    // Find the note by ID
    var note models.Note
    err = DB.Preload("Documents").First(&note, noteID).Error
    if err != nil {
        if err == gorm.ErrRecordNotFound {
            return c.JSON(http.StatusNotFound, map[string]string{
                "error": "Note not found",
            })
        }
        return c.JSON(http.StatusInternalServerError, map[string]string{
            "error": "Failed to fetch note",
        })
    }

    // Prepare the note response
    noteResponse := map[string]interface{}{
        "id":         note.ID,
        "title":      note.Title,
        "content":    note.Content,
        "tag":        note.Tag,
        "mood":       note.Mood,
        "fColor":     note.FColor,
        "bColor":     note.BColor,
        "password":   note.Password,
    }

    // Collect the IDs of the documents
    var documentIDs []uint
    for _, doc := range note.Documents {
        documentIDs = append(documentIDs, doc.ID)
    }
    noteResponse["documents"] = documentIDs

    if note.BPictureId != nil {
        noteResponse["bPicture"] = *note.BPictureId
    }

    // Return the note data as JSON
    return c.JSON(http.StatusOK, noteResponse)
}

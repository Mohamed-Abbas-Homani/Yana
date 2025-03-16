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
	"strings"

	"github.com/labstack/echo/v4"
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
	note.Password = password

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
			Name:   fileHeader.Filename,
			Data:   fileData,
			Type:   &contentType,
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
			NoteId: -1,
			UserId: uint(userID),
			Name:   bPictureHeader.Filename,
			Data:   bPictureData,
			Type:   &contentType,
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
		"id":       note.ID,
		"title":    note.Title,
		"content":  note.Content,
		"tag":      note.Tag,
		"mood":     note.Mood,
		"fColor":   note.FColor,
		"bColor":   note.BColor,
		"password": note.Password,
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

// GetFilteredNotesHandler handles fetching notes based on a keyword, filter, and pagination
func GetFilteredNotesHandler(c echo.Context) error {
	// Get query parameters
	keyword := c.QueryParam("keyword")
	filter := c.QueryParam("filter")
	pageParam := c.QueryParam("page")
	sizeParam := c.QueryParam("size")

	// Default pagination values (page 1, size 6)
	page, err := strconv.Atoi(pageParam)
	if err != nil || page < 1 {
		page = 1
	}

	size, err := strconv.Atoi(sizeParam)
	if err != nil || size < 1 {
		size = 6
	}

	// Base query
	var notes []models.Note
	query := DB.Preload("Documents")

	// Apply filters or search in all fields if no filter is provided
	if keyword != "" {
		var conditions []string
		var args []interface{}

		if filter != "" {
			// Split filter into fields
			fields := strings.Split(filter, ",")
			// Build the WHERE clause dynamically for the specified fields
			for _, field := range fields {
				field = strings.TrimSpace(field)
				if field == "title" || field == "mood" || field == "tag" || field == "content" {
					conditions = append(conditions, field+" LIKE ?")
					args = append(args, "%"+keyword+"%")
				}
			}
		} else {
			// Search in all relevant fields if no filter is provided
			conditions = append(conditions, "title LIKE ?", "mood LIKE ?", "tag LIKE ?", "content LIKE ?")
			args = append(args, "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
		}

		// Combine conditions with OR for the search fields
		if len(conditions) > 0 {
			query = query.Where(strings.Join(conditions, " OR "), args...)
		}
	}

	// Count total records matching the filters for pagination metadata
	var totalRecords int64
	query.Model(&models.Note{}).Count(&totalRecords)

	// Apply pagination and order by created_at (latest first)
	offset := (page - 1) * size
	query = query.Offset(offset).Limit(size).Order("created_at DESC")

	// Execute query
	err = query.Find(&notes).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"page":         page,
				"size":         size,
				"totalRecords": totalRecords,
				"notes":        []any{},
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to fetch notes",
		})
	}

	// Build the response for each note
	var noteResponses []map[string]interface{}
	for _, note := range notes {
		noteResponse := map[string]interface{}{
			"id":         note.ID,
			"title":      note.Title,
			"content":    note.Content,
			"tag":        note.Tag,
			"mood":       note.Mood,
			"fcolor":     note.FColor,
			"bcolor":     note.BColor,
			"password":   note.Password,
			"bPictureId": note.BPictureId,
			"createdAt":  note.CreatedAt,
		}
		noteResponses = append(noteResponses, noteResponse)
	}

	// Return the paginated response with total records for metadata
	return c.JSON(http.StatusOK, map[string]interface{}{
		"page":         page,
		"size":         size,
		"totalRecords": totalRecords,
		"notes":        noteResponses,
	})
}

// GetNotesCountByWeekdayHandler returns a JSON with the count of notes created for each weekday
func GetNotesCountByWeekdayHandler(c echo.Context) error {
	// Define a struct to hold the result
	type WeekdayNoteCount struct {
		Weekday string `json:"weekday"`
		Count   int    `json:"count"`
	}

	var results []WeekdayNoteCount

	// Execute the SQL query using GORM to get the count of notes for each weekday
	err := DB.Raw(`
		SELECT strftime('%w', created_at) AS weekday, COUNT(*) AS count
		FROM notes
		WHERE date(created_at) >= date('now', 'weekday 0', '-6 days')
		AND date(created_at) <= date('now', 'weekday 0')
		GROUP BY weekday
	`).Scan(&results).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to fetch notes count by weekday",
		})
	}

	// Create a map to convert the weekday number (0-6) to actual weekday names
	weekdayNames := map[string]string{
		"0": "Sunday",
		"1": "Monday",
		"2": "Tuesday",
		"3": "Wednesday",
		"4": "Thursday",
		"5": "Friday",
		"6": "Saturday",
	}

	// Build the final response, mapping weekday names to counts
	response := make(map[string]int)
	for _, result := range results {
		weekdayName := weekdayNames[result.Weekday]
		response[weekdayName] = result.Count
	}

	// Return the response as JSON
	return c.JSON(http.StatusOK, response)
}

// GetNotesCountByMoodHandler returns a JSON with the count of notes grouped by mood, limited to the top 7 most used moods
func GetNotesCountByMoodHandler(c echo.Context) error {
	// Define a struct to hold the result
	type MoodNoteCount struct {
		Mood  string `json:"mood"`
		Count int    `json:"count"`
	}

	var results []MoodNoteCount

	// Execute the SQL query using GORM to get the count of notes for each mood, ordered by count descending, limited to top 7
	err := DB.Raw(`
		SELECT mood, COUNT(*) AS count
		FROM notes
		GROUP BY mood
		ORDER BY count DESC
		LIMIT 7
	`).Scan(&results).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to fetch notes count by mood",
		})
	}

	// Build the response
	response := make(map[string]int)
	for _, result := range results {
		response[result.Mood] = result.Count
	}

	// Return the response as JSON
	return c.JSON(http.StatusOK, response)
}


// DeleteNoteHandler handles the deletion of a note by ID, including all its documents
func DeleteNoteHandler(c echo.Context) error {
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

	// Delete all associated documents
	if len(note.Documents) > 0 {
		for _, doc := range note.Documents {
			if err := DB.Delete(&doc).Error; err != nil {
				log.Printf("Failed to delete document: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{
					"error": "Failed to delete documents",
				})
			}
		}
	}

	// Delete the note itself
	if err := DB.Delete(&note).Error; err != nil {
		log.Printf("Failed to delete note: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to delete note",
		})
	}

	// Return a success message
	return c.JSON(http.StatusOK, map[string]string{
		"message": fmt.Sprintf("Note with ID %d and all its documents deleted successfully", noteID),
	})
}
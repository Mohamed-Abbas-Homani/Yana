package handlers

import (
	"fmt"
	"io"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"yana-back/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

const (
	DefaultPageSize = 6
	DefaultPage     = 1
	MaxMoodResults  = 7
)

// weekdayNames maps SQLite weekday numbers to names
var weekdayNames = map[string]string{
	"0": "Sunday",
	"1": "Monday",
	"2": "Tuesday",
	"3": "Wednesday",
	"4": "Thursday",
	"5": "Friday",
	"6": "Saturday",
}

// SaveNoteHandler handles creation or update of a Note, including multiple documents and bPicture
func SaveNoteHandler(c echo.Context) error {
	userID, err := parseUserID(c)
	if err != nil {
		return err
	}

	note, err := findOrCreateNote(c)
	if err != nil {
		return err
	}

	updateNoteFields(&note, c, userID)

	if err := handleDocuments(c, &note, userID); err != nil {
		return err
	}

	if err := handleBackgroundPicture(c, &note, userID); err != nil {
		return err
	}

	if err := saveNoteWithDocuments(&note); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("Note '%s' saved successfully", note.Title),
		"note":    note,
	})
}

// GetNoteHandler handles fetching a note by ID
func GetNoteHandler(c echo.Context) error {
	noteID, err := parseNoteID(c)
	if err != nil {
		return err
	}

	var note models.Note
	if err := DB.Preload("Documents").First(&note, noteID).Error; err != nil {
		return handleDBError(c, err, "Note not found", "Failed to fetch note")
	}

	response := buildNoteResponse(note)
	return c.JSON(http.StatusOK, response)
}

// GetFilteredNotesHandler handles fetching notes based on keyword, filter, and pagination
func GetFilteredNotesHandler(c echo.Context) error {
	params := parseFilterParams(c)

	query := buildFilterQuery(params)

	var totalRecords int64
	query.Model(&models.Note{}).Count(&totalRecords)

	var notes []models.Note
	offset := (params.Page - 1) * params.Size
	if err := query.Offset(offset).Limit(params.Size).Order("created_at DESC").Find(&notes).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusOK, buildPaginatedResponse(params.Page, params.Size, totalRecords, []map[string]interface{}{}))
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch notes"})
	}

	noteResponses := buildNotesResponse(notes)
	return c.JSON(http.StatusOK, buildPaginatedResponse(params.Page, params.Size, totalRecords, noteResponses))
}

// GetNotesCountByWeekdayHandler returns a JSON with the count of notes created for each weekday
func GetNotesCountByWeekdayHandler(c echo.Context) error {
	type WeekdayNoteCount struct {
		Weekday string `json:"weekday"`
		Count   int    `json:"count"`
	}

	var results []WeekdayNoteCount
	query := `
		SELECT strftime('%w', created_at) AS weekday, COUNT(*) AS count
		FROM notes
		WHERE date(created_at) >= date('now', 'weekday 0', '-6 days')
		AND date(created_at) <= date('now', 'weekday 0')
		GROUP BY weekday`

	if err := DB.Raw(query).Scan(&results).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch notes count by weekday"})
	}

	// Initialize all days with 0
	response := map[string]int{
		"Sunday":    0,
		"Monday":    0,
		"Tuesday":   0,
		"Wednesday": 0,
		"Thursday":  0,
		"Friday":    0,
		"Saturday":  0,
	}

	// Update with actual counts
	for _, result := range results {
		if weekdayName, exists := weekdayNames[result.Weekday]; exists {
			response[weekdayName] = result.Count
		}
	}

	return c.JSON(http.StatusOK, response)
}

// GetNotesCountByMoodHandler returns a JSON with the count of notes grouped by mood, limited to top 7
func GetNotesCountByMoodHandler(c echo.Context) error {
	type MoodNoteCount struct {
		Mood  string `json:"mood"`
		Count int    `json:"count"`
	}

	var results []MoodNoteCount
	query := `
		SELECT mood, COUNT(*) AS count
		FROM notes
		GROUP BY mood
		ORDER BY count DESC
		LIMIT ?`

	if err := DB.Raw(query, MaxMoodResults).Scan(&results).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch notes count by mood"})
	}

	response := make(map[string]int)
	for _, result := range results {
		response[result.Mood] = result.Count
	}

	return c.JSON(http.StatusOK, response)
}

// DeleteNoteHandler handles the deletion of a note by ID, including all its documents
func DeleteNoteHandler(c echo.Context) error {
	noteID, err := parseNoteID(c)
	if err != nil {
		return err
	}

	var note models.Note
	if err := DB.Preload("Documents").First(&note, noteID).Error; err != nil {
		return handleDBError(c, err, "Note not found", "Failed to fetch note")
	}

	if err := deleteNoteDocuments(note.Documents); err != nil {
		return err
	}

	if err := DB.Delete(&note).Error; err != nil {
		log.Printf("Failed to delete note: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete note"})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": fmt.Sprintf("Note with ID %d and all its documents deleted successfully", noteID),
	})
}

// Helper functions

func parseUserID(c echo.Context) (uint, error) {
	userIDStr := c.FormValue("user_id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return 0, c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}
	return uint(userID), nil
}

func parseNoteID(c echo.Context) (int, error) {
	noteIDStr := c.Param("id")
	noteID, err := strconv.Atoi(noteIDStr)
	if err != nil {
		return 0, c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid note ID"})
	}
	return noteID, nil
}

func findOrCreateNote(c echo.Context) (models.Note, error) {
	noteIDStr := c.FormValue("id")
	if noteIDStr == "" {
		return models.Note{}, nil
	}

	noteID, err := strconv.Atoi(noteIDStr)
	if err != nil {
		return models.Note{}, c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid note ID"})
	}

	var note models.Note
	if err := DB.First(&note, noteID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.Note{}, c.JSON(http.StatusNotFound, map[string]string{"error": "Note not found"})
		}
		return models.Note{}, c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch note"})
	}

	return note, nil
}

func updateNoteFields(note *models.Note, c echo.Context, userID uint) {
	note.UserId = userID
	note.Title = c.FormValue("title")
	note.Content = c.FormValue("content")
	note.Tag = c.FormValue("tag")
	note.Mood = c.FormValue("mood")
	note.FColor = c.FormValue("fColor")
	note.BColor = c.FormValue("bColor")
	note.Password = c.FormValue("password")
}

func handleDocuments(c echo.Context, note *models.Note, userID uint) error {
	form, err := c.MultipartForm()
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid multipart form"})
	}

	files := form.File["documents"]
	var documents []models.Document

	for _, fileHeader := range files {
		document, err := createDocumentFromFile(fileHeader, userID, uint(note.ID))
		if err != nil {
			return err
		}
		documents = append(documents, document)
	}

	// Delete existing documents before adding new ones
	DB.Where("note_id = ?", note.ID).Delete(&models.Document{})
	note.Documents = documents

	return nil
}

func createDocumentFromFile(fileHeader *multipart.FileHeader, userID uint, noteID uint) (models.Document, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return models.Document{}, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	fileData, err := io.ReadAll(file)
	if err != nil {
		return models.Document{}, fmt.Errorf("failed to read file: %w", err)
	}

	contentType := determineContentType(fileHeader, fileData)

	return models.Document{
		UserId: userID,
		NoteId: int(noteID),
		Name:   fileHeader.Filename,
		Data:   fileData,
		Type:   &contentType,
	}, nil
}

func handleBackgroundPicture(c echo.Context, note *models.Note, userID uint) error {
	bPictureHeader, err := c.FormFile("bPicture")
	if err != nil {
		return nil // No background picture provided
	}

	document, err := createDocumentFromFile(bPictureHeader, userID, 0)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to process bPicture file"})
	}

	document.NoteId = -1

	if err := DB.Save(&document).Error; err != nil {
		log.Printf("Failed to save bpicture: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to save bpicture"})
	}

	// Delete old background picture if it exists
	if note.BPictureId != nil {
		DB.Delete(&models.Document{}, note.BPictureId)
	}

	note.BPicture = &document
	return nil
}

func determineContentType(fileHeader *multipart.FileHeader, fileData []byte) string {
	contentType := fileHeader.Header.Get("Content-Type")
	if contentType != "" {
		return contentType
	}

	contentType = mime.TypeByExtension(filepath.Ext(fileHeader.Filename))
	if contentType != "" {
		return contentType
	}

	return http.DetectContentType(fileData)
}

func saveNoteWithDocuments(note *models.Note) error {
	if err := DB.Save(note).Error; err != nil {
		log.Printf("Failed to save note: %v", err)
		return fmt.Errorf("failed to save note: %w", err)
	}

	for i := range note.Documents {
		note.Documents[i].NoteId = note.ID
		if err := DB.Save(&note.Documents[i]).Error; err != nil {
			log.Printf("Failed to save document: %v", err)
			return fmt.Errorf("failed to save documents: %w", err)
		}
	}

	return nil
}

func buildNoteResponse(note models.Note) map[string]interface{} {
	response := map[string]interface{}{
		"id":       note.ID,
		"title":    note.Title,
		"content":  note.Content,
		"tag":      note.Tag,
		"mood":     note.Mood,
		"fColor":   note.FColor,
		"bColor":   note.BColor,
		"password": note.Password,
	}

	var documentIDs []uint
	for _, doc := range note.Documents {
		documentIDs = append(documentIDs, doc.ID)
	}
	response["documents"] = documentIDs

	if note.BPictureId != nil {
		response["bPicture"] = *note.BPictureId
	}

	return response
}

type FilterParams struct {
	Keyword string
	Filter  string
	Page    int
	Size    int
}

func parseFilterParams(c echo.Context) FilterParams {
	page, err := strconv.Atoi(c.QueryParam("page"))
	if err != nil || page < 1 {
		page = DefaultPage
	}

	size, err := strconv.Atoi(c.QueryParam("size"))
	if err != nil || size < 1 {
		size = DefaultPageSize
	}

	return FilterParams{
		Keyword: c.QueryParam("keyword"),
		Filter:  c.QueryParam("filter"),
		Page:    page,
		Size:    size,
	}
}

func buildFilterQuery(params FilterParams) *gorm.DB {
	query := DB.Preload("Documents")

	if params.Keyword == "" {
		return query
	}

	var conditions []string
	var args []interface{}

	if params.Filter != "" {
		fields := strings.Split(params.Filter, ",")
		for _, field := range fields {
			field = strings.TrimSpace(field)
			if isValidSearchField(field) {
				conditions = append(conditions, field+" LIKE ?")
				args = append(args, "%"+params.Keyword+"%")
			}
		}
	} else {
		// Search in all relevant fields
		searchFields := []string{"title", "mood", "tag", "content"}
		for _, field := range searchFields {
			conditions = append(conditions, field+" LIKE ?")
			args = append(args, "%"+params.Keyword+"%")
		}
	}

	if len(conditions) > 0 {
		query = query.Where(strings.Join(conditions, " OR "), args...)
	}

	return query
}

func isValidSearchField(field string) bool {
	validFields := map[string]bool{
		"title":   true,
		"mood":    true,
		"tag":     true,
		"content": true,
	}
	return validFields[field]
}

func buildNotesResponse(notes []models.Note) []map[string]interface{} {
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
	return noteResponses
}

func buildPaginatedResponse(page, size int, totalRecords int64, notes []map[string]interface{}) map[string]interface{} {
	return map[string]interface{}{
		"page":         page,
		"size":         size,
		"totalRecords": totalRecords,
		"notes":        notes,
	}
}

func deleteNoteDocuments(documents []models.Document) error {
	for _, doc := range documents {
		if err := DB.Delete(&doc).Error; err != nil {
			log.Printf("Failed to delete document: %v", err)
			return fmt.Errorf("failed to delete documents: %w", err)
		}
	}
	return nil
}

func handleDBError(c echo.Context, err error, notFoundMsg, internalMsg string) error {
	if err == gorm.ErrRecordNotFound {
		return c.JSON(http.StatusNotFound, map[string]string{"error": notFoundMsg})
	}
	return c.JSON(http.StatusInternalServerError, map[string]string{"error": internalMsg})
}

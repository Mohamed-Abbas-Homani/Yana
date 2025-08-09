package handlers

import (
	"net/http"

	"yana-back/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// GET /config/:key
func GetConfigByKeyHandler(c echo.Context) error {
	key := c.Param("key")

	var cfg models.Config
	if err := DB.First(&cfg, "id = ?", key).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, echo.Map{"error": "config not found"})
		}
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, cfg)
}

// POST /config
func CreateConfigHandler(c echo.Context) error {
	var payload struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	}

	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	if payload.Key == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "key is required"})
	}

	var cfg models.Config
	err := DB.First(&cfg, "id = ?", payload.Key).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create new config
			cfg = models.Config{
				ID:    payload.Key,
				Value: payload.Value,
			}
			if err := DB.Create(&cfg).Error; err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
			}
			return c.JSON(http.StatusCreated, cfg)
		}
		// Other DB error
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	// Update existing config
	cfg.Value = payload.Value
	if err := DB.Save(&cfg).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, cfg)
}

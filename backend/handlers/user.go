package handlers

import (
	"fmt"
	"io"
	"log"
	"mash-notes-back/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SaveUserHandler(c echo.Context) error {
	// Parse form values for user details
	name := c.FormValue("name")
	nickName := c.FormValue("nick_name")
	language := c.FormValue("language")
	password := c.FormValue("password")
	hint := c.FormValue("hint")

	// Parse profile picture from form file
	profilePicFile, err := c.FormFile("profile_picture")
	var profilePicData []byte
	if err == nil && profilePicFile != nil {
		file, err := profilePicFile.Open()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to open profile picture file",
			})
		}
		defer file.Close()

		// Read the file data into a byte slice
		profilePicData, err = io.ReadAll(file)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to read profile picture data",
			})
		}
	}

	// Check if we are updating an existing user
	userIDStr := c.FormValue("id")
	var user models.User
	if userIDStr != "" {
		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid user ID",
			})
		}

		// Find the user by ID
		err = DB.First(&user, userID).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.JSON(http.StatusNotFound, map[string]string{
					"error": "User not found",
				})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to fetch user",
			})
		}
	} else {
		// Create a new user if no ID is provided
		user = models.User{}
	}

	// Update the user details
	user.Name = name
	user.NickName = nickName
	user.Language = language
	user.Hint = hint

	// Hash the password if it's provided
	if password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to hash password",
			})
		}
		user.Password = string(hashedPassword)
	}

	if len(profilePicData) > 0 {
		user.ProfilePicture = profilePicData // Set profile picture if provided
	}

	// Save the user (insert or update)
	if err := DB.Save(&user).Error; err != nil {
		log.Printf("Failed to save user: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to save user",
		})
	}

	// Return the created or updated user
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("User %s saved successfully", user.Name),
		"user":    user, // Return the user object
	})
}

// GetUserByIDHandler retrieves a user by their ID.
func GetUserByIDHandler(c echo.Context) error {
	// Get the user ID from the request parameters
	userID := c.Param("id")

	// Variable to hold the user
	var user models.User

	// Find the user by ID, include profile picture as part of the query
	if err := DB.First(&user, "id = ?", userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "User not found",
			})
		}
		log.Printf("Error retrieving user: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to retrieve user",
		})
	}

	// Return the user details as a response
	return c.JSON(http.StatusOK, user)
}

func GetUserProfilePictureHandler(c echo.Context) error {
	// Get the user ID from the request parameters
	userID := c.Param("id")

	// Variable to hold the user
	var user models.User

	// Find the user by ID, we only need the profile picture (document)
	if err := DB.Select("profile_picture").First(&user, "id = ?", userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "User not found",
			})
		}
		log.Printf("Error retrieving user profile picture: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to retrieve profile document",
		})
	}

	// Check if the user has uploaded a document
	if len(user.ProfilePicture) == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "No profile document found for the user",
		})
	}

	// Send the document as a binary response without specifying MIME type
	return c.Blob(http.StatusOK, "", user.ProfilePicture)
}
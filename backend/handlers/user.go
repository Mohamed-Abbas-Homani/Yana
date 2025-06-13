package handlers

import (
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"yana-back/models"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const (
	NotificationMusicPath = "music/notification.mp3"
)

// mediaPlayers defines available media players with their configurations
var mediaPlayers = []MediaPlayer{
	{"mpv", []string{"--no-terminal", "--quiet"}},
	{"vlc", []string{"--intf", "dummy", "--play-and-exit"}},
	{"cvlc", []string{"--intf", "dummy", "--play-and-exit"}},
	{"ffplay", []string{"-nodisp", "-autoexit"}},
	{"play", []string{}},
	{"aplay", []string{}},
	{"mplayer", []string{"-really-quiet"}},
	{"totem", []string{"--play"}},
	{"rhythmbox", []string{"--play-uri"}},
	{"gnome-mplayer", []string{}},
	{"audacious", []string{}},
	{"qmmp", []string{}},
	{"xdg-open", []string{}},
}

type MediaPlayer struct {
	Name string
	Args []string
}

// SaveUserHandler handles creation or update of a User, including profile picture
func SaveUserHandler(c echo.Context) error {
	user, err := findOrCreateUser(c)
	if err != nil {
		return err
	}

	if err := updateUserFields(&user, c); err != nil {
		return err
	}

	if err := handleProfilePicture(&user, c); err != nil {
		return err
	}

	if err := saveUser(&user); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("User %s saved successfully", user.Name),
		"user":    user,
	})
}

// GetUserByIDHandler retrieves a user by their ID
func GetUserByIDHandler(c echo.Context) error {
	userID := c.Param("id")

	var user models.User
	if err := DB.First(&user, "id = ?", userID).Error; err != nil {
		return handleDBError(c, err, "User not found", "Failed to retrieve user")
	}

	return c.JSON(http.StatusOK, user)
}

// GetUserProfilePictureHandler retrieves and serves a user's profile picture
func GetUserProfilePictureHandler(c echo.Context) error {
	userID := c.Param("id")

	var user models.User
	if err := DB.Select("profile_picture").First(&user, "id = ?", userID).Error; err != nil {
		return handleDBError(c, err, "User not found", "Failed to retrieve profile document")
	}

	if len(user.ProfilePicture) == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "No profile document found for the user",
		})
	}

	return c.Blob(http.StatusOK, "", user.ProfilePicture)
}

// PlayPomodoroHandler plays the pomodoro notification sound
func PlayPomodoroHandler(c echo.Context) error {
	exeDir, err := getExecutableDir()
	if err != nil {
		log.Printf("Failed to determine executable directory: %v", err)
		return c.String(http.StatusInternalServerError, "Failed to determine executable directory")
	}

	mp3Path := filepath.Join(exeDir, NotificationMusicPath)
	if err := validateMusicFile(mp3Path); err != nil {
		log.Printf("Music file validation failed: %v", err)
		return c.String(http.StatusNotFound, "Music file not found")
	}

	playMP3Async(mp3Path)
	return c.String(http.StatusOK, "Playback started")
}

// Helper functions

func findOrCreateUser(c echo.Context) (models.User, error) {
	userIDStr := c.FormValue("id")
	if userIDStr == "" {
		return models.User{}, nil
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return models.User{}, c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid user ID",
		})
	}

	var user models.User
	if err := DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.User{}, c.JSON(http.StatusNotFound, map[string]string{
				"error": "User not found",
			})
		}
		return models.User{}, c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to fetch user",
		})
	}

	return user, nil
}

func updateUserFields(user *models.User, c echo.Context) error {
	user.Name = c.FormValue("name")
	user.NickName = c.FormValue("nick_name")
	user.Language = c.FormValue("language")
	user.Hint = c.FormValue("hint")

	password := c.FormValue("password")
	if password != "" {
		hashedPassword, err := hashPassword(password)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to hash password",
			})
		}
		user.Password = hashedPassword
	}

	return nil
}

func handleProfilePicture(user *models.User, c echo.Context) error {
	profilePicFile, err := c.FormFile("profile_picture")
	if err != nil || profilePicFile == nil {
		return nil // No profile picture provided
	}

	profilePicData, err := readFileData(profilePicFile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to process profile picture",
		})
	}

	user.ProfilePicture = profilePicData
	return nil
}

func readFileData(fileHeader *multipart.FileHeader) ([]byte, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file data: %w", err)
	}

	return data, nil
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedPassword), nil
}

func saveUser(user *models.User) error {
	if err := DB.Save(user).Error; err != nil {
		log.Printf("Failed to save user: %v", err)
		return fmt.Errorf("failed to save user: %w", err)
	}
	return nil
}

func getExecutableDir() (string, error) {
	exePath, err := os.Executable()
	if err != nil {
		return "", fmt.Errorf("failed to get executable path: %w", err)
	}
	return filepath.Dir(exePath), nil
}

func validateMusicFile(filePath string) error {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return fmt.Errorf("music file does not exist: %s", filePath)
	}
	return nil
}

func playMP3Async(filePath string) {
	go func() {
		player, args := findAvailableMediaPlayer()
		if player == "" {
			log.Println("No suitable media player found")
			return
		}

		if err := executeMediaPlayer(player, args, filePath); err != nil {
			log.Printf("Failed to play audio: %v", err)
		}
	}()
}

func findAvailableMediaPlayer() (string, []string) {
	for _, mp := range mediaPlayers {
		if path, err := exec.LookPath(mp.Name); err == nil {
			log.Printf("Using media player: %s", mp.Name)
			return path, mp.Args
		}
	}
	return "", nil
}

func executeMediaPlayer(playerPath string, args []string, filePath string) error {
	// Special handling for rhythmbox which needs file:// prefix
	if filepath.Base(playerPath) == "rhythmbox" {
		args = append(args, "file://"+filePath)
	} else {
		args = append(args, filePath)
	}

	cmd := exec.Command(playerPath, args...)

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start media player: %w", err)
	}

	if err := cmd.Wait(); err != nil {
		return fmt.Errorf("media player exited with error: %w", err)
	}

	return nil
}

package models

import (
	"gorm.io/gorm"

	"time"
)

// User model represents the user table
type User struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Name           string    `gorm:"type:text" json:"name"`
	NickName       string    `gorm:"type:text" json:"nickName"`
	Language       string    `gorm:"type:text" json:"language"`
	Password       string    `gorm:"type:text" json:"password"`
	Hint           string    `gorm:"type:text" json:"hint"`
	ProfilePicture []byte    `gorm:"type:blob" json:"profilePicture"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}


// BeforeUpdate GORM hook to update the UpdatedAt field
func (u *User) BeforeUpdate(tx *gorm.DB) (err error) {
	u.UpdatedAt = time.Now() // Set UpdatedAt to current time before update
	return nil
}

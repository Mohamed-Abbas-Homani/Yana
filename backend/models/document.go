package models

import (
	"time"
)

type Document struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserId     uint      `gorm:"not null" json:"user_id"`
	User       User      `gorm:"foreignKey:UserId;references:ID"`
	NoteId     uint      `gorm:"not null" json:"noteId"`
	Note       Note      `gorm:"foreignKey:NoteId;references:ID"`
	Data       []byte    `gorm:"type:blob" json:"data"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

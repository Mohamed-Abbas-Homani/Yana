package models

import (
	"gorm.io/gorm"

	"time"
)

type Note struct {
	ID         uint      `gorm:"primaryKey" form:"id"`
	UserId     uint      `gorm:"not null" form:"user_id"`
	User       User      `gorm:"foreignKey:UserId;references:ID"`
	Content    string    `gorm:"type:text" form:"content"`
	Title      string    `gorm:"type:text" form:"title"`
	Password   string    `gorm:"type:text" form:"password"`
	Tag        string    `gorm:"type:text" form:"tag"`
	Mood       string    `gorm:"type:text" form:"mood"`
	FColor     string    `gorm:"type:text" form:"fColor"`
	BColor     string    `gorm:"type:text" form:"bColor"`
	BPicture   *Document `gorm:"foreignKey:BPictureId"`
	BPictureId *uint     `form:"bpicture_id"`
	Documents  []Document
	CreatedAt  time.Time `gorm:"autoCreateTime" form:"createdAt"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" form:"updatedAt"`
}

func (n *Note) BeforeUpdate(tx *gorm.DB) (err error) {
	n.UpdatedAt = time.Now()
	return nil
}

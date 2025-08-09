package models

type Config struct {
	ID    string `gorm:"primaryKey" json:"id"`
	Value string `gorm:"type:text" json:"value"`
}

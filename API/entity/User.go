package entity

import (
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type User struct {
	ID       uint   `gorm:"primary_key"`
	Name     string `gorm:"size:128"`
	Email    string
	Password string
}

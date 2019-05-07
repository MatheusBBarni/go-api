package entity

import (
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type Cliente struct {
	ID             uint `gorm:"primary_key"`
	Name           string
	Idade          int64
	DataNascimento string
}

package entity

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB
var err error

type Produto struct {
	ID        uint   `gorm:"primary_key"`
	Name      string `gorm:"size:128" json: "nome"`
	Descricao string `gorm:"size:256" json: "descricao"`
}

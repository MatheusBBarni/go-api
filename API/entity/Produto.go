package entity

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB
var err error

type Produto struct {
	ID        uint   `gorm:"primary_key"`
	Name      string `gorm:"size:128"`
	Descricao string `gorm:"size:256"`
}

func InitialMigrationProduto() {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Println(err.Error())
		panic("Failed to connect")
	}
	defer db.Close()

	db.AutoMigrate(&Produto{})
}

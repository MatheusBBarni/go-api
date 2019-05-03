package entity

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type Cliente struct {
	ID    uint `gorm:"primary_key"`
	Name  string
	Idade int64
}

func InitialMigrationCliente() {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Println(err.Error())
		panic("Failed to connect")
	}
	defer db.Close()

	db.AutoMigrate(&Cliente{})
}

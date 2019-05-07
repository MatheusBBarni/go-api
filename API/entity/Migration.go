package entity

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

func InitialMigration() {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Println(err.Error())
		panic("Failed to connect")
	}
	defer db.Close()

	db.AutoMigrate(&Cliente{}, &Produto{}, &User{})
}

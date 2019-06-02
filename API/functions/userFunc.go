package functions

import (
	"encoding/json"
	"fmt"
	"go-api/entity"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)


func AllUserRes(w http.ResponseWriter, r *http.Request) {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}

	defer db.Close()

	var users []entity.User
	db.Find(&users)
	json.NewEncoder(w).Encode(users)
}

func NewUser(w http.ResponseWriter, r *http.Request) {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}
	defer db.Close()

	vars := mux.Vars(r)
	name := vars["name"]
	email := vars["email"]

	db.Create(&entity.User{Name: name, Email: email})
	fmt.Fprintf(w, "foi")
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}
	defer db.Close()

	vars := mux.Vars(r)
	name := vars["name"]

	var user entity.User
	db.Where("name = ?", name).Find(&user)
	db.Delete(&user)

	fmt.Fprintf(w, "foi")
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}
	defer db.Close()

	vars := mux.Vars(r)
	id := vars["id"]
	name := vars["name"]
	email := vars["email"]

	var user entity.User
	db.Where("id = ?", id).Find(&user)

	user.Name = name
	user.Email = email

	db.Save(&user)
	fmt.Fprintf(w, "Foi")
}

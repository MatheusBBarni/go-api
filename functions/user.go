package functions

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB
var err error

/*MODEL*/
type User struct {
	ID    uint   `gorm:"primary_key"`
	Name  string `gorm:"size:128"`
	Email string
}

type Produto struct {
	ID        uint   `gorm:"primary_key"`
	Name      string `gorm:"size:128"`
	Descricao string `gorm:"size:256"`
}

/*FUNCTIONS*/
func ConnDb() {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}
	defer db.Close()
}

func InitialMigration() {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Println(err.Error())
		panic("Failed to connect")
	}
	defer db.Close()

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Produto{})
}

func AllUserRes(w http.ResponseWriter, r *http.Request) {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}

	defer db.Close()

	var users []User
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

	db.Create(&User{Name: name, Email: email})
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

	var user User
	db.Where("name = ?", name).Find(&user)
	db.Delete(&user)

	fmt.Fprintf(w, "foi")
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	ConnDb()

	vars := mux.Vars(r)
	id := vars["id"]
	name := vars["name"]
	email := vars["email"]

	var user User
	db.Where("id = ?", id).Find(&user)

	user.Name = name
	user.Email = email

	db.Save(&user)
	fmt.Fprintf(w, "Foi")
}

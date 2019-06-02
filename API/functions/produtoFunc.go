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

var db *gorm.DB
var err error

func FindAll(w http.ResponseWriter, r *http.Request) {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}

	defer db.Close()

	var produto []entity.Produto
	db.Find(&produto)
	json.NewEncoder(w).Encode(produto)
}

func SaveOrUpdate(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	produto := entity.Produto{}

	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}

	defer db.Close()

	if err := decoder.Decode(&produto); err != nil {
		fmt.Fprintf(w, "erro")
		return
	}
	defer r.Body.Close()

	if err := db.Save(&produto).Error; err != nil {
		fmt.Fprintf(w, "salvou")
		return
	}
	fmt.Fprintf(w, "Produto salvo")

}

func DeleteProduto(w http.ResponseWriter, r *http.Request) {
	db, err = gorm.Open("mysql", "root:root@/goorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("nao foi")
	}
	defer db.Close()

	vars := mux.Vars(r)
	idProduto := vars["id"]

	var produto entity.Produto
	db.Where("id = ?", idProduto).Find(&produto)
	db.Delete(&produto)

	fmt.Fprintf(w, "Produto deletado")
}

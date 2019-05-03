package main

import (
	"fmt"
	"go-api/entity"
	"go-api/functions"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func helloWorld(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello world")
}

func handleRequest() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/", helloWorld).Methods("GET")
	r.HandleFunc("/users", functions.AllUserRes).Methods("GET")
	r.HandleFunc("/user/{name}/{email}", functions.NewUser).Methods("POST")
	r.HandleFunc("/user/{name}", functions.DeleteUser).Methods("DELETE")
	r.HandleFunc("/user/{id}/{name}/{email}", functions.UpdateUser).Methods("PUT")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func main() {
	fmt.Println("GO ORM")

	entity.InitialMigrationProduto()
	entity.InitialMigrationUser()
	entity.InitialMigrationCliente()

	handleRequest()
}

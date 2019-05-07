package routes

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"go-api/functions"
)

func HandleRequest() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/Users", functions.AllUserRes).Methods("GET")
	r.HandleFunc("/User/{name}/{email}", functions.NewUser).Methods("POST")
	r.HandleFunc("/User/{name}", functions.DeleteUser).Methods("DELETE")
	r.HandleFunc("/User/{id}/{name}/{email}", functions.UpdateUser).Methods("PUT")
	log.Fatal(http.ListenAndServe(":8080", r))
}

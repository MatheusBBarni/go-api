package routes

import (
	"go-api/functions"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func StaticFileServer(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./webapp/admin.html")
}

func HandleRequest() {
	r := mux.NewRouter().StrictSlash(true)
	//Users
	r.HandleFunc("/Users", functions.AllUserRes).Methods("GET")
	r.HandleFunc("/User/{name}/{email}", functions.NewUser).Methods("POST")
	r.HandleFunc("/User/{name}", functions.DeleteUser).Methods("DELETE")
	r.HandleFunc("/User/{id}/{name}/{email}", functions.UpdateUser).Methods("PUT")

	//Produto
	r.HandleFunc("/Produtos", functions.FindAll).Methods("GET")
	r.HandleFunc("/Produtos", functions.SaveOrUpdate).Methods("POST")
	r.HandleFunc("/Produtos/{id}", functions.DeleteProduto).Methods("DELETE")

	r.PathPrefix("/").HandlerFunc(StaticFileServer)
	r.Handle("/dist/", http.StripPrefix("/dist", http.FileServer(http.Dir("./dist"))))
	r.Handle("/app/", http.StripPrefix("/app", http.FileServer(http.Dir("./app"))))
	r.Handle("/ts/", http.StripPrefix("/ts", http.FileServer(http.Dir("./ts"))))
	r.Handle("/css/", http.StripPrefix("/css", http.FileServer(http.Dir("./css"))))

	log.Fatal(http.ListenAndServe(":8080", r))
}

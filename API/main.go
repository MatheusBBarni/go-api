package main

import (
	"fmt"
	"go-api/entity"
	"go-api/routes"
)

func main() {
	fmt.Println("SERVER STARTED")

	entity.InitialMigration()

	routes.HandleRequest()
}

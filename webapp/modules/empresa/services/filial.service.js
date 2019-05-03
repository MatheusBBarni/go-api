app.service('FilialService', function($http) {

	this.webService = "WS/Filial"; 
	
	this.findAll = function (){
		return $http.get(this.webService);	
	}	
	
	
});
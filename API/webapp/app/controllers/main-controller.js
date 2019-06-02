/*
* Controller
*/
app.controller('MainCtrl',function($scope, $location, $window, $rootScope){	
	
	$rootScope.atualizarNomeTela = function (nome) {
		$rootScope.titulo = nome;
	}
	$rootScope.atualizarNomeTela('Home')	

});
/*
* Controller
*/
app.controller('MainCtrl',function($scope, $location, $window, $rootScope){
	$scope.usuarioLogado = {};
	$scope.tipoImpressos = [];
	
	
    $rootScope.atualizarNomeTela = function (nome) {
    	$rootScope.titulo = nome;
    }
    $rootScope.atualizarNomeTela('Home')	
	
	$.get("WS/Usuario/UsuarioLogado", function(data){
		if(data){
			$scope.usuarioLogado = data;
			if(!$scope.usuarioLogado.imagem){
				$scope.srcImagemUsuario = "dist/img/user-avatar.png"
			}else{
				$scope.srcImagemUsuario = "data:image/png;base64," + $scope.usuarioLogado.imagem	
			}
			$scope.$apply()
		}
	});
	  
	$scope.carregarMenuCategorias = function(){
		$.get("WS/Categoria", function(data){
			if(data){
				$scope.tipoImpressos = data;
				$scope.$apply();
			}
		});
	}
	$scope.carregarMenuCategorias();
	
	$scope.chamarTipoMaterial = function(id){
		$window.location.href = "#!materiais/tipo/" + id;
	}
	
});
/**
 * Controller das regras de negócio do usuário 
 */

app.controller('ConfiguracaoCtrl', function($scope, $http)
{
	$scope.WebService = "WS/Configuracao/";
	$scope.registro = {};
	
	   //Inicialização tabela estados e cidades
   	$scope.cidades = []
	$http.get("WS/Cidade/Open").then(function(response){
		if(response.data){
			$scope.cidades = response.data
		}
	})
	  	
	
	$.get($scope.WebService, function(data){
		if(data){
			$scope.registro = data;
		}
		$('html').removeClass('loading');
		$scope.$apply();
	});
	
	$scope.salvar = function (){

		$.ajax({
		    url: $scope.WebService,
		    type: 'POST',
		    headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
		    dataType: 'json',
		    data: JSON.stringify($scope.registro),
		    success: function(data) {		    	
				$scope.$apply();
				toastr.success('Configurações salvas com sucesso.')
		    }
		});
	}
	
});


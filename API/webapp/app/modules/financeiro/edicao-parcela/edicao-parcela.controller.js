app.controller('EdicaoParcelaCtrl', function($scope, $rootScope)
{
	$scope.WebService = "WS/Parcela/";
	
	$scope.InicializarObjeto = function(){
		$scope.registro = {
				tipoOperacao: 'E',
				dataEmissao : new Date(),
				primeiroVencimento: new Date(),
				valorLiquido : 0,
				valorBruto: 0,
				valorDesconto: 0,
				categoriasCobranca: []
		};
	}
	$scope.InicializarObjeto();	
	

	$scope.salvar = function (){
		
		if (isValidForm($scope.formCadastro) == false) {
			return;
		}		
		
		Pace.track(function(){
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
			    	$scope.InicializarObjeto();
					$scope.$apply();
					$('#modal_edicao_parcela').modal('hide');
					$rootScope.$emit('parcela-editada-event', data);
			    }
			});
		});
	}
	
	$rootScope.$on('editar-parcela-event', function(event, idParcela, idCobranca) {
		$scope.editar(idParcela, idCobranca)			
	});	

	$scope.editar = function (idParcela, idCobranca){		
		$.get($scope.WebService + idParcela, function(data){
			if(data){
				inicializeForm($scope.formCadastro)
				$scope.registro = data;
				$scope.registro.cobranca = {id:idCobranca};
				$scope.$apply();
			}
		}).done(function(){
			$('#modal_edicao_parcela').modal('show');
		});
	}	
	
	
});

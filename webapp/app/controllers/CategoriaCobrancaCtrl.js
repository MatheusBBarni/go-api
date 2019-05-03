app.controller('CategoriaCobrancaCtrl', function($scope)
{
	$scope.WebService = "WS/CategoriaCobranca/";

	$scope.InicializarObjeto = function(){
		$scope.registro = {};
	}
	$scope.InicializarObjeto();
	
	$scope.atualizarTabelaPrincipal = function (){		
		$.get($scope.WebService, function(data){
			if(data){
				$scope.listagem = data;			
				$scope.$apply();
			}
		}).done(function(){
			$('#tabela-principal').bootstrapTable("destroy");
			$('#tabela-principal').bootstrapTable({data: $scope.listagem});
		});
	}
	$scope.atualizarTabelaPrincipal();
		
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
		    	$scope.InicializarObjeto();
				$scope.$apply();
				$scope.atualizarTabelaPrincipal()
				$('#modal_edicao').modal('hide');
		    }
		});
	}
	
	$scope.buscarPlanoDeContas = function (){
		$scope.planosDeConta = []
		$.get("WS/PlanoConta", function(data){
			if(data){
				$scope.planosDeConta = data;			
				$scope.$apply();
			}
		})
	}	
	$scope.buscarPlanoDeContas()
	
	$scope.editar = function (pValue){		
		$.get($scope.WebService + pValue, function(data){
			if(data){
				$scope.registro = data;			
				$scope.$apply();
			}
		}).done(function(){
			$('#modal_edicao').modal('show');
		});
	}	
	
	$scope.excluir = function (pValue){
		$.ajax({
		    url: $scope.WebService + pValue,
		    type: 'DELETE',
		    success: function(data) {		    	
				$scope.registro = {};
				$scope.atualizarTabelaPrincipal()				
		    }
		});
	}	
	
	$scope.incluir = function (){
		$scope.InicializarObjeto();
		$('#modal_edicao').modal('show');
	}
	
});


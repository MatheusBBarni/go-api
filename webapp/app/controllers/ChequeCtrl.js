app.controller('ChequeCtrl', function($scope,FilialService)
{
	$scope.WebService = "WS/Cheque/";
	
	$scope.InicializarObjeto = function(){
		$scope.registro = {
				dataEntrada : new Date(),
				dataCompensacao : new Date()
			};
	}
	
	$scope.InicializarObjeto();
	
	$scope.InicializarFiltro = function () {
		$scope.filtro = {}
	}
	$scope.InicializarFiltro()	
	
	
	$scope.renderizarTabelaPrincipal = function (data){
		$('#tabela-principal').bootstrapTable("destroy");
		$('#tabela-principal').bootstrapTable({data: data});
	}
	
	$scope.atualizarTabelaPrincipal = function (){	
		
		$.ajax({
		    url: $scope.WebService + "Filtrar",
		    type: 'POST',
		    headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
		    dataType: 'json',
		    data: JSON.stringify($scope.filtro),
		    success: function(data) {		    	
				$scope.listagem = data;			
				$scope.$apply();
		    }
		}).done(function () {
			$scope.renderizarTabelaPrincipal($scope.listagem)
		});		
	
	}
	$scope.atualizarTabelaPrincipal();
	
	$scope.buscarClientes = function (){
		$scope.clientes = [];
		$.get("WS/Cliente", function(data){
			if(data){
				$scope.clientes = data;			
				$scope.$apply();
			}
		})
	}	
	$scope.buscarClientes()	
	
	
	$scope.buscarFiliais = function () {
		$scope.filiais = [];
		FilialService.findAll().then(function(response){
			if(response.data){
				$scope.filiais = response.data;
			}
		});		
	}
	$scope.buscarFiliais();
	
	
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


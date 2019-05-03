
app.controller('MaquinaCtrl', function($scope, $http)
{
	$scope.WebService = "WS/Maquina/";
	$scope.inicializarObjeto = function () {
		$scope.registro = { situacao: 'A'};	
	}
	
	$scope.atualizarTabelaPrincipal = function () {
		$http.get($scope.WebService).then(function (response) {
			if ( response.data ) {
				$('#tabela-principal').bootstrapTable('destroy');
				$('#tabela-principal').bootstrapTable({data: response.data});
			} else {
				$('#tabela-principal').bootstrapTable('destroy');
				$('#tabela-principal').bootstrapTable({data: []});
			}
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
				$('#modal_edicao').modal('hide');
				$scope.atualizarTabelaPrincipal();
		    }
		});
	}
	
	$scope.editar = function (pValue){		
		$.get($scope.WebService + pValue, function(data){
			if(data){
				$scope.registro = data;
				$scope.$apply();
				$('#modal_edicao').modal('show');
			}
		})
	}	
	
	$scope.excluir = function (pValue){
		
		$.confirm({
		    title: 'Atenção!',
		    content: 'Você tem certeza que deseja excluir o item?',
		    theme: 'material',
		    type: 'red',
		    buttons: {
		    	  confirmar: {
		              text: 'Deletar',
		              btnClass: 'btn-red',
		              keys: ['enter',],
		              action: function(){
		            	  $.ajax({
		          		    url: $scope.WebService + pValue,
		          		    type: 'DELETE',
		          		    success: function(data) {		    	
		          				$scope.registro = {};
		          				$scope.atualizarTabelaPrincipal();				
		          		    }
		          		});
		              }
		          },
		        cancel: function () {
		        }
		    }
		});
		
		
	}	
	
	$scope.incluir = function (){
		$scope.inicializarObjeto();
		$('#modal_edicao').modal('show');
	}
	
});

function acertarTipoEndereco(pValue){
	if(pValue === 'F'){
		return "Faturamento";
	}
	if(pValue === 'C'){
		return "Cobrança";
	}
	if(pValue === 'E'){
		return "Entrega";
	}
}


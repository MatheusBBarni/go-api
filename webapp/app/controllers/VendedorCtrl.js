/**
 * Controller das regras de negócio do usuário 
 */

app.controller('VendedorCtrl', ['$scope', '$routeParams', 'tipoVendedor', '$rootScope', function($scope, $routeParams, tipoVendedor, $rootScope)
{
	$scope.WebService = "WS/Vendedor/";
	
	$scope.registro = { enderecos: [], situacao: "A"};
	$scope.endereco = {tipo:"E"};
	
	if ( tipoVendedor == 'V' ){
		$rootScope.atualizarNomeTela('Vendedor');
	}else{
		$rootScope.atualizarNomeTela('Preposto');
	}
	
	
	$('#tabela-principal').bootstrapTable({
		url: $scope.WebService + "Tipo/" + tipoVendedor
	});
	
	
   	$scope.cidades = []
	$.get("WS/Cidade/Open", function(data){
		if(data){
			$scope.cidades = data
		}
	})
	 
	
	$scope.salvar = function (){
		var data = $scope.registro;
		data.tipoVendedor = tipoVendedor
			
		$.ajax({
		    url: $scope.WebService,
		    type: 'POST',
		    headers: {
		        'Accept': 'application/json',
		        'Content-Type': 'application/json'
		    },
		    dataType: 'json',
		    data: JSON.stringify(data),
		    success: function(data) {		    	
				$scope.registro = {};				
				$scope.$apply();
				$('#modal_edicao').modal('hide');
				$('#tabela-principal').bootstrapTable("refresh");				
		    }
		});
	}
	
	$scope.editar = function (pValue){		
		$.get($scope.WebService + pValue, function(data){
			if(data){
				$scope.registro = data;
				$scope.atualizarTabela()				
				$scope.$apply();
			}
		}).done(function(){
			$('#panel-endereco').removeClass('active');
			$('#tab-enderecos').hide();
			$('#panel-dados').addClass('active');
			$('#tab-dados').show();			
			$('#modal_edicao').modal('show');
		});
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
				    				$('#tabela-principal').bootstrapTable("refresh");				
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
		$scope.registro = {};
		$scope.registro.enderecos = []
		$scope.registro.situacao = "A"
		$scope.atualizarTabela()
		
		$('#panel-endereco').removeClass('active');
		$('#tab-enderecos').hide();
		$('#panel-dados').addClass('active');
		$('#tab-dados').show();
		$('#modal_edicao').modal('show');
	}
	
	
	
	$scope.incluirEndereco = function (){
		$scope.endereco.id = null;
		$scope.registro.enderecos.push($scope.endereco)
		$scope.atualizarTabela()
		$scope.endereco = {tipo:"E"};
		$("#txtEndereco").focus();
	}
	
	$scope.excluirIndex = function (pValue){
		$scope.registro.enderecos.splice(pValue, 1);
		$scope.atualizarTabela()
	}	
	$scope.excluirEndereco = function (pId, pIndex){
		if ( pId > 0 ) {
			$.ajax({
			    url: "WS/Endereco/" + pId,
			    type: 'DELETE',
			    success: function(data) {		
			    	$scope.excluirIndex(pIndex)				
			    }
			});
		} else {
			$scope.excluirIndex(pIndex)
		}
	}		
	$scope.atualizarTabela = function(){
		$('#tabela-endereco-vendedor').bootstrapTable('destroy');
		$('#tabela-endereco-vendedor').bootstrapTable({data: $scope.registro.enderecos});		
	}
	
}]);

function excluirEnderecoFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirEndereco('+row.id+','+index+')" class="span-inativar"><i class="fa fa-trash"></i> Excluir</span>';	
}

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


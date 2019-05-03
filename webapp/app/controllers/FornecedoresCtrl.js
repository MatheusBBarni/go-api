/**
 * Controller das regras de negócio do usuário 
 */

app.controller('FornecedoresCtrl', function($scope, $http)
{
	$scope.WebService = "WS/Fornecedor/";
	$scope.registro = { enderecos: [], situacao: 'A'};
	$scope.endereco = {tipo:"E"};
	
	
   //Inicialização tabela estados e cidades
   	$scope.cidades = []
	$.get("WS/Cidade/Open", function(data){
		if(data){
			$scope.cidades = data
		}
	})
	  

   	$scope.atualizarTabelaPrincipal = function () {
   		$('#tabela-principal').bootstrapTable('destroy');
   		$('#tabela-principal').bootstrapTable();
   		$('#tabela-principal').bootstrapTable('showLoading');
   		$http.get('WS/Fornecedor').then(function (response) {
   			if ( response.data ) {
   				$('#tabela-principal').bootstrapTable('destroy');
   				$('#tabela-principal').bootstrapTable({data : response.data});		
   			}
   			$('#tabela-principal').bootstrapTable('hideLoading');
   		})
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
				$scope.registro = {};				
				$scope.$apply();
				$('#modal_edicao').modal('hide');
				$scope.atualizarTabelaPrincipal();
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
		$scope.registro = {};
		$scope.registro.enderecos = []
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
		            	  
			            	  if(pId > 0){
			            		  $.ajax({
					          		    url: "WS/Endereco/" + pId,
					          		    type: 'DELETE',
					          		    success: function(data) {		
					          		    		$scope.excluirIndex(pIndex)				
					          		    }
					          		});
			            	  }
	          		    	 $scope.excluirIndex(pIndex)				
		            	  
		            	  
		              }
		          },
		        cancel: function () {
		        }
		    }
		});
		
		
	}		
	
	$scope.atualizarTabela = function(){
		$('#tabela-endereco-cliente').bootstrapTable('destroy');
		$('#tabela-endereco-cliente').bootstrapTable({data: $scope.registro.enderecos});		
	}
	
});

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


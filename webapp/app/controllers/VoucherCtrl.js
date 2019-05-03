
app.controller('VoucherCtrl', function($scope, $http)
{
	$scope.WebService = "WS/Voucher/";
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
	$scope.converterArquivo = function(file) {
		   var reader = new FileReader();
		   reader.readAsDataURL(file.files[0]);
			 $scope.registro.arquivo={}
		   reader.onload = function () {
			 var dados = reader.result.split("base64,")
			 $scope.registro.arquivo.bytes = dados[1]
		   };
		   reader.onerror = function (error) {
		     console.log('Error: ', error);
		   };
		}
});


function tipoVoucherFormatter(value, row, index){
	if ( value == 'A' ) return "Aereo";
	if ( value == 'R' ) return "Recibo";
	if ( value == 'H' ) return "Hotel";
	if ( value == 'I' ) return "Ingressos";
	if ( value == 'S' ) return "Seguros";
	if ( value == 'L' ) return "Locação de carros";
	if ( value == 'O' ) return "Outros";
	
	
}


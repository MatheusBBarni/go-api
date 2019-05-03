/*
 * Controller
 */
app.controller('home-controller', function($scope){	
	$( "html" ).removeClass( "loading" );
	$scope.pedidos = [];
	$scope.clientes = [];
	$scope.transportadoras = [];
	$scope.quantidade = 0;

	$.get("WS/Cliente", function(data){
		if(data){
			$scope.clientes = data;
			$scope.$apply();
		}
	});

	$.get("WS/Cliente/Quantidade", function(data){
		if(data){
			$scope.quantidade = data;
			$scope.$apply();
		}
	});

	$.get("WS/ViagemCliente/Embarques", function(data){
		if(data){
			$scope.embarques = data;
			$scope.renderizarTabelaPrincipal(data);
			$scope.$apply();
		}
	});

	$scope.renderizarTabelaPrincipal = function(data) {
		$('#tabela-principal').bootstrapTable('destroy');
		$('#tabela-principal').bootstrapTable({
			data : data
		});
	}   

	$.get("WS/Transportadora", function(data){
		if(data){
			$scope.transportadoras = data;
			$scope.$apply();
		}
	});
	$scope.carregarPedidos = function(){
		$.get("WS/Pedido/Status/S", function(data){
			if(data){
				$scope.pedidos = data;
				$scope.$apply();
			}
		});
	}
	$scope.carregarPedidos();
	$scope.enviarTransporte = function(pValue){
		$scope.pedidoSelecionado = pValue;
		$('#modal_rastreio').modal('show');
	}
	$scope.transportarPedido = function(pValue){

		$.ajax({
			url: "WS/Pedido/Transportar/" + $scope.pedidoSelecionado + "/Rastreio/" + $scope.rastreio,
			type: 'POST',
			success: function(data) {		    	
				$scope.pedidoSelecionado = "";
				$scope.rastreio = "";
				$('#modal_rastreio').modal('hide');	
				$scope.carregarPedidos();
			}
		});
	}
	$scope.editar = function (pValue){		
		$.get("WS/Pedido/" + pValue, function(data){
			if(data){
				$scope.registro = data;		
				$scope.$apply();
				$scope.atualizaTabelaItens();
			}
		}).done(function(){
			$('#modal_edicao').modal('show');

		});
	}	
	$scope.atualizaTabelaItens = function() {
		$('#tabela-itens').bootstrapTable('destroy')
		$('#tabela-itens').bootstrapTable({
			data: $scope.registro.itens
		});			
	}
});
/**
 * Controller das regras de negócio do usuário 
 */

app.controller('PedidoComissaoCtrl', function($scope, FilialService, $http, $filter, $timeout)
{
	$scope.WebService = "WS/Pedido/";
	$scope.posicaoPedido = 'F';
	$scope.pedidos = [];	
	
	
	
	$scope.fornecedores = [];
	$http.get("WS/Fornecedor").then( function(response){
		if(response.data){
			$scope.fornecedores = response.data;
		}
	});		
	
	$scope.atualizarTela = function (){	
		
		if ( $scope.filtro == null ) {
			$scope.filtro = {};
		}
		$scope.filtro.posicaoPedido = $scope.posicaoPedido;
		$scope.filtro.seRevisado = 'N'
		
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
		    	
		    	for (var i = 0; i < data.length; i++) {
					var pedido = data[i];
					if ( ! pedido.dadosCartaoParcelas > 0) {
						pedido.dadosCartaoParcelas = 1;	
					}
				}
		    	
				$scope.pedidos = data;
				$scope.$apply();
		    }
		});			
	}
	
	$scope.salvar = function (){
		
		$http.post($scope.WebService + "/Revisar/Lote", $scope.pedidos).then(function (response){
			$.confirm({
				title: "Alterações efetuadas",
			    content: "Todos os pedidos que sofrerão alteração foram salvos.",
			    theme: 'material',
			    type: 'green',
			    buttons: {
			    	confirmar: {
			    		text: 'OK',
			            btnClass: 'btn-green',
			            keys: ['enter']
			    	},
			    }
			});
			
			$scope.atualizarTela();			
		});
	}
	
	$scope.calcularComissao = function(item){
		if (item.percentualComissaoVendedor > 0 ){
			item.valorComissaoVendedor = item.valorTotal/ 100 * item.percentualComissaoVendedor;
		}
		if ( item.percentualComissaoPreposto > 0 ){
			item.valorComissaoPreposto = item.valorComissaoVendedor/ 100 * item.percentualComissaoPreposto;
		}
	}
	
	$scope.atualizarTela();
});

function descricaoItemFormatter (value, row, index){
    if ( row.produto ) {
    	return row.produto.descricao
    } else {
    	return row.kit.descricao
    }	
}

function posicaoPedidoFormatter (value, row, index){
	if ( value == 'B' ) return "Em aberto";
	if ( value == 'G' ) return "Todos em aberto"; 
	if ( value == 'A' ) return "Aguardando pagamento"; 
	if ( value == 'P' ) return "Em produção";
	if ( value == 'S' ) return "Em separação";
	if ( value == 'U' ) return "Faturado"; 
	if ( value == 'T' ) return "Em transporte"; 
	if ( value == 'C' ) return "Cancelado";
    if ( value == 'F' ) return "Entregue";   	
}

function imprimirFormatter (value, row, index){
    return '<a href="WS/Relatorios/Pedido/DetalhePedido/' + row.id + '" target="_blank"><span class="span-tabela"><i class="fa fa-print"></i> Imprimir</span></a>';	
}

/**
 * Controller das regras de negócio do usuário 
 */

app.controller('PedidoCtrl', function($scope, FilialService, posicaoPedido, $http, $filter, $timeout)
{
	$scope.WebService = "WS/Pedido/";
	$scope.posicaoPedido = posicaoPedido;
	
	$scope.inicializarRegistro = function(){
		
		$scope.registro = {};
		$scope.registro.dataEmissao = new Date().toDateInputValue();
		$scope.registro.dataEntrega = Date.today();
		$scope.registro.posicaoPedido = 'B';
		$scope.registro.numeroPedido = "00000";
		$scope.registro.origemPedido = 'S';
		$scope.registro.valorBruto = "0";
		$scope.registro.PercentualDesconto = '0';
		$scope.registro.valorDesconto = '0';
		$scope.registro.valorTotal = '0';
		$scope.registro.quantidadeItens = '0';
		$scope.registro.seRevisado = 'N';
		$scope.item = { percentualIcms: "0", precoTabela: "0", quantidade:'1'};
		$scope.registro.itens = [];
		
		$scope.variantes = [];
		
		diasParaEntrega = $scope.configuracao.diasEntregaPedido;
		if ( diasParaEntrega > 0 ) {
			$scope.registro.dataEntrega = Date.today().add(diasParaEntrega).days();;
		}
		
	}	
	
	$scope.InicializarFiltro = function () {
		$scope.filtro = {}
	}
	$scope.InicializarFiltro()		
	
	
	$scope.renderizarTabelaPrincipal = function (data){
		$('#tabela-principal').bootstrapTable("destroy");
		$('#tabela-principal').bootstrapTable({data: data});
	}	
	
	$scope.atualizarTabelaPrincipal = function (){	
		
		$scope.filtro.posicaoPedido = posicaoPedido;
		
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
	
	
	$scope.atualizaTabelaItens = function() {
    	$('#tabela-itens').bootstrapTable('destroy')
		$('#tabela-itens').bootstrapTable({
	        data: $scope.registro.itens
	     });			
	}
	
	$scope.buscarMarcas = function(){
		$http.get("WS/Caracteristica/Tipo/M").then(function(response){
			$scope.marcas = response.data;
		})
	}
	$scope.buscarMarcas();
	
	$scope.configuracao = {};
	$.get("WS/Configuracao", function(data){
		if(data){
			$scope.configuracao = data;
			$scope.$apply();
		}
	});	

	$scope.enderecos = [];
	$http.get("WS/Endereco").then( function(response){
		if(response.data){
			$scope.enderecos = response.data;
		}
	});	
	
	
	$scope.fornecedores = [];
	$http.get("WS/Fornecedor").then( function(response){
		if(response.data){
			$scope.fornecedores = response.data;
		}
	});		
	
	
	$scope.inicializarRegistro()
	$scope.atualizaTabelaItens();
	
	$scope.filiais = [];
	FilialService.findAll().then(function(response){
		if(response.data){
			$scope.filiais = $filter('orderBy')(response.data, 'nomeFantasia');
		}
	});
	
	$scope.vendedores = [];
	$scope.buscarVendedores = function (){
		$http.get("WS/Vendedor/Tipo/V").then(function(response){
			if ( response.data ) {
				$scope.vendedores = response.data; 
			}
		})
	}
	$scope.buscarVendedores();

	$scope.prepostos = [];
	$scope.buscarPrepostos = function (){
		$http.get("WS/Vendedor/Tipo/P").then(function(response){
			if ( response.data ) {
				$scope.prepostos = response.data; 
			}
		})
	}
	$scope.buscarPrepostos();
	
	
	$scope.clientes = [];
	$.get("WS/Cliente", function(data){
		if(data){
			$scope.clientes = $filter('orderBy')(data, 'nomeFantasia');
			$scope.$apply();
		}
	});
	

	
	$scope.produtos = [];
	$.get("WS/Produto/ItensPedido", function(data){
		if(data){
			$scope.produtos = $filter('orderBy')(data, 'descricao');
			$scope.$apply();
		}
	});
	$scope.kits = [];
	$.get("WS/Kit", function(data){
		if(data){
			$scope.kits = $filter('orderBy')(data, 'nomeFantasia');
			$scope.$apply();
		}
	});
	
	$scope.transportadoras = [];
	$.get("WS/Transportadora", function(data){
		if(data){
			$scope.transportadoras = $filter('orderBy')(data, 'nomeFantasia');
			$scope.$apply();
		}
	});
	
	$scope.formasPagamento = [];
	$.get("WS/FormaPagamento", function(data){
		if(data){
			$scope.formasPagamento = $filter('orderBy')(data, 'descricao');
			$scope.$apply();
		}
	});
	
	
	$scope.salvar = function (){
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
					$scope.registro = {};				
					$scope.$apply();
					
					$('#modal_edicao').modal('hide');
					$scope.atualizarTabelaPrincipal();				
			    }
			});
		});
	}
	
	$scope.editar = function (pValue){
		Pace.track(function(){
			$.get($scope.WebService + pValue, function(data){
				if(data){
					$scope.registro = data;		
					$scope.atualizaTabelaItens();
					$scope.atualizarValoresPedido();
					
					if ($scope.registro.vendedor == null && $scope.vendedores.length == 1){
						$scope.registro.vendedor = $scope.vendedores[0]; 
					}
					
					$scope.$apply();
				}
			}).done(function(){
				$('#modal_edicao').modal('show');
				$scope.ativarDados()
			});
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
		              text: 'Excluir',
		              btnClass: 'btn-red',
		              keys: ['enter',],
		              action: function(){
		            	  Pace.track(function(){
		          			$.ajax({
		          			    url: $scope.WebService + pValue,
		          			    type: 'DELETE',
		          			    success: function(data) {		    	
		          					$scope.registro = {};
		          					$scope.atualizarTabelaPrincipal();			
		          			    }
		          			});
		          		});
		              }
		          },
		        cancel: function () {
		        }
		    }
		});		
		
	}
	
	$scope.excluirItem = function (pId, pIndex){
		$scope.registro.itens.splice(pIndex, 1);
    	$scope.atualizaTabelaItens();
    	$scope.atualizarValoresPedido();
    	$scope.$apply();
	}
	
	$scope.incluir = function (){
		$scope.inicializarRegistro();
		$scope.atualizaTabelaItens();
		if ( posicaoPedido != '' ) {
			$scope.registro.posicaoPedido = posicaoPedido;	
		}
		if ($scope.vendedores.length == 1){
			$scope.registro.vendedor = $scope.vendedores[0]; 
		}
		$('#modal_edicao').modal('show');
		$scope.ativarDados()
	}
	
	$scope.buscarVariantes = function(){
		$http.get("WS/Produto/" + $scope.item.produto.id +'/CaracteristicasVariaveis/C').then(function(response){
			$scope.variantes = response.data;
		})
	}
	

	
	$scope.changeProduto = function () {
		$scope.item.precoTabela = $scope.item.produto.precoUnitario;
		$scope.variantes = [];
		$scope.buscarVariantes();
		$scope.buscarMarcas();
	}
	
	$scope.cancelar = function(pValue){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebService + "Cancelar/" + pValue,
			    type: 'POST',
			    success: function(data) {		    	
					$scope.registro = {};
					$scope.atualizarTabelaPrincipal();				
			    }
			});
		});
	}
	
	$scope.produzirPedido = function(pValue){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebService + "Produzir/" + pValue,
			    type: 'POST',
			    success: function(data) {		    	
					$scope.registro = {};
					$scope.atualizarTabelaPrincipal();				
			    }
			});
		});
	}

	$scope.separarPedido = function(pValue){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebService + "Separar/" + pValue,
			    type: 'POST',
			    success: function(data) {		    	
					$scope.registro = {};
					$scope.atualizarTabelaPrincipal();				
			    }
			});
		});
	}	
	
	$scope.faturarPedido = function (pValue){
				
		$http.get($scope.WebService + pValue).then( function(response){
			if(response.data){
				
				itens = [];
				if ( response.data.itens != null ) {
					for (var i = 0; i < response.data.itens.length; i++) {
						var itemPedido = response.data.itens[i];
						if ( itemPedido.quantidadeFaturada < itemPedido.quantidade ) {
							itemPedido.quantidadeFaturamento = itemPedido.quantidade - itemPedido.quantidadeFaturada; 
							itens.push(itemPedido)
						}
					}				
				}
				
				$scope.faturamento = {
					pedidoId: pValue, 
					dataHoraEmissao : new Date(), 
					cliente: response.data.cliente, 
					itens: itens,
					fornecedor: response.data.fornecedor,
					clienteFaturamento: response.data.cliente,
					enderecoEntrega: response.data.enderecoEntrega
				}
				$scope.atualizaTabelaItensNota();
				$('#modal_faturamento').modal('show');
			}
		})
	}
	
	$scope.concluirFaturamento = function(){

		itens =  $filter('filter')($scope.faturamento.itens, {seMarcado : true});
		if ( itens.length == 0 ) {
			$.confirm({
				title: "Ops ...",
			    content: "Nenhum item selecionado.",
			    theme: 'material',
			    type: 'red',
			    buttons: {
			    	confirmar: {
			    		text: 'OK',
			            btnClass: 'btn-green',
			            keys: ['enter']
			    	},
			    }
			});	
			return;
		}
		
		if ( ! $scope.faturamento.numero > 0 || ! $scope.faturamento.serie > 0) {
			$.confirm({
				title: "Ops ...",
			    content: "O número e série da nota precisam ser informados.",
			    theme: 'material',
			    type: 'red',
			    buttons: {
			    	confirmar: {
			    		text: 'OK',
			            btnClass: 'btn-green',
			            keys: ['enter']
			    	},
			    }
			});	
			return;
		}
		
		
		
		$scope.faturamento.itens = $scope.converterItensNota(itens);
		
		$scope.faturamento.valorNotaFiscal = 0;
		for (var i = 0; i < $scope.faturamento.itens.length; i++) {
			var item = $scope.faturamento.itens[i];
			$scope.faturamento.valorNotaFiscal += item.valorProduto;
		}
		
		
		$http.post("WS/NotaFiscal/FaturarPedido", $scope.faturamento)
		.then(function(response){
			$scope.atualizarTabelaPrincipal();
			$('#modal_faturamento').modal('hide');
		})
		
	}	
	
	$scope.converterItensNota = function (itensPedido) {
		for (var i = 0; i < itensPedido.length; i++) {
			var itemPedido = itensPedido[i];
			
			itemPedido.itemPedidoId				= itemPedido.id;
			itemPedido.id = null;
			
			itemPedido.codigoProduto 			= itemPedido.produto.id;
			itemPedido.descricaoProduto 		= itemPedido.produto.descricao;
			
			itemPedido.quantidade				= itemPedido.quantidadeFaturamento;
			itemPedido.quantidadeEstoque		= itemPedido.quantidadeFaturamento;
			itemPedido.quantidadeTributada		= itemPedido.quantidadeFaturamento;
			itemPedido.valorUnitario			= itemPedido.precoTabela;
			itemPedido.valorUnitarioEstoque		= itemPedido.precoTabela;
			itemPedido.valorUnitarioTributado   = itemPedido.precoTabela;
			
			itemPedido.valorProduto 			= itemPedido.precoTabela * itemPedido.quantidadeFaturamento;
		
		}
		
		return itensPedido;
	}
		
	
	$scope.atualizaTabelaItensNota = function() {
    	$('#tabela-itens-nota').bootstrapTable('destroy')
		$('#tabela-itens-nota').bootstrapTable({
	        data: $scope.faturamento.itens
	     });			
	}	
	
	$scope.excluirItemNota = function (pIndex){
		$scope.faturamento.itens.splice(pIndex, 1);
    	$scope.atualizaTabelaItensNota();
    	$scope.$apply();
	}	

	$scope.solicitarRastreio = function(pValue){
		$scope.transporte = {idPedido: pValue, dataEntregaTransportadora: new Date(), dataEstimadaEntrega: new Date()}
		$scope.$apply()
		$('#modal_rastreio').modal('show');
	}
	$scope.transportarPedido = function(){
		
		$http.post($scope.WebService + "Transportar/" + $scope.transporte.idPedido, $scope.transporte)
		.then(function(response){
			$('#modal_rastreio').modal('hide');
			$scope.atualizarTabelaPrincipal();			
		});
	}	
	
	$scope.finalizarPedido = function(pValue){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebService + "Finalizar/" + pValue,
			    type: 'POST',
			    success: function(data) {		    	
					$scope.registro = {};
					$scope.atualizarTabelaPrincipal();				
			    }
			});
		});
	}
	
	$scope.aguardarPagamento = function(pValue){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebService + "AguardarPagamento/" + pValue,
			    type: 'POST',
			    success: function(data) {		    	
					$scope.registro = {};
					$scope.atualizarTabelaPrincipal();				
			    }
			});
		});
	}
	
	$scope.adicionarItem = function(){	
		
		$scope.item.precoTotal = $scope.item.quantidade * $scope.item.precoTabela;
		$scope.item.descricao = $scope.item.produto.descricao;

		$scope.registro.itens.push($scope.item);
		
		$scope.item = { percentualIcms: "0", precoTabela: "0", quantidade:'1'};
		
		$scope.atualizaTabelaItens();
		$scope.atualizarValoresPedido();
		$scope.$apply();
	}
	
	$scope.atualizarValorDesconto = function () {
		$scope.registro.valorDesconto = $scope.registro.valorBruto * $scope.registro.percentualDesconto / 100;
		$scope.registro.valorTotal = $scope.registro.valorBruto - $scope.registro.valorDesconto;
		$scope.atualizarValoresPedido();
		
	}
	$scope.atualizarPercentualDesconto = function () {
		$scope.registro.percentualDesconto = ($scope.registro.valorDesconto * 100) / $scope.registro.valorBruto;
		$scope.registro.valorTotal = $scope.registro.valorBruto - $scope.registro.valorDesconto;
		$scope.atualizarValoresPedido();		
	}
	
	$scope.atualizarComissoesVendedores = function () {
		if ( $scope.registro.percentualComissaoVendedor > 0 ){
			$scope.registro.valorComissaoVendedor = $scope.registro.valorTotal/ 100 * $scope.registro.percentualComissaoVendedor;
		}
		if ( $scope.registro.percentualComissaoPreposto > 0 ){
			$scope.registro.valorComissaoPreposto = $scope.registro.valorComissaoVendedor/ 100 * $scope.registro.percentualComissaoPreposto;
		}
	} 
	
	$scope.atualizarValoresPedido = function () {
		var valorTotal = 0;
		var quantidadeTotal = 0;
				
		for (var i = 0; i < $scope.registro.itens.length; i ++){
			item = $scope.registro.itens[i];
			valorTotal += item.precoTotal;
			quantidadeTotal += (item.quantidade * 1);
		}
		
		$scope.registro.quantidadeItens = quantidadeTotal;
		$scope.registro.valorBruto = valorTotal;
		$scope.registro.valorTotal = valorTotal;
	
		
		if ( $scope.registro.percentualDesconto > 0) {
			$scope.registro.valorDesconto = $scope.registro.valorBruto * $scope.registro.percentualDesconto / 100;
		}
		
		if ( $scope.registro.valorDesconto > 0 ){
			$scope.registro.valorTotal -= $scope.registro.valorDesconto; 
		}
		
		if ( $scope.registro.percentualComissaoVendedor > 0 ){
			$scope.registro.valorComissaoVendedor = $scope.registro.valorTotal/ 100 * $scope.registro.percentualComissaoVendedor;
		}
		if ( $scope.registro.percentualComissaoPreposto > 0 ){
			$scope.registro.valorComissaoPreposto = $scope.registro.valorComissaoVendedor/ 100 * $scope.registro.percentualComissaoPreposto;
		}		
		
	}
	
	
	$scope.montaDescricaoPagamento = function (item) {
		return tipoPagamentoFormatter(item.tipoPagamento) + " - " + item.descricao
	}
	
	
	$scope.escondeTabs = function(){
		$('li[role="presentation"]').removeClass('active');
		$('div[role="tabpanel"]').hide()
	}	
	$scope.ativarDados = function (){
		$scope.escondeTabs()	
		$('#tab-dados').show();	
		$('#panel-dados').addClass('active');
	}	
	$scope.ativarItens = function (){
		$scope.escondeTabs()		
		$('#tab-itens').show();
		$('#panel-itens').addClass('active');
	}

	$timeout(function(){
		$scope.atualizarTabelaPrincipal();
	},0,false);
	
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

function imprimirPedidoPortoFormatter (value, row, index){
    return '<a href="WS/Relatorios/Porto/Pedido/DetalhePedido/' + row.id + '" target="_blank"><span class="span-tabela"><i class="fa fa-print"></i> Imprimir</span></a>';	
}
function excluirLocalFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirItem('+row.id+','+index+')" class="span-tabela bg-red"><i class="fa fa-trash"></i> Excluir</span>';	
}

function excluirItemNotaFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirItemNota('+index+')" class="span-tabela bg-red"><i class="fa fa-trash"></i> Remover</span>';	
}

function separarFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().separarPedido('+row.id+')" class="span-tabela"><i class="fa fa-cubes"></i> Separar</span>';	
}
function produzirFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().produzirPedido('+row.id+')" class="span-tabela"><i class="fa fa-trash"></i> Produzir</span>';	
}
function faturarFormatter(value, row, index){
    return '<span onclick="angular.element(this).scope().faturarPedido('+row.id+')" class="span-tabela"><i class="far fa-file-alt"></i> Faturar</span>';	
}
function transporteFormatter(value, row, index){
    return '<span onclick="angular.element(this).scope().solicitarRastreio('+row.id+')" class="span-tabela"><i class="fa fa-truck"></i> Enviar p/ transporte</span>';	
}
function finalizarFormatter(value, row, index){
    return '<span onclick="angular.element(this).scope().finalizarPedido('+row.id+')" class="span-tabela"><i class="fa fa-trash"></i> Finalizar</span>';	
}
function aguardarPagamentoFormatter(value, row, index){
    return '<span onclick="angular.element(this).scope().aguardarPagamento('+row.id+')" class="span-tabela"><i class="fa fa-money"></i> Aguardar Pagamento</span>';	
}
function cancelarFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().cancelar('+row.id+')" class="span-tabela bg-red"><i class="fa fa-trash"></i> Cancelar</span>';	
}

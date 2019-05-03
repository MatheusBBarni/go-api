app.controller('ContasReceberPagarCtrl', function($scope, tipoOperacao, $rootScope, FilialService, $http)
{
	$scope.WebService = "WS/Cobranca/";
	$scope.WebServiceParcela = "WS/Parcela/";
	
	
	$scope.InicializarFiltro = function () {
		$scope.filtro = {
				tipoOperacao: tipoOperacao,
				situacaoParcela: 'A',
				numeroDocumento: null,
				dataVencimentoInicial: null,
				dataVencimentoFinal: null
		}
	}
	$scope.InicializarFiltro()
	
	$scope.InicializarObjeto = function(){
		$scope.registro = {
				tipoOperacao: tipoOperacao,
				dataEmissao : new Date(),
				primeiroVencimento: new Date(),
				valorLiquido : 0,
				valorBruto: 0,
				valorDesconto: 0,
				categoriasCobranca: []
		};
	}
	$scope.InicializarObjeto();
	
	$scope.renderizarTabelaPrincipal = function (data){
		$('#tabela-principal').bootstrapTable("destroy");
		$('#tabela-principal').bootstrapTable({data: data});
	}
	
	$scope.renderizarTabelaParcelas = function (data){
		$('#tabela-parcelas').bootstrapTable("destroy");
		$('#tabela-parcelas').bootstrapTable({data: data});
	}	
	
	$scope.filtrarParcelas = function (){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebServiceParcela + "Filtrar",
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
			}).done(function(){
				$scope.renderizarTabelaPrincipal($scope.listagem)
			});
		})
	}		
	
	
	$scope.atualizarTabelaPrincipal = function (){		
		$scope.filtrarParcelas()
	}
	$scope.atualizarTabelaPrincipal();
	
	
	if ( tipoOperacao == 'E' ) {
		$rootScope.atualizarNomeTela("Cobranças a receber");
	} else {
		$rootScope.atualizarNomeTela("Cobranças a pagar");
	}
	
	
	$scope.buscarFiliais = function () {
		$scope.filiais = [];
		FilialService.findAll().then(function(response){
			if(response.data){
				$scope.filiais = response.data;
			}
		});		
	}
	$scope.buscarFiliais();

	
	$scope.buscarFormasDePagamento = function (){
		$scope.formasDePagamento = []
		$.get("WS/FormaPagamento", function(data){
			if(data){
				$scope.formasDePagamento = data;			
				$scope.$apply();
			}
		})
	}	
	$scope.buscarFormasDePagamento()	
	
	$scope.prepostos = [];
	$scope.buscarPrepostos = function (){
		$http.get("WS/Vendedor/Tipo/P").then(function(response){
			if ( response.data ) {
				$scope.prepostos = response.data; 
			}
		})
	}
	$scope.buscarPrepostos();
	
	
	$scope.buscarContasBancarias = function (){
		$scope.contasBancarias = []
		$.get("WS/ContaBancaria", function(data){
			if(data){
				$scope.contasBancarias = data;			
				$scope.$apply();
			}
		})
	}	
	$scope.buscarContasBancarias()	

	
	$scope.buscarClientes = function (){
		$scope.clientes = []
		$.get("WS/Cliente", function(data){
			if(data){
				$scope.clientes = data;			
				$scope.$apply();
			}
		})
	}	
	$scope.buscarClientes()	

	
	$scope.buscarFornecedores = function (){
		$scope.fornecedores = []
		$.get("WS/Fornecedor", function(data){
			if(data){
				$scope.fornecedores = data;			
				$scope.$apply();
			}
		})
	}	
	$scope.buscarFornecedores()		
	
	
	$scope.buscarCategoriasDeCobranca = function (){
		$scope.categoriasDeCobranca = []
		$.get("WS/CategoriaCobranca", function(data){
			if(data){
				$scope.categoriasDeCobranca = data;			
				$scope.$apply();
			}
		})
	}	
	$scope.buscarCategoriasDeCobranca()		
	
	
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
					$scope.atualizarTabelaPrincipal()
					$('#modal_edicao').modal('hide');
			    }
			});
		});
	}
	
	
	$scope.editar = function (pValue){		
		$.get($scope.WebService + pValue, function(data){
			if(data){
				inicializeForm($scope.formCadastro)
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
		
	$scope.pagarParcela = function (id, tipoPagamento){
		if ( tipoPagamento == "Q") {
			$scope.adicionarChequesParcela(id, tipoPagamento)
		} else {
			$scope.concluirPagamentoParcela(id);
		}

	}	

	$scope.concluirPagamentoParcela = function (id) {
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebServiceParcela + id + "/Pagar",
			    type: 'POST',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {		    	
					$scope.atualizarTabelaPrincipal()
					toastr.success('Parcela paga.')
			    }
			});
		});
	}
	
	$scope.incluirParcelada = function (){
		inicializeForm($scope.formCadastro)
		$scope.InicializarObjeto();
		$scope.registro.tipoCobranca = 'P';
		$('#modal_edicao').modal('show');
	}
	
	
	$scope.incluirFixa = function (){
		inicializeForm($scope.formCadastro)
		$scope.InicializarObjeto();
		$scope.registro.tipoCobranca = 'F';
		$('#modal_edicao').modal('show');
	}	
	
	
	$scope.calculaValorLiquido = function () {
		$scope.registro.valorLiquido = $scope.registro.valorBruto - $scope.registro.valorDesconto;
	}
	
	
	$scope.detalharParcela = function (id) {
		$.get($scope.WebService + "/Parcela/" + id + "/Parcelas", function(data){
			if(data){
				$scope.cobranca = data;
				$scope.renderizarTabelaParcelas(data.parcelas)
				$scope.$apply();
			}
		}).done(function(){
			$('#modal_detalhe').modal('show');
		});		
	}
	
	$scope.editarParcela = function (idParcela) {
		$rootScope.$emit('editar-parcela-event', idParcela, $scope.cobranca.id);
	}
	
	$rootScope.$on('parcela-editada-event', function(event, parcela) {
		$scope.detalharParcela(parcela.id);			
	});
	
	
	$scope.cancelarCobranca = function (id){
		
		$.confirm({
		    title: 'Atenção!',
		    content: 'Tem certeza que deseja cancelar esta cobrança?',
		    buttons: {
		        confirm: {
		        	text: 'Sim',
		        	btnClass: 'btn-green',
					action: function () {
						Pace.track(function(){
							$.ajax({
							    url: $scope.WebService + id + "/Cancelar",
							    type: 'POST',
							    headers: { 
							        'Accept': 'application/json',
							        'Content-Type': 'application/json' 
							    },
							    dataType: 'json',
							    success: function(data) {		    	
							    	$('#modal_detalhe').modal('hide');	
							    }
							});
						});
			        }
				},
		        cancel: {
		        	text: 'Não',
		        	btnClass: 'btn-red', 
					action: function () {
						
					}
				}
		    }
		});		
		
		

	}	
	
	$scope.pagarParcelaDetalhe = function (id){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebServiceParcela + id + "/Pagar",
			    type: 'POST',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {		    	
			    	$scope.detalharParcela(data.id);		
			    }
			});
		});
	}
	
	$scope.estornarParcela = function (id){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebServiceParcela + id + "/Estornar",
			    type: 'POST',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {		    	
			    	$scope.detalharParcela(data.id);		
			    }
			});
		});
	}		
	
	
	
	$scope.adicionarChequesParcela = function (id, tipoPagamento, cb) {
		
		$scope.parcelaPagamento = {id: id, cheques:[]}
		$scope.cheques = [];
		$.get("WS/Cheque/Disponivel", function(data){
			if(data){
				$scope.cheques = data;			
				$scope.$apply();
				$scope.atualizarTabelaCheques();
				$('#modal_lista_cheque').modal('show');
			}
		})		
		
	}
	
	$scope.atualizarTabelaCheques = function () {
		$('#tabela-cheques').bootstrapTable("destroy");
		$('#tabela-cheques').bootstrapTable({data: $scope.parcelaPagamento.cheques});
	}
	
	$scope.incluirChequeDisponivel = function () {
		$scope.parcelaPagamento.cheques.push($scope.chequeDisponivel);
		$scope.chequeDisponivel = {};
		$scope.atualizarTabelaCheques();
	}
	
	$scope.incluirNovoCheque = function (){
		$scope.novoCheque = {};
		$('#modal_edicao_cheque').modal('show');
	}
	
	$scope.salvarNovoCheque = function () {
		$.ajax({
		    url: "WS/Cheque",
		    type: 'POST',
		    headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
		    dataType: 'json',
		    data: JSON.stringify($scope.novoCheque),
		    success: function(data) {		    	
				$scope.chequeDisponivel = data;
				$scope.incluirChequeDisponivel();
				$('#modal_edicao_cheque').modal('hide');
		    }
		});		
	}
	
	$scope.excluirChequeParcela = function (index) {
		$scope.parcelaPagamento.cheques.splice(index, 1)
		$scope.atualizarTabelaCheques();
	}
	
	$scope.concluirPagamentoParcelaCheque = function () {
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebServiceParcela + "Pagar/Cheque",
			    type: 'POST',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    data: JSON.stringify($scope.parcelaPagamento),
			    success: function(data) {		    
			    	$('#modal_lista_cheque').modal('hide');
					$scope.atualizarTabelaPrincipal()
					toastr.success('Parcela paga.')
			    }
			});
		});
	}	
	
	
});

function situacaoParcelaFormatter(pValue) {
	if (pValue === 'A') {
		return "Aberta";
	}
	if (pValue === 'P') {
		return "Paga";
	}
	if (pValue === 'C') {
		return "Cancelada";
	}
	if (pValue === 'D') {
		return "Dívida";
	}		
}

function excluirChequeFormatter(value, row, index) {
	return '<span onclick="angular.element(this).scope().excluirChequeParcela(' + index + ')" class="span-tabela bg-red"> <i class="fa fa-search"></i> Excluir</span>';
}

function detalharParcelaFormatter(value, row, index) {
	return '<span onclick="angular.element(this).scope().detalharParcela(' + row.id + ')" class="span-tabela"> <i class="fa fa-search"></i> Detalhar</span>';
}
function pagarParcelaFormatter(value, row, index) {
	
	var tipoPagamento;
	if ( row.formaPagamento ) {
		tipoPagamento = row.formaPagamento.tipoPagamento
	}
	
	return '<span onclick="angular.element(this).scope().pagarParcela(' + row.id + ', \''+ tipoPagamento +'\')" class="span-tabela"> <i class="fas fa-check"></i> Pagar</span>';
}

function pagarEstornarParcelaFormatter(value, row, index) {
	if (row.situacaoParcela === 'A') {
		return '<span onclick="angular.element(this).scope().pagarParcelaDetalhe(' + row.id + ')" class="span-tabela"> <i class="fas fa-check"></i> Pagar</span>';
	}
	if (row.situacaoParcela === 'P') {
		return '<span onclick="angular.element(this).scope().estornarParcela(' + row.id + ')" class="span-tabela bg-red"> <i class="fa fa-ban"></i> Estornar</span>';
	}	
	if (row.situacaoParcela === 'C') {
		return '';
	}		
}

function editarParcelaFormatter(value, row, index) {
	return '<span onclick="angular.element(this).scope().editarParcela(' + row.id + ')" class="span-tabela"> <i class="fas fa-edit"></i> Editar</span>';	
}
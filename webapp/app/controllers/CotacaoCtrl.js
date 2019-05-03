app.controller('CotacaoCtrl', function($scope, $http) {
	
	$scope.WebService = "WS/Cotacao/";
	
	$scope.inicializarObjeto = function() {
		$scope.registro = {
			situacao : 'A',
			statusCotacao: 'A',
			logs: []
		};
	}

	$scope.clientes = [];
	$scope.buscarClientes = function () {
		$http.get("WS/Cliente").then(function (response) {
			if ( response.data ) {
				$scope.clientes = response.data;
			}
		});
	}
	$scope.buscarClientes();
	
	$scope.atendentes = [];
	$scope.buscarAtendentes = function() {
		$http.get("WS/Usuario").then(function(response) {
			$scope.atendentes = response.data;
		});
	}
	$scope.buscarAtendentes();
	
//	$scope.atualizarTabelaPrincipal = function() {
//		$http.get($scope.WebService).then(function(response) {
//			if (response.data) {
//				$('#tabela-principal').bootstrapTable('destroy');
//				$('#tabela-principal').bootstrapTable({
//					data : response.data
//				});
//			} else {
//				$('#tabela-principal').bootstrapTable('destroy');
//				$('#tabela-principal').bootstrapTable({
//					data : []
//				});
//			}
//		});
//	}
//	$scope.atualizarTabelaPrincipal();

	$scope.salvar = function() {
		$.ajax({
			url : $scope.WebService,
			type : 'POST',
			headers : {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json'
			},
			dataType : 'json',
			data : JSON.stringify($scope.registro),
			success : function(data) {
				showDetalhes('container-detalhes', 'container-principal');
				$scope.atualizarTabelaPrincipal();
			}
		});
	}

	$scope.editar = function(pValue) {
		$.get($scope.WebService + pValue, function(data) {
			if (data) {
				$scope.registro = data;
				$scope.$apply(); 
				$scope.atualizaTabelaConversa();
				showDetalhes('container-principal', 'container-detalhes');
				$scope.ativarTab('cotacao');
				
				if($scope.registro.simNao == "S"){
					$scope.podeSimNao = "Sim"
				} else if($scope.registro.simNao == "N") {
					$scope.podeSimNao = "Não"
				} else if($scope.registro.simNao == null) {
					$scope.podeSimNao = "----";
				}
				
			}
		})
	}
	
	$scope.adicionarConversa = function(){	
		$scope.conversa.dataResposta = new Date();
		$scope.registro.logs.push($scope.conversa);
		
		if ( $scope.registro.statusCotacao == "A" ){
			$scope.registro.statusCotacao = "C";
		}
		$scope.conversa = {};
		$scope.atualizaTabelaConversa();
	}
	$scope.excluirMensagem = function(mIndex) {
		$scope.registro.logs.splice(mIndex, 1);
		$scope.atualizaTabelaConversa();
		$scope.$apply();
	}


	$scope.excluir = function(pValue) {

		$.confirm({
			title : 'Atenção!',
			content : 'Você tem certeza que deseja excluir o item?',
			theme : 'material',
			type : 'red',
			buttons : {
				confirmar : {
					text : 'Deletar',
					btnClass : 'btn-red',
					keys : [ 'enter', ],
					action : function() {
						$.ajax({
							url : $scope.WebService + pValue,
							type : 'DELETE',
							success : function(data) {
								$scope.registro = {};
								$scope.atualizarTabelaPrincipal();
							}
						});
					}
				},
				cancel : function() {
				}
			}
		});

	}
	
	$scope.atualizaTabelaConversa = function() {
		$('#tabela-conversa').bootstrapTable('destroy')
		$('#tabela-conversa').bootstrapTable({})
		$('#tabela-conversa').bootstrapTable('showLoading')		
		if ( $scope.registro.id > 0 && $scope.registro.logs == null ) {
			$http.get("WS/CotacaoLog/Cotacao/" + $scope.registro.id).then (function (response) {
				$scope.registro.logs = [];
				if ( response.data) {
					$scope.registro.logs = response.data; 
				}
				$('#tabela-conversa').bootstrapTable('destroy')
				$('#tabela-conversa').bootstrapTable({data:$scope.registro.logs})
			})
		} else {
			$('#tabela-conversa').bootstrapTable('destroy')
			$('#tabela-conversa').bootstrapTable({data:$scope.registro.logs})
		}
	}


	$scope.incluir = function() {
		$scope.inicializarObjeto();
		$scope.atualizaTabelaConversa();
		
		$scope.ativarTab('cotacao')

	}

	$scope.escondeTabs = function() {
		$('li[role="presentation"]').removeClass('active');
		$('div[role="tabpanel"]').hide()
	}
	$scope.ativarTab = function(nome) {
		$scope.escondeTabs()
		$('#tab-' + nome).show();
		$('#panel-' + nome).addClass('active');
	}
	$scope.excluirItem = function(pId, pIndex) {
		$scope.registro.logs.splice(pIndex, 1);
		$scope.atualizaTabelaConversa();
		$scope.$apply();
	}
	
	//Pagination
	$scope.pagination = {}; 
	
	url = $scope.WebService;
	
	$scope.pagination.tableName = "tabela-principal";
	//Retorno do page do spring
	$scope.pagination.page = {
		totalPages: 0,
		totalElements: 0,
		first: false,
		last: false,
		sort: null,
		size: 10,
		number: 0
		
	};

	$scope.pagination.prevNumber = function() { return $scope.pagination.page.number-1; }//Não alterar esse valor
	$scope.pagination.nextNumber = function() { return $scope.pagination.page.number+1; }//Não alterar esse valor
	
	$scope.pagination.fetchFirst = function(){
		$scope.pagination.page.number = 0;
		$scope.pagination.refresh();
	}
	$scope.pagination.fetchLast = function(){
		$scope.pagination.page.number = $scope.pagination.page.totalPages - 1;
		$scope.pagination.refresh();
	}
	$scope.pagination.prevData = function(){
		$scope.pagination.page.number = $scope.pagination.prevNumber();
		$scope.pagination.refresh();
	}
	$scope.pagination.nextData = function(){
		$scope.pagination.page.number = $scope.pagination.nextNumber();
		$scope.pagination.refresh();
	}
	
	$scope.filtro = { situacao: "A" };
	$scope.pagination.refresh = function(){
		
		if($scope.pagination.page.size == null){
			$scope.pagination.page.size = 10;
		}
		
		$scope.pagination.url  = url + "/Filtrar/Pageable/?page="+$scope.pagination.page.number+"&size=" + $scope.pagination.page.size; 
		

		Pace.track(function(){
			$.ajax({
			    url: $scope.pagination.url,
			    type: 'POST',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    data: JSON.stringify($scope.filtro),
			    success: function(data) {
			    		$scope.pagination.page = data;

			    		$('#sctPagination option[value='+ $scope.pagination.page.size + ']').attr('selected','selected');
			    		
			    		$('#sctPagination').val($scope.pagination.page.size);
			    		$('#' + $scope.pagination.tableName).bootstrapTable('destroy');
			    		$('#' + $scope.pagination.tableName).bootstrapTable({
						data: $scope.pagination.page.content
					});
					$scope.$apply();
			    		
			    }
			});
		});
		
	}
	$scope.pagination.refresh();

});

function excluirMensagemFormatter(value, row, index){
	return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluirMensagem('+index+')"><i class="fas fa-trash-alt"></i>&nbsp;  Excluir</div></td>';
}
			
function tipoVoucherFormatter(value, row, index) {
	if (value == 'A')
		return "Atendente";
	if (value == 'C')
		return "Cliente"
}

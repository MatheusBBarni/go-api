app.controller('ViagemCtrl', function($scope, $http) {
				
				
	$scope.WebService = "WS/Viagem/";
	$scope.inicializarObjeto = function() {
		$scope.registro = {
			situacao : 'A',
			viagemVouchers: [],
			viagemClientes: [],
		};
		
		$scope.viagemVoucherSelecionado = {vouchers: []};
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
			
	$scope.salvar = function() {
		if ($scope.registro.nome != null && $scope.registro.local != null){
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
					$scope.pagination.refresh();
					showDetalhes('container-detalhes', 'container-principal')
				}
			});
		}
	}

	
	
	$scope.editar = function(pValue) {
		
		$.get($scope.WebService + pValue, function(data) {
			if (data) {
				$scope.registro = data;
				$http.get($scope.WebService+$scope.registro.id+"/ViagemVouchers").then(function(response){
					$scope.registro.viagemVouchers = response.data;
					$scope.atualizaTabelaViagemVouchers();
				});
				$http.get($scope.WebService+$scope.registro.id+"/ViagemClientes").then(function(response){
					$scope.registro.viagemClientes = response.data;
					$scope.atualizaTabelaViagemClientes();
				});
				$scope.atualizaImagem();
				$scope.ativarTab('viagem');
				showDetalhes('container-principal', 'container-detalhes')
			}
			
			$scope.$apply();
		});
	}
	
	
	
	$scope.adicionarViagemVoucher = function(){						
		$scope.registro.viagemVouchers.push($scope.viagemVoucher);				
		$scope.viagemVoucher = {};
		$scope.atualizaTabelaViagemVouchers();
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
								$scope.pagination.refresh();
							}
						});
					}
				},
				cancel : function() {
				}
			}
		});

	}
	
	$scope.atualizaTabelaViagemVouchers = function() {
		if ($scope.registro.viagemVouchers == null){
			$('#tabela-viagem-voucher').bootstrapTable('destroy');
			$('#tabela-viagem-voucher').bootstrapTable({
				data : []
			});
		} else {
			$('#tabela-viagem-voucher').bootstrapTable('destroy')
			$('#tabela-viagem-voucher').bootstrapTable({
				data : $scope.registro.viagemVouchers
			});
		}
	}


	$scope.incluir = function() {
		$scope.ativarTab('viagem');	
		$scope.inicializarObjeto();
		$scope.atualizaImagem();
		$scope.atualizaTabelaViagemClientes();
		$scope.atualizaTabelaViagemVouchers();
		$scope.atualizaTabelaVouchers();
			
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
		$scope.registro.viagemVouchers.splice(pIndex, 1);
		$scope.atualizaTabelaViagemVoucher();
		$scope.atualizaTabelaVouchers();
		$scope.$apply();
	}

	$scope.adicionarCliente = function(){				
		if ( $scope.viagemCliente.cliente && $scope.viagemCliente.cliente.id){			
			if ($scope.modoViagemCliente != "E" ){
				$scope.registro.viagemClientes.push($scope.viagemCliente);
			}			
			$scope.modoViagemCliente = "I";
			$scope.viagemCliente = {};
			$scope.atualizaTabelaViagemClientes();	
		}
	}	
	$scope.atualizaTabelaViagemClientes = function() {
		if ($scope.registro.viagemClientes == null){
			$('#tabela-viagem-clientes').bootstrapTable('destroy')
			$('#tabela-viagem-clientes').bootstrapTable({
				data : []
			});
		}
		$('#tabela-viagem-clientes').bootstrapTable('destroy')
		$('#tabela-viagem-clientes').bootstrapTable({
			data : $scope.registro.viagemClientes
		});
	}
	
	$scope.excluirCliente = function(pIndex) {
		$scope.registro.viagemClientes.splice(pIndex, 1);
		$scope.atualizaTabelaViagemClientes();
		$scope.$apply();
	}
	
	$scope.editarViagemCliente = function (index) {
		$scope.modoViagemCliente = "E";
		$scope.viagemCliente = $scope.registro.viagemClientes[index]; 
		$scope.$apply();
	}
	
	$scope.excluirLocal = function(lIndex) {
		$scope.registro.viagemVouchers.splice(lIndex, 1);
		$scope.atualizaTabelaViagemVouchers();
		$scope.$apply();
	}
	
	
	$scope.converterArquivo = function(file) {
		   var reader = new FileReader();
		   reader.readAsDataURL(file.files[0]);
		   
		   if ( ! $scope.registro.imagem) {
			   $scope.registro.imagem = {};
		   }
		   
		   reader.onload = function () {
			   var dados = reader.result.split("base64,")
			   $scope.registro.imagem.bytes = dados[1]
			   $scope.atualizaImagem()
			   $scope.$apply()
			   $(file).val("")
		   };
		   reader.onerror = function (error) {
			   console.log('Error: ', error);
		   };
	}		
	
	$scope.atualizaImagem = function(){

		if ( $scope.registro.id ) { //se tem id significa que é uma edição
			if ( ! $scope.registro.imagem || ! $scope.registro.imagem.id ) { //Se for uma edição e ainda não tenho o id da arquivo então tem que buscar ela do WS
				buscaImagemWS($scope.registro.id, renderizaImagem)
			} else {
				renderizaImagem()
			}			
		} else { //se for uma inclusão já pode buscar a arquivo default
			renderizaImagem()
		}
		
	}	
	
	function buscaImagemWS(idViagem, cb){
		Pace.track(function(){
			$.ajax({
			    url: "WS/Viagem/" + idViagem +'/Imagem/Json',
			    type: 'GET',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {		    	
			    	$scope.registro.imagem = data
			    	cb()
			    	$scope.$apply();
			    }
			});
		});	
	}		
	
	function renderizaImagem() {
		if( ! $scope.registro.imagem){ //verifica se a arquivo cadastrada realmente possui bytes
			$scope.srcImagem = "dist/img/user-avatar.png"
		}else{
			$scope.srcImagem = "data:image/png;base64," + $scope.registro.imagem.bytes
		}			
	}				
				
				
	$scope.converterArquivoVoucher = function(file) {
		   var reader = new FileReader();
		   reader.readAsDataURL(file.files[0]);
		   
		   $scope.voucher.arquivo.nome = file.files[0].name
		   $scope.voucher.arquivo.tamanho = file.files[0].size
		   $scope.voucher.arquivo.contentType = file.files[0].type
		   
		   reader.onload = function () {
			   var dados = reader.result.split("base64,")
			   $scope.voucher.arquivo.bytes = dados[1]
			   $scope.$apply()
		   };
		   reader.onerror = function (error) {
			   console.log('Error: ', error);
		   };
	}				
	
	$scope.abrirVouchers = function (index) {
		$scope.indexSelecionado = index;
		$scope.viagemVoucherSelecionado = $scope.registro.viagemVouchers[index];
		$scope.voucher = {descricao: "", arquivo: {}, dataVoucher: new Date()};
		if ( $scope.viagemVoucherSelecionado.vouchers == null && $scope.viagemVoucherSelecionado.id != null) {
			$http.get("WS/Voucher/ViagemVoucher/" + $scope.viagemVoucherSelecionado.id).then(function (response) {
				if ( response.data ) {
					$scope.viagemVoucherSelecionado.vouchers = response.data;	
				}
				$scope.atualizaTabelaVouchers();
				showDetalhes('container-detalhes', 'container-detalhes2')
			});
		} else {
			$scope.atualizaTabelaVouchers();
			showDetalhes('container-detalhes', 'container-detalhes2')
		}
	}
	
	$scope.adicionarVoucher = function () {
		if ($scope.viagemVoucherSelecionado.vouchers == null){
			$scope.viagemVoucherSelecionado.vouchers = [];
		}
		$scope.viagemVoucherSelecionado.vouchers.push($scope.voucher);
		$scope.voucher = {descricao: "", arquivo: {}, dataVoucher: new Date()};
		$scope.atualizaTabelaVouchers();
	}
	
	$scope.excluirVoucher = function (index) {
		$scope.viagemVoucherSelecionado.vouchers.splice(index, 1);
		$scope.atualizaTabelaVouchers();
	}
	
	$scope.atualizaTabelaVouchers = function() {
		$('#tabela-voucher').bootstrapTable('destroy')
		$('#tabela-voucher').bootstrapTable({
			data : $scope.viagemVoucherSelecionado.vouchers
		});
	}
	
	$scope.salvarVouchers = function () {
		if ($scope.registro.viagemVouchers[$scope.indexSelecionado] == null){
			$scope.registro.viagemVouchers[$scope.indexSelecionado] = []
		}
		$scope.registro.viagemVouchers[$scope.indexSelecionado].vouchers = $scope.viagemVoucherSelecionado.vouchers; 
		showDetalhes('container-detalhes2', 'container-detalhes')
	}
	
	$scope.fecharVouchers = function() {
		$.confirm({
		    title: 'Atenção!',
		    content: 'Você tem certeza que deseja sair sem salvar ?',
		    theme: 'material',
		    type: 'grey',
		    buttons: {
		    	  confirmar: {
		              text: 'fechar',
		              btnClass: 'btn-red',
		              keys: ['enter',],
		              action: function(){
		            	  $scope.imagens = []
		            	  showDetalhes('container-detalhes2', 'container-detalhes')
		            	  $scope.pagination.refresh();
		              }
		          },
		        cancel: function () {
		        }
		    }
		});
	}
	
	$scope.fechar = function() {
		$.confirm({
		    title: 'Atenção!',
		    content: 'Você tem certeza que deseja sair sem salvar ?',
		    theme: 'material',
		    type: 'grey',
		    buttons: {
		    	  confirmar: {
		              text: 'fechar',
		              btnClass: 'btn-red',
		              keys: ['enter',],
		              action: function(){
		            	  $scope.pagination.refresh();
		            	  $scope.modoViagemCliente = "I";
		            	  showDetalhes('container-detalhes', 'container-principal');
		              }
		          },
		        cancel: function () {
		        }
		    }
		});
	}
	
	$scope.renderizaTabelaVoucherDicas = function(data) {
		$('#tabela-voucher-dica').bootstrapTable('destroy');
		$('#tabela-voucher-dica').bootstrapTable({
			data : data
		});
	}
	
	$scope.atualizarTabelaVoucherDicas = function(vId) {
		if(vId > 0){
			var idDica = vId;
			$http.get("WS/ViagemVoucherDica/ViagemVoucher/"+idDica).then(function(response) {
				if (response.data) {
					$scope.renderizaTabelaVoucherDicas(response.data);
					$scope.viagemVoucherSelecionado.dicas = response.data;
				} else {
					$scope.renderizaTabelaVoucherDicas([]);
				}
			});
		} else {
			$scope.renderizaTabelaVoucherDicas([]);
		}
	}
	
	$scope.dicaRoteiro = function(index){
		$scope.indexSelecionado = index;
		$scope.viagemVoucherSelecionado = $scope.registro.viagemVouchers[index];
		showDetalhes('container-detalhes', 'container-dicas');
		$scope.atualizarTabelaVoucherDicas($scope.viagemVoucherSelecionado.id);
		$scope.buscarDicas();
	}
	
	$scope.excluirDica = function(dIndex) {
		$scope.viagemVoucherSelecionado.dicas.splice(dIndex, 1);
		$scope.renderizaTabelaVoucherDicas($scope.viagemVoucherSelecionado.dicas);
	}
	
	$scope.salvarDica = function() {
		if ($scope.registro.viagemVouchers[$scope.indexSelecionado] == null){
			$scope.registro.viagemVouchers[$scope.indexSelecionado] = [];
		}
		$scope.registro.viagemVouchers[$scope.indexSelecionado].dicas = $scope.viagemVoucherSelecionado.dicas; 
		showDetalhes('container-dicas', 'container-detalhes');
	}
	
	$scope.adicionarDica = function() {
		
		if ($scope.viagemVoucherSelecionado.dicas == null){
			$scope.viagemVoucherSelecionado.dicas = [];
		}
		$scope.viagemVoucherSelecionado.dicas.push($scope.viagemVoucherDica);
		$scope.renderizaTabelaVoucherDicas($scope.viagemVoucherSelecionado.dicas);
		
		$scope.viagemVoucherDica = {};
	}
		
	$scope.dicas = [];
	$scope.buscarDicas = function(){
		$http.get("WS/Dica/").then(function(response){
			if(response.data) {
				$scope.dicas = response.data
			}
		});
	}
	
	$scope.fecharDica = function(){
		showDetalhes('container-dicas', 'container-detalhes');
		$scope.ativarTab('voucher');
	}
	
	
	$scope.clienteBoleto = {};
	$scope.buscarClienteBoleto = function(clienteId) {
		$http.get("WS/Cliente/"+clienteId).then(function(response) {
			$scope.clienteBoleto = response.data;
		});
	}
	
	$scope.iniciarBoleto = function() {
		$scope.boleto = { situacao: "A", cliente: {}, viagem: {} };
		$scope.boleto.arquivo = {};
	}
	
	$scope.boletoCliente = function(cliente){
		$scope.iniciarBoleto();
		$http.get("WS/Boleto/Cliente/"+cliente+"/Viagem/"+$scope.registro.id).then(function(response) {
			if(response.data.arquivo) {
				$scope.boleto = response.data;
			}
			$scope.buscarClienteBoleto(cliente);
			showDetalhes('container-detalhes', 'container-boleto');
			$scope.atualizaArquivoBoleto();
		});
	}
	
	$scope.salvarBoleto = function() {
		$scope.boleto.cliente = $scope.clienteBoleto;
		$scope.boleto.viagem = $scope.registro;
		$http.post("WS/Boleto", $scope.boleto).then(function(response) {
			showDetalhes('container-boleto', 'container-detalhes');
			ativarTab('cliente');
		}); 
		
	}
	
	$scope.fecharBoleto = function(){
		showDetalhes('container-boleto', 'container-detalhes');
		ativarTab('cliente');
	}
	
	$scope.converterArquivoBoleto = function(file) {
		var reader = new FileReader();		   
		   
	   file.nome = file.files[0].name;
	   file.contentType = file.files[0].type;
	   
	   $scope.boleto.arquivo.nome = file.nome;
	   $scope.boleto.arquivo.contentType = file.contentType;
	   
	   reader.readAsDataURL(file.files[0]);
	   
	   reader.onload = function () {
		   var dados = reader.result.split("base64,")
		   $scope.boleto.arquivo.bytes = dados[1];
		   $scope.atualizaArquivoBoleto();
		   $scope.$apply();
	   };
	   reader.onerror = function (error) {
		   console.log('Error: ', error);
	   };
	}
	$scope.atualizaArquivoBoleto = function(){
		$("#boletoFile").val("");
		if ( $scope.boleto.id ) { //se tem id significa que é uma edição
			if ( $scope.boleto.arquivo == null ) { //Se for uma edição e ainda não tenho o id da arquivo então tem que buscar ela do WS
				buscaBoletoWS($scope.boleto.id, renderizaArquivoBoleto);
			} else {
				renderizaArquivoBoleto();
			}			
		} else { //se for uma inclusão já pode buscar a arquivo default
			renderizaArquivoBoleto();
		}
		
	}
	
	function buscaBoletoWS(idBoleto, cb){
		Pace.track(function(){
			$.ajax({
			    url: "WS/Boleto/" + idBoleto +'/Arquivo/Json',
			    type: 'GET',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {
			    	$scope.boleto.arquivo = data;
			    	cb();
			    	$scope.$apply();
			    }
			});
		});	
	}
	
	function renderizaArquivoBoleto() {
		$scope.linkArquivo = "";
		$scope.nomeArquivo = "";
		if( $scope.boleto.arquivo.bytes == null){ //verifica se a arquivo cadastrada realmente possui bytes
			$scope.nomeArquivo = "Sem arquivo";
			$scope.linkArquivo = "#!home";
		}else{
			$scope.nomeArquivo = $scope.boleto.arquivo.nome;
			$scope.linkArquivo = "WS/Boleto/"+$scope.boleto.id+"/Arquivo";
		}			
	}
	
	//Controles da páginação
	
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
	//FIM PAGINATION
	
	$scope.indexRoteiro = 0;
	$scope.seEditarRoteiro = false;
	$scope.editarRoteiro = function(index) {
		$scope.indexRoteiro = index;
		$scope.seEditarRoteiro = true;
		$scope.viagemVoucher = $scope.registro.viagemVouchers[index];
		$scope.$apply();
	}
	
	$scope.salvarRoteiro = function() {
		$scope.registro.viagemVouchers[$scope.indexRoteiro] = $scope.viagemVoucher;
		$scope.viagemVoucher = {};
		$scope.seEditarRoteiro = false;
	}
	
});

function dicaFormatter(value, row, index){
	return '<div class="span-padrao span-acao" onclick="angular.element(this).scope().dicaRoteiro('+index+')"><i class="fas fa-broadcast-tower"></i>  Dica</div></td>';
}

function editarRoteiroFormatter(value, row, index){
	return '<div onclick="angular.element(this).scope().editarRoteiro('+index+')" class="span-padrao span-editar" ><i class="fas fa-pen"></i>  Editar</div>';
}

function boletoClienteFormatter(value, row, index){
	return '<div class="span-padrao span-acao" onclick="angular.element(this).scope().boletoCliente('+row.cliente.id+')"><i class="fas fa-money-bill-wave"></i>  Boleto</div></td>';
}

function excluirDicaFormatter(value, row, index){
	return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluirDica('+index+')"><i class="fas fa-trash-alt"></i>&nbsp;  Remover</div></td>';
}

function tipoVoucherFormatter(value, row, index) {
	if (value == 'A')
		return "Atendente";
	if (value == 'C')
		return "Cliente"

}

function excluirLocalFormatter(value, row, index){
	return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluirLocal('+index+')"><i class="fas fa-trash-alt"></i>&nbsp;  Excluir</div></td>';
}

function vouchers00Formatter (value, row, index){
    return '<div onclick="angular.element(this).scope().abrirVouchers('+index+')" class="span-padrao span-editar" ><i class="far fa-clone"></i> Vouchers</span>';	
}

function excluirClienteFormatter (value, row, index){
    return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluirCliente('+index+')"><i class="fas fa-trash-alt"></i>&nbsp;  Excluir</div>';	
}

function excluirVoucherFormatter (value, row, index){
    return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluirVoucher('+index+')"><i class="fas fa-trash-alt"></i>&nbsp;  Remover</div>';	
}

function editarViagemCliente00Formatter (value, row, index){
	return '<div onclick="angular.element(this).scope().editarViagemCliente('+index+')" class="span-padrao span-editar" ><i class="fas fa-pen"></i> Editar</div>';	
}
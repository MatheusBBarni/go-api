/**
 * Controller das regras de negócio do usuário 
 */

app.controller('ClientesCtrl', function($scope, $http, $routeParams)
{
	$scope.WebService = "WS/Cliente/";	
	
	$scope.inicializarRegistro = function () {
		$scope.registro = { enderecos: [{tipo:"E"}], situacao: 'A'};
	}
	$scope.inicializarRegistro()
	$scope.inicializarObjeto = function() {
		$scope.registro = {
			situacao : 'A',
			viagemVouchers: [],
			viagemClientes: []
		};
		
		$scope.viagemVoucherSelecionado = {vouchers: []};
	}
	
	$scope.estados = []
	$http.get("WS/Estado").then(function(response){
		if(response.data){
			$scope.estados = response.data;
		}
	})
	
   	$scope.cidades = [];
   	$scope.buscaCidades = function () {
   		if ( $scope.registro.enderecoPrincipal.estado ) {
	   		$http.get("WS/Cidade/Estado/" + $scope.registro.enderecoPrincipal.estado.id).then(function(response){
	   			if(response.data){
	   				$scope.cidades = response.data;
	   			}
	   		})
   		} else {
   			$scope.cidades = [];
   		}
   	}
   	
	$scope.salvar = function (){
		if($scope.registro.nomeFantasia != null && $scope.registro.cpfCnpj != null && $scope.registro.emailContato != null && $scope.registro.enderecoPrincipal.endereco != null){
			$scope.registro.tipoCliente = 'C';
			$http.post($scope.WebService, $scope.registro).then(function (response) {	
				showDetalhes('container-detalhes', 'container-principal');
				$scope.pagination.refresh();
			})
		}
	}	
		
	$scope.editar = function (pValue){
		
		$http.get($scope.WebService + pValue).then(function (response) {
			if(response.data){
				$scope.registro = response.data;
				$scope.buscaCidades();
				showDetalhes('container-principal', 'container-detalhes');	
			} 
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
		          		    	$scope.inicializarRegistro();
		          		    	$scope.pagination.refresh();				
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
		$scope.inicializarRegistro();		
		$scope.atualizaTabelaViagemClientes();		
	}
	
	$scope.WebServiceViagem = "WS/Viagem/";
	$scope.inicializarObjeto = function() {
		$scope.registro = {
			situacao : 'A',
			viagemVouchers: [],
			viagemClientes: []
		};
	}
	$scope.modoViagemCliente = "I";
	$scope.clientes = [];
	$scope.buscarClientes = function () {
		$http.get("WS/Cliente").then(function (response) {
			if ( response.data ) {
				$scope.clientes = response.data;	
			}
		});
	}
	$scope.buscarClientes();
	
	$scope.salvarViagem = function() {
		if ($scope.registro.nome != null && $scope.registro.local != null){
			$.ajax({
				url : $scope.WebServiceViagem,
				type : 'POST',
				headers : {
					'Accept' : 'application/json',
					'Content-Type' : 'application/json'
				},
				dataType : 'json',
				data : JSON.stringify($scope.registro),
				success : function(data) {
					$scope.pagination.refresh();
					showDetalhes('container-detalhes2', 'container-principal');
				}
			});
		}
	}
	
	$scope.adicionarViagemVoucher = function(){						
		$scope.registro.viagemVouchers.push($scope.viagemVoucher);				
		$scope.viagemVoucher = {};
		$scope.atualizaTabelaViagemVouchers();
	}
	
	$scope.excluirLocal = function(lIndex) {
		$scope.registro.viagemVouchers.splice(lIndex, 1);
		$scope.atualizaTabelaViagemVouchers();
		$scope.$apply();
	}
	
	$scope.atualizaTabelaViagemVouchers = function() {
		if ($scope.registro.viagemVouchers == null){
			$('#tabela-viagem-voucher').bootstrapTable('destroy')
			$('#tabela-viagem-voucher').bootstrapTable({
				data : []
			});
		} else{
			$('#tabela-viagem-voucher').bootstrapTable('destroy')
			$('#tabela-viagem-voucher').bootstrapTable({
				data : $scope.registro.viagemVouchers
			});
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

	$scope.incluirViagem = function() {
		$scope.inicializarObjeto();		
		$scope.listarSelecionados();	
		$scope.atualizaTabelaViagemClientes();
		$scope.atualizaTabelaViagemVouchers();
		$scope.ativarTab('viagem')			
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
		$scope.atualizaTabelaVoucher();
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
		$('#tabela-viagem-clientes').bootstrapTable('destroy')
		$('#tabela-viagem-clientes').bootstrapTable({
			data : $scope.registro.viagemClientes
		});
	}	
	$scope.editarViagemCliente = function (index) {
		$scope.modoViagemCliente = "E";
		$scope.viagemCliente = $scope.registro.viagemClientes[index]; 
		$scope.$apply();
	}
	$scope.excluirCliente = function(pIndex) {
		$scope.registro.viagemClientes.splice(pIndex, 1);
		$scope.atualizaTabelaViagemClientes();
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
	
	function renderizaImagem () {
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
				showDetalhes('container-detalhes2', 'container-detalhes3')
			});
		} else {
			$scope.atualizaTabelaVouchers();
			showDetalhes('container-detalhes2', 'container-detalhes3')
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
	
	//Controles da páginação
	
	$scope.pagination = {}; 
	
	url = "WS/Cliente";
	
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
	

	$scope.salvarVouchers = function () {
		if ($scope.registro.viagemVouchers[$scope.indexSelecionado] == null){
			$scope.registro.viagemVouchers[$scope.indexSelecionado] = []
		}
		$scope.registro.viagemVouchers[$scope.indexSelecionado].vouchers = $scope.viagemVoucherSelecionado.vouchers;
		showDetalhes('container-detalhes3', 'container-detalhes2')
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
		            	  showDetalhes('container-detalhes3', 'container-detalhes2')
		              }
		          },
		        cancel: function () {
		        }
		    }
		});
	}
	
	$scope.listarSelecionados = function(){
		var lista = [];
		var clientes = $('#tabela-principal').bootstrapTable('getSelections');
	    for(var i = 0; i < clientes.length; i++){
	    	cliente = clientes[i];
	    	viajemCliente = {	    		
	    		cliente : cliente,
	    		dataPartida : null,
	    		dataRetorno : null
	    	};
	    	lista.push(viajemCliente);
	    }
	    $scope.registro.viagemClientes = lista;
	    $scope.atualizaTabelaViagemClientes();
	}
	
	$scope.fechar = function(detalhes) {
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
		            	  $scope.modoViagemCliente = "I";
				        	if (detalhes == 0){
				        		showDetalhes('container-detalhes', 'container-principal');
				        	}else if (detalhes == 1){
				        		showDetalhes('container-detalhes2', 'container-principal');
				        	}
		              }
		          },
		        cancel: function () {
		        }
		    }
		});
	}
});



function excluirEnderecoFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirEndereco('+row.id+','+index+')" class="span-inativar"><i class="fa fa-trash"></i> Excluir</span>';	
}

function editarViagemClienteFormatter (value, row, index){
	return '<div onclick="angular.element(this).scope().editarViagemCliente('+index+')" class="span-padrao span-editar" ><i class="fas fa-pen"></i> Editar</div>';	
}

function vouchers00Formatter (value, row, index){
    return '<div onclick="angular.element(this).scope().abrirVouchers('+index+')" class="span-padrao span-editar" ><i class="far fa-clone"></i> Vouchers</span>';	
}

function excluirVoucherFormatter (value, row, index){
    return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluirVoucher('+index+')"><i class="fas fa-trash-alt"></i>&nbsp;  Remover</div>';	
}
function excluirLocalFormatter(value, row, index){
	return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluirLocal('+index+')"><i class="fas fa-trash-alt"></i>&nbsp;  Excluir</div></td>';
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
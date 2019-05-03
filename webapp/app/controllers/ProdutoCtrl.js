/**
 * Controller das regras de negócio do usuário 
 */

app.controller('ProdutoCtrl', ['$scope', '$window', '$routeParams','$http', function($scope, $window, $routeParams, $http){
	
	$scope.WebService = "WS/Produto/";
	$scope.tabInicial = 'dados'
	
	$scope.InicializarObjeto = function(){
		
		$scope.secundariasCarregadas = false;
		$scope.caracteristicasCarregadas = false;
		
		$scope.registro = { 
				precoCusto:"0", 
				precoUnitario:"0", 
				precoPromocional:"0",
				pesoBruto: "0",
				pesoLiquido: "0",
				utilizaEstoque: "S",
				variantes: [],
				caracteristicas: [],
				informacoes: [],
				imagemPrincipal: {},
				imagemMedidas: {},
				imagensSecundarias: []
		};
		$scope.srcImagemPrincipal = ''
			
		$scope.srcImagemMedidas = ''
		
		$scope.atualizaTabelaVariantes()
		$scope.atualizaImagemPrincipal()
		$scope.atualizaTabelaImagens()
	}
	
	$scope.variantes = []
	$scope.buscarVariantes = function(){
		$http.get("WS/Caracteristica/Tipo/C").then(function(response){
			if ( response.data ) {
				$scope.variantes = response.data	
			}
		});
	}	
	$scope.buscarVariantes();	
	
	$scope.marcas = []
	$scope.buscarMarcas = function(){
		$http.get("WS/Caracteristica/Tipo/M").then(function(response){
			if ( response.data ) {
				$scope.marcas = response.data	
			}
		});
	}	
	$scope.buscarMarcas();		
	
	$scope.adicionarVariante = function () {
		var caracteristica = { caracteristica: $scope.variante.caracteristica, tipoCaracteristica: $scope.variante.caracteristica.tipoVariavel};
		if ( verificarCaracteristicaJaCadastrado($scope.registro.variantes, caracteristica) ){
			$scope.registro.variantes.push(caracteristica);
			$scope.variante = {};
			
	    	$scope.renderizaTabelaVariantes();
		}
	}	
	
	$scope.adicionarMarca = function () {
		var caracteristica = { caracteristica: $scope.marca.caracteristica, tipoCaracteristica: $scope.marca.caracteristica.tipoVariavel};
		if ( verificarCaracteristicaJaCadastrado($scope.registro.marcas, caracteristica) ){
			$scope.registro.marcas.push(caracteristica);
			$scope.marca = {};
			
	    	$scope.renderizaTabelaMarcas();
		}
	}		
	
	
	function verificarCaracteristicaJaCadastrado(lista, item){
		for (var i = 0; i < lista.length; i++) {
			var itemCadastrado = lista[i];
			
			if ( itemCadastrado.caracteristica.id == item.caracteristica.id ) {
				
				$.confirm({
				    title: 'Atenção!',
				    content: 'Você já cadastrou este item!',
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
				return false;
				
			}
			
		}
		return true;
	}
	
	$scope.atualizarProdutos = function(){
		$http.get("WS/Produto").then( function(response) {
			if ( response.data ) {
		    	$('#tabela-principal').bootstrapTable('destroy')
				$('#tabela-principal').bootstrapTable({
			        data: response.data
			    });	
		    }
		});
	}
	$scope.atualizarProdutos();
	
	$scope.renderizaTabelaVariantes = function() {
    	$('#tabela-variantes').bootstrapTable('destroy')
		$('#tabela-variantes').bootstrapTable({
	        data: $scope.registro.variantes
	    });			
	}		
	
	$scope.atualizaTabelaVariantes = function() {
		if ( $scope.registro.id ) { //se tem id significa que é uma edição			
			$http.get("WS/Produto/" + $scope.registro.id +'/CaracteristicasVariaveis/C').then(function(response){
				$scope.registro.variantes = response.data;
				$scope.renderizaTabelaVariantes();
			})
		} else {
			$scope.registro.variantes = [];
			$scope.renderizaTabelaVariantes()
		}		
	}		
	
	
	
	
	$scope.renderizaTabelaMarcas = function() {
    	$('#tabela-marcas').bootstrapTable('destroy')
		$('#tabela-marcas').bootstrapTable({
	        data: $scope.registro.marcas
	    });			
	}		
	
	$scope.atualizaTabelaMarcas = function() {
		if ( $scope.registro.id ) { //se tem id significa que é uma edição			
			$http.get("WS/Produto/" + $scope.registro.id +'/CaracteristicasVariaveis/M').then(function(response){
				$scope.registro.marcas = response.data;
				$scope.renderizaTabelaMarcas();
			})
		} else {
			$scope.registro.marcas = [];
			$scope.renderizaTabelaMarcas()
		}		
	}		
	
	
	
	
	function renderizaTabelaImagens (dados) {
		$scope.secundariasCarregadas = true
    	$('#tabela-imagens').bootstrapTable('destroy')
		$('#tabela-imagens').bootstrapTable({
	        data: dados
	    });			
	}
	
	$scope.atualizaTabelaImagens = function() {
		
		if ( $scope.registro.id ) { //se tem id significa que é uma edição
			if ( ! $scope.secundariasCarregadas) { // se ela ainda não foi carregada do WS
				Pace.track(function(){
					$.ajax({
					    url: $scope.WebService + $scope.registro.id +'/Imagens',
					    type: 'GET',
					    headers: { 
					        'Accept': 'application/json',
					        'Content-Type': 'application/json' 
					    },
					    dataType: 'json',
					    success: function(data) {		    	
					    	$scope.registro.imagensSecundarias = data
					    	renderizaTabelaImagens ($scope.registro.imagensSecundarias)
					    }
					});
				});	
			} else { //se já foi carregada do WS só atualiza
				renderizaTabelaImagens ($scope.registro.imagensSecundarias)				
			}	
		} else {
			renderizaTabelaImagens($scope.registro.imagensSecundarias)
		}
			
	}	
	
	
	
	$scope.converterArquivo = function(file) {
		   var reader = new FileReader();
		   reader.readAsDataURL(file.files[0]);
		   reader.onload = function () {
			   var dados = reader.result.split("base64,")
			   $scope.registro.imagemPrincipal.bytes = dados[1]
			   $scope.atualizaImagemPrincipal()
			   $scope.atualizaImagemMedidas()
			   $scope.$apply()
			   $(file).val("")
		   };
		   reader.onerror = function (error) {
			   console.log('Error: ', error);
		   };
	}		
		
	function buscaImagemProdutoWS(idProduto, cb){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebService + idProduto +'/Imagem',
			    type: 'GET',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {		    	
			    	$scope.registro.imagemPrincipal = data
			    	cb()
			    }
			});
		});	
	}	
	
	function renderizaImagemPrincipal () {
		if( ! $scope.registro.imagemPrincipal.bytes){ //verifica se a imagem cadastrada realmente possui bytes
			$scope.srcImagemPrincipal = "dist/img/user-avatar.png"
		}else{
			$scope.srcImagemPrincipal = "data:image/png;base64," + $scope.registro.imagemPrincipal.bytes
		}			
	}
	
	$scope.atualizaImagemPrincipal = function(){

		if ( $scope.registro.id ) { //se tem id significa que é uma edição
			if ( ! $scope.registro.imagemPrincipal.id ) { //Se for uma edição e ainda não tenho o id da imagem então tem que buscar ela do WS
				buscaImagemProdutoWS($scope.registro.id, renderizaImagemPrincipal)
			} else {
				renderizaImagemPrincipal()
			}			
		} else { //se for uma inclusão já pode buscar a imagem default
			renderizaImagemPrincipal()
		}
		
	}			

    
	$scope.InicializarObjeto()
	
	
	$('#tabela-principal').bootstrapTable({});	
	

	$scope.statuses = {};
	$.get("WS/Status", function(data){
		if(data){
			$scope.statuses = data;
			$scope.$apply();
		}
	});
	
	$scope.categorias = {};
	$.get("WS/Categoria", function(data){
		if(data){
			$scope.categorias = data;
			$scope.$apply();
		}
	});
	

	
	$scope.salvar = function (){
		
		var data = $scope.registro;
		data.tipoProduto = 'P';
		
		data.caracteristicasVariaveis = $scope.registro.variantes.concat($scope.registro.marcas);
		$scope.registro.variantes = [];
		$scope.registro.marcas = [];
		
		Pace.track(function(){
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
			    	$scope.InicializarObjeto()			
					$scope.$apply();
					
					$('#modal_edicao').modal('hide');
					$scope.atualizarProdutos();			
			    }
			});
		})
	}
	
	
	$scope.editar = function (pValue){	
		$scope.ativarTab($scope.tabInicial);
		
		Pace.track(function(){
			$.get($scope.WebService + pValue, function(data){
				if(data){
					$scope.secundariasCarregadas = false
					$scope.caracteristicasCarregadas = false
					
					$scope.registro = data;
					$scope.registro.imagemPrincipal = {},
					$scope.registro.imagemMedidas = {},
					$scope.registro.imagensSecundarias = []				
					
					$scope.$apply();
					
					$scope.atualizaTabelaVariantes()
					$scope.atualizaTabelaMarcas()
					$scope.atualizaImagemPrincipal()
					$scope.atualizaTabelaImagens()
				}
			}).done(function(){
				$scope.ativarTab($scope.tabInicial)
				$('#modal_edicao').modal('show');
			});
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
		          		    	$scope.InicializarObjeto()
		          		    	$scope.atualizarProdutos();			
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
		$scope.InicializarObjeto()
		$scope.atualizaTabelaVariantes();
		$scope.atualizaTabelaMarcas();
		$scope.ativarTab($scope.tabInicial)
		$('#modal_edicao').modal('show');
	}


	$scope.excluirVariante = function (pId, pIndex){ 
		
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
		              action: function() {
		          			$scope.registro.variantes.splice(pIndex, 1);
		          			$scope.renderizaTabelaVariantes();			
		              }
		    	  },
		    	  cancel: function () { }
		    }
		});
	}	
	
	
	$scope.excluirMarca = function (pId, pIndex){ 
		
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
		              action: function() {
		          			$scope.registro.marcas.splice(pIndex, 1);
		          			$scope.renderizaTabelaMarcas();			
		              }
		    	  },
		    	  cancel: function () { }
		    }
		});
	}		

	$scope.converterArquivoSecundaria = function(file) {
		   var reader = new FileReader();
		   reader.readAsDataURL(file.files[0]);
		   reader.onload = function () {
			   var dados = reader.result.split("base64,")
			   $scope.registro.imagensSecundarias.push({bytes : dados[1]})
			   $scope.atualizaTabelaImagens()
			   $scope.$apply()
			   $(file).val("")
		   };
		   reader.onerror = function (error) {
			   console.log('Error: ', error);
		   };
	}	
	$scope.excluirImagem= function (pId, pIndex){    	
		$scope.registro.imagensSecundarias.splice(pIndex, 1);
		$scope.atualizaTabelaImagens();
	}	
	
		
	
	
	$scope.escondeTabs = function(){
		$('li[role="presentation"]').removeClass('active');
		$('div[role="tabpanel"]').hide()
	}
	$scope.ativarTab = function(nome){
		$scope.escondeTabs()
		$('#panel-' + nome).addClass('active');
		$('#tab-' + nome).show();	
	}	
	
		
	$scope.modalDuplicarProduto = function(id, index){
		$scope.novo = { 
				id: id,
				codigo: '',
				descricao: ''
			}
		$scope.$apply();
		$('#modal_duplicar').modal('show');
	}	
	
	$scope.duplicarProduto = function(){
		$http.post($scope.WebService + $scope.novo.id + '/Duplicar', $scope.novo).then(function(response){
			$scope.InicializarObjeto()			
			$('#modal_duplicar').modal('hide');
			$scope.atualizarProdutos();
		})		
	}		
	
	$scope.ativarDados = function(){
		$scope.escondeTabs()
		$('#panel-dados').addClass('active');
		$('#tab-dados').show();	
	}
	$scope.ativarVariantes = function(){	
		$scope.escondeTabs()
		$('#panel-variantes').addClass('active');
		$('#tab-variantes').show();
	}
	$scope.ativarMarcas = function(){	
		$scope.escondeTabs()
		$('#panel-marcas').addClass('active');
		$('#tab-marcas').show();
	}		
	$scope.ativarImagens = function(){	
		$scope.escondeTabs()
		$('#panel-imagens').addClass('active');
		$('#tab-imagens').show();
	}
	
}]);

function medidasFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().cadastroMedidas('+row.id + ',\'' + row.descricao +'\')" class="span-editar"><i class="fa fa-object-group"></i> Medidas</span>';	
}
function excluirTabelaMedidaFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirTabelaMedida('+row.id+','+index+')" class="span-inativar"><i class="fa fa-trash"></i> Excluir</span>';	
}

function excluirVarianteFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirVariante('+row.id+','+index+')" class="span-inativar"><i class="fa fa-trash"></i> Excluir</span>';	
}
function excluirMarcaFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirMarca('+row.id+','+index+')" class="span-inativar"><i class="fa fa-trash"></i> Excluir</span>';	
}

function excluirCaracteristicaFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirCaracteristica('+row.id+','+index+')" class="span-inativar"><i class="fa fa-trash"></i> Excluir</span>';	
}
function excluirImagemFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirImagem('+row.id+','+index+')" class="span-inativar"><i class="fa fa-trash"></i> Excluir</span>';	
}
function duplicarProdutoFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().modalDuplicarProduto('+row.id+','+index+')" class="span-tabela"><i class="far fa-clone"></i> Clonar</span>';	
}
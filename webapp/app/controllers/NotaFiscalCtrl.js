/**
 * Controller das regras de negócio do usuário 
 */

app.controller('NotaFiscalCtrl', function($scope, $http, $filter)
{
	$scope.WebService = "WS/NotaFiscal/";
	
	
	$scope.atualizarTabelaNotas = function () {
		
		$('#tabela-principal').bootstrapTable('destroy');
		$('#tabela-principal').bootstrapTable();
		
		$http.get('WS/NotaFiscal').
		then(function(response){
			if ( response.data ) {
				$('#tabela-principal').bootstrapTable('destroy');
				$('#tabela-principal').bootstrapTable({data: response.data});
			}
		})
		
	}
	$scope.atualizarTabelaNotas();
	
	
	
	$scope.fornecedores = [];
	$http.get("WS/Fornecedor").then( function(response){
		if(response.data){
			$scope.fornecedores = response.data;
		}
	});			
	
	$scope.clientes = [];
	$.get("WS/Cliente", function(data){
		if(data){
			$scope.clientes = $filter('orderBy')(data, 'nomeFantasia');
			$scope.$apply();
		}
	});	
	
	$scope.enderecos = [];
	$http.get("WS/Endereco").then( function(response){
		if(response.data){
			$scope.enderecos = response.data;
		}
	});		

	$scope.notaFiscal = {}
	$scope.modalNota = {}
	$scope.modalImportacao = {} 
	
	$scope.inicializarRegistro = function(){
		$scope.registro = {};
		$scope.registro.dataEmissao = new Date().toDateInputValue();
		$scope.registro.dataEntrega = new Date().toDateInputValue();
		$scope.registro.posicaoPedido = 'G';
		$scope.item = { precoTabela: "0"};
		$scope.registro.itens = [];
	}	
	
	
	
	$scope.atualizaTabelaItens = function() {
    	$('#tabela-itens').bootstrapTable('destroy')
		$('#tabela-itens').bootstrapTable({
	        data: $scope.registro.itens
	    });			
	}
	
	$scope.atualizaTabelaEmbalagens = function() {
    	$('#tabela-embalagens').bootstrapTable('destroy')
		$('#tabela-embalagens').bootstrapTable({
	        data: $scope.registro.embalagens
	    });			
	}
	
	$scope.inicializarRegistro()
	$scope.atualizaTabelaItens();
	
	
	$scope.clientes = {};
	$.get("WS/Cliente", function(data){
		if(data){
			$scope.clientes = data;
			$scope.$apply();
		}
	});
	
	$scope.tabelasPreco = {};
	$.get("WS/TabelaPreco", function(data){
		if(data){
			$scope.tabelasPreco = data;
			$scope.$apply();
		}
	});	
	$scope.transportadoras = {};
	$.get("WS/Transportadora", function(data){
		if(data){
			$scope.transportadoras = data;
			$scope.$apply();
		}
	});
	
	$scope.editar = function (pValue){	
		Pace.track(function(){
			$.get($scope.WebService + pValue, function(data){
				if(data){
					$scope.notaFiscal = data;
					$scope.$apply();
					$scope.atualizarTabelaDuplicatas(data.id)
					$scope.modalNota.registro = data
					$scope.modalNota.open();
				}
			})
		});		
		
	}	
		
	$scope.lerDadosXml = function (){
		$scope.notaFiscal = null;
		$http.post("WS/NotaFiscal/LerXml",$scope.arquivo)
			.then(function(response){
				$scope.notaFiscal = response.data;
			}
		)
	}		

	
	$scope.converterArquivo = function(file) {
		var reader = new FileReader();
		var loadedFile = file.files[0];
		reader.readAsDataURL(file.files[0]);
		reader.onload = function () {
			 var dados = reader.result.split("base64,")
			 
			 $scope.arquivo = {
				 bytes: dados[1],
				 nome: loadedFile.name,
				 tamanho: loadedFile.size,
				 contentType: loadedFile.type
			 }
			 
			 $scope.atualizaArquivo() 
			 $scope.notaFiscal = null;
			 $scope.$apply()
			 $(file).val("")
		   };
		   reader.onerror = function (error) {
		     console.log('Error: ', error);
		};
	}	

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
			    	
			    	$scope.atualizarDuplicatasPedido(data.id, $scope.duplicatas);
			    	
					$scope.registro = {};				
					$scope.$apply();
					
					$scope.modalNota.close();
					$scope.atualizarTabelaNotas();
					
			    }
			});
		});
	}	
	
	$scope.atualizarDuplicatasPedido = function (id, duplicatas){
		$http.post('WS/Duplicata/NotaFiscal/' + id, duplicatas).then(function(response){
			$scope.duplicatas = [];
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
		              text: 'Excluir',
		              btnClass: 'btn-red',
		              keys: ['enter',],
		              action: function(){
		            	  Pace.track(function(){
		          			$.ajax({
		          			    url: $scope.WebService + pValue,
		          			    type: 'DELETE',
		          			    success: function(data) {		    	
		          					$scope.atualizarTabelaNotas();			
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
	
	$scope.onSaveImportacao = function () {
		
		for (var x = 0; x < $scope.notaFiscal.itens.length; x++) {
			var item = $scope.notaFiscal.itens[x];
			if ( item.produtoFornecedor == null ) {
				$.confirm({
					title: "Ops ...",
				    content: "Existem produtos sem o produto do fornecedor defindo.",
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
				return ;
			}
		}		
		
		$scope.notaFiscal.arquivoXml = $scope.arquivo
		
		$http.post("WS/NotaFiscal/Importar", $scope.notaFiscal)
			.then(function(response){
				$scope.atualizarTabelaNotas();
				$scope.modalImportacao.close();
			}
		)
		
	}
	
	$scope.visualizarNF = function (id) {
		$scope.id = id;
		$scope.modalNota.open();
	}
	
	$scope.onOpenModal = function (id) {
		
		Pace.track(function(){
			$.get($scope.WebService + id + "/ComItens", function(data){
				if(data){
					$scope.registro = data;
					$scope.atualizarTabelaItensNota()
					$scope.atualizarTabelaDuplicatas($scope.registro.id)
					$scope.$apply();
				}
			})
		});			
		
	}
	
	$scope.atualizarTabelaDuplicatas = function (idNotaFiscal) {
		
		$scope.duplicatas = [];
		
		$('#tabela-duplicatas').bootstrapTable('destroy');
		$('#tabela-duplicatas').bootstrapTable();
		
		$http.get('WS/Duplicata/NotaFiscal/' + idNotaFiscal).
		then(function(response){
			if ( response.data ) {
				$scope.duplicatas = response.data;
				$scope.renderizaTabelaDuplicatas($scope.duplicatas);
			}
		})
		
	}	
	
	$scope.renderizaTabelaDuplicatas = function (data) {
		$('#tabela-duplicatas').bootstrapTable('destroy');
		$('#tabela-duplicatas').bootstrapTable({data: data});
		
		$scope.duplicata= {valor:'0'};
	}
	
	$scope.adicionarDuplicata = function(){	
		
		$scope.duplicatas.push($scope.duplicata);
		
		$scope.renderizaTabelaDuplicatas($scope.duplicatas);
	}	
	
	$scope.excluirDuplicata = function(index){	
		
		$scope.duplicatas.splice(index, 1);
		
		$scope.renderizaTabelaDuplicatas($scope.duplicatas);
	}		
	
	$scope.atualizarTabelaItensNota = function () {
		
		$('#tabela-itens-nota').bootstrapTable('destroy');
		$('#tabela-itens-nota').bootstrapTable();
		
		if ( $scope.registro.itens.length > 0 ) {
			$('#tabela-itens-nota').bootstrapTable('destroy');
			$('#tabela-itens-nota').bootstrapTable({data: $scope.registro.itens});
		}
	}	
		
	
	$scope.onOpenImportacao = function () {
		$scope.arquivo = {};
		$scope.notaFiscal = null;
		$scope.atualizaArquivo();
	}
	
	$scope.atualizaArquivo = function () {
		if ($scope.arquivo && $scope.arquivo.bytes){
			$scope.textoBotao = "Alterar arquivo"	
		} else {
			$scope.textoBotao = "Buscar arquivo"	
		}
	}

});

function excluirDuplicataFormatter(value, row, index){
    return '<span onclick="angular.element(this).scope().excluirDuplicata('+index+')" class="span-tabela bg-red"><i class="fas fa-trash"></i> Excluir</span>';	
}

function visualizarNFFormatter(value, row, index){
    return '<span onclick="angular.element(this).scope().visualizarNF('+row.id+')" class="span-tabela"><i class="fas fa-search"></i> Visualizar</span>';	
}

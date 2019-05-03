
app.controller('DicaCtrl', function($scope, $http)
{
	$scope.WebService = "WS/Dica/";
	$scope.inicializarObjeto = function () {
		$scope.registro = { situacao: 'A'};	
		$scope.registro.arquivo = {};
	}
	
	$scope.estados = []
	$http.get("WS/Estado").then(function(response){
		if(response.data){
			$scope.estados = response.data;
		}
	})
	
   	$scope.cidades = [];
   	$scope.buscaCidades = function () {
   		if ( $scope.registro.estado ) {
	   		$http.get("WS/Cidade/Estado/" + $scope.registro.estado.id).then(function(response){
	   			if(response.data){
	   				$scope.cidades = response.data;
	   			}
	   		})
   		} else {
   			$scope.cidades = [];
   		}
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
				$scope.atualizarTabelaPrincipal();
				showDetalhes('container-detalhes', 'container-principal');
		    }
		});
	}
	
	$scope.editar = function (pValue){		
		$.get($scope.WebService + pValue, function(data){
			if(data){
				$scope.registro = data;
				$scope.$apply();
				$scope.buscaCidades();
				$scope.atualizaArquivo();
				showDetalhes('container-principal', 'container-detalhes');
			}
		})
	}	
	
	$scope.fechar = function() {
		$.confirm({
		    title: 'Atenção!',
		    content: 'Você tem certeza que deseja fechar sem salvar?',
		    theme: 'material',
		    type: 'red',
		    buttons: {
		    	  confirmar: {
		              text: 'Fechar',
		              btnClass: 'btn-red',
		              keys: ['enter',],
		              action: function(){
		            	  showDetalhes('container-detalhes', 'container-principal');
		            	  $scope.atualizarTabelaPrincipal();
		              }
		          },
		        cancel: function () {
		        }
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
		$scope.buscaCidades();
		$scope.atualizaArquivo();
	}
	
	$scope.converterArquivo = function(file) {
		var reader = new FileReader();		   
		   
	   file.nome = file.files[0].name;
	   file.contentType = file.files[0].type;
	   
	   $scope.registro.arquivo.nome = file.nome;
	   $scope.registro.arquivo.contentType = file.contentType;
	   
	   reader.readAsDataURL(file.files[0]);
	   
	   reader.onload = function () {
		   var dados = reader.result.split("base64,")
		   $scope.registro.arquivo.bytes = dados[1];
		   $scope.atualizaArquivo();
		   $scope.$apply();
	   };
	   reader.onerror = function (error) {
		   console.log('Error: ', error);
	   };
	}
	$scope.atualizaArquivo = function(){
		$("#arquivoFile").val("");
		if ( $scope.registro.id ) { //se tem id significa que é uma edição
			if ( $scope.registro.arquivo == null ) { //Se for uma edição e ainda não tenho o id da arquivo então tem que buscar ela do WS
				buscaArquivoWS($scope.registro.id, renderizaArquivo);
			} else {
				renderizaArquivo();
			}			
		} else { //se for uma inclusão já pode buscar a arquivo default
			renderizaArquivo();
		}
		
	}
	
	function buscaArquivoWS(idDica, cb){
		$scope.idArquivo = idDica;
		Pace.track(function(){
			$.ajax({
			    url: "WS/Dica/" + idDica +'/Arquivo/Json',
			    type: 'GET',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {
			    	$scope.registro.arquivo = data;
			    	cb();
			    	$scope.$apply();
			    }
			});
		});	
	}
	
	function renderizaArquivo () {
		$scope.linkArquivo = "";
		$scope.nomeArquivo = "";
		if( $scope.registro.arquivo.bytes == null){ //verifica se a arquivo cadastrada realmente possui bytes
			$scope.nomeArquivo = "Sem arquivo";
		}else{
			$scope.nomeArquivo = $scope.registro.arquivo.nome;
			$scope.linkArquivo = "WS/Dica/"+$scope.idArquivo+"/Arquivo";
		}			
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


/**
 * Controller das regras de negócio do usuário 
 */

app.controller('PromocaoCtrl', function($scope)
{

	$scope.tabelaPrincipalTemp = {};
	
	$scope.inicializarRegistro = function () {
		$scope.registro = {
				arquivo: {
					byte: null,
				}
			};
		$scope.srcImagem = null;
	}
	$scope.inicializarRegistro();


	$scope.atualizaImagem = function(){

		if ( $scope.registro.id ) { //se tem id significa que é uma edição
			if ( ! $scope.registro.arquivo || ! $scope.registro.arquivo.id ) { //Se for uma edição e ainda não tenho o id da arquivo então tem que buscar ela do WS
				buscaImagemWS($scope.registro.id, renderizaImagem)
			} else {
				renderizaImagem()
			}			
		} else { //se for uma inclusão já pode buscar a arquivo default
			renderizaImagem()
		}
		
	}		
	
//	function atualizarPromocaos(){
//		$scope.tabelaPrincipal = {};
//		$.get("WS/Promocao/", function(data){
//			if(data){
//				$scope.tabelaPrincipal = data;
//				$scope.$apply();
//				$('#tabela-principal').bootstrapTable("destroy");		
//				$('#tabela-principal').bootstrapTable({data: $scope.tabelaPrincipal});
//				$( "html" ).removeClass( "loading" );
//			}
//		});		
//	}
//	
//	atualizarPromocaos();
	
	$scope.salvar = function (){		
		$.ajax({
		    url: "WS/Promocao/",
		    type: 'POST',
		    headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
		    dataType: 'json',
		    data: JSON.stringify($scope.registro),
		    success: function(data) {		    	
				$scope.registro = {};				
				$('#modal_edicao').modal('hide');
				atualizarPromocaos()
				$scope.$apply();
		    }
		});
	}
	
	
	
	$scope.editar = function (pValue){
		$scope.inicializarRegistro();
		$.get("WS/Promocao/" + pValue, function(data){
			if(data){
				$scope.registro = data;			
				$scope.atualizaImagem()
			}
		}).done(function(){
			$scope.$apply();
			document.getElementById('container-detalhes1').style.display = "block";
		    document.getElementById('container-detalhes1').style.opacity = "1";
		    document.getElementById('container-principal').style.opacity = "0";
			document.getElementById('container-principal').style.display = "none";
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
		          		    url: "WS/Promocao/" + pValue,
		          		    type: 'DELETE',
		          		    success: function(data) {		    	
		          				$scope.registro = {};
		          				atualizarPromocaos();		
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
		$scope.atualizaImagem();
		$('#modal_edicao').modal('show');
	}	
	
	$scope.converterArquivo = function(file) {
		   var reader = new FileReader();
		   reader.readAsDataURL(file.files[0]);
		   reader.onload = function () {
			   var dados = reader.result.split("base64,")
			   $scope.registro.arquivo.bytes = dados[1]
			   $scope.atualizaImagem()
			   $scope.$apply()
			   $(file).val("")
		   };
		   reader.onerror = function (error) {
			   console.log('Error: ', error);
		   };
	}	
	
	
	function buscaImagemWS(idPromocao, cb){
		Pace.track(function(){
			$.ajax({
			    url: "WS/Promocao/" + idPromocao +'/Arquivo',
			    type: 'GET',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    success: function(data) {		    	
			    	$scope.registro.arquivo = data
			    	cb()
					$scope.$apply();
			    }
			});
		});	
	}		
	
	function renderizaImagem () {
		if( ! $scope.registro.arquivo.bytes){ //verifica se a arquivo cadastrada realmente possui bytes
			$scope.srcImagem = "dist/img/user-avatar.png"
		}else{
			$scope.srcImagem = "data:image/png;base64," + $scope.registro.arquivo.bytes
		}			
	}
	
	//Pagination
	$scope.pagination = {}; 
	
	url = 'WS/Promocao';
	
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
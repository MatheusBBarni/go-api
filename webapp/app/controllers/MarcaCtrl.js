/**
 * Controller das regras de negócio do usuário 
 */

app.controller('MarcaCtrl', function($scope)
{

	$scope.caracteristicasTemp = {};
	
	$scope.inicializarRegistro = function () {
		$scope.registro = {
				imagem: {
					byte: null,
				}
			};
		$scope.srcImagem = null;
	}
	$scope.inicializarRegistro();


	$scope.atualizaImagem = function(){

		if ( $scope.registro.id ) { //se tem id significa que é uma edição
			if ( ! $scope.registro.imagem || ! $scope.registro.imagem.id ) { //Se for uma edição e ainda não tenho o id da imagem então tem que buscar ela do WS
				buscaImagemWS($scope.registro.id, renderizaImagem)
			} else {
				renderizaImagem()
			}			
		} else { //se for uma inclusão já pode buscar a imagem default
			renderizaImagem()
		}
		
	}		
	
	function atualizarCaracteristicas(){
		$scope.caracteristicas = {};
		$.get("WS/Caracteristica/Tipo/M", function(data){
			if(data){
				$scope.caracteristicas = data;
				$scope.$apply();
				$('#tabela-principal').bootstrapTable("destroy");		
				$('#tabela-principal').bootstrapTable({data: $scope.caracteristicas});
				$( "html" ).removeClass( "loading" );
			}
		});		
	}
	
	atualizarCaracteristicas()
	
	$scope.salvar = function (){
		$scope.registro.tipoVariavel = 'M';
		$.ajax({
		    url: "WS/Caracteristica",
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
				atualizarCaracteristicas()
				$scope.$apply();
		    }
		});
	}
	
	
	
	$scope.editar = function (pValue){
		$scope.inicializarRegistro();
		$.get("WS/Caracteristica/" + pValue, function(data){
			if(data){
				$scope.registro = data;			
				$scope.atualizaImagem()
			}
		}).done(function(){
			$scope.$apply();
			$('#modal_edicao').modal('show');
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
		          		    url: "WS/Caracteristica/" + pValue,
		          		    type: 'DELETE',
		          		    success: function(data) {		    	
		          				$scope.registro = {};
		          				atualizarCaracteristicas();		
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
			   $scope.registro.imagem.bytes = dados[1]
			   $scope.atualizaImagem()
			   $scope.$apply()
			   $(file).val("")
		   };
		   reader.onerror = function (error) {
			   console.log('Error: ', error);
		   };
	}	
	
	
	function buscaImagemWS(idCaracteristica, cb){
		Pace.track(function(){
			$.ajax({
			    url: "WS/Caracteristica/" + idCaracteristica +'/Imagem',
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
		if( ! $scope.registro.imagem.bytes){ //verifica se a imagem cadastrada realmente possui bytes
			$scope.srcImagem = "dist/img/user-avatar.png"
		}else{
			$scope.srcImagem = "data:image/png;base64," + $scope.registro.imagem.bytes
		}			
	}

	

});
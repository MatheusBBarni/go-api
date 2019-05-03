/**
 * Controller das regras de negócio do usuário 
 */

app.controller('UsuariosCtrl', function($scope)
{
	$scope.WebService = "WS/Usuario/";
	$scope.usuario = { sistema: []};

	$('#tabela-usuarios').bootstrapTable({
		onLoadSuccess: function(){
		      $( "html" ).removeClass( "loading" );
		    }
	});	
		
	$scope.salvar = function (){
		$scope.usuario.tipoUsuario = 'S';

		$.ajax({
		    url: $scope.WebService,
		    type: 'POST',
		    headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
		    dataType: 'json',
		    data: JSON.stringify($scope.usuario),
		    success: function(data) {		    	
				$scope.usuario = {};
				$scope.$apply();

				$('#modal_usuario').modal('hide');
				$('#tabela-usuarios').bootstrapTable("refresh");				
		    }
		});
	}
	$scope.editar = function (pValue){		
		$.get($scope.WebService + pValue, function(data){
			if(data){
				$scope.usuario = data;			
				$scope.usuario.senha = "";
				$scope.$apply();
			}
		}).done(function(){
			document.getElementById('container-detalhes').style.display = "block";
		    document.getElementById('container-detalhes').style.opacity = "1";
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
			          		    url: $scope.WebService + pValue,
			          		    type: 'DELETE',
			          		    success: function(data) {		    	
			          				$scope.usuario = {sistema: []};
			          				$('#tabela-usuarios').bootstrapTable("refresh");				
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
		$scope.usuario = { situacao: "A"};
		$('#modal_usuario').modal('show');
	}
	
	$scope.converterArquivo = function(file) {
	   var reader = new FileReader();
	   reader.readAsDataURL(file.files[0]);
	   reader.onload = function () {
		 var dados = reader.result.split("base64,")
		 $scope.usuario.imagem = dados[1]
	   };
	   reader.onerror = function (error) {
	     console.log('Error: ', error);
	   };
	}	
});
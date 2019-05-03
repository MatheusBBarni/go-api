/**
 * Controller das regras de negócio do usuário 
 */

app.controller('CategoriaCtrl', function($scope)
{
	$scope.WebService = "WS/Categoria/";
	$scope.registro = {};
	
	$('#tabela-principal').bootstrapTable();
	function atualizarCategorias(){
		$scope.categorias = {};
		Pace.track(function(){
			$.get("WS/Categoria", function(data){
				if(data){
					$scope.categorias = data;
					$scope.$apply();
					$('#tabela-principal').bootstrapTable("destroy");
					
					$scope.categoriasPais = []
					for (var i = 0; i < $scope.categorias.length; i++) {
						if(! $scope.categorias[i].categoriaPai){
							$scope.categoriasPais.push($scope.categorias[i])
						}
					}
					
					$('#tabela-principal').bootstrapTable({data: $scope.categorias});					
				}
			});
		});
	}
	
	atualizarCategorias()
	
	$scope.salvar = function (){
		
		if (isValidForm($scope.formCadastro) == false) {
			return;
		}		
		
		var data = $scope.registro;
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
					$scope.registro = {};				
					$scope.$apply();
					$('#modal_edicao').modal('hide');
					atualizarCategorias()				
			    }
			});
		});
	}
	

	
	
	$scope.editar = function (pValue){		
		Pace.track(function(){
			inicializeForm($scope.formCadastro) 
			$.get($scope.WebService + pValue, function(data){
				if(data){
					$scope.registro = data;			
					
					$scope.$apply();
					$('#modal_edicao').modal('show');
				}
			}).done(function(){
			});
		});
	}	
	
	$scope.excluir = function (pValue){
		Pace.track(function(){
			$.ajax({
			    url: $scope.WebService + pValue,
			    type: 'DELETE',
			    success: function(data) {		    	
					$scope.registro = {};
					atualizarCategorias();		
			    }
			});
		});
	}	

	$scope.incluir = function (){
		$scope.registro = {};
		inicializeForm($scope.formCadastro) 
	}	
});


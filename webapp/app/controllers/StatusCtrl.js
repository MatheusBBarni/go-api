/**
 * Controller das regras de negócio do usuário 
 */

app.controller('StatusCtrl', function($scope)
{
	$scope.WebService = "WS/Status/";
	$scope.registro = {bloqueia: 'N'};
	
	$('#tabela-principal').bootstrapTable();
	
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
					$('#tabela-principal').bootstrapTable("refresh");		
					$scope.registro = { bloqueia: "N"};
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
				//$('#modal_edicao').modal('show');
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
					$('#tabela-principal').bootstrapTable("refresh");				
			    }
			});
		});
	}	
	$scope.incluir = function (){
		inicializeForm($scope.formCadastro) 
	}
	

    $('[data-toggle="tooltip"]').tooltip(); 
});


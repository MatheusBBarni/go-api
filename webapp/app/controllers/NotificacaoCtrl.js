/**
 * Controller das regras de negócio do usuário 
 */

app.controller('NotificacaoCtrl', function($scope)
{
	$scope.WebService = "WS/LayoutNotificacao/";
	
	
	$('#tabela-principal').bootstrapTable( { 
		url : $scope.WebService 
	} );
	
	
	  $scope.tinymceOptions = {
		  valid_elements : '*[*]',
		  height: 300,
		  plugins: [
		    "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
		    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
		    "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern"
		  ],
		  toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
		  toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
		  toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
		  menubar: true,
		  toolbar_items_size: 'small'
	  };		

	
	$.get($scope.WebService + "/Gatilhos", function(data){
		if(data){
			$scope.gatilhos = data							
			$scope.$apply();
		}
	});	
	
	
	$scope.inicializarObjeto = function (){
		$scope.registro = {
			sePortal : 'S',
			sePush: 'S',
			seEmail: 'S'
		};
	}
	
	$scope.salvar = function (){
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
			    	$scope.inicializarObjeto()				
					$scope.$apply();
					
					$('#modal_edicao').modal('hide');
					$('#tabela-principal').bootstrapTable("refresh");				
			    }
			});
		});
	}
	
	$scope.editar = function (pValue){

		Pace.track(function(){
			$.get($scope.WebService + pValue, function(data){
				if(data){
					$scope.inicializarObjeto()				
					$scope.registro = data;			
					$scope.$apply();
				}
			}).done(function(){
				$('#modal_edicao').modal('show');
				$scope.ativarGeral()
			});
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
		          },
		        cancel: function () {
		        }
		    }
		});
		
		
	}	
	
	$scope.incluir = function (){
		$scope.inicializarObjeto()				
		$('#modal_edicao').modal('show');
		$scope.ativarGeral()		
	}
		
	
	
	
	$scope.escondeTabs = function(){
		$('li[role="presentation"]').removeClass('active');
		$('div[role="tabpanel"]').hide()
	}
	
	$scope.ativarGeral = function(){
		$scope.escondeTabs()
		$('#panel-geral').addClass('active');
		$('#tab-geral').show();	
	} 
	
	$scope.ativarPortal = function(){
		$scope.escondeTabs()
		$('#panel-portal').addClass('active');
		$('#tab-portal').show();	
	}
	
	$scope.ativarPush= function(){
		$scope.escondeTabs()
		$('#panel-push').addClass('active');
		$('#tab-push').show();	
	}
	
	$scope.ativarEmail= function(){
		$scope.escondeTabs()
		$('#panel-email').addClass('active');
		$('#tab-email').show();	
	}			
});


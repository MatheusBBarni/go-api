app.controller('FormOrdemCorteCtrl', function($scope, $http, $ngConfirm, FilialService)
{
	var vm = this;
	
	vm.api = $scope.api;
	vm.onSaveCallBack = $scope.onSaveCallBack; 
	
	vm.WebService = "WS/OrdemCorte/";
	vm.configuracao = {};
	vm.fornecedores = [];
	vm.filiais = [];
	
	
	
	vm.init = function () {
		vm.inicializarRegistro();
		
		vm.api.incluir = vm.incluir;
		vm.api.editar = vm.editar;
		vm.api.cancelar = vm.cancelar;
		vm.api.concluir = vm.concluir;
		vm.api.modalConcluirOrdemCorte = vm.modalConcluirOrdemCorte;
		
		vm.buscarConfiguracao();
		vm.buscarFornecedores();
		vm.buscarFiliais();
	}
	
	
	
	vm.inicializarRegistro = function(){
		
		vm.registro = {};
		vm.registro.dataEmissao = Date.today();
		vm.registro.dataEntrega = Date.today();
		vm.registro.posicaoOrdemCorte = 'A';
		
		diasParaEntrega = vm.configuracao.diasEntregaOrdemCorte;
		if ( diasParaEntrega > 0 ) {
			vm.registro.dataEntrega = Date.today().add(diasParaEntrega).days();;
		}
		
	}		
	
	vm.buscarFiliais = function () {
		FilialService.findAll().then(function(response){
			if(response.data){
				vm.filiais = response.data;
			}
		});	
	}	
	
	vm.buscarConfiguracao = function () {
		$.get("WS/Configuracao", function(data){
			if(data){
				vm.configuracao = data;
			}
		});	
	};
	
	vm.buscarFornecedores = function (){
		var url = "WS/Fornecedor"; 
		$http.get(url).then(function(response){
			if(response.data){
				vm.fornecedores = response.data;
			}
		});		
	}	
	
	vm.changeProdutoSaida = function (){		
		var url = "WS/Produto/"+ vm.item.produto.id +"/Variantes"; 
		$http.get(url).then(function(response){
			if(response.data){
				vm.variantes = response.data;
			}
		});
	};	
	
	vm.salvar = function (){
		
		var data = vm.registro;
		
		Pace.track(function(){			
			$.ajax({
			    url: vm.WebService,
			    type: 'POST',
			    headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
			    dataType: 'json',
			    data: JSON.stringify(data),
			    success: function(data) {		    	
					vm.registro = {};				
					$('#modal-form-ordem-corte').modal('hide');
					vm.onSaveCallBack();
			    }
			});
		});
	};
	
	vm.editar = function (pValue){	
		Pace.track(function(){
			
			var url = vm.WebService + pValue
			$http.get(url).
			then(function(response){
				if ( response.data )
					vm.registro = response.data;
					$('#modal-form-ordem-corte').modal('show');
				}
			)			
			
		});
	};
	
	vm.modalConcluirOrdemCorte = function (pValue){	
		Pace.track(function(){
			vm.registro = {
				id: pValue,
				dataEntrega: Date.today(),
				valorServico: '0'
			}
			$scope.$apply();
			$('#modal-form-concluir-ordem-corte').modal('show');
		});
	};	

	vm.concluirOrdemCorte = function () {
    	Pace.track(function(){
			var url = vm.WebService + "Concluir";
			$http.post(url, vm.registro).then(function() {
				$('#modal-form-concluir-ordem-corte').modal('hide');
				vm.onSaveCallBack();
			});
		});
	}
	
	vm.cancelar = function (pValue){
		
		$ngConfirm({
		    title: 'ATENÇÃO',
		    content: 'Tem certeza que deseja cancelar a ordem de corte?',
		    type: 'red',
		    buttons: {
		        sim: {
		        	text: 'Sim',
		            btnClass: 'btn-green',
		            action: function(){
		            	Pace.track(function(){
		        			var url = vm.WebService + pValue + "/Cancelar";
		        			$http.post(url, {}).then(function() {
		        				vm.onSaveCallBack();
		        			});
		        		});
		            }
		        },
		        nao: {
		            text: 'Não',
		            btnClass: 'btn-red',
		        }
		    }
		});		
	};	
	
	
	vm.concluir = function (pValue){
		
		$ngConfirm({
		    title: 'ATENÇÃO',
		    content: 'Tem certeza que deseja concluir a ordem de corte ' + pValue +'?',
		    type: 'green',
		    buttons: {
		        sim: {
		        	text: 'Sim',
		            btnClass: 'btn-green',
		            action: function(){
		            	Pace.track(function(){
		        			var url = vm.WebService + pValue + "/Concluir";
		        			$http.post(url, {}).then(function() {
		        				vm.onSaveCallBack();
		        			});
		        		});
		            }
		        },
		        nao: {
		            text: 'Não',
		            btnClass: 'btn-red',
		        }
		    }
		});		
	};		

	
	vm.incluir = function (posicaoOrdemCorte){
		vm.inicializarRegistro();
		vm.atualizaTabelaItens();
		if ( posicaoOrdemCorte != '' ) {
			vm.registro.posicaoOrdemCorte = posicaoOrdemCorte;	
		}
		$('#modal-form-ordem-corte').modal('show');
		vm.ativarDados()
	};
	

	vm.init();
});

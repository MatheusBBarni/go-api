app.controller('ConsultaOrdemCorteCtrl', function($scope, $timeout, $http, FilialService) {

	var vm = this;
	
	vm.WebService = "WS/OrdemCorte/";
	vm.formOrdemCorteApi = {};
	vm.formConcluirOrdemCorteApi = {};
	vm.statusOrdemCorte = $scope.statusOrdemCorte;
	vm.filiais = [];
	vm.filtro = {posicaoOrdemCorte: vm.statusOrdemCorte};
	
	
	vm.init = function () {
		vm.atualizarTabela();	
		vm.buscarFiliais();
	}

	
	
	vm.atualizarTabela = function () {
		
		$('#tabela-ordens-corte').bootstrapTable('destroy');
		$('#tabela-ordens-corte').bootstrapTable();
		$('#tabela-ordens-corte').bootstrapTable('showLoading');
		
		Pace.track(function(){
			$http.post(vm.WebService + "Filtrar", vm.filtro).
			then(function(response){
				if ( response.data ) {
					$('#tabela-ordens-corte').bootstrapTable('destroy');
					$('#tabela-ordens-corte').bootstrapTable({data: response.data});	
				}
				$('#tabela-ordens-corte').bootstrapTable('hideLoading');
			})
		});		
	};
	
	vm.buscarFiliais = function () {
		FilialService.findAll().then(function(response){
			if(response.data){
				vm.filiais = response.data;
			}
		});	
	}		
	
	vm.visualizarOrdemCorte = function (id) {
		vm.formOrdemCorteApi.editar(id)
	}
	
	vm.concluirOrdemCorte = function (id) {
		vm.formConcluirOrdemCorteApi.modalConcluirOrdemCorte(id)
	}	
	
	vm.cancelarOrdemCorte = function (id) {
		vm.formOrdemCorteApi.cancelar(id)
	}
	

	
	$timeout(function(){
		vm.init();
	},0,false);
});
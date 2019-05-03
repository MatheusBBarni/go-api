app.directive('dcConsultaOrdemCorte', function() {
	return {
		restrict: 'AE',
		templateUrl: 'modules/ordem-corte/templates/consulta-ordem-corte.template.html',
		controller: 'ConsultaOrdemCorteCtrl',
		controllerAs: 'ctrl',
		scope : {
			statusOrdemCorte : '@'
		}
	}
});
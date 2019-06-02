app.directive('dcFormConcluirOrdemCorte', function() {
	return {
		restrict: 'AE',
		templateUrl: 'modules/ordem-corte/templates/form-concluir-ordem-corte.template.html',
		controller: 'FormOrdemCorteCtrl',
		controllerAs: 'ctrl',
		scope : {
			api: '=',
			onSaveCallBack: '&'
		},
	}
});
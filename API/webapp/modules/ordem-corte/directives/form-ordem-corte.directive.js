app.directive('dcFormOrdemCorte', function() {
	return {
		restrict: 'AE',
		templateUrl: 'modules/ordem-corte/templates/form-ordem-corte.template.html',
		controller: 'FormOrdemCorteCtrl',
		controllerAs: 'ctrl',
		scope : {
			api: '=',
			onSaveCallBack: '&'
		},
	}
});
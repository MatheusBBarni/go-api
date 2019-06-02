app.directive('dcModalCadastro', function() {
	return {
		restrict: 'AE',
		transclude : true,
		templateUrl: 'modules/layout/templates/modal-cadastro.template.html',
		controller: 'ModalCadastroCtrl',
		controllerAs: 'ctrl',
		scope : {
			id : '@',
			title: '@',
			canSave: '@',
			api: '=',
			onSave: '&',
			onCancel: '&',
			onOpen: '&'
		},
	}
});
app.controller('ModalCadastroCtrl', function($scope)
{
	var vm = this;
	
	vm.title = $scope.title;
	vm.canSave = $scope.canSave;
	vm.id = $scope.id;
	vm.api = $scope.api;
	
	vm.elementSelector = '.modal[id="'+vm.id+'"]';
	
	vm.onOpen = $scope.onOpen;
	vm.onSave = $scope.onSave;
	vm.onCancel = $scope.onCancel;

	
	vm.save = function () {
		if ( vm.onSave ) {
			vm.onSave()
		} else {
			$(vm.elementSelector).modal('hide');
		}	
	}
	
	vm.cancel = function () {
		vm.onCancel()	
		$(vm.elementSelector).modal('hide');
	}	
	
	vm.api.open = function () {
		if ( vm.onOpen ){
			vm.onOpen();	
		}
		$(vm.elementSelector).modal('show');
	}

	vm.api.close = function () {
		$(vm.elementSelector).modal('hide');
	}	
	
});

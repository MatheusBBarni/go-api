app.directive('dcField', function() {
	return {
		restrict : 'E',
		transclude : true,
		replace : true,
		scope: {
			label: '@',
			class: '@',
			type: '@',
			decimais: '@',
			model: '='
		},
		template: `<input class="form-control" ng-model="model" type="{{type == 'number' ? 'text' : type}}" ng-attr-ui-number-mask="{{type == 'number' ? decimais : 'undefined'}}" />`,
	}
})
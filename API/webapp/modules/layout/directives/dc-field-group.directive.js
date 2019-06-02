app.directive('dcFieldGroup', function() {
	return {
		restrict : 'E',
		transclude : true,
		replace : true,
		scope: {
			label: '@',
			class: '@',
			type: '@',
			decimais: '@',
			readonly: '@',
			model: '=',
			change: '='
		},
		template: `	<div class="{{class}}">
						<label class="label-form">{{label}}</label>
						
						<input ng-show="type != 'number'" class="form-control" ng-model="model" ng-change="change" type="{{type}}"/>
						<input ng-show="type == 'number'" class="form-control" ng-model="model" ng-change="change" type="text" ng-attr-ui-number-mask="{{decimais}}""/>
						
					</div>`,
	}
})
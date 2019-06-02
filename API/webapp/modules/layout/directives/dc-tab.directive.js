app.directive('dcTab', function() {
	return {
		restrict : 'E',
		transclude : true,
		template: '<div role="tabpanel" ng-show="active" ng-transclude></div>',
		require : '^dcTabset',
		scope : {
			heading : '@'
		},
		link : function(scope, elem, attr, tabsetCtrl) {
			scope.active = false
			tabsetCtrl.addTab(scope)
		}
	}
})
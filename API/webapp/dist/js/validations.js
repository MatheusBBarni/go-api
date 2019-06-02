
inicializeForm = function (form){

	angular.element(form.$$element[0].closest('div')).find('.error-block').remove()
	form.$dirty = false
	form.$submitted = false
}

isValidForm = function (form){

	form.$setSubmitted()
	
    for (control of form.$$controls) {
        control.$setDirty();
        control.$validate();
    }	
	
	if (form.$invalid == true) {
		return false;
	} else {
		return true;
	}	
}

app.directive('dcNotEmpty', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			
			ctrl.$validators.notEmpty = function(modelValue, viewValue) {
				
				var classValidation = 'dcNotEmpty'
				var descErro = 'Este campo precisa estar preenchido'	
				
				for (var i = 0; i < elm.length; i++) {
					
					angular.element(elm[i].closest('div')).find('.'+classValidation+'-error').remove()
					
					if (ctrl.$isEmpty(modelValue)) {
						angular.element(elm[i].closest('div')).addClass('has-error')
						if(ctrl.$$parentForm.$submitted == true) {
							angular.element(elm[i].closest('div')).append('<span class="help-block error-block '+classValidation+'-error" style="margin-bottom: 0">'+descErro+'</span>')
						}
						return false;
					} else {
						if ( angular.element(elm[i].closest('div')).find('.error-block').length == 0){
							angular.element(elm[i].closest('div')).removeClass('has-error')
						}	
						return true;
					}
				}
			};	
			
		}
	};
});

app.directive('dcNotEmptyIf', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			
			ctrl.$validators.notEmpty = function(modelValue, viewValue) {
			
				var condition = attrs.dcNotEmptyIf
				var classValidation = 'dcNotEmptyIf'
				var descErro = 'Este campo precisa estar preenchido'	
				
				if (condition == "false"){
					return true;
				}
									
					
				for (var i = 0; i < elm.length; i++) {
					
					angular.element(elm[i].closest('div')).find('.'+classValidation+'-error').remove()
					
					if (ctrl.$isEmpty(modelValue)) {
						angular.element(elm[i].closest('div')).addClass('has-error')
						if(ctrl.$$parentForm.$submitted == true) {
							angular.element(elm[i].closest('div')).append('<span class="help-block error-block '+classValidation+'-error" style="margin-bottom: 0">'+descErro+'</span>')
						}
						return false;
					} else {
						if ( angular.element(elm[i].closest('div')).find('.error-block').length == 0){
							angular.element(elm[i].closest('div')).removeClass('has-error')
						}	
						return true;
					}
				}
			};	
			
		}
	};
});

app.directive('dcNotEmptyNumber', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {

			ctrl.$validators.notEmpty = function(modelValue, viewValue) {
				
				var classValidation = 'dcNotEmptyNumber'
				var descErro = 'Este campo precisa ser maior que zero'	
				
				for (var i = 0; i < elm.length; i++) {
					
					angular.element(elm[i].closest('div')).find('.'+classValidation+'-error').remove()
					
					if (ctrl.$isEmpty(modelValue) || modelValue == 0) {
						angular.element(elm[i].closest('div')).addClass('has-error')
						if(ctrl.$$parentForm.$submitted == true) {
							angular.element(elm[i].closest('div')).append('<span class="help-block error-block '+classValidation+'-error" style="margin-bottom: 0">'+descErro+'</span>')
						}
						return false;
					} else {
						if ( angular.element(elm[i].closest('div')).find('.error-block').length == 0){
							angular.element(elm[i].closest('div')).removeClass('has-error')
						}	
						return true;
					}
				}
			};	
			
		}
	};
});

app.directive('dcMinLegth', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {

			ctrl.$validators.minLength = function(modelValue, viewValue) {
				
				var tamanhoMinimo = attrs.dcMinLegth
				var classValidation = 'dcMinLegth'
				var descErro = 'Este campo precisa ter pelo menos '+ tamanhoMinimo +' caracteres'				
				
				for (var i = 0; i < elm.length; i++) {
					
					angular.element(elm[i].closest('div')).find('.'+classValidation+'-error').remove()
				
					if ( !modelValue || modelValue.length < tamanhoMinimo) {
						angular.element(elm[i].closest('div')).addClass('has-error')
						if(ctrl.$$parentForm.$submitted == true) {
							angular.element(elm[i].closest('div')).append('<span class="help-block error-block '+classValidation+'-error" style="margin-bottom: 0">'+descErro+'</span>')
						}
						return false;
					} else {
						if ( angular.element(elm[i].closest('div')).find('.error-block').length == 0){
							angular.element(elm[i].closest('div')).removeClass('has-error')
						}	
						return true;
					}
				}
				
			};
		}
	};
});


app.directive('dcMaxLegth', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {

			ctrl.$validators.maxLength = function(modelValue, viewValue) {
				
				var tamanhoMaximo = attrs.dcMaxLegth
				var classValidation = 'dcMaxLegth'
				var descErro = 'Este campo não pode ter mais de '+ tamanhoMaximo +' caracteres'
				
				for (var i = 0; i < elm.length; i++) {
					
					angular.element(elm[i].closest('div')).find('.'+classValidation+'-error').remove()
				
					if ( ! ctrl.$isEmpty(modelValue) && modelValue.length > tamanhoMaximo) {
						angular.element(elm[i].closest('div')).addClass('has-error')
						if(ctrl.$$parentForm.$submitted == true) {
							angular.element(elm[i].closest('div')).append('<span class="help-block error-block '+classValidation+'-error" style="margin-bottom: 0">'+descErro+'</span>')
						}
						return false;
					} else {
						if ( angular.element(elm[i].closest('div')).find('.error-block').length == 0){
							angular.element(elm[i].closest('div')).removeClass('has-error')
						}	
						return true;
					}
				}
				
			};
		}
	};
});
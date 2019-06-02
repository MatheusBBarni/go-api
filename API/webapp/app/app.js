/*
  * App Angular
*/
var app = angular.module('app',['ngRoute','ui.utils.masks','ui.tinymce','cp.ngConfirm']);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.config(function($routeProvider)
{
	
   $routeProvider

   .when('/home', {
      templateUrl : 'app/views/produto.html',
      controller     : 'ProdutoCtrl',
   }) 
	
   // caso não seja nenhum desses, redirecione para a rota '/'
   .otherwise ({
	   redirectTo: 'home'
   }); 
   
});

app.directive("input", function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            if (attr['type'] === 'date'){
                modelCtrl.$formatters.push(function(modelValue) {
                    if (modelValue){
						var date = new Date(modelValue)
						var userTimezoneOffset = date.getTimezoneOffset() * 60000;
						date = new Date(date.getTime() + userTimezoneOffset);                    	
                        return date;
                    }
                    else {
                        return null;
                    }
                });
            }

        }
    };
});

function openMenu(menu){
	
	var act = $('#sidebar').hasClass("active");

    if(act){
    	$('#sidebar').toggleClass('active');       
    }else{
    }
	
	
	
	$(".collapse").collapse('hide');
	$("#" + menu).collapse('show');
}


function openSubMenu(menu){
	
	$(".sub-collapse").collapse('hide');
	$("#" + menu).collapse('show');
}

function acertarSituacao(pValue){
	if(pValue === "A")
	{
		return "Ativo";
	}
	else
	{
		return "Inativo";
	}
}

function simNaoFormatter(pValue) {
	if (pValue === 'S') {
		return "Sim";
	} else {
		return "Não";
	}
}

function acertarSimNao(pValue){
	if(pValue === 'S')
	{
		return "Sim";
	}
	else
	{
		return "Não";
	}
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function editarFormatter (value, row, index){
	return '<div class="span-padrao span-editar" onclick="angular.element(this).scope().editar('+row.id+')"><i class="fas fa-pen"></i>&nbsp;  Editar</div>';	
}
function excluirFormatter (value, row, index){
	return '<div class="span-padrao span-excluir" onclick="angular.element(this).scope().excluir('+row.id+')"><i class="fas fa-trash-alt"></i>&nbsp;  Excluir</div>';
}
function excluirIndexFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().excluirIndex('+index+')" class="span-tabela bg-red"><i class="fa fa-trash"></i> Excluir</span>';	
}

function imageFormatter(bytes){
	var src;
	if(!bytes){
		src = "dist/img/user-avatar.png"
	}else{
		src = "data:image/png;base64," + bytes
	}	
	return '<img src="' + src +'" class="img-responsive" width="150px">';
}

 function dateFormatter(date){

	if(date == null){
		return date
	}
	
	var date = new Date(date)
	var userTimezoneOffset = date.getTimezoneOffset() * 60000;
	formattedDate = new Date(date.getTime() + userTimezoneOffset);  	
	
	var d = formattedDate.getDate();    
	if(d < 10){    	    
		d = "0"+d
	}
	var m =  formattedDate.getMonth();
	m += 1;  // JavaScript months are 0-11
	if(m < 10){
		m = "0"+m
	}
	var y = formattedDate.getFullYear();
	Data =  d + "/" + m + "/" + y
	return Data

}
 
 function dateTimeFormatter(date){

	if(date == null){
		return date
	}
	
	var date = new Date(date)
	var userTimezoneOffset = date.getTimezoneOffset() * 60000;
	formattedDate = new Date(date.getTime() + userTimezoneOffset);  	
	
	var d = formattedDate.getDate();    
	if(d < 10){    	    
		d = "0"+d
	}
	var m =  formattedDate.getMonth();
	m += 1;  // JavaScript months are 0-11
	if(m < 10){
		m = "0"+m
	}
	let hora = date.getHours()
	let minutos = date.getMinutes()
	let segundos = date.getSeconds()
	
	if(hora < 10) {
		hora = "0"+hora
	}
	if(minutos < 10) {
		minutos = "0"+minutos
	}
	if(segundos < 10) {
		segundos = "0"+segundos
	}
	var time = hora + ":" + minutos + ":" + segundos
	var y = formattedDate.getFullYear()
	Data =  d + "/" + m + "/" + y + " - " + time
	return Data

}

 Pace.on('done', function() {	 
 	$(':button').prop('disabled', false); // Disable all the buttons
 });
 Pace.on('start', function() {
 	$(':button').prop('disabled', true); // Disable all the buttons
 });
 
 
function moneyFormatter(value){
	
	return numeral(value).format('0,0.00')

}


//load a locale
numeral.register('locale', 'pt', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: 'R$'
    }
});

// switch between locales
numeral.locale('pt');	
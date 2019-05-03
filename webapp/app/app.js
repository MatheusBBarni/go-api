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
      templateUrl : 'app/views/home.html',
      controller     : 'home-controller',
   })  
   
   .when('/configuracao', {
      templateUrl : 'app/views/configuracao.html',
      controller  : 'ConfiguracaoCtrl',
   })
   
   .when('/agencia', {
      templateUrl : 'app/views/agencia.html',
      controller  : 'AgenciaCtrl',
   })
   
   .when('/ofertas', {
      templateUrl : 'app/views/promocao.html',
      controller  : 'PromocaoCtrl',
   })
   
   .when('/usuarios', {
      templateUrl : 'app/views/usuarios.html',
      controller  : 'UsuariosCtrl',
   })
   
   .when('/notificacao', {
		templateUrl : 'app/views/notificacao.html',
		controller : 'NotificacaoCtrl',
	})	      
   
   
   .when('/fornecedores', {
      templateUrl : 'app/views/fornecedores.html',
      controller  : 'FornecedoresCtrl',
   })
   
   .when('/clientes', {
      templateUrl : 'app/views/clientes.html',
      controller  : 'ClientesCtrl',
   })
   .when('/endereco', {
      templateUrl : 'app/views/endereco.html',
      controller  : 'EnderecoCtrl',
   })   
   
   .when('/vendedores', {
      templateUrl : 'app/views/vendedor.html',
      controller  : 'VendedorCtrl',
      resolve : {
    	  tipoVendedor : function () {return 'V'}
      }
   })
   
   .when('/prepostos', {
      templateUrl : 'app/views/vendedor.html',
      controller  : 'VendedorCtrl',
      resolve : {
    	  tipoVendedor : function () {return 'P'}
      }
   })   
   
   
   .when('/pedido', {
      templateUrl : 'app/views/pedido.html',
      controller  : 'PedidoCtrl',
      resolve: {
    	  posicaoPedido : function () { return "B"; }
      }
   })	   
   .when('/pedidoTransporte', {
      templateUrl : 'app/views/pedido.html',
      controller  : 'PedidoCtrl',
      resolve: {
    	  posicaoPedido : function () { return "T"; }
        }
   })  
   .when('/pedidoFinalizado', {
      templateUrl : 'app/views/pedido.html',
      controller  : 'PedidoCtrl',
   })
   .when('/dica', {
	   templateUrl : 'app/views/dica.html',
      controller  : 'DicaCtrl',
   })
   .when('/pedidoCancelado', {
      templateUrl : 'app/views/pedido.html',
      controller  : 'PedidoCtrl',
      resolve: {
    	  posicaoPedido : function () { return "C"; }
        }
   })    
   .when('/comissoes', {
      templateUrl : 'app/views/pedido-comissao.html',
      controller  : 'PedidoComissaoCtrl',      
   })       
   .when('/produto', {
      templateUrl : 'app/views/produto.html',
      controller  : 'ProdutoCtrl',
   })      
   .when('/variante', {
      templateUrl : 'app/views/variante.html',
      controller  : 'VarianteCtrl',
   })
   .when('/marca', {
      templateUrl : 'app/views/marcas.html',
      controller  : 'MarcaCtrl',
   })     
   .when('/status', {
      templateUrl : 'app/views/status.html',
      controller  : 'StatusCtrl',
   })  
   .when('/categoria', {
      templateUrl : 'app/views/categoria.html',
      controller  : 'CategoriaCtrl',
   })     
   
  .when('/notas-fiscais', {
      templateUrl : 'app/views/nota-fiscal.html',
      controller : 'NotaFiscalCtrl',
   })      
       
   
	//FINANCEIRO//
	.when('/contaBancaria', {
		templateUrl : 'app/views/conta-bancaria.html',
		controller : 'ContaBancariaCtrl',
		resolve : {
			init : function() {
			}
		}
	})	
	.when('/formaPagamento', {
		templateUrl : 'app/views/forma-pagamento.html',
		controller : 'FormaPagamentoCtrl',
		resolve : {
			init : function() {
			}
		}
	})
	.when('/planoContas', {
		templateUrl : 'app/views/plano-conta.html',
		controller : 'PlanoContaCtrl',
		resolve : {
			init : function() {
			}
		}
	})
	.when('/cheque', {
		templateUrl : 'app/views/cheque.html',
		controller : 'ChequeCtrl',
		resolve : {
			init : function() {
			}
		}
	})
	.when('/categoriaCobranca', {
		templateUrl : 'app/views/categoria-cobranca.html',
		controller : 'CategoriaCobrancaCtrl',
		resolve : {
			init : function() {
			}
		}
	})
	.when('/contasReceber', {
		templateUrl : 'app/views/contas-receber-pagar.html',
		controller : 'ContasReceberPagarCtrl',
		resolve : {
			tipoOperacao: function() { return 'E' }
		
		}
	})
	.when('/contasPagar', {
		templateUrl : 'app/views/contas-receber-pagar.html',
		controller : 'ContasReceberPagarCtrl',
		resolve : {
			tipoOperacao: function() { return 'S' }
		}
	})	
	.when('/maquina', {
		templateUrl : 'app/views/maquina.html',
		controller : 'MaquinaCtrl',

	})	
	
	.when('/viagem', {
		templateUrl : 'app/views/viagem.html',
		controller : 'ViagemCtrl',
	})
	
	.when('/voucher', {
		templateUrl : 'app/views/voucher.html',
		controller : 'VoucherCtrl',
	})
	
	.when('/cotacao', {
		templateUrl : 'app/views/cotacao.html',
		controller : 'CotacaoCtrl',
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
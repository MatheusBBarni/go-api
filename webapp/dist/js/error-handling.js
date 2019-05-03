/**
 *  Exibe mensagem de retorno para o cliente caso aconteça algum erro na requisição
 */

function mostraMensagem(erro) {
	
	if ( erro == null || typeof erro == "string" ) {
		erro = {}
	}
	
	if ( ! erro.titulo){
		erro.titulo = 'Ops ...';
	}
	if ( ! erro.descricao){
		erro.descricao = 'Aconteceu um erro durante a sua solicitação! Confira os dados e tente novamente.';
	}
	
	$.confirm({
		title: erro.titulo,
	    content: erro.descricao,
	    theme: 'material',
	    type: 'red',
	    buttons: {
	    	confirmar: {
	    		text: 'OK',
	            btnClass: 'btn-green',
	            keys: ['enter']
	    	},
	    }
	});	
}

$( document ).ajaxError(function( event, request, settings, object ) {
	
	if ( request.status == 0 || request.status >= "400" ) {
		mostraMensagem(request.responseJSON);
	}
});

(function(){
    app.factory('Interceptor', Interceptor);
    
    Interceptor.$inject = ['$q'];
    
    function Interceptor($q) {        
        return {
            responseError: function(error) {
            	
            	mostraMensagem(error.data);  
               
            	return $q.reject(error);
            }
        };
    }  
    
    app.config(['$httpProvider', function($httpProvider) {  
        $httpProvider.interceptors.push('Interceptor');
    }]);
    
})();


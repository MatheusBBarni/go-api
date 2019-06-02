app.config(function($routeProvider){
	
	$routeProvider
	
		.when('/ordens-corte-abertas', {
			template : '<dc-consulta-ordem-corte status-ordem-corte="A"></dc-consulta-ordem-corte>',
		})
		.when('/ordens-corte-concluidas', {
			template : '<dc-consulta-ordem-corte status-ordem-corte="O"></dc-consulta-ordem-corte>',
		})
		.when('/ordens-corte-canceladas', {
			template : '<dc-consulta-ordem-corte status-ordem-corte="C"></dc-consulta-ordem-corte>',
		})		
		
})
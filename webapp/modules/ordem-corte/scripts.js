function posicaoOrdemCorteFormatter (value, row, index){
	if ( value == 'A' ) return "Em aberto";  
	if ( value == 'O' ) return "Concluido";
	if ( value == 'C' ) return "Cancelado";
}

function concluirOrdemCorteFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().ctrl.concluirOrdemCorte('+row.id+')" class="span-tabela"><i class="fa fa-check-square"></i> Concluir</span>';	
}

function imprimirOrdemCorteFormatter (value, row, index){
    return '<a href="WS/Relatorios/OrdemCorte/DetalheOrdemCorte/' + row.id + '" target="_blank"><span class="span-tabela"><i class="fa fa-print"></i> Imprimir</span></a>';	
}

function visualizarOrdemCorteFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().ctrl.visualizarOrdemCorte('+row.id+')" class="span-tabela"><i class="fa fa-search"></i> Visualizar</span>';	
}

function cancelarOrdemCorteFormatter (value, row, index){
    return '<span onclick="angular.element(this).scope().ctrl.cancelarOrdemCorte('+row.id+')" class="span-tabela bg-red"><i class="fa fa-trash"></i> Cancelar</span>';	
}


/*
*
* Demacode.js Testes
*
 */
function iniciarTestes(){

	testarLoadingSelect();
}

 function testarLoadingSelect(){
 	var mJson = [{
				    "id": "1",
				    "desc": "umd",
				    "outro": "f"
				  },{
				    "id": "2",
				    "desc": "mais um",
				    "outro": "f"
				  },{
				    "id": "3",
				    "desc": "mais dois",
				    "outro": "f"
				  }];

	var mSelect = document.getElementById('select-teste');

	var mTabela = document.getElementById('tabela-teste');
	
	incluirNaoDefinidoSelect(mSelect);
	carregarSelect(mSelect, mJson, ["id", "desc"]);

	carregarTabela(mTabela, mJson);

 }

 function testeFuncaoBotao(botao){
 	alert(botao.dataset.registro);
 }
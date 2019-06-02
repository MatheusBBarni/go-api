/*
* 
Arquivo padrão demacode JS
*
 */
 function limparFilhos(elemento){	
	while (elemento.firstChild) {
	    elemento.removeChild(elemento.firstChild);
	}
 }

//
 function carregarSelect(elemento, itens, parametros){
 	if (itens.length <= 0)
 		return;

 	itens.forEach(function(itemPosicionado){ 		
		var mOption = document.createElement('option');
		mOption.id = itemPosicionado[parametros[0]];
		mOption.innerHTML = itemPosicionado[parametros[1]];
		elemento.appendChild(mOption); 		
 	});
 }

function incluirNaoDefinidoSelect(elemento){
	var mOption = document.createElement('option');
	mOption.id = 0;
	mOption.innerHTML = 'Não definido';
	elemento.appendChild(mOption); 		
}




function carregarTabela(elemento, itens, botoes){
 	var mHead = elemento.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
 	var mBody = elemento.getElementsByTagName('tbody')[0];
 	var mThHeaders = mHead.getElementsByTagName('th');
 	var mLen = mThHeaders.length;
 	limparFilhos(mBody);

 	itens.forEach(
 		function(itemSelecionado){
 			var mLinha = document.createElement('tr');

 			for(var i = 0; i < mLen; i++){
 				if(mThHeaders[i].dataset.campo != 'botao')
 					insereColuna(mLinha, itemSelecionado[mThHeaders[i].dataset.campo]);	
 				else{
 					insereBotao(mLinha, mThHeaders[i].dataset, itemSelecionado);	

 				}
 			}

			elemento.appendChild(mLinha);
 		}
 	);

 	elemento.DataTable();
}

function carregarDataTable(elemento, itens, botoes){
	carregarTabela(elemento, itens, botoes);

	elemento.DataTable();
}

function insereColuna(elemento, texto){
	var mColuna = document.createElement('td');

	mColuna.innerHTML = texto;

	elemento.appendChild(mColuna);
}

function insereBotao(elemento, dataset, item){
	var mColuna = document.createElement('td');
	var mBotao;
	var mTipo = dataset.tipo;
	var mFuncao = dataset.funcao;	

	if(mTipo == 'editar')
		mBotao = criarBotaoEdicao();
	else if(mTipo == 'inativar')
		mBotao = criarBotaoInativar();
	else if(mTipo == 'incluir')
		mBotao = criarBotaoIncluir();
	else if(mTipo == 'extra')
		mBotao = criarBotaoExtra(dataset.css, dataset.texto);

	mBotao.onclick = new Function (mFuncao);
	mBotao.dataset.registro = item.id;

	mColuna.appendChild(mBotao);
	elemento.appendChild(mColuna);
}

function criarBotaoEdicao(){
	var mBotao = document.createElement('span');

	mBotao.innerHTML = "<i class='fa fa-pencil'></i> Editar";
	mBotao.setAttribute('class', 'span-editar dema-edicao');

	return mBotao;
}

function criarBotaoInativar(){
	var mBotao = document.createElement('span');
	
	mBotao.innerHTML = "<i class='fa fa-trash'></i> Inativar";
	mBotao.setAttribute('class', 'span-inativar dema-inativar');

	return mBotao;
}

function criarBotaoIncluir(){
	var mBotao = document.createElement('span');
	
	mBotao.innerHTML = "<i class='fa fa-plus'></i> Incluir";
	mBotao.setAttribute('class', 'span-incluir dema-incluir');

	return mBotao;
}

function criarBotaoExtra(classe, texto){
	var mBotao = document.createElement('span');
	
	mBotao.innerHTML = texto;
	mBotao.setAttribute('class', classe + " dema-extra");

	return mBotao;
}

 function carregarNotificacoesTemplate(){

 }
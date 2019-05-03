$(document).ready(function(){
	    
  $('.data').mask('11/11/1111');
  $('.horario').mask('00:00:00');
  $('.data_hora').mask('00/00/0000 00:00:00');
  $('.cep').mask('00000-000');
  $('.quantidade').mask('000.000', {reverse: true});
  $('.cpf').mask('000.000.000-00', {reverse: true});
  $('.cnpj').mask('00.000.000/0000-00', {reverse: true});
  
  var FoneBehavior = function (val) {
	  return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
  },
  telOptions = {
      onKeyPress: function(val, e, field, options) {
    	  field.mask(FoneBehavior.apply({}, arguments), options);
      }
  }
  $('.telefone').mask(FoneBehavior, telOptions);
  $('.celular').mask(FoneBehavior, telOptions);
  
});

var CpfCnpjBehavior = function (val) {
	  return val.replace(/\D/g, '').length === 14 ? '00.000.000/0000-00' : '000.000.000-00999';
},
CpfCnpjOptions = {
		
    onKeyPress: function(val, e, field, options) {
  	  field.mask(CpfCnpjBehavior.apply({}, arguments), options);
    },
    
    clearIfNotMatch: true
}    
$('.cpfcnpj').mask(CpfCnpjBehavior, CpfCnpjOptions);

function moedaParaNumero(valor)
{
    return isNaN(valor) == false ? parseFloat(valor) :   parseFloat(valor.replace("R$","").replace(".","").replace(",","."));
}
function numeroParaMoeda(n, c, d, t)
{
	
    c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

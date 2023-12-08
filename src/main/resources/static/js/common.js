
$(document).ready(function(){
	
	var langValue = $.cookie("lang");
	if( langValue == "" || langValue == undefined ){
		langValue = "eng";
		$.cookie("lang",langValue, {expired: 365, path:"/"});
	}else{
		langValue = langValue.toLowerCase();
	}
	$("#langCd").val(langValue);
	
	$("#langCd").on("change",function(){
		var pickLang = $("#langCd option:selected").val();
		$.cookie("lang", pickLang, {expired: 365, path:"/"});
		
		window.location.replace("/");
	})
});
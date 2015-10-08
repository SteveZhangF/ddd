/**
 * when Profile->module is clicked
 */
function moduleShow() {
	submitForm("../module", {
		action : "showMain"
	}, function(data) {
		$("#main_container").html(data)
	});
	showTreeMenuModule();
}
/**
 * request the company's organazation information in a tree format and set it to
 * the left menu
 */
function showTreeMenuModule() {
	submitForm("../module", {
		action : "showTreeMenuModule"
	}, function(data) {
		$(".avatar-box").html("");
		$(".avatar-box").html(data);
		$.getScript('./custom/js/menu_tree.js', function() {
		});
		showModulePercent();
	});
}
function showModulePercent(){
	submitForm("../module", {
		action : "getPercentInMenu"
	}, function(data) {
		$.each(data,function(i,md){
			var module_id = md.module_id;
			var module_percent = md.percent;
			$module = $($("input[name='module_id'][value='"+module_id+"']").parent());
			$module.addProcessbar({width:module_percent+"%",height:"10px"});
			var forms = md.form;
			$.each(forms,function(i,f){
				var form_id = f.form_id;
				var f_p = f.percent;
				console.log(f_p);
				$form = $($("input[name='id'][value='"+form_id+"']").parent());
				console.log($form.html());
				$form.addProcessbar({width:f_p+"%",height:"10px"});
			});
		});
	});
}

function showFormsInModule(formid){
	alert(formid);
	
}
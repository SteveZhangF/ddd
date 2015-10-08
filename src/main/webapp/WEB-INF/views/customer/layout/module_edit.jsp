
<%@page import="database.dao.factory.DAOFactoryImpl"%>
<%@page import="bean.form.module.Module"%>
<link href="css/form-editor.css" rel="stylesheet" />
<%
Module module = (Module)request.getAttribute("module");
Module parent = null;
if(module == null){
	parent = (Module) request.getAttribute("parent");
}else{
	parent = module.getSuperModule();;
}
%>
<div class="span7 form-editor">
	<h5>Module info</h5>

	<form id="module_form">
		<input type="hidden" name="oper" value="<%=(String)request.getAttribute("oper")%>"/>
		<input type="hidden" name="module_id" value="<%=module!=null?module.getId():""%>">
		<div class="field-box">
			<label>Module Name:</label> <input class="span5 inline-input"
				type="text" name = "name" value="<%=module!=null? module.getName():""%>" />
		</div>
		<div class="field-box">
			<label>Create Time:</label> <input class="span5 inline-input"
				type="text" value="">
		</div>

		<div class="field-box moduleReceiver">
			<label>Parent Module:</label> <input id="parent_id" type="hidden"
				value="<%=parent.getId()%>" name="parent_id" /> <input id="parent_name"
				class=" span5 inline-input" type="text"
				value="<%=parent.getName()%>">
		</div>

		<div class="span6 field-box actions">
			<input type="button" class="btn-glow primary" value="Save Changes"  onclick="saveModule();" />
			<span>OR</span> <input type="reset" value="Cancel" class="reset" />
		</div>
 	</form>
</div>


<script>
function saveModule(){
	$.ajax({
		cache : true,
		type : "POST",
		url : "../form_operation?action=editModule",
		data :$("#module_form").serialize(),
		async : false,
		error : function(request) {

		},
		success : function(data) {
			console.log("success");
		}
	});
}
	$(document)
			.ready(
					function() {
						$(".moduleReceiver")
								.droppable(
										{
											drop : function(event, ui) {
												$element = ui.draggable;
												var parentname = $element.text();
												var parentid = $($element.find("input[name='module_id']"))
														.attr("value");
												console.log($element.html());
												$receiver = $(this);
												$receiver
														.find("#parent_id")
														.attr("value", parentid);
												$receiver.find("#parent_name")
														.attr("value",
																parentname);
											}
										});

					});
</script>
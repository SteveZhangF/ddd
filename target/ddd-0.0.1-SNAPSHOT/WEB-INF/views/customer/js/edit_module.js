$(document).ready(function() {
	var spans_module = $(".tree").find(".module");
	$.each(spans_module, function(i, se) {
		$(se).contextmenu({
			target : '#context-menu-module',
			onItem : function(context, e) {
				var id = $(e.target).attr('id');
				switch (id) {
				case "add_module":
					addModule($(context.find("input")).attr("value"));
					break;
				case "add_form":
					addForm($(context.find("input")).attr("value"));
					break;
				case "delete":
					break;
				case "edit_module":
					editModule($(context.find("input")).attr("value"));
					break;
				}

			}
		});
	});

	var spans_form = $(".tree").find(".form");
	$.each(spans_form, function(i, se) {
		$(se).contextmenu({
			target : '#context-menu-form',
			onItem : function(context, e) {
				var id = $(e.target).attr('id');
				switch (id) {
				case "edit_form":
					break;
				case "delete_form":
					break;
				}

			}
		});
	});

});




function editModule( moduleid) {
	$.ajax({
		cache : true,
		type : "POST",
		url : "../form_operation?action=editModule",
		data : {
			oper:"edit",
			module_id : moduleid
		},
		async : false,
		error : function(request) {

		},
		success : function(data) {
			$(".module-edit").html(data);
		}
	});
}

function addModule(parentid) {
	$.ajax({
		cache : true,
		type : "POST",
		url : "../form_operation?action=editModule",
		data : {
			oper:"add",
			parent_id : parentid,
		},
		async : false,
		error : function(request) {

		},
		success : function(data) {
			$(".module-edit").html(data);
		}
	});
}

function addForm(parentid) {
	$.ajax({
		cache : true,
		type : "POST",
		url : "../form_operation?action=editForm",
		data : {
			oper:"create",
			module_id : parentid,
		},
		async : false,
		error : function(request) {

		},
		success : function(data) {
			$(".module-edit").html(data);
			$(".module-edit").removeClass("span7");
			$(".module-edit").addClass("span12");
			$(".tree").addClass("hidden");
		}
	});
}


function changeFormParent(myid,parentid){
	$.ajax({
		cache : true,
		type : "POST",
		url : "../form_operation",
		data : {
			action:"changeParentID",
			parentid : parentid,
			myid:myid,
			changeType:'form'
		},
		async : false,
		error : function(request) {

		},
		success : function(data) {
			$("#pad-wrapper").html(data);
		}
	});
}

function changeModuleParent(myid,parentid){
	$.ajax({
		cache : true,
		type : "POST",
		url : "../form_operation",
		data : {
			action:"changeParentID",
			parentid : parentid,
			myid:myid,
			changeType:'module'
		},
		async : false,
		error : function(request) {

		},
		success : function(data) {
			$("#pad-wrapper").html(data);
		}
	});
}


$(document)
		.ready(
				function() {

					$(".draggable").draggable({
						helper : "clone",
					});
					$(".droppable")
							.droppable(
									
									{accept:".draggable",
										 greedy: true,
										drop : function(event, ui) {
											$dragged = $(ui.draggable);
											$dropped = $(this);
											console.log($dropped.html());
											var dragged_id =$($dragged.children("li").children("span").children("input")).attr("value");
											var dropped_id =$($dropped.children("span").children("input")).attr("value")
											var type = $($dragged.children("li").children("span").children("input")).attr("name");
											if(type=="module_id"){
												changeModuleParent(dragged_id,dropped_id);
											}else{
												changeFormParent(dragged_id,dropped_id);
											}
											$(this).append(ui.draggable);
											
										}
									});

				});